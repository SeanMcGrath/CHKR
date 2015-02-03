'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/:id/newdaily', auth.isAuthenticated(), controller.addDaily);
router.post('/:id/newtodo', auth.isAuthenticated(), controller.addTodo);
router.put('/:id/todos', auth.isAuthenticated(), controller.removeTodo);
router.put('/:id/dailies', auth.isAuthenticated(), controller.removeDaily);
router.post('/:id/todos', auth.isAuthenticated(), controller.updateTodo);
router.post('/:id/dailies', auth.isAuthenticated(), controller.updateDaily);


module.exports = router;
