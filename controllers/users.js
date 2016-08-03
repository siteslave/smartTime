var fse = require('fs-extra')

angular.module('app.controllers.Users', [])
  .controller('UsersCtrl', function ($scope, $rootScope, $mdDialog, UsersService, Connection) {
    // var config = fse.readJsonSync($rootScope.configFile)
    // var configFile = $rootScope.configFile;
    var db = Connection.getConnection();
    
    $scope.openMenu = function ($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };

    $scope.getList = function () {
      $scope.members = [];

      $scope.showLoading = true;
      
      UsersService.getMembers(db)
        .then(function (rows) {
          $scope.members = rows;
          $scope.showLoading = false;
        })
        .catch(function (err) {
          console.log(err);
          $scope.showLoading = false;
        });
    }

    $scope.getList();    

    $scope.showAddMember = function () {

      $mdDialog.show({
        controller: 'AddMemberDialogCtrl',
        templateUrl: './templates/add-member-dialog.html',
        parent: angular.element(document.body),
        // targetEvent: event,
        clickOutsideToClose: false,
        fullscreen: false
      })
        .then(function () {
          $scope.getList();
        }, function () {
          //
        });

    };

    $scope.update = function (id) {

      $rootScope.memberId = id;
      
      $mdDialog.show({
        controller: 'UpdateMemberDialogCtrl',
        templateUrl: './templates/add-member-dialog.html',
        parent: angular.element(document.body),
        // targetEvent: event,
        clickOutsideToClose: false,
        fullscreen: false
      })
        .then(function () {
          $scope.getList();
        }, function () {
          //
        });

    }

  });