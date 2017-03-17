(function() {
  'use strict';

  angular.module('MyApp', ['ngMaterial', 'ngMdIcons', 'ngDatetime'])
    .controller('MyController', function($scope) {
    	$scope.datetime = "2017-03-17 10:34:10";
    });
})();