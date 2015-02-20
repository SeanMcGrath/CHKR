'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

// Remove an element el from array arr if it exists
var removeFromArray = function(arr, el, cb) {
  var newArr = arr.filter(function(e) {
    return e.id !== el.id;
  });
  cb(newArr);
};

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

// update the fields in a user's existing daily.
exports.updateDailies = function(req,res) {
  var userId = {_id: req.user._id};
  User.findOneAndUpdate(userId, req.body, function (err, user) {
    if (err) throw err;
    res.send(200);
  });
};

// update the fields in a user's existing todo.
exports.updateTodos = function(req,res) {
  var userId = {_id: req.user._id};
  User.findOneAndUpdate(userId, req.body, function (err, user) {
    if (err) throw err;
    res.send(200);
  });
};

// resets dailies to undone state if needed
exports.resetDailies = function(req,res) {

  var resetUser = function(user) {
    var day = "Su";
    switch (new Date().getDay()) {
      case 0:
          day = "Su";
          break;
      case 1:
          day = "M";
          break;
      case 2:
          day = "Tu";
          break;
      case 3:
          day = "W";
          break;
      case 4:
          day = "Th";
          break;
      case 5:
          day = "F";
          break;
      case 6:
          day = "Sa";
          break;
    }
    for (var i=0;i<user.dailies.length;i++){
      if (!user.dailies[i].days[day]) {
        user.dailies[i].done=true;
      }
      else user.dailies[i].done=false;
    }
    user.markModified('dailies');
    user.save(function(err){
      if(!err) {
        res.send(200);
      }
      else {
        console.log(err);
        res.send(500);
      }
    });
  }
  
  if (req.connection.remoteAddress === "127.0.0.1") {
      User.find({}, function(err, users) {
	  if (err) throw err;
	  for(var i = 0;i<users.length;i++) {
	      resetUser(users[i]);
	  }
	  res.send(200);
      });
  }
  else {
      console.log("Daily reset attempted from unknown IP " + req.connection.remoteAddress);
      res.send(401);
  }
};

//Handle todos that were completed yesterday
exports.clearTodos = function(req,res) {

  var resetUser = function(user) {
    // For now just remove completed tasks  
    user.todos = user.todos.filter(function(todo){return !todo.done;});
    user.markModified('todos');
    user.save(function(err){
      if(err) throw err;
    });
  }

  if(req.connection.remoteAddress === '127.0.0.1'){
    User.find({}, function(err,users){
      if (err) throw err;
      for(var i = 0;i<users.length;i++) {
	resetUser(users[i]);
      }
      res.send(200);
    });
  }
}

exports.resetUsers = function(req,res) {

  var resetUser = function(user) {
    var day = "Su";
    switch (new Date().getDay()) {
      case 0:
          day = "Su";
          break;
      case 1:
          day = "M";
          break;
      case 2:
          day = "Tu";
          break;
      case 3:
          day = "W";
          break;
      case 4:
          day = "Th";
          break;
      case 5:
          day = "F";
          break;
      case 6:
          day = "Sa";
          break;
    }
    for (var i=0;i<user.dailies.length;i++){
      if (!user.dailies[i].days[day]) {
        user.dailies[i].done=true;
      }
      else user.dailies[i].done=false;
    }
    user.markModified('dailies');
    user.todos = user.todos.filter(function(todo){return !todo.done;});
    user.markModified('todos');
    user.save(function(err){
      if(err) throw err;
    });
  }

  if(req.connection.remoteAddress === '127.0.0.1'){

    try {
      User.find({}, function(err, users) {
        if (err) throw err;
        for(var i = 0;i<users.length;i++) {
          resetUser(users[i]);
        }
        res.send(200);
      });
    }

    catch(err) {console.log(err);}

  }
  else{
    console.log("Daily reset attempted from unknown IP " + req.connection.remoteAddress);
    res.send(401)
  }
}

function handleError(res, err) {
  return res.send(500, err);
}
