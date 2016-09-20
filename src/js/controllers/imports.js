'use strict';

let fs = require('fs');
let moment = require('moment');

const {dialog} = require('electron').remote;

angular.module('app.controllers.Imports', ['app.services.Import'])
  .controller('ImportCtrl', ($scope, $mdDialog, ImportService, Connection) => {
    
    $scope.showLoading = false;

    $scope.importEncoding = 'UCS2';
  
      $scope.openTarget = () => {
        $scope.targetName = dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [{ name: 'CSV', extensions: ['csv', 'txt'] }]
        });
      }

      $scope.doImport = () => {
        $scope.showLoading = true;

        let db = Connection.getConnection();
        let csvFile = $scope.targetName[0];

        let startDate = moment($scope.startDate).format('YYYY-MM-DD');
        let endDate = moment($scope.endDate).format('YYYY-MM-DD');
        let csvData = null;

        if ($scope.importEncoding == 'UCS2') {
          csvData = fs.readFileSync(csvFile, 'ucs2');
        } else {
          csvData = fs.readFileSync(csvFile, 'utf8');
        }

        let _data = csvData.toString().split("\n");
        delete _data[0];
        let items = [];

        _data.forEach((v, i) => {
          if (v) {
            let arrItem = v.toString().split("\t");
            let obj = {
              checkin_date: moment(arrItem[8], 'YYYY/MM/DD HH:mm:ss').format('YYYY-MM-DD'),
              checkin_time: moment(arrItem[8], 'YYYY/MM/DD HH:mm:ss').format('HH:mm:ss'),
              employee_code: arrItem[2],
              imported_date: moment().format('YYYY-MM-DD HH:mm:ss')
            };

            let isBetween = moment(obj.checkin_date).isBetween(startDate, endDate, null, '[]');
            if (isBetween) {
              items.push(obj);
            }
          }

        });

        if (items.length) {
          ImportService.doImport(db, items)
            .then(() => {
              $scope.showLoading = false;
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#popupContainer')))
                  .clickOutsideToClose(true)
                  .title('ผลการนำเข้า')
                  .textContent('นำเข้าข้อมูลเสร็จเรียบร้อย จำนวน ' + _data.length + ' รายการ')
                  .ariaLabel('Alert')
                  .ok('ตกลง')
              );
            }, err => {
              $scope.showLoading = false;
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#popupContainer')))
                  .clickOutsideToClose(true)
                  .title('ผลการนำเข้า')
                  .textContent('เกิดข้อผิดพลาด : ' + JSON.stringify(err))
                  .ariaLabel('Alert')
                  .ok('ตกลง')
              );
            });
        } else {
          $scope.showLoading = false;
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('ผลการนำเข้า')
              .textContent('ไม่พบรายการที่ต้องการนำเข้า')
              .ariaLabel('Alert')
              .ok('ตกลง')
          );
        }
        
      }
    });