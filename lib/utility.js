var request = require('request');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var session = require('express-session');

exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      console.log(title, '<----------title');
      return cb(err, title);
    }
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};

exports.isLoggedIn = function(req, res) {
  console.log('in is loggedin', req.session, 'omg', req.session.user)
  return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next) {
  console.log('in check user!!!---------------', req.session);
  if (!exports.isLoggedIn(req)) {
    console.log('in checkuser not loggedin', req.session);
    res.redirect('/login');
  } else {
    console.log('next called');
    next();
  }
};

exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
    console.log(req.session.user, '<<<<<<<<<<<<<');
    //req.session.cookie
    req.session.user = newUser;
    console.log(req.session.user, '<----ADD TO SESSION!');
    res.redirect('/');
    res.send();
      // console.log('IN CREATE SESSION REDIRECTING', res);
  });
};

exports.comparePassword = function(user, attemptedPassword, callback) {
  console.log('++++=====+++++ user.password', user.password);
  bcrypt.compare(attemptedPassword, user.password, function(err, isMatch) {
    console.log('inside comparePassword');
    callback(isMatch);
  });
};

exports.hashPassword = function(password, cb) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(password, null, null).bind(this)
    .then(function(hash) {
      cb(hash);
    });
};
