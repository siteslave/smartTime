'use strict';

var moment = require('moment');
var _ = require('lodash');

angular.module('app.controllers.AttendancesProcess', ['app.services.Attendance']).controller('AttendancesProcessCtrl', function ($scope, $mdDialog, Attendance, Connection) {

  $scope.startDate = new Date(moment().startOf('month').format());
  $scope.endDate = new Date(moment().endOf('month').format());

  var db = Connection.getConnection();

  $scope.getProcessLog = function () {
    $scope.showLoading = true;
    Attendance.getProcessLog(db).then(function (rows) {
      $scope.logs = [];
      rows.forEach(function (v) {
        var obj = {};
        obj.process_date = moment(v.process_date).format('DD/MM/') + '/' + (moment(v.process_date).get('year') + 543);
        obj.process_time = v.process_time;
        $scope.logs.push(obj);
      });

      $scope.showLoading = false;
    }, function (err) {
      $scope.showLoading = false;
      console.log(err);
    });
  };

  $scope.doProcess = function () {
    $scope.showLoading = true;
    var start = moment($scope.startDate).format('YYYY-MM-DD');
    var end = moment($scope.endDate).format('YYYY-MM-DD');

    // console.log(start, end)
    //Attendance.getAttendancesByDate(db, start, limit, offset)
    Attendance.processAttendances(db, start, end).then(function (rows) {
      //console.log(rows);
      var attendances = [];
      rows.forEach(function (v) {
        var obj = {};
        obj.employee_code = v.employee_code;
        //obj.fullname = v.fullname;

        var _attendance = v.time_checked.split(',');
        obj.checkin_date = moment(v.checkin_date).format('YYYY-MM-DD');
        obj.checkin = _attendance;
        obj.employee_code = v.employee_code;

        attendances.push(obj);
      });

      var _data = Attendance.processTime(attendances);

      // remove old process
      Attendance.removeOldProcess(db, start, end).then(function () {
        var at = [];
        _data.forEach(function (v) {
          var obj = {};
          obj.employee_code = v.employee_code;
          obj.checkin_date = v.checkin_date;
          obj.start_time = v.start_time;
          obj.end_time = v.end_time;
          at.push(obj);
          console.log(at);
        });
        return Attendance.saveProcess(db, at);
      }).then(function () {
        return Attendance.saveProcessLog(db);
      }).then(function () {
        $mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title('Success!').textContent('ประมวลผลเสร็จเรียบร้อยแล้ว').ariaLabel('Alert Dialog Demo').ok('ปิดหน้าต่าง'));
        $scope.showLoading = false;

        $scope.getProcessLog();
      }, function (err) {
        $mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title('Error!').textContent(JSON.stringify(err)).ariaLabel('Alert Dialog Demo').ok('ปิดหน้าต่าง'));

        $scope.showLoading = false;
      });
      // import data
    }, function (err) {
      $scope.showLoading = false;
      alert(JSON.stringify(err));
    });
  };

  $scope.getProcessLog();
});