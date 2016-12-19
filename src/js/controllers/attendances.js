let moment = require('moment');
let _ = require('lodash');
let json2xls = require('json2xls');

// let remote = require('electron').remote;
// let app = remote.app;
const {shell, app} = require('electron').remote;

let path = require('path');
let fs = require('fs');

angular.module('app.controllers.Attendances', ['app.services.Attendance'])
  .controller('AttendancesCtrl', function ($scope, $mdDialog, $rootScope, Attendance, Connection) {
    let db = Connection.getConnection();
    $scope.workDate = new Date(moment().format());

    $scope.showLoading = false;
    $scope.searchQuery = null;

    $scope.employees = [];

    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

    $scope.getList = () => {
      $scope.showLoading = true;
      let start = moment($scope.workDate).format('YYYY-MM-DD');

      $scope.attendances = [];

      Attendance.getAttendancesByDate(db, start)
        .then(rows => {
          $scope.attendances = rows;
          $scope.showLoading = false;
        }, err => {
          $scope.showLoading = false;
          alert(JSON.stringify(err));
        });
    }

//DialogAttendancesCoverageCtrl
    $scope.showCoverage = (ev, employee) => {
      $rootScope.employee_code = employee.employee_code;
      $rootScope.start = moment($scope.workDate).format('YYYY-MM-DD');

      $mdDialog.show({
        controller: 'DialogAttendancesCoverageCtrl',
        templateUrl: './templates/dialog-attends-coverage.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      })
        .then(function () {
          //$scope.status = 'You said the information was "' + answer + '".';
        }, function () {
          //$scope.status = 'You cancelled the dialog.';
        });
    }


    $scope.exportExcel = () => {
      if ($scope.attendances) {

        let exportPath = app.getPath('temp');
        let filePath = path.join(exportPath, 'export.xlsx')
        let xls = json2xls($scope.attendances, {
          fields: ['fullname', 'employee_code', 'in_time', 'out_time']
        });
        fs.writeFile(filePath, xls, 'binary', (err) => {
          if (err) {
            alert(err);
          } else {
            console.log(filePath)
            shell.openItem(filePath);
          }
        });


      } else {
        alert('ไม่พบข้อมูลที่ต้องการส่งออก')
      }
    };

    $scope.getList();

  });