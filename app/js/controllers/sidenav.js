'use strict';

angular.module('app.controllers.Sidenav', []).controller('SideNavCtrl', function ($scope, $mdSidenav, $state) {

  $scope.toggleSidenav = function (menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.toggleLeft = function () {
    $mdSidenav('left').toggle();
  };

  $scope.go = function (state) {
    $state.go(state);
  };
});