'use strict';

var moment = require('moment');
var _ = require('lodash');

angular.module('app.controllers.Attendances', ['app.services.Attendance']).controller('AttendancesCtrl', function ($scope, Attendance, Connection) {
  var db = Connection.getConnection();
  $scope.workDate = new Date(moment().format());

  $scope.total = 0;
  $scope.showLoading = false;
  $scope.showPaging = true;
  $scope.searchQuery = null;

  $scope.employees = [];

  $scope.openMenu = function ($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
  };

  $scope.query = {
    limit: 20,
    page: 1
  };

  $scope.onPaginate = function (page, limit) {
    // console.log(page, limit);
    var offset = (page - 1) * limit;
    $scope.getList(limit, offset);
  };

  $scope.getTotal = function () {
    var date = moment($scope.workDate).format('YYYY-MM-DD');

    Attendance.getAttendancesByDateTotal(db, date).then(function (total) {
      $scope.total = total;
    }, function (err) {
      console.log(err);
    });
  };

  $scope.initial = function () {
    var limit = $scope.query.limit;
    var offset = ($scope.query.page - 1) * $scope.query.limit;

    $scope.getTotal();
    $scope.getList(limit, offset);
  };

  $scope.getList = function (limit, offset) {
    $scope.showLoading = true;
    $scope.showPaging = true;

    var start = moment($scope.workDate).subtract(1, 'd').format('YYYY-MM-DD');
    var end = moment($scope.workDate).add(1, 'd').format('YYYY-MM-DD');

    $scope.employees = [];

    Attendance.getAttendancesByDate(db, start, end, limit, offset).then(function (rows) {
      // console.log(rows);
      var attendances = [];

      var codes = _.map(rows, 'employee_code');
      var _empCode = _.uniq(codes);

      _.forEach(_empCode, function (v) {
        console.log(v);
      });
      // rows.forEach(v => {
      //   let obj = {};
      //   obj.employee_code = v.employee_code;
      //   obj.fullname = v.fullname;

      //   let attendances = v.time_checked.split(',')
      //   obj.start = moment(attendances[0], 'HH:mm:ss').format('HH:mm');
      //   obj.end = attendances[1] ? moment(attendances[attendances.length - 1], 'HH:mm:ss').format('HH:mm') : '';

      //   $scope.employees.push(obj);
      // })


      $scope.showLoading = false;
    }, function (err) {
      $scope.showLoading = false;
      alert(JSON.stringify(err));
    });
  };

  $scope.initial();
});