let moment = require('moment');
let _ = require('lodash');

angular.module('app.controllers.AttendancesAllow', ['app.services.Attendance'])
  .controller('AttendancesAllowCtrl', function ($scope, $mdDialog, Attendance, Connection) {

    let db = Connection.getConnection();

    $scope.yearCode = null;
    $scope.monthCode = null;

    $scope.months = [];
    $scope.years = [];
    $scope.logs = [];

    $scope.years.push({ year: '2016', name: '2559' });
    $scope.years.push({ year: '2017', name: '2560' });
    $scope.years.push({ year: '2018', name: '2561' });
    $scope.years.push({ year: '2019', name: '2562' });

    $scope.months.push({ month: '01', name: 'มกราคม' });
    $scope.months.push({ month: '02', name: 'กุมภาพันธ์' });
    $scope.months.push({ month: '03', name: 'มีนาคม' });
    $scope.months.push({ month: '04', name: 'เมษายน' });
    $scope.months.push({ month: '05', name: 'พฤษภาคม' });
    $scope.months.push({ month: '06', name: 'มิถุนายน' });
    $scope.months.push({ month: '07', name: 'กรกฎาคม' });
    $scope.months.push({ month: '08', name: 'สิงหาคม' });
    $scope.months.push({ month: '09', name: 'กันยายน' });
    $scope.months.push({ month: '10', name: 'ตุลาคม' });
    $scope.months.push({ month: '11', name: 'พฤศจิกายน' });
    $scope.months.push({ month: '12', name: 'ธันวาคม' });

    $scope.getLogs = () => {
      Attendance.getAllowLogs(db)
        .then(rows => {
          $scope.logs = rows;
        });
    };

    $scope.getLogs();

    $scope.doAddAllow = () => {
      let selectedMonth = `${$scope.yearCode}-${$scope.monthCode}`;
      $scope.startDate = moment(selectedMonth, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
      $scope.endDate = moment(selectedMonth, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');

      console.log($scope.startDate, $scope.endDate);
      let employees = [];
      // get all employees without assigned this month
      Attendance.getInitialAllowEmployees(db, $scope.startDate, $scope.endDate)
        .then(rows => {
          // console.log(rows);
          rows.forEach(v => {
            employees.push(v.employee_code);
          });

          let _startDate = +moment(selectedMonth, 'YYYY-MM').startOf('month').format('DD');
          let _endDate = +moment(selectedMonth, 'YYYY-MM').endOf('month').format('DD');
          let serviceDates = [];

          for (let i = 0; i <= _endDate - 1; i++) {
            let _date = moment($scope.startDate, 'YYYY-MM-DD').add(i, "days").format("YYYY-MM-DD");
            serviceDates.push(_date);
          }

          let services = [];

          employees.forEach((v) => {

            serviceDates.forEach(d => {
              let obj = { employee_code: v, date_serve: d, service_type: "1" };
              services.push(obj);
            });
          });

          return Attendance.saveInitialAllowEmployees(db, services);
        })
        .then(() => {
          return Attendance.saveAllow(db, $scope.yearCode, $scope.monthCode);
        })
        .then(() => {
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('Success!')
              .textContent('บันทึกข้อมูล เสร็จเรียบร้อยแล้ว')
              .ariaLabel('Alert Dialog Demo')
              .ok('ปิดหน้าต่าง')
          );

          $scope.getLogs();
        }, (error) => { 
          console.log(error);
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('Error!')
              .textContent('เกิดข้อผิดพลาด')
              .ariaLabel('Alert Dialog Demo')
              .ok('ปิดหน้าต่าง')
          );
         });

      // console.log($scope.yearCode, $scope.monthCode);
      // Attendance.saveAllow(db, $scope.yearCode, $scope.monthCode)
      //   .then(() => {

      //     $mdDialog.show(
      //       $mdDialog.alert()
      //         .clickOutsideToClose(true)
      //         .title('Success!')
      //         .textContent('บันทึกข้อมูล เสร็จเรียบร้อยแล้ว')
      //         .ariaLabel('Alert Dialog Demo')
      //         .ok('ปิดหน้าต่าง')
      //     );

      //     $scope.getLogs();

      //   }, (error) => {
      //     console.log(error);
      //     $mdDialog.show(
      //       $mdDialog.alert()
      //         .clickOutsideToClose(true)
      //         .title('Error!')
      //         .textContent('เกิดข้อผิดพลาด')
      //         .ariaLabel('Alert Dialog Demo')
      //         .ok('ปิดหน้าต่าง')
      //     );
      //   });

    };

  });