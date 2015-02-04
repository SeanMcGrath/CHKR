'use strict';

angular.module('chkrApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('top-navbar', {
        url: '/top-navbar',
        templateUrl: 'components/top-navbar/top-navbar.html',
        controller: 'TopNavbarCtrl'
      });
  });