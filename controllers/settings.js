var fse = require('fs-extra')

angular.module('app.controllers.Settings', [])
  .controller('SettingsCtrl', function ($scope, $rootScope, $mdDialog) {
    
    $scope.config = fse.readJsonSync($rootScope.configFile)

    console.log($scope.config)

    $scope.save = function () {
      fse.writeJson($rootScope.configFile, $scope.config, function (err) {
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