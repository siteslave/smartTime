'use strict';

angular.module('app.controllers.Employees', []).controller('EmployeesCtrl', function ($scope, Employee, Connection) {

  var db = Connection.getConnection();

  $scope.total = 0;
  $scope.showLoading = false;
  $scope.showPaging = true;
  $scope.searchQuery = null;

  $scope.openMenu = function ($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
  };

  $scope.query = {
    limit: 20,
    page: 1
  };

  $scope.onPaginate = function (page, limit) {
    console.log(page, limit);
    var offset = (page - 1) * limit;
    $scope.getList(limit, offset);
  };

  $scope.getTotal = function () {
    Employee.total(db).then(function (total) {
      $scope.total = total;
    }, function (err) {
      // connection error
    });
  };

  $scope.initial = function () {

    var limit = $scope.query.limit;
    var offset = ($scope.query.page - 1) * $scope.query.limit;

    $scope.getTotal();
    $scope.getList(limit, offset);
  };

  $scope.getList = function (limit, offset) {
    $scope.showLoading = true;
    $scope.showPaging = true;
    Employee.list(db, limit, offset).then(function (rows) {
      $scope.showLoading = false;
      $scope.employees = rows;
      // console.log(rows)
    }, function (err) {
      $scope.showLoading = false;
      console.log(err);
    });
  };

  $scope.search = function () {
    if ($scope.searchQuery) {
      $scope.showLoading = true;
      console.log($scope.searchQuery);
      if (isNaN($scope.searchQuery)) {
        // search by name
        Employee.searchByName(db, $scope.searchQuery).then(function (rows) {
          console.log(rows);
          $scope.showLoading = false;
          $scope.showPaging = false;
          $scope.employees = rows;
        }, function (err) {
          $scope.showLoading = false;
          console.log(err);
        });
      } else {
        // search by code
        Employee.searchByCode(db, $scope.searchQuery).then(function (rows) {
          console.log(rows);
          $scope.showLoading = false;
          $scope.showPaging = false;
          $scope.employees = rows;
        }, function (err) {
          $scope.showLoading = false;
          console.log(err);
        });
      }
    }
  };

  $scope.initial();
});