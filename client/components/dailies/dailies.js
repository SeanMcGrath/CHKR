'use strict';

angular.module('chkrApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dailies', {
        url: '/dailies',
        templateUrl: 'components/dailies/dailies.html',
        controller: 'DailiesCtrl'
      });
  });