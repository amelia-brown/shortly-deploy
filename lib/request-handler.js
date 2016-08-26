var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var session = require('express-session');
var mongoose = require('mongoose');
//var Users = require('../app/collections/users');
//var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  console.log('in render index');
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  console.log('in render signup');

  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  console.log('link data----------------------->');

  Link.find(function(err, data) {
    console.log('link data----->', data);
    res.status(200).send(data);
  });

  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  Link.findOne({url: uri}, function(err, data) {
    console.log(err, data, '<-----------------link data');
    if (data) {
      res.status(200).send(data);
    } else {
      console.log('link data not found');
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        console.log('before creating new link');
        var newLink = Link.create({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        }).then(function(link) {
          console.log('after creating new link', link);

          res.status(200).send(link);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).exec(function(err, data) {
    console.log(data, '<--------------------login data in login after find');
    if (!data) {
      res.redirect('/login');
    } else {
      console.log(data, '<----------------data 0');
      util.comparePassword(data, password, function (isMatch) {
        if (isMatch) {
          console.log(data.user, 'data.user <========================in ismatch!');
          util.createSession(req, res, data);
          // res.redirect('/');
        } else {
          res.redirect('/login');
        }
      });
    }
  });
    
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // console.log('this is the thing', User.find({username: 'Phillip'})[0]);
  // console.log(User.find, User.collection, '<----------------------user');
  User.findOne({username: username}).exec(function(err, data) {
    console.log(data, '<<<<<<<<<<<<<<<<<<<<<<<<<user data');
    if (err) {
      console.log('omg errrrrrr');
    }
    if (!data) {
      // console.log('data', data);
      var newUser = new User({username: username, password: password}); 
      console.log(newUser.save, 'saaaveeee');
      newUser.save(function(err, newUser) {
        if (err) {
          console.log(err, 'ERRRRRRRRR');
          res.send(err);
        }
        console.log('fwah====================', newUser);
        util.createSession(req, res, newUser);
        // console.log(req.session.user, '<--------------------createeeee');
        // req.session.user = user;
        //res.redirect('/');

      });
        // res.send();
    } else {
      // console.log('existing user! redirecting!');
      res.redirect('/signup');
    }

  });

    // .then(function(user) {
    //   if (!user) {
    //     var newUser = new User({
    //       username: username,
    //       password: password
    //     });
    //     newUser.save()
    //       .then(function(newUser) {
    //         Users.add(newUser);
    //         util.createSession(req, res, newUser);
    //       });
    //   } else {
    //     console.log('Account already exists');
    //     res.redirect('/signup');
    //   }
    // });
};

exports.navToLink = function(req, res) {
  console.log(req.params[0], 'params');
  Link.findOne({code: req.params[0]}, function(err, code) {
    console.log(code, '<-----code');
    if (!code) {
      res.redirect('/');
    } else {
      code.update({'$inc': {visits: 1}})
      .then(function() {
        return res.redirect(link.get('url'));
      });
    }
  });

  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};