'use strict';

angular.module('chkrApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, $timeout) {
    $scope.user = {};
    $scope.errors = {};

    if(Auth.isLoggedIn()){
      $location.path('/');
    }

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
