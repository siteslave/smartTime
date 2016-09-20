var fse = require('fs-extra')

angular.module('app.controllers.Users', [])
  .controller('UsersCtrl', function ($scope, $rootScope, $mdDialog, UsersService, Connection) {
    // var config = fse.readJsonSync($rootScope.configFile)
    // var configFile = $rootScope.configFile;
    var db = Connection.getConnection();
    
    $scope.openMenu = function ($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };

    $scope.total = 0;
    
    // Paging
    $scope.query = {
      limit: 3,
      page: 1
    };

    $scope.onPaginate = function (page, limit) {
      var offset = (page - 1) * limit;
      $scope.getList(limit, offset);
    }

    $scope.getTotal = function () {
      UsersService.getTotal(db)
        .then(function (total) {
          $scope.total = total;
        }, function (err) {
          console.log(err);
        });
    }

    $scope.initialData = function () {
      var limit = $scope.query.limit;
      var offset = ($scope.query.page - 1) * $scope.query.limit;

      $scope.getTotal();
      $scope.getList(limit, offset);
    };
    
    $scope.getList = function (limit, offset) {
      $scope.members = [];

      $scope.showLoading = true;
      
      UsersService.getMembers(db, limit, offset)
        .then(function (rows) {
          $scope.members = rows;
          $scope.showLoading = false;
        })
        .catch(function (err) {
          console.log(err);
          $scope.showLoading = false;
        });
    }    
    
    $scope.showAddMember = function () {

      $mdDialog.show({
        controller: 'AddMemberDialogCtrl',
        templateUrl: './templates/add-member-dialog.html',
        parent: angular.element(document.body),
        // targetEvent: event,
        clickOutsideToClose: false,
        fullscreen: false
      })
        .then(function () {
          $scope.initialData();
        }, function () {
          //
        });

    };

    $scope.update = function (id) {

      $rootScope.memberId = id;
      
      $mdDialog.show({
        controller: 'UpdateMemberDialogCtrl',
        templateUrl: './templates/add-member-dialog.html',
        parent: angular.element(document.body),
        // targetEvent: event,
        clickOutsideToClose: false,
        fullscreen: false
      })
        .then(function () {
          $scope.initialData();
        }, function () {
          //
        });

    }

    $scope.remove = function (id) {
      var confirm = $mdDialog.confirm()
        .title('ยืนยันการลบข้อมูล')
        .textContent('คุณต้องลบรายการนี้ ใช่หรือไม่?')
        .ariaLabel('confirm')
        // .targetEvent(event)
        .ok('ใช่, ฉันต้องการลบ')
        .cancel('ยกเลิก');
      
      $mdDialog.show(confirm).then(function () {
        // ยืนยันการลบ
        UsersService.remove(db, id)
          .then(function () {
            $scope.initialData();
          }, function (err) {
            alert('เกิดข้อผิดพลาด : ' + JSON.stringify(err));
          });

      }, function () {
        //
      });
      
    }


    $scope.initialData();
    
  });