'use strict';

// Songs controller
angular.module('songs').controller('SongsController', ['$scope', '$stateParams', '$location', '$sce', 'Authentication', 'Songs',
  function ($scope, $stateParams, $location, $sce, Authentication, Songs) {
    $scope.authentication = Authentication;

    // Create new Song
    $scope.create = function () {
      // Create new Song object
      var song = new Songs({
        title: this.title,
        content: this.content,
        video: this.video,
        type: this.type,
        titlealign: this.titlealign,
        background: this.background,
        sequence: this.sequence,
        top: this.top
      });

      // Redirect after save
      song.$save(function (response) {
        $location.path('songs/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.video= '';
        $scope.type= '';
        $scope.titlealign= '';
        $scope.background= '';
        $scope.sequence= '';
        $scope.top= '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Song
    $scope.remove = function (song) {
      if (song) {
        song.$remove();

        for (var i in $scope.songs) {
          if ($scope.songs[i] === song) {
            $scope.songs.splice(i, 1);
          }
        }
      } else {
        $scope.song.$remove(function () {
          $location.path('songs');
        });
      }
    };

    // Update existing Song
    $scope.update = function () {
      var song = $scope.song;

      song.$update(function () {
        $location.path('songs/' + song._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Songs
    $scope.find = function () {
      $scope.songs = Songs.query();
    };

    // Find existing Song
    $scope.findOne = function () {
      $scope.song = Songs.get({
        songId: $stateParams.songId
      });
      //$scope.videoUrl = $sce.trustAsResourceUrl($scope.song.video);
    };
  }
]);
