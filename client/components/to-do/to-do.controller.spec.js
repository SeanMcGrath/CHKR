'use strict';

describe('Controller: ToDoCtrl', function () {

  // load the controller's module
  beforeEach(module('chkrApp'));

  var ToDoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ToDoCtrl = $controller('ToDoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
