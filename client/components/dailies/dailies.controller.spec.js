'use strict';

describe('Controller: DailiesCtrl', function () {

  // load the controller's module
  beforeEach(module('chkrApp'));

  var DailiesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DailiesCtrl = $controller('DailiesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
