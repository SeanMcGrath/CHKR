'use strict';

describe('Controller: TopNavbarCtrl', function () {

  // load the controller's module
  beforeEach(module('chkrApp'));

  var TopNavbarCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TopNavbarCtrl = $controller('TopNavbarCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
