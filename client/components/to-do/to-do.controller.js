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

angular.module('chkrApp')
  .controller('ToDoCtrl', function ($scope, $http, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.currentUser = Auth.getCurrentUser();
    
    $scope.currentUser.$promise.then(function(user){
        var todos = user.todos || [];
        $scope.settings = user.settings || {};
        for (var i=0;i< todos.length;i++){
            todos[i].editable = false;
            todos[i].calOpen = false;
        }
        // Make sure we start sorted
        if ($scope.settings.sortTasks) {
            $scope.todos = $scope.sortTodos(todos);
        }
        else {
            $scope.todos = todos;
        }
    });

    $scope.addTodo = function() {
    	if($scope.newTodo === ''){
    		return;
    	}
    	var nt = { name: $scope.newTodo, id: generateUUID(), done: false, color: '', date: new Date()};
        if ($scope.todos === undefined){
            $scope.todos = [];
        }
    	$scope.todos.push(nt);
        if ($scope.settings.sortTasks) {
            $scope.todos = $scope.sortTodos($scope.todos, angular.noop);
        }
        $scope.newTodo = '';
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/todos', {todos: $scope.todos})
    		.success(function(){
    			console.log('Added todo ' + nt.id);
    		});
    };

    $scope.removeTodo = function(todo) {
    	$scope.todos = $scope.todos.filter(function(e){
			return e.id !== todo.id;
		});
		if ($scope.todos === undefined){
			$scope.todos = [];
		}
		$http.post('api/users/' + Auth.getCurrentUser()._id + '/todos', {todos: $scope.todos})
			.success(function() {
				console.log('Removed Todo ' + todo.id);
			});
    };

    $scope.updateTodos = function(todos) {

        $scope.todos = todos;
        $http.post('/api/users/' + Auth.getCurrentUser()._id + '/todos', {todos: $scope.todos})
            .success(function() {
                console.log('Updated todos.');
            });
    };

    $scope.sortTodos = function(todos, cb) {
        var dones = [];
        var undones = [];
        if($scope.settings.sortTasks){
            for(var i=0;i<todos.length;i++){
                if (todos[i].done) {
                    dones.push(todos[i]);
                }
                else {
                    undones.push(todos[i]);
                }
            }
            return undones.concat(dones);
        }
        else{
            return todos;
        }
        
    };

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.format = 'shortDate';

    $scope.sortableOptions = {
    	handle: '.handle',
    	containment: 'parent',
    	axis: 'y',
    	cursor: 'move',
    	opacity: 1,
    	revert: 150,
    	stop: function(event, ui) {
            $scope.updateTodos($scope.todos);
        }
    };

  });
