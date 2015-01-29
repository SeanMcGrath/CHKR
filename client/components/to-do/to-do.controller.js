'use strict';

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
    	$http.post('/api/users/' + Auth.getCurrentUser()._id + '/todos', {name: $scope.newTodo})
    		.success(function() {
    			$scope.todos.push({name: $scope.newTodo});
    			$scope.newTodo = '';
    		});
    };

    $scope.removeToDo = function() {};
  });
