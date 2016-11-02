'use strict';

var moment = require('moment');
var _ = require('lodash');

angular.module('app.controllers.Dialog.Attendances.Coverage', ['app.services.Attendance']).controller('DialogAttendancesCoverageCtrl', function ($scope, $rootScope, $mdDialog, Attendance, Connection) {
  var db = Connection.getConnection();

  $scope.attendances = [];

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.getList = function () {
    var start = moment($rootScope.start).subtract(1, 'day').format('YYYY-MM-DD');
    var end = moment($rootScope.start).add(1, 'day').format('YYYY-MM-DD');

    Attendance.getAttendancesCoverage(db, $rootScope.employee_code, start, end).then(function (rows) {
      rows.forEach(function (v) {
        var obj = {};
        obj.checkin_date = moment(v.checkin_date).format('DD/MM') + '/' + (moment(v.checkin_date).get('year') + 543);
        obj.time = v.checkin_time;
        $scope.attendances.push(obj);
      });
    }, function (err) {
      console.log(err);
    });
  };

  $scope.getList();
});