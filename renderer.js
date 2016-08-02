
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
  'app.controllers.AddMemberDialog'
])

  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {

    // theme
    $mdThemingProvider.theme('default')
      .primaryPalette('pink', {
        'default': '400', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
      })
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