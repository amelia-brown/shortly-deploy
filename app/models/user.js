var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
//var Backbone = require('backbone');
var mongoose = require('mongoose');

var User = mongoose.model('users', db.users);


/*
  makeUser(userAttr) {
    console.log(userAttr, '<----------- user');
    var newUser = new db.user(userAttr);
    console.log(newUser, '<---------- newUser');
  },
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  }
*/

module.exports = User;

// var ameliaCollection = new User({username: 'amelia', password: 'hiii'});
// var userArray = [{username: 'amelia', password: 'hiii'}, {username: 'dani', password: 'hello'}];
// User.create(userArray, function(err, users) {
//   console.log(users);
// });
