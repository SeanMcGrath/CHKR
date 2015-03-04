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
        },
        // Wait slightly to ensure login has been processed,
        // Otherwise main screen will redirect back to login
        function(err) {
          if(err){
            $scope.errors = err;
          }
          else $timeout(function() {$location.path('/');}, 150);
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
