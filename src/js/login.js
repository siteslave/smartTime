'use strict';

var {app} = require('electron').remote
var _crypto = require('crypto')

angular.module('app', [
  'ngMaterial', 'ui.router',
  'app.services.Connnection',
  'app.controllers.Settings'
])
  .config(function ($mdThemingProvider, $stateProvider, $urlRouterProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('pink')
      .accentPalette('orange');
    
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: './templates/login.html',
        controller: 'LoginCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: './templates/settings-login.html',
        controller: 'SettingsCtrl'
      });

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
 
  .factory('LoginService', ($q) => {
    return {
      doLogin: function (db, username, password) {
        var q = $q.defer();
        db('admin')
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