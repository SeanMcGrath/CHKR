'use strict';

// Counter functions to generate sequential IDs
function makeCounter() {
    var i = 0;
    return function() {
        return i++;
    };
}

var todoID = makeCounter();

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
    	var nd = { name: $scope.newTodo, id: todoID(), done: false};
    	$scope.todos.push(nd);
		$scope.newTodo = '';
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/todos', {todos: $scope.todos})
    		.success(function(){
    			console.log('Added todo.');
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
				console.log('Removed Todo');
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
