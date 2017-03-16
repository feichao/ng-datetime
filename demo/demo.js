(function() {
  'use strict';

  angular.module('MyApp', ['ngMaterial', 'ngMdIcons', 'ngDatetime'])
    .controller('MyController', function($scope) {
    	$scope.datetime = "2017-09-09 19:09:10";
    });
})();