'use strict';

var moment = require('moment');

angular.module('app.services.Attendance', []).factory('Attendance', function ($q) {
  return {
    getAttendancesByDate: function getAttendancesByDate(db, start) {
      var q = $q.defer();

      var sql = '\n        select concat(e.first_name, " ", e.last_name) as fullname, e.employee_code,\n        (\n        select s.start_time\n        from attendances_summary as s \n        where s.employee_code=e.employee_code\n        and s.checkin_date=?\n        ) as start_time,\n        (\n        select s.end_time\n        from attendances_summary as s \n        where s.employee_code=e.employee_code\n        and s.checkin_date=?\n        ) as end_time\n        from employees as e\n        order by e.first_name, e.last_name\n        ';

      db.raw(sql, [start, start]).then(function (rows) {
        q.resolve(rows[0]);
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },
    getAttendancesCoverage: function getAttendancesCoverage(db, employee_code, start, end) {
      var q = $q.defer();

      var sql = '\n        select e.employee_code, a.checkin_date, \n        group_concat(a.checkin_time order by a.checkin_time asc) as checkin_time\n        from attendances as a\n        inner join employees as e on e.employee_code=a.employee_code\n        where a.employee_code=? and a.checkin_date between ? and ?\n        group by a.checkin_date, a.employee_code\n        ';

      db.raw(sql, [employee_code, start, end]).then(function (rows) {
        q.resolve(rows[0]);
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },
    processAttendances: function processAttendances(db, start, end) {
      var q = $q.defer();

      var sql = '\n        select a.employee_code, concat(e.first_name, " ", e.last_name) as fullname, a.checkin_date, \n        group_concat(a.checkin_time order by a.checkin_time asc) as time_checked\n        from attendances as a\n        inner join employees as e on e.employee_code=a.employee_code\n        where a.checkin_date between ? and ?\n        group by a.employee_code, a.checkin_date\n        order by e.first_name, e.last_name\n        ';

      db.raw(sql, [start, end]).then(function (rows) {
        q.resolve(rows[0]);
      }).catch(function (err) {
        console.log(err);
        q.reject(err);
      });

      return q.promise;
    },
    removeOldProcess: function removeOldProcess(db, start, end) {
      console.log('Do remove...');
      var q = $q.defer();
      db('attendances_summary').whereBetween('checkin_date', [start, end]).delete().then(function () {
        return q.resolve();
      }).catch(function (err) {
        console.log(err);
        q.reject(err);
      });

      return q.promise;
    },
    saveProcess: function saveProcess(db, data) {
      var q = $q.defer();
      db('attendances_summary').insert(data).then(function () {
        return q.resolve();
      }).catch(function (err) {
        return q.reject(err);
      });

      return q.promise;
    },
    saveProcessLog: function saveProcessLog(db) {
      var q = $q.defer();
      db('attendances_logs').insert({
        process_date: moment().format('YYYY-MM-DD'),
        process_time: moment().format('HH:mm:ss')
      }).then(function () {
        q.resolve();
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },
    getProcessLog: function getProcessLog(db) {
      var q = $q.defer();
      db('attendances_logs').orderByRaw('process_date, process_time DESC').limit(20).then(function (rows) {
        q.resolve(rows);
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },
    getAttendancesByDateTotal: function getAttendancesByDateTotal(db, date) {
      var q = $q.defer();
      var sql = '\n        select count(distinct a.employee_code) as total from attendances as a\n        inner join employees as e on e.employee_code=a.employee_code\n        where a.checkin_date=?\n        ';

      db.raw(sql, [date]).then(function (rows) {
        // console.log(rows[0][0])
        q.resolve(rows[0][0].total);
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },
    processTime: function processTime(data) {

      var timeServices = [];

      data.forEach(function (v) {
        var startMorningTime = moment('07:00:00', 'HH:mm:ss');
        var endMorningTime = moment('10:00:00', 'HH:mm:ss');

        var startAfternoonTime = moment('15:00:00', 'HH:mm:ss');
        var endAfternoonTime = moment('17:00:00', 'HH:mm:ss');
        var startEveningTime = moment('23:00:00', 'HH:mm:ss');
        var endEveningTime = moment('23:59:00', 'HH:mm:ss');
        var isMorning = moment(v.checkin[0], 'HH:mm:ss').isBetween(startMorningTime, endMorningTime);

        if (isMorning) {
          var obj = {};
          obj.checkin_date = v.checkin_date;
          obj.employee_code = v.employee_code;

          if (v.checkin[1] && !v.checkin[2]) {
            obj.start_time = v.checkin[0];
            obj.end_time = v.checkin[1];
          } else {
            // 08:07:04,16:49:38,23:58:26
            var isEvening = moment(v.checkin[2], 'HH:mm:ss').isBetween(startEveningTime, endEveningTime);
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
          var aa = v.checkin[0].split(':');
          var _isMorning = moment(v.checkin[1], 'HH:mm:ss').isBetween(startMorningTime, endMorningTime);
          if (aa == '00' && _isMorning) {
            // 00-00-00, 08:30:00
            if (v.checkin[2]) {
              // 00:00:00, 08:30:00, 16:00:00
              var _isEvening = moment(v.checkin[2], 'HH:mm:ss').isBetween(startEveningTime, endEveningTime);
              if (_isEvening) {
                var _obj = {};
                // สงสัยเวรเช้า
                // check เวลาออก
                if (v.checkin[3]) {
                  var xx = moment(v.checkin[3], 'HH:mm:ss').isBefore(endEveningTime);
                  if (xx) {
                    // เวรบ่าย
                  } else {
                    // เวรเช้า
                    _obj.start_time = v.checkin[1];
                    _obj.end_time = v.checkin[2];
                    _obj.employee_code = v.employee_code;
                  }
                } else {
                  // เวรเช้า
                  _obj.start_time = v.checkin[1];
                  _obj.end_time = v.checkin[2];
                  _obj.employee_code = v.employee_code;
                }

                timeServices.push(_obj);
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
      }); // end for

      return timeServices;
    }
  };
});