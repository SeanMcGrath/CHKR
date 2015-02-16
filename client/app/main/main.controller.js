'use strict';

angular.module('chkrApp')
  .controller('MainCtrl', function ($scope, Auth, $location, $window) {

  	$scope.isLoggedIn = Auth.isLoggedIn;
  	console.log($scope.isLoggedIn());

  	if(!$scope.isLoggedIn()){
  		$location.path('/login');
  	}
  });
