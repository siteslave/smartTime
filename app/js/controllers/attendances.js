'use strict';

var moment = require('moment');
var _ = require('lodash');
var json2xls = require('json2xls');

// let remote = require('electron').remote;
// let app = remote.app;

var _require$remote = require('electron').remote,
    shell = _require$remote.shell,
    app = _require$remote.app;

var path = require('path');
var fs = require('fs');

angular.module('app.controllers.Attendances', ['app.services.Attendance']).controller('AttendancesCtrl', function ($scope, $mdDialog, $rootScope, Attendance, Connection) {
  var db = Connection.getConnection();
  $scope.workDate = new Date(moment().format());

  $scope.showLoading = false;
  $scope.searchQuery = null;

  $scope.employees = [];

  $scope.openMenu = function ($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
  };

  $scope.getList = function () {
    $scope.showLoading = true;
    var start = moment($scope.workDate).format('YYYY-MM-DD');

    $scope.attendances = [];

    Attendance.getAttendancesByDate(db, start).then(function (rows) {
      $scope.attendances = rows;
      $scope.showLoading = false;
    }, function (err) {
      $scope.showLoading = false;
      alert(JSON.stringify(err));
    });
  };

  //DialogAttendancesCoverageCtrl    
  $scope.showCoverage = function (ev, employee) {
    $rootScope.employee_code = employee.employee_code;
    $rootScope.start = moment($scope.workDate).format('YYYY-MM-DD');

    $mdDialog.show({
      controller: 'DialogAttendancesCoverageCtrl',
      templateUrl: './templates/dialog-attends-coverage.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    }).then(function () {
      //$scope.status = 'You said the information was "' + answer + '".';
    }, function () {
      //$scope.status = 'You cancelled the dialog.';
    });
  };

  $scope.exportExcel = function () {
    if ($scope.attendances) {
      (function () {

        var exportPath = app.getPath('temp');
        var filePath = path.join(exportPath, 'export.xlsx');
        var xls = json2xls($scope.attendances, {
          fields: ['fullname', 'employee_code', 'start_time', 'end_time']
        });
        fs.writeFile(filePath, xls, 'binary', function (err) {
          if (err) {
            alert(err);
          } else {
            console.log(filePath);
            shell.openItem(filePath);
          }
        });
      })();
    } else {
      alert('ไม่พบข้อมูลที่ต้องการส่งออก');
    }
  };

  $scope.getList();
});