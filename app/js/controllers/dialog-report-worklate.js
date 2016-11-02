'use strict';

var moment = require('moment');

angular.module('app.controller.Dialogs.ReportDetail', []).controller('DialogReportWorkLoadDetail', function ($scope, $rootScope, $mdDialog, ReportService, Connection) {
  var db = Connection.getConnection();

  // employee_code, start, end
  var employee_code = $rootScope.employee_code;
  var start = $rootScope.start;
  var end = $rootScope.end;

  $scope.details = [];

  if ($rootScope.type == 'late') {
    ReportService.getEmployeeWorkLateDetail(db, employee_code, start, end).then(function (rows) {
      rows.forEach(function (v) {
        var obj = {};
        obj.checkin_date = moment(v.checkin_date).format('DD/MM') + '/' + (moment(v.checkin_date).get('year') + 543);
        obj.start_time = v.start_time;
        obj.end_time = v.end_time;

        $scope.details.push(obj);
      });
    });
  } else if ($rootScope.type == 'exit') {
    ReportService.getEmployeeExitDetail(db, employee_code, start, end).then(function (rows) {
      rows.forEach(function (v) {
        var obj = {};
        obj.checkin_date = moment(v.checkin_date).format('DD/MM') + '/' + (moment(v.checkin_date).get('year') + 543);
        obj.start_time = v.start_time;
        obj.end_time = v.end_time;

        $scope.details.push(obj);
      });
    });
  } else {
    ReportService.getEmployeeNotExitDetail(db, employee_code, start, end).then(function (rows) {
      rows.forEach(function (v) {
        var obj = {};
        obj.checkin_date = moment(v.checkin_date).format('DD/MM') + '/' + (moment(v.checkin_date).get('year') + 543);
        obj.start_time = v.start_time;
        obj.end_time = v.end_time;

        $scope.details.push(obj);
      });
    });
  }

  $scope.cancel = function () {
    $mdDialog.cancel();
  };
});