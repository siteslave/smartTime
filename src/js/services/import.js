'use strict';
let moment = require('moment');

angular.module('app.services.Import', [])
    .factory('ImportService', () => {
        return {
            doImport(db, data) {
                let currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                // generate sql for insert statement
                let sql = db('attendances')
                    .insert(data)
                    .toString();
                // upsert
                let _sql = sql + ` on duplicate key update imported_date=?`;
                return db.raw(_sql, [currentDateTime]);
                // console.log(mySQL)
            }
        }
    });