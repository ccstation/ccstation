'use strict';

// Configuring the Songs module
angular.module('songs').run(['Menus',
  function (Menus) {
    // Add the songs dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Songs',
      state: 'songs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'songs', {
      title: 'List Songs',
      state: 'songs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'songs', {
      title: 'Create Songs',
      state: 'songs.create',
      roles: ['user']
    });
  }
]);
