'use strict';

// Counter functions to generate sequential IDs
function makeCounter() {
    var i = 0;
    return function() {
        return i++;
    }
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
    	var nt = {id: todoID(), name: $scope.newTodo, done: false};
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/newtodo', nt)
    		.success(function() {
    			$scope.todos.push(nt);
    			$scope.newTodo = '';
    		});
    };

    $scope.removeToDo = function(todo) {
    	$http.put('/api/users/' + Auth.getCurrentUser()._id + '/todos', todo)
    		.success(function() {
    			$scope.todos = $scope.todos.filter(function(e){
     				return !(e.id === todo.id);
    			});
    		});
    };

    $scope.toggleDone = function(todo) {
    	for (var i=0; i < $scope.todos.length; i++){
    		if (todo.id === $scope.todos[i].id) {
    			$scope.todos[i].done = !$scope.todos[i].done;
    		}
    	}
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/todos', {todos: $scope.todos})
    		.success(function() {
		      	console.log("Updated Todos");
		    });
    };
  });
