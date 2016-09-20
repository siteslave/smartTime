'use strict';

var moment = require('moment');

angular.module('app.services.Import', []).factory('ImportService', function () {
    return {
        doImport: function doImport(db, data) {
            var currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            // generate sql for insert statement
            var sql = db('attendances').insert(data).toString();
            // upsert
            var _sql = sql + ' on duplicate key update imported_date=?';
            return db.raw(_sql, [currentDateTime]);
            // console.log(mySQL)
        }
    };
});