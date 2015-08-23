'use strict';

//Songs service used for communicating with the songs REST endpoints
angular.module('songs').factory('Songs', ['$resource',
  function ($resource) {
    return $resource('api/songs/:songId', {
      songId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
