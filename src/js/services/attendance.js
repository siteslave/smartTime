'use strict';

angular.module('app.services.Attendance', [])
  .factory('Attendance', ($q) => {
    return {
      getAttendancesByDate(db, start, end, limit, offset) {
        let q = $q.defer()

        let sql = `
        select a.employee_code, concat(e.first_name, " ", e.last_name) as fullname, a.checkin_date, 
        group_concat(a.checkin_time order by a.checkin_time asc) as time_checked
        from attendances as a
        inner join employees as e on e.employee_code=a.employee_code
        where a.checkin_date between ? and ?
        group by a.employee_code, a.checkin_date
        order by e.first_name, e.last_name
        limit ? offset ?
        `;

        db.raw(sql, [start, end, limit, offset])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            q.reject(err)
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
      }
    }
  });