
angular.module('app.controllers.Reports', [])

  .controller('ReportsCtrl', function ($scope, UsersService, Connection) {
  
    var db = Connection.getConnection();

    $scope.chart1 = {
      options: {
        chart: {
          type: 'column'
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

    $scope.showLoading = true;

    UsersService.getReportsMembers(db)
      .then(function (rows) {
        console.log(rows);
        rows.forEach(function (v) {
          $scope.chart1.xAxis.categories.push(v.group_name);
          $scope.chart1.series[0].data.push(v.total);
        });

        $scope.showLoading = false;
        
      }, function (err) {
        $scope.showLoading = false;
      });
    

  });
