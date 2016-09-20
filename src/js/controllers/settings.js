var fse = require('fs-extra')

angular.module('app.controllers.Settings', [])
  .controller('SettingsCtrl', function ($scope, $rootScope, $mdDialog, Connection) {
    
    $scope.config = Connection.getConfig();
    var configFile = Connection.getConfigFile();

    $scope.save = function () {
      fse.writeJson(configFile, $scope.config, function (err) {
        if (err) {
          console.log(err);
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('ผลการบันทึก')
              .textContent('ไม่สามารถบันทึกได้')
              .ariaLabel('alert')
              .ok('ตกลง')
              .targetEvent(event)
          );
        } else {
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('ผลการบันทึก')
              .textContent('บันทึกเสร็จเรียบร้อยแล้ว')
              .ariaLabel('alert')
              .ok('ตกลง')
              .targetEvent(event)
          );
        }
      });
    }

  });