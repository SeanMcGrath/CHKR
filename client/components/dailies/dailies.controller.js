'use strict';

// Counter functions to generate sequential IDs
function makeCounter() {
    var i = 0;
    return function() {
        return i++;
    }
}

var dailyID = makeCounter();

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
    	var nd = { name: $scope.newDaily, id: dailyID(), done: false};
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/newdaily', nd )
    		.success(function(){
    			$scope.dailies.push(nd);
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
    	for (var i=0; i < $scope.dailies.length; i++){
    		if (daily.id === $scope.dailies[i].id) {
    			$scope.dailies[i].done = !$scope.dailies[i].done;
    		}
    	}
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/dailies', {dailies: $scope.dailies})
    		.success(function() {
    			console.log('Updated dailies.')
    		});
    };
  });
