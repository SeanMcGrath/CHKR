'use strict';

angular.module('chkrApp')
  .controller('DailiesCtrl', function ($scope, $http, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.dailies = Auth.getCurrentUser().dailies;

    $scope.addDaily = function() {
    	if($scope.newDaily === ''){
    		return;
    	}
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/dailies', { name: $scope.newDaily});
      	$scope.newDaily = '';
      	$scope.dailies = Auth.getCurrentUser().dailies;
    };

    $scope.removeDaily = function() {}
  });
