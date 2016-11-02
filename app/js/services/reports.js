'use strict';

angular.module('app.services.Report', []).factory('ReportService', function ($q) {
  return {
    getEmployeeWorkLate: function getEmployeeWorkLate(db, start, end) {
      var q = $q.defer();

      // let sql = `
      //   select concat(e.first_name, " ", e.last_name) as fullname, s.employee_code, count(*) as total,
      //   ls.name as department_name
      //   from attendances_summary as s
      //   inner join employees as e on e.employee_code=s.employee_code
      //   left join l_sub_departments as ls on ls.id=e.sub_department_id
      //   where s.start_time >= '08:45:59' and s.checkin_date between ? and ?
      //   and s.start_time between '06:00:00' and '10:00:00'
      //   group by s.employee_code
      //   order by total desc
      // `;
      var late_time = '08:45:59';
      var exit_time = '16:00:00';

      var start_time = '06:00:00';
      var end_time = '10:00:00';

      var start_date = start;
      var end_date = end;

      var sql = '\n          select e.employee_code, concat(e.first_name, " ", e.last_name) as fullname, \n          ls.name as department_name,\n          (select\n          count(*)\n          from attendances_summary as s\n          where s.start_time is not null\n          and s.checkin_date between \'' + start_date + '\' and \'' + end_date + '\'\n          and s.employee_code=e.employee_code\n          ) as work_total,\n          (select\n          count(*)\n          from attendances_summary as s\n          where s.start_time >= \'' + late_time + '\'\n          and s.start_time between \'' + start_time + '\' and \'' + end_time + '\'\n          and s.checkin_date between \'' + start_date + '\' and \'' + end_date + '\'\n          and s.employee_code=e.employee_code\n          ) as late_total,\n          (select\n          count(*)\n          from attendances_summary as s\n          where s.end_time < \'' + exit_time + '\'\n          and s.start_time between \'' + start_time + '\' and \'' + end_time + '\'\n          and s.checkin_date between \'' + start_date + '\' and \'' + end_date + '\'\n          and s.employee_code=e.employee_code\n          ) as exit_total,\n          (select\n          count(*)\n          from attendances_summary as s\n          where s.end_time is null\n          and s.start_time is not null\n          and s.checkin_date between \'' + start_date + '\' and \'' + end_date + '\'\n          and s.employee_code=e.employee_code\n          ) as notexit_total\n          from employees as e\n          left join l_sub_departments as ls on ls.id=e.sub_department_id\n\n        ';
      console.log(sql);
      db.raw(sql, []).then(function (rows) {
        q.resolve(rows[0]);
      }).catch(function (err) {
        console.log(err);
        q.reject(err);
      });

      return q.promise;
    },
    getEmployeeWorkLateDetail: function getEmployeeWorkLateDetail(db, employee_code, start, end) {
      var q = $q.defer();

      var sql = '\n          select s.checkin_date, s.start_time, s.end_time\n          from attendances_summary as s\n          where s.start_time >= \'08:45:59\' and s.checkin_date between ? and ?\n          and s.start_time between \'06:00:00\' and \'10:00:00\'\n          and s.employee_code=?\n          order by s.checkin_date\n        ';

      db.raw(sql, [start, end, employee_code]).then(function (rows) {
        q.resolve(rows[0]);
      }).catch(function (err) {
        console.log(err);
        q.reject(err);
      });

      return q.promise;
    },
    getEmployeeExitDetail: function getEmployeeExitDetail(db, employee_code, start, end) {
      var q = $q.defer();

      var sql = '\n          select s.checkin_date, s.start_time, s.end_time\n          from attendances_summary as s\n          where s.end_time < \'16:00:00\' and s.checkin_date between ? and ?\n          and s.start_time between \'06:00:00\' and \'10:00:00\'\n          and s.employee_code=?\n          order by s.checkin_date\n        ';

      db.raw(sql, [start, end, employee_code]).then(function (rows) {
        q.resolve(rows[0]);
      }).catch(function (err) {
        console.log(err);
        q.reject(err);
      });

      return q.promise;
    },
    getEmployeeNotExitDetail: function getEmployeeNotExitDetail(db, employee_code, start, end) {
      var q = $q.defer();

      var sql = '\n          select s.checkin_date, s.start_time, s.end_time\n          from attendances_summary as s\n          where s.end_time is null\n          and s.start_time is not null\n          and s.checkin_date between ? and ?\n          and s.start_time between \'06:00:00\' and \'10:00:00\'\n          and s.employee_code=?\n          order by s.checkin_date\n        ';

      db.raw(sql, [start, end, employee_code]).then(function (rows) {
        q.resolve(rows[0]);
      }).catch(function (err) {
        console.log(err);
        q.reject(err);
      });

      return q.promise;
    }
  };
});