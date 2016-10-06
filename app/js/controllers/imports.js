'use strict';

var fs = require('fs');
var moment = require('moment');

var dialog = require('electron').remote.dialog;

angular.module('app.controllers.Imports', ['app.services.Import']).controller('ImportCtrl', function ($scope, $mdDialog, ImportService, Connection) {

  $scope.showLoading = false;

  $scope.importEncoding = 'UCS2';

  $scope.openTarget = function () {
    $scope.targetName = dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'CSV', extensions: ['csv', 'txt'] }]
    });
  };

  $scope.doImport = function () {
    $scope.showLoading = true;

    var db = Connection.getConnection();
    var csvFile = $scope.targetName[0];

    var startDate = moment($scope.startDate).format('YYYY-MM-DD');
    var endDate = moment($scope.endDate).format('YYYY-MM-DD');
    var csvData = null;

    if ($scope.importEncoding == 'UCS2') {
      csvData = fs.readFileSync(csvFile, 'ucs2');
    } else {
      csvData = fs.readFileSync(csvFile, 'utf8');
    }

    var _data = csvData.toString().split("\n");
    delete _data[0];
    var items = [];

    _data.forEach(function (v, i) {
      if (v) {
        var arrItem = v.toString().split("\t");
        if (parseInt(arrItem[2])) {
          var obj = {
            checkin_date: moment(arrItem[8], 'YYYY/MM/DD HH:mm:ss').format('YYYY-MM-DD'),
            checkin_time: moment(arrItem[8], 'YYYY/MM/DD HH:mm:ss').format('HH:mm:ss'),
            employee_code: parseInt(arrItem[2]),
            imported_date: moment().format('YYYY-MM-DD HH:mm:ss')
          };

          var isBetween = moment(obj.checkin_date).isBetween(startDate, endDate, null, '[]');
          if (isBetween) {
            items.push(obj);
          }
        }
      }
    });

    if (items.length) {
      ImportService.doImport(db, items).then(function () {
        $scope.showLoading = false;
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.querySelector('#popupContainer'))).clickOutsideToClose(true).title('ผลการนำเข้า').textContent('นำเข้าข้อมูลเสร็จเรียบร้อย จำนวน ' + items.length + ' รายการ').ariaLabel('Alert').ok('ตกลง'));
      }, function (err) {
        $scope.showLoading = false;
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.querySelector('#popupContainer'))).clickOutsideToClose(true).title('ผลการนำเข้า').textContent('เกิดข้อผิดพลาด : ' + JSON.stringify(err)).ariaLabel('Alert').ok('ตกลง'));
      });
    } else {
      $scope.showLoading = false;
      $mdDialog.show($mdDialog.alert().parent(angular.element(document.querySelector('#popupContainer'))).clickOutsideToClose(true).title('ผลการนำเข้า').textContent('ไม่พบรายการที่ต้องการนำเข้า').ariaLabel('Alert').ok('ตกลง'));
    }
  };
});