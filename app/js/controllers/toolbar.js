'use strict';

angular.module('app.controllers.Toolbar', []).controller('ToolbarCtrl', function ($scope, $mdSidenav, $state) {
  $scope.toggleLeft = function () {
    $mdSidenav('left').toggle();
  };

  $scope.go = function (state) {
    $state.go(state);
  };
});