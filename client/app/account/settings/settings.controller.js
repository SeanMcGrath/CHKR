'use strict';

angular.module('chkrApp')
  .controller('SettingsCtrl', function ($scope, $http, User, Auth) {
    $scope.errors = {};
    $scope.settings = Auth.getCurrentUser().settings || {};

    $scope.updateSettings = function() {
      $http.post('/api/users/' + Auth.getCurrentUser()._id + '/settings', {settings: $scope.settings})
            .success(function() {
                console.log('Updated Settings.');
            });
    };

    $scope.changePassword = function(form) {
      $scope.passwordSubmitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });
