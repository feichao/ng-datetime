(function() {
  'use strict';

  angular.module('MyApp', ['ngMaterial', 'ngMdIcons', 'ngDatetime'])
    .controller('MyController', function($scope) {
      var m = moment();
      $scope.date = m.format('YYYY-MM-DD');
      $scope.time = m.format('HH:mm:ss');
    	$scope.datetime = m.format('YYYY-MM-DD HH:mm:ss');

      $scope.startDate = m.format('YYYY-MM-DD');
      $scope.endDate = moment(m).add(10, 'days').format('YYYY-MM-DD');

      $scope.startTime = m.format('HH:mm:ss');
      $scope.endTime = moment(m).add(10, 'minutes').format('HH:mm:ss');

      $scope.startDatetime = m.format('YYYY-MM-DD HH:mm:ss');
      $scope.endDatetime = moment(m).add(5, 'days').add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss');

      $scope.startDatetime0 = m.format('YYYY-MM-DD HH:mm:ss');
      $scope.endDatetime0 = moment(m).add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss');

      $scope.max = moment(m).add(10, 'days').format('YYYY-MM-DD');
      $scope.min = moment(m).add(-10, 'days').format('YYYY-MM-DD');

      $scope.qSelect = [{
        label: '15 分钟前',
        value: 15 * 60,
      }, {
        label: '30 分钟前',
        value: 30 * 60,
      }, {
        label: '5 小时前',
        value: 5 * 60 * 60,
      }, {
        label: '10 天前',
        value: 10 * 24 * 60 * 60,
      }, {
        label: '30 天前',
        value: 30 * 24 * 60 * 60,
      }, {
        label: '1 年前',
        value: 365 * 24 * 60 * 60,
      }];

      $scope.qSelectRange = [{
        label: '最近 15 分钟',
        value: 15 * 60,
      }, {
        label: '最近 30 分钟',
        value: 30 * 60,
      }, {
        label: '最近 5 小时',
        value: 5 * 60 * 60,
      }, {
        label: '昨天',
        value: [24 * 60 * 60, 24 * 60 * 60],
      }, {
        label: '最近 10 天',
        value: 10 * 24 * 60 * 60,
      }, {
        label: '最近 30 天',
        value: 30 * 24 * 60 * 60,
      }, {
        label: '最近 1 年',
        value: 365 * 24 * 60 * 60,
      }];

      $scope.dtLanguage = {
        today: 'Jy',
        confirm: 'Okk',
        weeks: ['Rii', 'Yii', 'Er', 'Sam', 'Si', 'Wui', 'Liu']
      };

      $scope.confirm = function(a, b) {
        if(b) {
          console.log('Your select: start is ' + a + ', end is ' + b);
        } else {
          console.log('Your select: ' + a);
        }
      }
    });
})();