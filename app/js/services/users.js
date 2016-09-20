'use strict';

angular.module('app.services.Users', []).factory('UsersService', function ($q) {
  return {
    getMembers: function getMembers(db, limit, offset) {
      var q = $q.defer();

      db('test_members as m').select('m.id', 'm.fullname', 'm.username', 'g.name as group_name').leftJoin('test_groups as g', 'g.id', 'm.group_id').limit(limit).offset(offset).then(function (rows) {
        q.resolve(rows);
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },

    getTotal: function getTotal(db) {
      var q = $q.defer();
      db('test_members').count('* as total').then(function (rows) {
        q.resolve(rows[0].total);
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },

    getGroups: function getGroups(db) {
      var q = $q.defer();
      db('test_groups').then(function (rows) {
        q.resolve(rows);
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },

    save: function save(db, user) {
      var q = $q.defer();
      db('test_members').insert(user).then(function () {
        q.resolve();
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },

    getDetail: function getDetail(db, id) {
      var q = $q.defer();
      db('test_members').select('id', 'fullname', 'username', 'group_id').where('id', id).then(function (rows) {
        q.resolve(rows[0]); // object {}
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },

    update: function update(db, memberId, user) {
      var q = $q.defer();
      db('test_members').where('id', memberId).update({
        fullname: user.fullname,
        group_id: user.group_id
      }).then(function () {
        q.resolve();
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },

    remove: function remove(db, id) {
      var q = $q.defer();
      // DELETE FROM test_members WHERE id=xx
      var sql = 'DELETE FROM test_members WHERE id=?';
      db.raw(sql, [id]).then(function () {
        q.resolve();
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },

    getReportsMembers: function getReportsMembers(db) {
      var q = $q.defer();
      var sql = 'select g.name as group_name, count(*) as total\n                  from test_members as m\n                  left join test_groups as g on g.id=m.group_id\n                  group by m.group_id';
      db.raw(sql, []).then(function (rows) {
        q.resolve(rows[0]);
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },

    getReportsDrug: function getReportsDrug(db, start, end) {
      var q = $q.defer();

      var sql = '\n        select count(*) as total, d.DNAME\n        from drug_opd as d\n        where d.HOSPCODE=\'04248\'\n        and d.DATE_SERV BETWEEN ? and ?\n        group by d.DIDSTD\n        order by total desc\n        limit 10\n        ';

      db.raw(sql, [start, end]).then(function (rows) {
        q.resolve(rows[0]);
      }).catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    }

  };
});