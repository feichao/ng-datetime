(function() {
  'use strict';

  angular.module('MyApp', ['ngMaterial', 'ngMdIcons', 'ngDatetime'])
    .controller('MyController', function($scope) {
      $scope.date = "2017-03-17";
      $scope.time = "10:34:10";
    	$scope.datetime = "2017-03-17 10:34:10";

      $scope.max = '2017-03-29';
      $scope.min = '2017-03-03';

      $scope.qSelect = [{
        label: '最近 15 分钟',
        value: 15 * 60,
      }, {
        label: '最近 30 分钟',
        value: 30 * 60,
      }, {
        label: '最近 5 小时',
        value: 5 * 60 * 60,
      }, {
        label: '最近 10 天',
        value: 10 * 24 * 60 * 60,
      }, {
        label: '最近 20 天',
        value: 20 * 24 * 60 * 60,
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
        console.log('start: ' + a);
        console.log('end: ' + b);
      }
    });
})();