var fse = require('fs-extra')

angular.module('app.controllers.Users', [])
  .controller('UsersCtrl', function ($scope, $rootScope, UsersService, Connection) {
    // var config = fse.readJsonSync($rootScope.configFile)
    var configFile = $rootScope.configFile;
    var db = Connection.getConnection(configFile);
    
    $scope.members = [];

    $scope.showLoading = true;
    
    UsersService.getMembers(db)
      .then(function (rows) {
        $scope.members = rows;
        $scope.showLoading = false;
      })
      .catch(function (err) {
        console.log(err);
        $scope.showLoading = false;
      });

  });