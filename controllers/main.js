var {app} = require('electron').remote
var path = require('path')
var fs = require('fs')
var fse = require('fs-extra')


angular.module('app.controllers.Main', [])
  .controller('MainCtrl', function ($scope, $rootScope) {
    
    // check configure file

    var appDataPath = app.getPath('appData');
    var appPath = path.join(appDataPath, 'MySQLApp')
    var configFile = path.join(appPath, 'config.json')

    $rootScope.configFile = configFile;
    
    console.log(configFile);


    fse.ensureDirSync(appPath)

    fs.access(configFile, function (err) {
      if (err) {
        var defaultConfig = {
          host: 'localhost',
          port: 3306,
          database: 'hdc',
          user: 'hdc',
          password: 'hdc'
        };

        fse.writeJsonSync(configFile, defaultConfig);

      }
    })

  });