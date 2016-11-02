
var moment = require('moment')
let json2xls = require('json2xls');
const {shell, app} = require('electron').remote;

let path = require('path');
let fs = require('fs');

angular.module('app.controllers.Reports', [])

  .controller('ReportsCtrl', function ($scope, $rootScope, $mdDialog, ReportService, Connection) {
  
    let db = Connection.getConnection();
    $scope.attendances = [];
    
    $scope.startDate = new Date(moment().startOf('month').format());
    $scope.endDate = new Date(moment().endOf('month').format());
    
    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };
    
    $scope.getWorkLate = () => {

      $scope.showLoading = true;
      let start = moment($scope.startDate).format('YYYY-MM-DD');
      let end = moment($scope.endDate).format('YYYY-MM-DD');

      ReportService.getEmployeeWorkLate(db, start, end)
        .then(rows => {
          $scope.attendances = rows;
          $scope.showLoading = false;
        }, err => {
          $scope.showLoading = false;
          alert(JSON.stringify(err));
        });
      
    }

    $scope.exportExcel = () => {
      if ($scope.attendances) {

        let exportPath = app.getPath('temp');
        let filePath = path.join(exportPath, 'export-worklate.xlsx')
        let xls = json2xls($scope.attendances, {
          fields: [
            'employee_code', 'fullname', 'department_name',
            'work_total', 'late_total', 'exit_total', 'notexit_total'
          ]
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

    $scope.showWorklateDetail = (ev, employee) => {
       let start = moment($scope.startDate).format('YYYY-MM-DD');
       let end = moment($scope.endDate).format('YYYY-MM-DD');
      
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
        })
          .then(function () {
            //$scope.status = 'You said the information was "' + answer + '".';
          }, function () {
            //$scope.status = 'You cancelled the dialog.';
          });
    }

    $scope.showExitDetail = (ev, employee) => {
       let start = moment($scope.startDate).format('YYYY-MM-DD');
       let end = moment($scope.endDate).format('YYYY-MM-DD');
      
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
        })
          .then(function () {
            //$scope.status = 'You said the information was "' + answer + '".';
          }, function () {
            //$scope.status = 'You cancelled the dialog.';
          });
    }

    $scope.showNotExitDetail = (ev, employee) => {
       let start = moment($scope.startDate).format('YYYY-MM-DD');
       let end = moment($scope.endDate).format('YYYY-MM-DD');
      
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
        })
          .then(function () {
            //$scope.status = 'You said the information was "' + answer + '".';
          }, function () {
            //$scope.status = 'You cancelled the dialog.';
          });
    }


  });
