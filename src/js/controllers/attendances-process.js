let moment = require('moment');
let _ = require('lodash');

angular.module('app.controllers.AttendancesProcess', ['app.services.Attendance'])
  .controller('AttendancesProcessCtrl', function ($scope, $mdDialog, Attendance, Connection) {

    $scope.startDate = new Date(moment().startOf('month').format());
    $scope.endDate = new Date(moment().endOf('month').format());

    let db = Connection.getConnection(); 
    
    $scope.getProcessLog = () => {
      $scope.showLoading = true;
      Attendance.getProcessLog(db)
        .then(rows => {
          $scope.logs = [];
          rows.forEach(v => {
            let obj = {};
            obj.process_date = moment(v.process_date).format('DD/MM') + '/' + (moment(v.process_date).get('year') + 543)
            obj.process_time = v.process_time;
            $scope.logs.push(obj);
          });

          $scope.showLoading = false;
        }, err => {
          $scope.showLoading = false;
          console.log(err);
        });
    }

    $scope.doProcess = () => {
      $scope.showLoading = true;
      let start = moment($scope.startDate).format('YYYY-MM-DD');
      let end = moment($scope.endDate).format('YYYY-MM-DD');

      // remove old data
      Attendance.removeOldProcess(db, start, end)
        .then(() => {
          return Attendance.processAttendances(db, start, end);
        })
        .then(() => {
          return Attendance.updateServiceTypeStatus(db, start, end);
        })
        .then(() => {
          return Attendance.saveProcessLog(db);
        })
        .then(() => {
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('Success!')
              .textContent('ประมวลผลเสร็จเรียบร้อยแล้ว')
              .ariaLabel('Alert Dialog Demo')
              .ok('ปิดหน้าต่าง')
          );
          $scope.showLoading = false;

          $scope.getProcessLog();

        }, err => {
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('Error!')
              .textContent(JSON.stringify(err))
              .ariaLabel('Alert Dialog Demo')
              .ok('ปิดหน้าต่าง')
          );

          $scope.showLoading = false;
        });
    }

    $scope.getProcessLog();
    
  });