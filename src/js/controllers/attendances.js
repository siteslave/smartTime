let moment = require('moment');
let _ = require('lodash');

angular.module('app.controllers.Attendances', ['app.services.Attendance'])
  .controller('AttendancesCtrl', function ($scope, Attendance, Connection) {
    let db = Connection.getConnection();  
    $scope.workDate = new Date(moment().format());

    $scope.total = 0;
    $scope.showLoading = false;
    $scope.showPaging = true;
    $scope.searchQuery = null;

    
    $scope.employees = [];

    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };
    
    $scope.query = {
      limit: 20,
      page: 1
    };

    $scope.onPaginate = (page, limit) => {
      // console.log(page, limit);
      let offset = (page - 1) * limit;
      $scope.getList(limit, offset);
    };

    $scope.getTotal = () => {
      let date = moment($scope.workDate).format('YYYY-MM-DD');

      Attendance.getAttendancesByDateTotal(db, date)
        .then(total => {
          $scope.total = total;
        }, err => {
          console.log(err)
        });
    };

    $scope.initial = () => {
      let limit = $scope.query.limit;
      let offset = ($scope.query.page - 1) * $scope.query.limit;

      $scope.getTotal();
      $scope.getList(limit, offset);
    };

    $scope.getList = (limit, offset) => {
      $scope.showLoading = true;
      $scope.showPaging = true;

      let start = moment($scope.workDate).subtract(1, 'd').format('YYYY-MM-DD');
      let end = moment($scope.workDate).add(1, 'd').format('YYYY-MM-DD');

      $scope.employees = [];

      Attendance.getAttendancesByDate(db, start, end, limit, offset)
        .then(rows => {
          // console.log(rows);
          let attendances = [];

          let codes = _.map(rows, 'employee_code')
          let _empCode = _.uniq(codes)

          _.forEach(_empCode, v => { 
            console.log(v)
          })          
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
        }, err => {
          $scope.showLoading = false;
          alert(JSON.stringify(err));
        });
    }

    $scope.initial();

  });