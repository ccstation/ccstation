'use strict';

// Configuring the Queues module
angular.module('queues').run(['Menus',
  function (Menus) {
    // Add the queues dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Queues',
      state: 'queues',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'queues', {
      title: 'List Queues',
      state: 'queues.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'queues', {
      title: 'Create Queues',
      state: 'queues.create',
      roles: ['user']
    });
  }
]);
