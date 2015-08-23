'use strict';

(function () {
  // Queues Controller Spec
  describe('Queues Controller Tests', function () {
    // Initialize global variables
    var QueuesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Queues,
      mockQueue;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Queues_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Queues = _Queues_;

      // create mock queue
      mockQueue = new Queues({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Queue about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Queues controller.
      QueuesController = $controller('QueuesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one queue object fetched from XHR', inject(function (Queues) {
      // Create a sample queues array that includes the new queue
      var sampleQueues = [mockQueue];

      // Set GET response
      $httpBackend.expectGET('api/queues').respond(sampleQueues);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.queues).toEqualData(sampleQueues);
    }));

    it('$scope.findOne() should create an array with one queue object fetched from XHR using a queueId URL parameter', inject(function (Queues) {
      // Set the URL parameter
      $stateParams.queueId = mockQueue._id;

      // Set GET response
      $httpBackend.expectGET(/api\/queues\/([0-9a-fA-F]{24})$/).respond(mockQueue);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.queue).toEqualData(mockQueue);
    }));

    describe('$scope.craete()', function () {
      var sampleQueuePostData;

      beforeEach(function () {
        // Create a sample queue object
        sampleQueuePostData = new Queues({
          title: 'An Queue about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Queue about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Queues) {
        // Set POST response
        $httpBackend.expectPOST('api/queues', sampleQueuePostData).respond(mockQueue);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the queue was created
        expect($location.path.calls.mostRecent().args[0]).toBe('queues/' + mockQueue._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/queues', sampleQueuePostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock queue in scope
        scope.queue = mockQueue;
      });

      it('should update a valid queue', inject(function (Queues) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/queues\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/queues/' + mockQueue._id);
      }));

      it('should set scope.error to error response message', inject(function (Queues) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/queues\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(queue)', function () {
      beforeEach(function () {
        // Create new queues array and include the queue
        scope.queues = [mockQueue, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/queues\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockQueue);
      });

      it('should send a DELETE request with a valid queueId and remove the queue from the scope', inject(function (Queues) {
        expect(scope.queues.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.queue = mockQueue;

        $httpBackend.expectDELETE(/api\/queues\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to queues', function () {
        expect($location.path).toHaveBeenCalledWith('queues');
      });
    });
  });
}());
