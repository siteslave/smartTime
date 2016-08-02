
angular.module('app.services.Users', [])
  .factory('UsersService', function ($q) {
    return {
      getMembers: function (db) {
        var q = $q.defer();
        /*
        select * from members limit 10
        */
        db('test_members')
          .select()
          .limit(10)
          .then(function (rows) {
            q.resolve(rows);
          })
          .catch(function (err) {
            q.reject(err);
          });
        
        return q.promise;
      },
      getMembers2: function (db) {
        return db.raw('select * from test_members limit 10')
      }
    }
  });