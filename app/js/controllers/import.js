'use strict';

var fs = require('fs');
var csvParse = require('csv-parse');
var moment = require('moment');

var dialog = require('electron').remote.dialog;

angular.module('app.controllers.Import', []).controller('ImportCtrl', function ($scope) {
    $scope.openTarget = function () {
        $scope.targetName = dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'CSV', extensions: ['csv', 'txt'] }]
        });
    };

    $scope.doImport = function () {
        // console.log($scope.targetName[0]);
        var csvFile = $scope.targetName[0];
        fs.readFile(csvFile, 'utf8', function (err, data) {
            if (err) console.log(err);else {
                csvParse(data, {
                    delimiter: '\t',
                    columns: true
                }, function (err, items) {
                    console.log(items);
                });
            }
        });
    };
});