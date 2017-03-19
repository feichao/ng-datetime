(function() {
  'use strict';

  angular.module('MyApp', ['ngMaterial', 'ngMdIcons', 'ngDatetime'])
    .controller('MyController', function($scope) {
      $scope.date = "2017-03-17";
      $scope.time = "10:34:10";
    	$scope.datetime = "2017-03-17 10:34:10";

      $scope.max = '2017-03-29';
      $scope.min = '2017-03-03';

      $scope.confirm = function(a, b) {
        console.log('start: ' + a);
        console.log('end: ' + b);
      }
    });
})();