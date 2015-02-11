'use strict';
/*jshint bitwise: false*/

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

var daysOfWeek = {
    Su: true,
    M: true,
    Tu: true,
    W: true,
    Th: true,
    F: true,
    Sa: true
}

angular.module('chkrApp')
  .controller('DailiesCtrl', function ($scope, $http, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.dailies = Auth.getCurrentUser().dailies;

    for (var i=0;i<$scope.dailies.length;i++){
        $scope.dailies[i].editable = false;
    }
    
    $scope.addDaily = function() {
    	if($scope.newDaily === ''){
    		return;
    	}
    	if ($scope.dailies === undefined){
			$scope.dailies = [];
		}
    	var nd = { name: $scope.newDaily, id: generateUUID(), done: false, editable: false, color: "white", days: daysOfWeek};
    	$scope.dailies.push(nd);
		$scope.newDaily = '';
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/dailies', {dailies: $scope.dailies})
    		.success(function(){
    			console.log('Added daily ' + nd.id);
    		});
    };

    $scope.removeDaily = function(daily) {
    	$scope.dailies = $scope.dailies.filter(function(e){
			return e.id !== daily.id;
		});
        if ($scope.dailies === undefined){
            $scope.dailies = [];
        }
		$http.post('api/users/' + Auth.getCurrentUser()._id + '/dailies', {dailies: $scope.dailies})
			.success(function() {
				console.log('Removed Daily ' + daily.id);
			});
    };

    $scope.updateDailies = function() {
       $http.post('/api/users/' + Auth.getCurrentUser()._id + '/dailies', {dailies: $scope.dailies})
            .success(function() {
                console.log('Updated dailies.');
            }); 
    };

    $scope.dayClick = function(day) {
        console.log(day);
    }
  });