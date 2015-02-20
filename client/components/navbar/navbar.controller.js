'use strict';

angular.module('chkrApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {

    $scope.isCollapsed = false;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.toggleMenu = function() {
      $('#wrapper').toggleClass('toggled');
    };
  });