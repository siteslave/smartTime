let moment = require('moment');
let _ = require('lodash');

angular.module('app.controllers.Dialog.Attendances.Coverage', ['app.services.Attendance'])
  .controller('DialogAttendancesCoverageCtrl', function ($scope, $rootScope, $mdDialog, Attendance, Connection) {
    let db = Connection.getConnection();  

    $scope.attendances = [];
    
    $scope.cancel = function () {
      $mdDialog.cancel();
    };
    
    $scope.getList = () => {
      let start = moment($rootScope.start).subtract(1, 'day').format('YYYY-MM-DD');
      let end = moment($rootScope.start).add(1, 'day').format('YYYY-MM-DD');
  
      Attendance.getAttendancesCoverage(db, $rootScope.employee_code, start, end)
        .then(rows => {
          rows.forEach(v => {
            let obj = {};
            obj.checkin_date = moment(v.checkin_date).format('DD/MM') + '/' + (moment(v.checkin_date).get('year') + 543);
            obj.time = v.checkin_time;
            $scope.attendances.push(obj);
          });
        }, err => {
          console.log(err);
        });
    }

    $scope.getList();

  });