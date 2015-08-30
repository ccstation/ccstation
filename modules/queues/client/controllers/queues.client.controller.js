'use strict';

// Queues controller
angular.module('queues').controller('QueuesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Queues', 'Songs',
  function ($scope, $stateParams, $location, Authentication, Queues, Songs) {
    $scope.authentication = Authentication;

    $scope.addSong = function () {
      if(! $scope.songs){
        $scope.songs = [];
      }

      var newsong = $scope.newSong;

      console.log($scope.newSong);
      $scope.songs.push($scope.newSong);
      $scope.newSong = "";
    };

    // Create new Queue
    $scope.create = function () {
      // Create new Queue object
      var queue = new Queues({
        title: this.title,
        description: this.description,
        songs: []
      });

      console.log(queue);
      // Redirect after save
      queue.$save(function (response) {
        $location.path('queues/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.description = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Queue
    $scope.remove = function (queue) {
      if (queue) {
        queue.$remove();

        for (var i in $scope.queues) {
          if ($scope.queues[i] === queue) {
            $scope.queues.splice(i, 1);
          }
        }
      } else {
        $scope.queue.$remove(function () {
          $location.path('queues');
        });
      }
    };

    // Update existing Queue
    $scope.update = function () {
      var queue = $scope.queue;

      console.log(queue);
      console.log(queue.songs);

      queue.$update(function () {
        $location.path('queues/' + queue._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Queues
    $scope.find = function () {
      $scope.queues = Queues.query();
    };

    // Find existing Queue
    $scope.findOne = function () {
      $scope.queue = Queues.get({
        queueId: $stateParams.queueId
      });
    };
  }
]);
