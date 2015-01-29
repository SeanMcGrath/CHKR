'use strict';

angular.module('chkrApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('to-do', {
        url: '/to-do',
        templateUrl: 'components/to-do/to-do.html',
        controller: 'ToDoCtrl'
      });
  });