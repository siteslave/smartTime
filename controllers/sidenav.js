
angular.module('app.controllers.Sidenav', [])
  .controller('SideNavCtrl', function ($scope, $mdSidenav, $state) { 

    $scope.toggleSidenav = function (menuId) {
      $mdSidenav(menuId).toggle();
    };
    $scope.toggleLeft = () => {
      $mdSidenav('left')
        .toggle();
    };

      $scope.go = (state) => {
        $state.go(state);
      };
    
  })