'use strict';

angular.module('app.services.Employee', [])
  .factory('Employee', ($q) => {
    return {
      list(db, limit, offset) {
        let q = $q.defer();
        let sql = `select e.employee_code, t.name as title_name, e.first_name, 
          e.last_name, e.cid, d.name as department_name, p.name as position_name
          from employees as e
          left join l_sub_departments as d on d.id=e.sub_department_id
          left join l_titles as t on t.id=e.title_id
          left join l_positions as p on p.id=e.position_id
          order by e.first_name, e.last_name
          limit ? offset ?`;
        db.raw(sql, [limit, offset])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => q.reject(err));
        
        return q.promise;

      },

      searchByName(db, query) {
        let q = $q.defer();
        let _query = `%${query}%`;

        let sql = `select e.employee_code, t.name as title_name, e.first_name, 
          e.last_name, e.cid, d.name as department_name, p.name as position_name
          from employees as e
          left join l_sub_departments as d on d.id=e.sub_department_id
          left join l_titles as t on t.id=e.title_id
          left join l_positions as p on p.id=e.position_id
          where e.first_name like ?
          order by e.first_name, e.last_name`;
        db.raw(sql, [_query])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => q.reject(err));
        
        return q.promise;

      },

      searchByCode(db, code) {
        let q = $q.defer();
        let sql = `select e.employee_code, t.name as title_name, e.first_name, 
          e.last_name, e.cid, d.name as department_name, p.name as position_name
          from employees as e
          left join l_sub_departments as d on d.id=e.sub_department_id
          left join l_titles as t on t.id=e.title_id
          left join l_positions as p on p.id=e.position_id
          where e.employee_code=?
          order by e.first_name, e.last_name`;
        db.raw(sql, [code])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => q.reject(err));
        
        return q.promise;

      },

      total(db) {
        let q = $q.defer();
        db('employees')
          .count('* as total')
          .then(rows => {
            q.resolve(rows[0].total)
          })
          .catch(err => {
            q.reject(err)
          });
        
        return q.promise;
      }
    }
  });