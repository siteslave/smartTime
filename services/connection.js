
var {app} = require('electron').remote
var path = require('path')
var fs = require('fs')
var fse = require('fs-extra')

angular.module('app.service.Connnection', [])
  .factory('Connection', function () {
    
    var appDataPath = app.getPath('appData');
    var appPath = path.join(appDataPath, 'MySQLApp')
    var configFile = path.join(appPath, 'config.json')

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
    });
    
    return {
      getConnection: function () {
        var config = fse.readJsonSync(configFile);

        return require('knex')({
          client: 'mysql',
          connection: config,
          acquireConnectionTimeout: 10000
        });
      } 
  }
})