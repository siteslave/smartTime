
angular.module('app.services.Report', [])
  .factory('ReportService', ($q) => {
    return {
      getEmployeeWorkLate(db, start, end) {
        let q = $q.defer()

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
        let late_time = '08:45:59';
        let exit_time = '16:00:00';

        let start_time = '06:00:00';
        let end_time = '10:00:00';

        let start_date = start;
        let end_date = end;

        let sql = `
          select e.employee_code, concat(e.first_name, " ", e.last_name) as fullname, 
          ls.name as department_name,
          (select
          count(*)
          from attendances_summary as s
          where s.start_time is not null
          and s.checkin_date between '${start_date}' and '${end_date}'
          and s.employee_code=e.employee_code
          ) as work_total,
          (select
          count(*)
          from attendances_summary as s
          where s.start_time >= '${late_time}'
          and s.start_time between '${start_time}' and '${end_time}'
          and s.checkin_date between '${start_date}' and '${end_date}'
          and s.employee_code=e.employee_code
          ) as late_total,
          (select
          count(*)
          from attendances_summary as s
          where s.end_time < '${exit_time}'
          and s.start_time between '${start_time}' and '${end_time}'
          and s.checkin_date between '${start_date}' and '${end_date}'
          and s.employee_code=e.employee_code
          ) as exit_total,
          (select
          count(*)
          from attendances_summary as s
          where s.end_time is null
          and s.start_time is not null
          and s.checkin_date between '${start_date}' and '${end_date}'
          and s.employee_code=e.employee_code
          ) as notexit_total
          from employees as e
          left join l_sub_departments as ls on ls.id=e.sub_department_id

        `;
        console.log(sql);
        db.raw(sql, [])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            console.log(err)
            q.reject(err)
          });
        
        return q.promise;
      },

      getEmployeeWorkLateDetail(db, employee_code, start, end) {
        let q = $q.defer()

        let sql = `
          select s.checkin_date, s.start_time, s.end_time
          from attendances_summary as s
          where s.start_time >= '08:45:59' and s.checkin_date between ? and ?
          and s.start_time between '06:00:00' and '10:00:00'
          and s.employee_code=?
          order by s.checkin_date
        `;

        db.raw(sql, [start, end, employee_code])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            console.log(err)
            q.reject(err)
          });
        
        return q.promise;
      },

      getEmployeeExitDetail(db, employee_code, start, end) {
        let q = $q.defer()
        
        let sql = `
          select s.checkin_date, s.start_time, s.end_time
          from attendances_summary as s
          where s.end_time < '16:00:00' and s.checkin_date between ? and ?
          and s.start_time between '06:00:00' and '10:00:00'
          and s.employee_code=?
          order by s.checkin_date
        `;

        db.raw(sql, [start, end, employee_code])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            console.log(err)
            q.reject(err)
          });
        
        return q.promise;
      },

      getEmployeeNotExitDetail(db, employee_code, start, end) {
        let q = $q.defer()
        
        let sql = `
          select s.checkin_date, s.start_time, s.end_time
          from attendances_summary as s
          where s.end_time is null
          and s.start_time is not null
          and s.checkin_date between ? and ?
          and s.start_time between '06:00:00' and '10:00:00'
          and s.employee_code=?
          order by s.checkin_date
        `;

        db.raw(sql, [start, end, employee_code])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            console.log(err)
            q.reject(err)
          });
        
        return q.promise;
      }
    }
  });