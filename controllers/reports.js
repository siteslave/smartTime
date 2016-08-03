
var moment = require('moment')

angular.module('app.controllers.Reports', [])

  .controller('ReportsCtrl', function ($scope, UsersService, Connection) {
  
    var db = Connection.getConnection();

    $scope.chart1 = {
      options: {
        chart: {
          type: 'bar'
        }
      },
      xAxis: {
          categories: [],
          title: {
              text: null
          }
      },
      series: [{
        name: 'จำนวน',
        data: []
      }],
      title: {
        text: 'จำนวนสมาชิก'
      },

      loading: false
    };

    $scope.chart2 = {
      options: {
        chart: {
          type: 'column'
        }
      },
      xAxis: {
          categories: [],
          title: {
              text: 'จำนวน (ครั้ง)'
          }
      },
      yAxis: {
          title: {
              text: 'จำนวน (ครั้ง)'
          }
      },
      series: [{
        name: 'ครั้ง',
        data: []
      }],
      title: {
        text: 'ปริมาณการจ่ายยา'
      },

      loading: false
    };

    $scope.showLoading = true;

    UsersService.getReportsMembers(db)
      .then(function (rows) {
        console.log(rows);
        rows.forEach(function (v) { // v = {group_name: 'xx', total: 4}
          $scope.chart1.xAxis.categories.push(v.group_name);
          $scope.chart1.series[0].data.push(v.total);
        });

        $scope.showLoading = false;
        
      }, function (err) {
        $scope.showLoading = false;
      });
    

    // report drugs

    $scope.showReport = function () {
      // YYYY-MM-DD
      var start = moment($scope.start).format('YYYY-MM-DD')
      var end = moment($scope.end).format('YYYY-MM-DD')

      $scope.showLoading = true;
      
      UsersService.getReportsDrug(db, start, end)
        .then(function (rows) {
          console.log(rows);
          rows.forEach(function (v) { // v = {DNAME: 'xx', total: 4}
            $scope.chart2.xAxis.categories.push(v.DNAME);
            $scope.chart2.series[0].data.push(v.total);
          });
          
          $scope.showLoading = false;
        }, function (err) {
          console.log(err)
          $scope.showLoading = false;
        });
      
    }

  });
