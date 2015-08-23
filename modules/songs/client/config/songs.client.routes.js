'use strict';

// Setting up route
angular.module('songs').config(['$stateProvider',
  function ($stateProvider) {
    // Songs state routing
    $stateProvider
      .state('songs', {
        abstract: true,
        url: '/songs',
        template: '<ui-view/>'
      })
      .state('songs.list', {
        url: '',
        templateUrl: 'modules/songs/client/views/list-songs.client.view.html'
      })
      .state('songs.create', {
        url: '/create',
        templateUrl: 'modules/songs/client/views/create-song.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('songs.view', {
        url: '/:songId',
        templateUrl: 'modules/songs/client/views/view-song.client.view.html'
      })
      .state('songs.edit', {
        url: '/:songId/edit',
        templateUrl: 'modules/songs/client/views/edit-song.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
