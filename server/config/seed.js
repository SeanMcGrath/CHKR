/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test',
    dailies: [{
      id: 'default1',
      name: 'Brush Teeth',
      done: false,
      editable: false,
      days: {
        Su: true,
        M: true,
        Tu: true,
        W: true,
        Th: true,
        F: true,
        Sa: true
      }
    },
    {
      id: 'default2',
      name: 'clean up',
      done: true,
      editable: false,
      days: {
        Su: true,
        M: true,
        Tu: true,
        W: true,
        Th: true,
        F: true,
        Sa: true
      }
    }],
    todos: [{
      id: 'default2',
      name: 'Go to Doctor',
      date: new Date(),
      done: false,
      editable: false,
      color: 'white',
    }],
    settings: {
      showDailies: 'all',
    }
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});
