'use strict';

angular.module('app.services.Employee', []).factory('Employee', function ($q) {
  return {
    list: function list(db, limit, offset) {
      var q = $q.defer();
      var sql = 'select e.employee_code, t.name as title_name, e.first_name, \n          e.last_name, e.cid, d.name as department_name, p.name as position_name\n          from employees as e\n          left join l_sub_departments as d on d.id=e.sub_department_id\n          left join l_titles as t on t.id=e.title_id\n          left join l_positions as p on p.id=e.position_id\n          order by e.first_name, e.last_name\n          limit ? offset ?';
      db.raw(sql, [limit, offset]).then(function (rows) {
        q.resolve(rows[0]);
      }).catch(function (err) {
        return q.reject(err);
      });

      return q.promise;
    },
    searchByName: function searchByName(db, query) {
      var q = $q.defer();
      var _query = '%' + query + '%';

      var sql = 'select e.employee_code, t.name as title_name, e.first_name, \n          e.last_name, e.cid, d.name as department_name, p.name as position_name\n          from employees as e\n          left join l_sub_departments as d on d.id=e.sub_department_id\n          left join l_titles as t on t.id=e.title_id\n          left join l_positions as p on p.id=e.position_id\n          where e.first_name like ?\n          order by e.first_name, e.last_name';
      db.raw(sql, [_query]).then(function (rows) {
        q.resolve(rows[0]);
      }).catch(function (err) {
        return q.reject(err);
      });

      return q.promise;
    },
    searchByCode: function searchByCode(db, code) {
      var q = $q.defer();
      var sql = 'select e.employee_code, t.name as title_name, e.first_name, \n          e.last_name, e.cid, d.name as department_name, p.name as position_name\n          from employees as e\n          left join l_sub_departments as d on d.id=e.sub_department_id\n          left join l_titles as t on t.id=e.title_id\n          left join l_positions as p on p.id=e.position_id\n          where e.employee_code=?\n          order by e.first_name, e.last_name';
      db.raw(sql, [code]).then(function (rows) {
        q.resolve(rows[0]);
      }).catch(function (err) {
        return q.reject(err);
      });

      return q.promise;
    },
    total: function total(db) {
      var q = $q.defer();
      db('employees').count('* as total').then(function (rows) {
        q.resolve(rows[0].total);
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    }
  };
});