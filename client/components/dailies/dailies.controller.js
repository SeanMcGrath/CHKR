'use strict';

// Counter functions to generate sequential IDs
function makeCounter() {
    var i = 0;
    return function() {
        return i++;
    };
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
    	if ($scope.dailies === undefined){
			$scope.dailies = [];
		}
    	var nd = { name: $scope.newDaily, id: dailyID(), done: false, editable: false};
    	$scope.dailies.push(nd);
		$scope.newDaily = '';
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/dailies', {dailies: $scope.dailies})
    		.success(function(){
    			console.log('Added daily.');
    		});
    };

    $scope.removeDaily = function(daily) {
    	$scope.dailies = $scope.dailies.filter(function(e){
			return e.id !== daily.id;
		});
		$http.post('api/users/' + Auth.getCurrentUser()._id + '/dailies', {dailies: $scope.dailies})
			.success(function() {
				console.log('Removed Daily');
			});
    };

    $scope.toggleDone = function(daily) {
    	for (var i=0; i < $scope.dailies.length; i++){
    		if (daily.id === $scope.dailies[i].id) {
    			$scope.dailies[i].done = !$scope.dailies[i].done;
    			break;
    		}
    	}
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/dailies', {dailies: $scope.dailies})
    		.success(function() {
    			console.log('Updated dailies.');
    		});
    };

    $scope.toggleEdit = function(daily) {
        for (var i=0; i < $scope.dailies.length; i++){
            if (daily.id === $scope.dailies[i].id) {
                $scope.dailies[i].editable = !$scope.dailies[i].editable;
                break;
            }
        }
    }
  });