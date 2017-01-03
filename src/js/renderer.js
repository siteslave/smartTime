let moment = require('moment');

require('angular')
require('angular-material')
require('angular-ui-router')
require('angular-animate')
require('angular-aria')
require('angular-messages')
require('angular-material-data-table')

window.Highcharts = require('highcharts')
require('../../node_modules/highcharts-ng/dist/highcharts-ng.min.js')

require('./controllers/sidenav.js')
require('./controllers/toolbar.js')
require('./controllers/main.js')
require('./controllers/users.js')
require('./controllers/imports.js')
require('./controllers/settings.js')
require('./controllers/attendances.js')
require('./controllers/attendances-process.js')
require('./controllers/dialog-attendances-coverage.js')
require('./controllers/dialog-report-worklate')
require('./controllers/add-member-dialog.js')
require('./controllers/update-member-dialog.js')
require('./controllers/reports.js')
require('./controllers/employees.js')
require('./controllers/attendances-allow')

require('./services/users.js')
require('./services/import.js')
require('./services/reports.js')
require('./services/connection.js')
require('./services/employee.js')
require('./services/attendance.js')


angular.module('app', [
  'ui.router',
  'ngMaterial',
  'md.data.table',
  'highcharts-ng',
  'app.controllers.Sidenav',
  'app.controllers.Toolbar',
  'app.controllers.Main',
  'app.controllers.Settings',
  'app.controllers.Users',
  'app.controllers.Imports',
  'app.controllers.Attendances',
  'app.controllers.AttendancesProcess',
  'app.controllers.Dialog.Attendances.Coverage',
  'app.controller.Dialogs.ReportDetail',
  'app.services.Users',
  'app.services.Report',
  'app.services.Connnection',
  'app.controllers.AddMemberDialog',
  'app.controllers.UpdateMemberDialog',
  'app.controllers.Reports',
  'app.services.Employee',
  'app.controllers.Employees',
  'app.controllers.AttendancesAllow'
])

  .config(function ($stateProvider, $urlRouterProvider,
    $mdThemingProvider, $mdDateLocaleProvider) {

    // theme
    $mdThemingProvider.theme('default')
      .primaryPalette('pink')
      .accentPalette('orange');
    
    var shortMonths = ['ม.ค', 'ก.พ', 'มี.ค', 'เม.ย', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย', 'ต.ค', 'พ.ย', 'ธ.ค'];

    $mdDateLocaleProvider.months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    $mdDateLocaleProvider.shortMonths = shortMonths;
    $mdDateLocaleProvider.days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    $mdDateLocaleProvider.shortDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

    $mdDateLocaleProvider.monthHeaderFormatter = function (date) {
      return shortMonths[date.getMonth()] + ' ' + (date.getFullYear() + 543);
    };

    $mdDateLocaleProvider.formatDate = function (date) {
      return `${moment(date).format('DD/MM')}/${moment(date).get('year') + 543}`;
    };

    $mdDateLocaleProvider.parseDate = function (dateString) {
      var m = moment(dateString, 'L', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
    

    $urlRouterProvider.otherwise('/')

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: './templates/main.html',
        controller: 'MainCtrl'
      })
      .state('employees', {
        url: '/employees',
        templateUrl: './templates/employees.html',
        controller: 'EmployeesCtrl'
      })
      .state('import', {
        url: '/import',
        templateUrl: './templates/import.html',
        controller: 'ImportCtrl'
      })
      .state('attendances', {
        url: '/attendances',
        templateUrl: './templates/attendances.html',
        controller: 'AttendancesCtrl'
      })
      .state('attendances-process', {
        url: '/attendances-process',
        templateUrl: './templates/attendances-process.html',
        controller: 'AttendancesProcessCtrl'
      })
      .state('reports', {
        url: '/reports',
        templateUrl: './templates/reports.html',
        controller: 'ReportsCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: './templates/settings.html',
        controller: 'SettingsCtrl'
      })
      .state('attendances-allow', {
        url: '/attendances-allow',
        templateUrl: './templates/attendances-allow.html',
        controller: 'AttendancesAllowCtrl'
      })
    
   })