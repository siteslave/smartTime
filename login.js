
var {app} = require('electron').remote
var _crypto = require('crypto')

angular.module('app', ['ngMaterial', 'app.services.Connnection'])
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('pink')
      .accentPalette('orange');
  })
  .controller('LoginCtrl', function ($scope, Connection, LoginService) {

    var db = Connection.getConnection();

    $scope.Exit = function () {
      app.quit();
    }

    $scope.Login = function () {
      var encryptedPass = _crypto.createHash('md5').update($scope.password).digest('hex');
      LoginService.doLogin(db, $scope.username, encryptedPass)
        .then(function (total) {
          if (total) {
            window.location.href = './index.html';
          } else {
            alert('ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง')
          }
        }, function (err) {
          console.log(err)
        });
    }
    
  })
  .factory('LoginService', function ($q) {
    return {
      doLogin: function (db, username, password) {
        var q = $q.defer();
        db('test_members')
          .where('username', username)
          .where('password', password)
          .count('* as total')
          .then(function (rows) {
            q.resolve(rows[0].total)
          })
          .catch(function (err) {
            q.reject(err)
          });
        
        return q.promise;
      }
    }
  });