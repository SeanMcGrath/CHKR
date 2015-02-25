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

function blankWeek() {

    return {
        Su: true,
        M: true,
        Tu: true,
        W: true,
        Th: true,
        F: true,
        Sa: true,
    };
}

angular.module('chkrApp')
  .controller('DailiesCtrl', function ($scope, $http, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.dailies = Auth.getCurrentUser().dailies || [];
    $scope.settings = Auth.getCurrentUser().settings || {};

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
    	var nd = { name: $scope.newDaily, id: generateUUID(), done: false, editable: false, color: 'white', days: blankWeek()};
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

    $scope.sortDailies = function(cb) {
        if($scope.settings.sortTasks){
            var dones = [];
            var undones = [];
            for(var i=0;i<$scope.dailies.length;i++){
                if ($scope.dailies[i].done) {
                    dones.push($scope.dailies[i]);
                }
                else {
                    undones.push($scope.dailies[i]);
                }
            }
            $scope.dailies = undones.concat(dones);
        }
        cb()
    }

    $scope.updateDailies = function() {
       $http.post('/api/users/' + Auth.getCurrentUser()._id + '/dailies', {dailies: $scope.dailies})
            .success(function() {
                console.log('Updated dailies.');
            }); 
    };

    $scope.activeToday = function(daily) {
        var day = "Su";
        switch (new Date().getDay()) {
          case 0:
              day = "Su";
              break;
          case 1:
              day = "M";
              break;
          case 2:
              day = "Tu";
              break;
          case 3:
              day = "W";
              break;
          case 4:
              day = "Th";
              break;
          case 5:
              day = "F";
              break;
          case 6:
              day = "Sa";
              break;
        }
        return daily.days[day];
    }

    $scope.sortableOptions = {
        handle: '.handle',
    	containment: 'parent',
    	axis: 'y',
    	cursor: 'grabbing',
    	opacity: 1,
    	revert: 150,
    	stop: $scope.updateDailies
    };

  });
