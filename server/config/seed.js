/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');

User.find({}).remove(function() {
  User.create({
    settings: {
      showAllDailies: true,
      sortTasks: true
    },
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test',
    dailies: [{
      id: 'default1',
      name: 'Sunday',
      done: false,
      editable: false,
      days: {
        Su: true,
        M: false,
        Tu: false,
        W: false,
        Th: false,
        F: false,
        Sa: false
      }
    },
    {
      id: 'default2',
      name: 'Monday',
      done: false,
      editable: false,
      days: {
        Su: false,
        M: true,
        Tu: false,
        W: false,
        Th: false,
        F: false,
        Sa: false
      }
    },
    {
      id: 'default3',
      name: 'Tuesday',
      done: false,
      editable: false,
      days: {
        Su: false,
        M: false,
        Tu: true,
        W: false,
        Th: false,
        F: false,
        Sa: false
      }
    },
    {
      id: 'default4',
      name: 'Wednesday',
      done: false,
      editable: false,
      days: {
        Su: false,
        M: false,
        Tu: false,
        W: true,
        Th: false,
        F: false,
        Sa: false
      }
    },
    {
      id: 'default5',
      name: 'Thursday',
      done: false,
      editable: false,
      days: {
        Su: false,
        M: false,
        Tu: false,
        W: false,
        Th: true,
        F: false,
        Sa: false
      }
    },
    {
      id: 'default6',
      name: 'Friday',
      done: false,
      editable: false,
      days: {
        Su: false,
        M: false,
        Tu: false,
        W: false,
        Th: false,
        F: true,
        Sa: false
      }
    },
    {
      id: 'default7',
      name: 'Saturday',
      done: false,
      editable: false,
      days: {
        Su: false,
        M: false,
        Tu: false,
        W: false,
        Th: false,
        F: false,
        Sa: true
      }
    },
    ],
    todos: [{
      id: 'default2',
      name: 'Go to Doctor',
      date: new Date(),
      done: false,
      editable: false,
      color: 'white',
    }],
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