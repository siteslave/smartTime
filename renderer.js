
angular.module('app', [
  'ui.router',
  'ngMaterial',
  'md.data.table',
  'app.controllers.Sidenav',
  'app.controllers.Toolbar',
  'app.controllers.Main',
  'app.controllers.Settings',
  'app.controllers.Users',
  'app.controllers.Groups',
  'app.services.Users',
  'app.service.Connnection',
  'app.controllers.AddMemberDialog',
  'app.controllers.UpdateMemberDialog'
])

  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {

    // theme
    $mdThemingProvider.theme('default')
      .primaryPalette('pink')
      .accentPalette('orange');
    
    $urlRouterProvider.otherwise('/')

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: './templates/main.html',
        controller: 'MainCtrl'
      })
      .state('users', {
        url: '/users',
        templateUrl: './templates/users.html',
        controller: 'UsersCtrl'
      })
      .state('groups', {
        url: '/groups',
        templateUrl: './templates/groups.html',
        controller: 'GroupsCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: './templates/settings.html',
        controller: 'SettingsCtrl'
      })
    
   })