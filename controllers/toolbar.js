
angular.module('app.controllers.Toolbar', [])
  .controller('ToolbarCtrl', function ($scope, $mdSidenav, $state) { 
    $scope.toggleLeft = () => {
      $mdSidenav('left')
        .toggle();
    };

    $scope.go = (state) => {
      $state.go(state);
    };
    
  })