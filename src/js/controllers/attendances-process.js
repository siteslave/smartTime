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
            obj.process_date = moment(v.process_date).format('DD/MM/') + '/' + (moment(v.process_date).get('year') + 543)
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

      // console.log(start, end)
      //Attendance.getAttendancesByDate(db, start, limit, offset)
      Attendance.processAttendances(db, start, end)
        .then(rows => {
          //console.log(rows);
          let attendances = [];
          rows.forEach(v => {
            let obj = {};
            obj.employee_code = v.employee_code;
            //obj.fullname = v.fullname;

            let _attendance = v.time_checked.split(',')
            obj.checkin_date = moment(v.checkin_date).format('YYYY-MM-DD');
            obj.checkin = _attendance;
            obj.employee_code = v.employee_code;

            attendances.push(obj)

          });

          let _data = Attendance.processTime(attendances);

          // remove old process
          Attendance.removeOldProcess(db, start, end)
            .then(() => {
              let at = [];
              _data.forEach(v => {
                let obj = {};
                obj.employee_code = v.employee_code;
                obj.checkin_date = v.checkin_date;
                obj.start_time = v.start_time;
                obj.end_time = v.end_time;
                at.push(obj)
                console.log(at);
              })
              return Attendance.saveProcess(db, at);
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
          // import data
          
        }, err => {
          $scope.showLoading = false;
          alert(JSON.stringify(err));
        });
    }

    $scope.getProcessLog();
    
  });