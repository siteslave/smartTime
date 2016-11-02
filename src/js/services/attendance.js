'use strict';

let moment = require('moment');

angular.module('app.services.Attendance', [])
  .factory('Attendance', ($q) => {
    return {
      getAttendancesByDate(db, start) {
        let q = $q.defer()

        let sql = `
        select concat(e.first_name, " ", e.last_name) as fullname, e.employee_code,
        (
        select s.start_time
        from attendances_summary as s 
        where s.employee_code=e.employee_code
        and s.checkin_date=?
        ) as start_time,
        (
        select s.end_time
        from attendances_summary as s 
        where s.employee_code=e.employee_code
        and s.checkin_date=?
        ) as end_time
        from employees as e
        order by e.first_name, e.last_name
        `;

        db.raw(sql, [start, start])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            q.reject(err)
          });
        
        return q.promise;
      },
      getAttendancesCoverage(db, employee_code, start, end) {
        let q = $q.defer()

        let sql = `
        select e.employee_code, a.checkin_date, 
        group_concat(a.checkin_time order by a.checkin_time asc) as checkin_time
        from attendances as a
        inner join employees as e on e.employee_code=a.employee_code
        where a.employee_code=? and a.checkin_date between ? and ?
        group by a.checkin_date, a.employee_code
        `;

        db.raw(sql, [employee_code, start, end])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            q.reject(err)
          });
        
        return q.promise;
      },

      processAttendances(db, start, end) {
        let q = $q.defer()

        let sql = `
        select a.employee_code, concat(e.first_name, " ", e.last_name) as fullname, a.checkin_date, 
        group_concat(a.checkin_time order by a.checkin_time asc) as time_checked
        from attendances as a
        inner join employees as e on e.employee_code=a.employee_code
        where a.checkin_date between ? and ?
        group by a.employee_code, a.checkin_date
        order by e.first_name, e.last_name
        `;

        db.raw(sql, [start, end])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            console.log(err)
            q.reject(err)
          });
        
        return q.promise;
      },

      removeOldProcess(db, start, end) {
        console.log('Do remove...')
        let q = $q.defer();
        db('attendances_summary')
          .whereBetween('checkin_date', [start, end])
          .delete()
          .then(() => q.resolve())
          .catch(err => {
            console.log(err)
            q.reject(err);
          });
        
        return q.promise;
      },

      saveProcess(db, data) {
        let q = $q.defer();
        db('attendances_summary')
          .insert(data)
          .then(() => q.resolve())
          .catch(err => q.reject(err));
        
        return q.promise;
      },

      saveProcessLog(db) {
        let q = $q.defer();
        db('attendances_logs')
          .insert({
            process_date: moment().format('YYYY-MM-DD'),
            process_time: moment().format('HH:mm:ss')
          })
          .then(() => {
            q.resolve()
          })
          .catch(err => {
            q.reject(err);
          });
        
        return q.promise;
      },

      getProcessLog(db) {
        let q = $q.defer();
        db('attendances_logs')
          .orderByRaw('process_date, process_time DESC')
          .limit(20)
          .then((rows) => {
            q.resolve(rows)
          })
          .catch(err => {
            q.reject(err);
          });
        
        return q.promise;
      },
      getAttendancesByDateTotal(db, date) {
        let q = $q.defer()
        let sql = `
        select count(distinct a.employee_code) as total from attendances as a
        inner join employees as e on e.employee_code=a.employee_code
        where a.checkin_date=?
        `;

        db.raw(sql, [date])
          .then(rows => {
            // console.log(rows[0][0])
            q.resolve(rows[0][0].total)
          })
          .catch(err => {
            q.reject(err)
          });
        
        return q.promise;
      },

      processTime(data) {

        let timeServices = [];

        data.forEach(v => {
          let startMorningTime = moment('07:00:00', 'HH:mm:ss');
          let endMorningTime = moment('10:00:00', 'HH:mm:ss');

          let startAfternoonTime = moment('15:00:00', 'HH:mm:ss');
          let endAfternoonTime = moment('17:00:00', 'HH:mm:ss');
          let startEveningTime = moment('23:00:00', 'HH:mm:ss');
          let endEveningTime = moment('23:59:00', 'HH:mm:ss');
          let isMorning = moment(v.checkin[0], 'HH:mm:ss').isBetween(startMorningTime, endMorningTime);

          if (isMorning) {
            let obj = {};
            obj.checkin_date = v.checkin_date;
            obj.employee_code = v.employee_code;

            if (v.checkin[1] && !v.checkin[2]) {
              obj.start_time = v.checkin[0];
              obj.end_time = v.checkin[1];
            } else {
              // 08:07:04,16:49:38,23:58:26
              let isEvening = moment(v.checkin[2], 'HH:mm:ss').isBetween(startEveningTime, endEveningTime)
              if (isEvening) {
                obj.start_time = v.checkin[1];
                obj.end_time = v.checkin[2];
              } else {
                obj.start_time = v.checkin[0];
                obj.end_time = v.checkin[2];
              }
            }

            timeServices.push(obj);
    
          } else {
            let aa = v.checkin[0].split(':')
            let isMorning = moment(v.checkin[1], 'HH:mm:ss').isBetween(startMorningTime, endMorningTime)
            if (aa == '00' && isMorning) { // 00-00-00, 08:30:00
              if (v.checkin[2]) { // 00:00:00, 08:30:00, 16:00:00
                let isEvening = moment(v.checkin[2], 'HH:mm:ss').isBetween(startEveningTime, endEveningTime)
                if (isEvening) {
                  let obj = {};
                  // สงสัยเวรเช้า
                  // check เวลาออก
                  if (v.checkin[3]) {
                    let xx = moment(v.checkin[3], 'HH:mm:ss').isBefore(endEveningTime)
                    if (xx) {
                      // เวรบ่าย
                    } else {
                      // เวรเช้า
                      obj.start_time = v.checkin[1];
                      obj.end_time = v.checkin[2];
                      obj.employee_code = v.employee_code;
                    }
                  } else {
                    // เวรเช้า
                    obj.start_time = v.checkin[1];
                    obj.end_time = v.checkin[2];
                    obj.employee_code = v.employee_code;
                  }

                  timeServices.push(obj);
                } else {
                  // ไม่ใช่เวรเช้า
                }
      
              } else {
                // ไม่ใชเวรเช้า
              }
            } else {
              // ไม่ใช่เวรเช้า
            }
          }
        }) // end for

        return timeServices;
      } 
    }
  });