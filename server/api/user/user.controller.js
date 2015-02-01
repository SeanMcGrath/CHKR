'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var validationError = function(res, err) {
  return res.json(422, err);
};

// Remove an element el from array arr if it exists
var removeFromArray = function(arr, el, cb) {
  var newArr = arr.filter(function(e) {
    return !(e.id === el.id);
  });
  cb(newArr);
};

// Counter functions to generate sequential IDs
function makeCounter() {
    var i = 0;
    return function() {
        return i++;
    }
}

var dailyID = makeCounter();
var todoID = makeCounter();

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

// Updates an existing user in the DB.
exports.addDaily = function(req, res, next) {
  var userId = req.user._id;
  User.findById(userId, function (err, user) {
    var newDaily = req.body;
    newDaily.id = dailyID();
    user.dailies.push(newDaily);
    user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
  });
};

// Removes a daily task from a user in the db.
exports.removeDaily = function(req, res, next){
  var userId = req.user._id;
  User.findById(userId, function (err, user) {
    removeFromArray(user.dailies,req.body,function(newDailies) {
      user.dailies = newDailies;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    });    
  });
};

// update the fields ina user's existing daily.
exports.updateDaily = function(req,res,next) {
  var userId = req.user._id;
  User.findById(userId, function (err, user) {
    user.todos.push(req.body);
    user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
  });
};

// adds a todo to an existing user in the DB.
exports.addTodo = function(req, res, next) {
  var userId = req.user._id;
  User.findById(userId, function (err, user) {
    var newTodo = req.body;
    newTodo.id = todoID();
    user.todos.push(newTodo);
    user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
  });
};

// Removes a Todo from a user in the db.
exports.removeTodo = function(req, res, next){
  var userId = req.user._id;
  User.findById(userId, function (err, user) {
    removeFromArray(user.todos,req.body,function(newTodos) {
      user.todos = newTodos;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    });    
  });
};


function handleError(res, err) {
  return res.send(500, err);
}
