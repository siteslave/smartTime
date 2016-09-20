'use strict';

angular.module('app.controllers.Employees', [])
  .controller('EmployeesCtrl', ($scope, Employee, Connection) => {
  
    let db = Connection.getConnection();

    $scope.total = 0;
    $scope.showLoading = false;
    $scope.showPaging = true;
    $scope.searchQuery = null;

    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

    $scope.query = {
      limit: 20,
      page: 1
    };

    $scope.onPaginate = (page, limit) => {
      console.log(page, limit);
      let offset = (page - 1) * limit;
      $scope.getList(limit, offset);
    };

    $scope.getTotal = () => {
      Employee.total(db)
        .then(total => {
          $scope.total = total;
        }, err => {
          // connection error
        });
    };

    $scope.initial = () => {

      let limit = $scope.query.limit;
      let offset = ($scope.query.page - 1) * $scope.query.limit;

      $scope.getTotal();
      $scope.getList(limit, offset);
    };

    $scope.getList = (limit, offset) => {
      $scope.showLoading = true;
      $scope.showPaging = true;
      Employee.list(db, limit, offset)
        .then(rows => {
          $scope.showLoading = false;
          $scope.employees = rows;
          // console.log(rows)
        }, err => {
          $scope.showLoading = false;
          console.log(err);
        });
    }

    $scope.search = () => {
      if ($scope.searchQuery) {
        $scope.showLoading = true;
        console.log($scope.searchQuery)
        if (isNaN($scope.searchQuery)) { // search by name
          Employee.searchByName(db, $scope.searchQuery)
            .then(rows => {
              console.log(rows)
              $scope.showLoading = false;
              $scope.showPaging = false;
              $scope.employees = rows;
            }, err => {
              $scope.showLoading = false;
              console.log(err);
            });
        } else { // search by code
          Employee.searchByCode(db, $scope.searchQuery)
            .then(rows => {
              console.log(rows)
              $scope.showLoading = false;
              $scope.showPaging = false;
              $scope.employees = rows;
            }, err => {
              $scope.showLoading = false;
              console.log(err);
            });
        }
      }
    }

    $scope.initial();
    
  });