'use strict';

//Queues service used for communicating with the queues REST endpoints
angular.module('queues').factory('Queues', ['$resource',
  function ($resource) {
    return $resource('api/queues/:queueId', {
      queueId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
