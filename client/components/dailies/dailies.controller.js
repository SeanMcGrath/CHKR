'use strict';
/*jshint bitwise: false*/

//Many thanks to StackOverflow
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

// Generator for day-of-week control objects for new dailies
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
  .controller('DailiesCtrl', function ($scope, $http, Auth, socket) {

    $scope.addDaily = function() {
    	if($scope.newDaily === ''){
    		return;
    	}
    	if ($scope.dailies === undefined){
			   $scope.dailies = [];
		  }
    	var nd = { name: $scope.newDaily, id: generateUUID(), done: false, editable: false, color: 'white', days: blankWeek()};
    	$scope.dailies.push(nd);
      if($scope.settings.sortTasks) {$scope.sortDailies(angular.noop);}
		  $scope.newDaily = '';
    	$http.post('/api/users/' + $scope.currentUser._id + '/dailies', {dailies: $scope.dailies})
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
  		$http.post('api/users/' + $scope.currentUser._id + '/dailies', {dailies: $scope.dailies})
  			.success(function() {
  				console.log('Removed Daily ' + daily.id);
  			});
    };

    $scope.sortDailies = function(dailies) {
        if($scope.settings.sortTasks){
          var dones = [];
          var undones = [];
          for(var i=0;i<dailies.length;i++){
            if (dailies[i].done) {
              dones.push(dailies[i]);
            }
            else {
              undones.push(dailies[i]);
            }
          }
          return undones.concat(dones);
        }
        else{
          return dailies;
        }
    };

    $scope.updateDailies = function(dailies) {
      $scope.dailies = dailies;
      $http.post('/api/users/' + $scope.currentUser._id + '/dailies', {dailies: $scope.dailies})
            .success(function() {
                console.log('Updated dailies.');
            }); 
    };

    // Check if a daily is active today
    $scope.activeToday = function(daily) {
        var day = 'Su';
        switch (new Date().getDay()) {
          case 0:
              day = 'Su';
              break;
          case 1:
              day = 'M';
              break;
          case 2:
              day = 'Tu';
              break;
          case 3:
              day = 'W';
              break;
          case 4:
              day = 'Th';
              break;
          case 5:
              day = 'F';
              break;
          case 6:
              day = 'Sa';
              break;
        }
        return daily.days[day];
    };

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.currentUser = Auth.getCurrentUser();
    $scope.currentUser.$promise.then(function(user){
        $scope.dailies = user.dailies || [];
        $scope.settings = user.settings || {};
        // Make sure we start sorted
        if($scope.settings.sortTasks) {$scope.sortDailies(angular.noop);}

        // Start everything as not editable, hide dailies that should be invisible
        for (var i=0;i<$scope.dailies.length;i++){
            $scope.dailies[i].editable = false;
            $scope.dailies[i].hidden = !$scope.settings.showAllDailies && !$scope.activeToday($scope.dailies[i]);
        }
      });

    //Parameters for sortable widget that controls drag/drop
    $scope.sortableOptions = {
      handle: '.handle',
    	containment: 'parent',
    	axis: 'y',
    	cursor: 'grabbing',
    	opacity: 1,
    	revert: 150,
      stop: function(event, ui){
        $scope.updateDailies($scope.dailies);
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('user');
    });

  
  });
