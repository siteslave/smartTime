'use strict';

var moment = require('moment');
var json2xls = require('json2xls');

var _require$remote = require('electron').remote,
    shell = _require$remote.shell,
    app = _require$remote.app;

var path = require('path');
var fs = require('fs');

angular.module('app.controllers.Reports', []).controller('ReportsCtrl', function ($scope, $rootScope, $mdDialog, ReportService, Connection) {

  var db = Connection.getConnection();
  $scope.attendances = [];

  $scope.startDate = new Date(moment().startOf('month').format());
  $scope.endDate = new Date(moment().endOf('month').format());

  $scope.openMenu = function ($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
  };

  $scope.getWorkLate = function () {

    $scope.showLoading = true;
    var start = moment($scope.startDate).format('YYYY-MM-DD');
    var end = moment($scope.endDate).format('YYYY-MM-DD');

    ReportService.getEmployeeWorkLate(db, start, end).then(function (rows) {
      $scope.attendances = rows;
      $scope.showLoading = false;
    }, function (err) {
      $scope.showLoading = false;
      alert(JSON.stringify(err));
    });
  };

  $scope.exportExcel = function () {
    if ($scope.attendances) {
      (function () {

        var exportPath = app.getPath('temp');
        var filePath = path.join(exportPath, 'export-worklate.xlsx');
        var xls = json2xls($scope.attendances, {
          fields: ['employee_code', 'fullname', 'department_name', 'work_total', 'late_total', 'exit_total', 'notexit_total']
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

  $scope.showWorklateDetail = function (ev, employee) {
    var start = moment($scope.startDate).format('YYYY-MM-DD');
    var end = moment($scope.endDate).format('YYYY-MM-DD');

    $rootScope.employee_code = employee.employee_code;
    $rootScope.start = start;
    $rootScope.end = end;
    $rootScope.type = 'late';

    $mdDialog.show({
      controller: 'DialogReportWorkLoadDetail',
      templateUrl: './templates/dialog-report-worklate-detail.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    }).then(function () {
      //$scope.status = 'You said the information was "' + answer + '".';
    }, function () {
      //$scope.status = 'You cancelled the dialog.';
    });
  };

  $scope.showExitDetail = function (ev, employee) {
    var start = moment($scope.startDate).format('YYYY-MM-DD');
    var end = moment($scope.endDate).format('YYYY-MM-DD');

    $rootScope.employee_code = employee.employee_code;
    $rootScope.start = start;
    $rootScope.end = end;
    $rootScope.type = 'exit';

    $mdDialog.show({
      controller: 'DialogReportWorkLoadDetail',
      templateUrl: './templates/dialog-report-worklate-detail.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    }).then(function () {
      //$scope.status = 'You said the information was "' + answer + '".';
    }, function () {
      //$scope.status = 'You cancelled the dialog.';
    });
  };

  $scope.showNotExitDetail = function (ev, employee) {
    var start = moment($scope.startDate).format('YYYY-MM-DD');
    var end = moment($scope.endDate).format('YYYY-MM-DD');

    $rootScope.employee_code = employee.employee_code;
    $rootScope.start = start;
    $rootScope.end = end;
    $rootScope.type = 'notExit';

    $mdDialog.show({
      controller: 'DialogReportWorkLoadDetail',
      templateUrl: './templates/dialog-report-worklate-detail.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    }).then(function () {
      //$scope.status = 'You said the information was "' + answer + '".';
    }, function () {
      //$scope.status = 'You cancelled the dialog.';
    });
  };
});