'use strict';

let moment = require('moment');

angular.module('app.services.Attendance', [])
  .factory('Attendance', ($q) => {
    return {
      getAttendancesByDate(db, start) {
        let q = $q.defer()

        let sql = `
        select concat(e.first_name, " ", e.last_name) as fullname, e.employee_code, s.in_time, s.out_time
        from employees as e
        left join t_attendances as s on s.employee_code=e.employee_code and s.checkin_date=?
        order by e.first_name, e.last_name
        `;

        db.raw(sql, [start])
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
        insert into t_attendances(employee_code, date_serve, service_type, in_morning,
        in_afternoon, in_evening, in_evening2, out_morning, out_afternoon, out_afternoon2, out_evening)

        select st.employee_code, st.date_serve, st.service_type,
        (
          select checkin_time from attendances where employee_code=st.employee_code
          and checkin_date=st.date_serve
          and checkin_time between '04:00:00' and '09:45:59' and st.service_type='1' order by checkin_time limit 1
        ) as in_morning,
        (
          select checkin_time from attendances where employee_code=st.employee_code
          and checkin_date=st.date_serve
          and checkin_time between '15:00:00' and '17:45:59' and st.service_type='2' order by checkin_time limit 1
        ) as in_afternoon,
        (
          select checkin_time from attendances where employee_code=st.employee_code
          and checkin_date=st.date_serve
          and checkin_time between '23:00:00' and '23:59:59' and st.service_type='3' order by checkin_time limit 1
        ) as in_evening,
        (
          select checkin_time from attendances where employee_code=st.employee_code
          and checkin_date=date_add(st.date_serve, interval 1 day)
          and checkin_time between '00:00:00' and '01:45:59' and st.service_type='3' order by checkin_time limit 1
        ) as in_evening2,
        (
          select checkin_time from attendances where employee_code=st.employee_code
          and checkin_date=st.date_serve
          and checkin_time between '15:30:00' and '19:00:00' and st.service_type='1' order by checkin_time limit 1
        ) as out_morning,
        (
          select checkin_time from attendances where employee_code=st.employee_code
          and checkin_date=st.date_serve
          and checkin_time between '19:45:00' and '23:59:59' and st.service_type='2' order by checkin_time limit 1
        ) as out_afternoon,
        (
          select checkin_time from attendances where employee_code=st.employee_code
          and checkin_date=date_add(st.date_serve, interval 1 day)
          and checkin_time between '00:00:00' and '01:45:59' and st.service_type='2' order by checkin_time limit 1
        ) as out_afternoon2,
        (
          select checkin_time from attendances where employee_code=st.employee_code
          and checkin_date=date_add(st.date_serve, interval 1 day)
          and checkin_time between '08:00:00' and '09:45:59' and st.service_type='3' order by checkin_time limit 1
        ) as out_evening
        from service_type_attendances as st
        where st.date_serve between ? and ?
        order by st.date_serve
        `;

        db.raw(sql, [start, end])
          .then(rows => {
            q.resolve()
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
        db('t_attendances')
          .whereBetween('date_serve', [start, end])
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

      updateServiceTypeStatus(db, start, end) {
        let q = $q.defer();
        db('service_type_attendances')
          .update({ is_process: 'Y' })
          .whereBetween('date_serve', [start, end])
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
          .orderByRaw('process_date DESC')
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

      saveAllow(db, year, month) {
        let q = $q.defer();
        let sql = `INSERT INTO service_time_allow(ayear, amonth)
        VALUES(?, ?)`;

        db.raw(sql, [year, month])
          .then(() => {
            q.resolve()
          })
          .catch(err => {
            q.reject(err)
          });

        return q.promise;
      },

      getAllowLogs(db) {
        let q = $q.defer();
        let sql = `SELECT * FROM service_time_allow ORDER BY ayear, amonth`;

        db.raw(sql, [])
          .then((rows) => {
            q.resolve(rows[0])
          })
          .catch(err => {
            q.reject(err)
          });

        return q.promise;
      },

      getInitialAllowEmployees(db, start, end) {
        let q = $q.defer();
        let sql = `select distinct employee_code 
                  from employees as e 
                  where employee_code not in (
                    select distinct employee_code
                    from service_type_attendances
                    where date_serve between ? and ?
                  )`;

        db.raw(sql, [start, end])
          .then((rows) => {
            // console.log(rows[0]);
            q.resolve(rows[0])
          })
          .catch(err => {
            q.reject(err)
          });

        return q.promise;
      },

      saveInitialAllowEmployees(db, data) {
        let q = $q.defer();

        db('service_type_attendances')
          .insert(data)
          .then(() => {
            q.resolve()
          })
          .catch(err => {
            q.reject(err)
          });

        return q.promise;
      }
    }
  });