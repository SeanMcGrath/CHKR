'use strict';

angular.module('chkrApp')
  .controller('DailiesCtrl', function ($scope, $http, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $http.get('/api/users/me').success(function(user) {
      $scope.dailies = user.dailies;
    });

    $scope.addDaily = function() {
    	if($scope.newDaily === ''){
    		return;
    	}
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/dailies', { name: $scope.newDaily})
    		.success(function(){
    			$scope.dailies.push({ name: $scope.newDaily});
    			$scope.newDaily = '';
    		});
    };

    $scope.removeDaily = function(daily) {
    	$http.put('/api/users/' + Auth.getCurrentUser()._id + '/dailies', daily)
    		.success(function() {
    			$scope.dailies = $scope.dailies.filter(function(e){
     				return !(e.id === daily.id);
    			});
    		});
    };

    $scope.toggleDone = function(daily) {
    	daily.done = !daily.done;
    };
  });
