'use strict';

(function () {
  // Songs Controller Spec
  describe('Songs Controller Tests', function () {
    // Initialize global variables
    var SongsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Songs,
      mockSong;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Songs_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Songs = _Songs_;

      // create mock song
      mockSong = new Songs({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Song about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Songs controller.
      SongsController = $controller('SongsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one song object fetched from XHR', inject(function (Songs) {
      // Create a sample songs array that includes the new song
      var sampleSongs = [mockSong];

      // Set GET response
      $httpBackend.expectGET('api/songs').respond(sampleSongs);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.songs).toEqualData(sampleSongs);
    }));

    it('$scope.findOne() should create an array with one song object fetched from XHR using a songId URL parameter', inject(function (Songs) {
      // Set the URL parameter
      $stateParams.songId = mockSong._id;

      // Set GET response
      $httpBackend.expectGET(/api\/songs\/([0-9a-fA-F]{24})$/).respond(mockSong);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.song).toEqualData(mockSong);
    }));

    describe('$scope.craete()', function () {
      var sampleSongPostData;

      beforeEach(function () {
        // Create a sample song object
        sampleSongPostData = new Songs({
          title: 'An Song about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Song about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Songs) {
        // Set POST response
        $httpBackend.expectPOST('api/songs', sampleSongPostData).respond(mockSong);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the song was created
        expect($location.path.calls.mostRecent().args[0]).toBe('songs/' + mockSong._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/songs', sampleSongPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock song in scope
        scope.song = mockSong;
      });

      it('should update a valid song', inject(function (Songs) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/songs\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/songs/' + mockSong._id);
      }));

      it('should set scope.error to error response message', inject(function (Songs) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/songs\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(song)', function () {
      beforeEach(function () {
        // Create new songs array and include the song
        scope.songs = [mockSong, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/songs\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockSong);
      });

      it('should send a DELETE request with a valid songId and remove the song from the scope', inject(function (Songs) {
        expect(scope.songs.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.song = mockSong;

        $httpBackend.expectDELETE(/api\/songs\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to songs', function () {
        expect($location.path).toHaveBeenCalledWith('songs');
      });
    });
  });
}());
