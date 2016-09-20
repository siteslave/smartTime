'use strict';

angular.module('app.controllers.UpdateMemberDialog', []).controller('UpdateMemberDialogCtrl', function ($scope, $rootScope, $mdDialog, UsersService, Connection) {

  $scope.isUpdate = true;

  $scope.memberId = $rootScope.memberId;
  $scope.user = {};

  // var configFile = $rootScope.configFile;
  var db = Connection.getConnection();

  // get groups
  UsersService.getGroups(db).then(function (rows) {
    $scope.groups = rows;
  });

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  UsersService.getDetail(db, $scope.memberId).then(function (user) {
    $scope.user = user;
    $scope.user.password = 'xxx';
  });

  $scope.save = function () {
    if ($scope.user.group_id) {
      // save
      UsersService.update(db, $scope.memberId, $scope.user).then(function () {
        // success
        // ซ่อน modal
        $mdDialog.hide();
      }, function (err) {
        // แสดง Dialog
        $mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title('เกิดข้อผิดพลาด').textContent(JSON.stringify(err)).ariaLabel('alert').ok('ตกลง'));
      });
    } else {
      // alert
      $mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title('เกิดข้อผิดพลาด').textContent('ข้อมูลไม่สมบูรณ์').ariaLabel('alert').ok('ตกลง'));
    }
  };
});