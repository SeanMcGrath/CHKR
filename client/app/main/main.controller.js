'use strict';

angular.module('chkrApp')
  .controller('MainCtrl', function ($scope, Auth, $location, $window) {

        //ensure user logged in
  	if(!$scope.isLoggedIn()){
  		$location.path('/login');
  	}
  });
