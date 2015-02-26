'use strict';

angular.module('chkrApp')
  .controller('MainCtrl', function ($scope, Auth, $location) {
        
        $scope.isLoggedIn = Auth.isLoggedIn;

        //ensure user logged in
  	if(!$scope.isLoggedIn()){
  		$location.path('/login');
  	}
  });
