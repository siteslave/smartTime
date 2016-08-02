var fse = require('fs-extra');

angular.module('app.service.Connnection', [])
  .factory('Connection', function () {
    
    return {
      getConnection: function (configFile) {
        var config = fse.readJsonSync(configFile);

        return require('knex')({
          client: 'mysql',
          connection: config
        });
      } 
  }
})