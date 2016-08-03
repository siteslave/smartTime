
angular.module('app.services.Users', [])
  .factory('UsersService', function ($q) {
    return {
      getMembers: function (db) {
        var q = $q.defer();
        /*
        select m.id, m.fullname, m.username, g.name as group_name
        from test_members as m
        left join test_groups as g on g.id=m.group_id
        limit 10
        */
        db('test_members as m')
          .select('m.id', 'm.fullname', 'm.username', 'g.name as group_name')
          .leftJoin('test_groups as g', 'g.id', 'm.group_id')
          .limit(10)
          .then(function (rows) {
            q.resolve(rows);
          })
          .catch(function (err) {
            q.reject(err);
          });
        
        return q.promise;
      },

      getGroups: function (db) {
        var q = $q.defer();
        db('test_groups')
          .then(function (rows) {
            q.resolve(rows);
          })
          .catch(function (err) {
            q.reject(err);
          });
        
        return q.promise;
      },

      save: function (db, user) {
        var q = $q.defer();
        db('test_members')
          .insert(user)
          .then(function () {
            q.resolve();
          })
          .catch(function (err) {
            q.reject(err);
          });
        
        return q.promise;
      },

      getDetail: function (db, id) {
        var q = $q.defer();
        db('test_members')
          .select('id', 'fullname', 'username', 'group_id')
          .where('id', id)
          .then(function (rows) {
            q.resolve(rows[0]) // object {}
          })
          .catch(function (err) {
            q.reject(err)
          });
        
        return q.promise;
      },

      update: function (db, memberId, user) {
        var q = $q.defer();
        db('test_members')
          .where('id', memberId)
          .update({
            fullname: user.fullname,
            group_id: user.group_id
          })
          .then(function () {
            q.resolve()
          })
          .catch(function (err) {
            q.reject(err)
          });
        
        return q.promise;
          
      },

      remove: function (db, id) {
        var q = $q.defer();
        // DELETE FROM test_members WHERE id=xx
        var sql = 'DELETE FROM test_members WHERE id=?';
        db.raw(sql, [id])
          .then(function () {
            q.resolve()
          })
          .catch(function (err) {
            q.reject(err)
          });
        
        return q.promise;
      }

    }
  });