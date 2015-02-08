'use strict';

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

angular.module('chkrApp')
  .controller('ToDoCtrl', function ($scope, $http, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.todos = Auth.getCurrentUser().todos;

    $scope.addTodo = function() {
    	if($scope.newTodo === ''){
    		return;
    	}
    	var nt = { name: $scope.newTodo, id: generateUUID(), done: false};
        if ($scope.todos === undefined){
            $scope.todos = [];
        }
    	$scope.todos.push(nt);
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

    $scope.toggleDone = function(todo) {
    	for (var i=0; i < $scope.todos.length; i++){
    		if (todo.id === $scope.todos[i].id) {
    			$scope.todos[i].done = !$scope.todos[i].done;
    			break;
    		}
    	}
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/todos', {todos: $scope.todos})
    		.success(function() {
    			console.log('Updated todos.');
    		});
    };
  });
