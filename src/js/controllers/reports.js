
var moment = require('moment')
let json2xls = require('json2xls');
const {shell, app} = require('electron').remote;

let _ = require('lodash');
let path = require('path');
let fs = require('fs');
let rimraf = require('rimraf');
let fse = require('fs-extra');
let pdf = require('html-pdf');
let jsonData = require('gulp-data');
let gulp = require('gulp');
let jade = require('gulp-jade');

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
            'total_work', 'total_late', 'total_exit_before', 'total_not_exit'
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



    $scope.printSummary = (event, employee) => {

      let exportPath = app.getPath('temp');
      var destPath = path.join(exportPath, moment().format('x'));
      fse.ensureDirSync(destPath);

      let start = moment($scope.startDate).format('YYYY-MM-DD');
      let end = moment($scope.endDate).format('YYYY-MM-DD');
      let json = {};

      json.items = [];
      json.employee = employee;

      json.start_date = `${moment($scope.startDate).format('DD/MM')}/${moment($scope.startDate).get('year') + 543}`;
      json.end_date = `${moment($scope.endDate).format('DD/MM')}/${moment($scope.endDate).get('year') + 543}`;

      ReportService.getDetailForPrint(db, employee.employee_code, start, end)
        .then((rows) => {
          json.results = [];

          rows.forEach(v => {
            let obj = {};
            obj.date_serve = `${moment(v.date_serve).format('DD/MM')}/${moment(v.date_serve).get('year') + 543}`;
            obj.in01 = v.in01 ? moment(v.in01, 'HH:mm:ss').format('HH:mm') : '';
            obj.in02 = v.in02 ? moment(v.in02, 'HH:mm:ss').format('HH:mm') : '';
            let _in03 = v.in03 || v.in03_2;
            obj.in03 = _in03 ? moment(_in03, 'HH:mm:ss').format("HH:mm") : '';
            obj.out01 = v.out01 ? moment(v.out01, 'HH:mm:ss').format('HH:mm') : '';
            let _out02 = v.out02 || v.out02_2;
            obj.out02 = _out02 ? moment(_out02, 'HH:mm:ss').format('HH:mm') : '';
            obj.out03 = v.out03 ? moment(v.out03, 'HH:mm:ss').format('HH:mm') : '';

            json.results.push(obj);
          });

          gulp.task('html', (cb) => {
              return gulp.src('./jade/summary.jade')
                .pipe(jsonData(() => {
                  return json;
                }))
                .pipe(jade())
                .pipe(gulp.dest(destPath));
            });

            gulp.task('pdf', ['html'], () => {
              let html = fs.readFileSync(destPath + '/summary.html', 'utf8')
              let options = {
                format: 'A4',
                // height: "8in",
                // width: "6in",
                orientation: "portrait",
                footer: {
                  height: "15mm",
                  contents: '<span style="color: #444;"><small>Printed: ' + new Date() + '</small></span>'
                }
              }

              let pdfName = path.join(destPath, employee.fullname + '-' + moment().format('x') + '.pdf');

              pdf.create(html, options).toFile(pdfName, (err, resp) => {
                if (err) {
                  alert(JSON.stringify(err));
                } else {
                  shell.openItem(pdfName);
                }
              });

            });

            gulp.start('pdf');

        }, err => {
          console.log(err);
        });

    }
  });
