var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
//var Users = require('../app/collections/users');
//var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  console.log('in render index')
  res.render('index');
};

exports.signupUserForm = function(req, res) {
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
  Links.reset().fetch().then(function(links) {
    res.status(200).send(links.models);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  Link.find({url: uri}, function(err, data) {
    if (data.length !== 0) {
      res.status(200).send(data[0]);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = Link.create({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        }).then(function(link) {
          res.status(200).send(link);
        });
      });
    }
  });

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.status(200).send(found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.sendStatus(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         baseUrl: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.status(200).send(newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username }, function(err, data) {
    console.log(data, '<--------------------data in login after find');
    if (data.length === 0) {
      res.redirect('/login');
    } else {
      console.log(data[0], '<----------------data 0');
      util.comparePassword(data[0], password, function (isMatch) {
        if (isMatch) {
          console.log('<========================in ismatch!');
          util.createSession(req, res, data[0]).bind(this);
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
  User.find({username: username}, function(err, data) {
    // console.log('data', data, err);
    if (data.length === 0) {
      // console.log('data', data);
      User.create({username: username, password: password}, function(err, user) {
        util.createSession(req, res, user).bind(this);
      });
    } else {
      // console.log('existing user! redirecting!');
      res.redirect('/login');
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
  Link.find({code: req.params[0]}, function(err, code) {
    console.log(code, '<-----code');
    if (code.length === 0) {
      res.redirect('/');
    } else {
      code[0].update({'$inc': {visits: 1}})
      .then(f);
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