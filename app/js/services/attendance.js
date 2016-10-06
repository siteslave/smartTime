'use strict';

angular.module('app.services.Attendance', []).factory('Attendance', function ($q) {
  return {
    getAttendancesByDate: function getAttendancesByDate(db, start, end, limit, offset) {
      var q = $q.defer();

      var sql = '\n        select a.employee_code, concat(e.first_name, " ", e.last_name) as fullname, a.checkin_date, \n        group_concat(a.checkin_time order by a.checkin_time asc) as time_checked\n        from attendances as a\n        inner join employees as e on e.employee_code=a.employee_code\n        where a.checkin_date between ? and ?\n        group by a.employee_code, a.checkin_date\n        order by e.first_name, e.last_name\n        limit ? offset ?\n        ';

      db.raw(sql, [start, end, limit, offset]).then(function (rows) {
        q.resolve(rows[0]);
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
    }
  };
});