var crypto = require('crypto')


angular.module('app.controllers.AddMemberDialog', [])

  .controller('AddMemberDialogCtrl', function ($scope, $rootScope,
    $mdDialog, UsersService, Connection) {
  
    // var configFile = $rootScope.configFile;
    var db = Connection.getConnection();
    
    $scope.user = {};

    // get groups
    UsersService.getGroups(db)
      .then(function (rows) {
        $scope.groups = rows;
      });

    $scope.cancel = function () {
      $mdDialog.cancel();
    }

    $scope.save = function () {
      // alert(JSON.stringify($scope.user))
      $scope.user.password = crypto.createHash('md5')
        .update($scope.user.password)
        .digest('hex');
      
      UsersService.save(db, $scope.user)
        .then(function () {
          $mdDialog.hide();
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('ผลการบันทึก')
              .textContent('บันทึกข้อมูลเรียบร้อยแล้ว')
              .ariaLabel('alert')
              .ok('ตกลง')
          );
          
        }, function (err) {
          console.log(err);
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('ผลการบันทึก')
              .textContent('ไม่สามารถบันทึกได้')
              .ariaLabel('alert')
              .ok('ตกลง')
          );
        });
    }

  });

