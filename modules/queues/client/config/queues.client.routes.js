'use strict';

// Setting up route
angular.module('queues').config(['$stateProvider',
  function ($stateProvider) {
    // Queues state routing
    $stateProvider
      .state('queues', {
        abstract: true,
        url: '/queues',
        template: '<ui-view/>'
      })
      .state('queues.list', {
        url: '',
        templateUrl: 'modules/queues/client/views/list-queues.client.view.html'
      })
      .state('queues.create', {
        url: '/create',
        templateUrl: 'modules/queues/client/views/create-queue.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('queues.view', {
        url: '/:queueId',
        templateUrl: 'modules/queues/client/views/view-queue.client.view.html'
      })
      .state('queues.edit', {
        url: '/:queueId/edit',
        templateUrl: 'modules/queues/client/views/edit-queue.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
