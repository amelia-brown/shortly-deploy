var path = require('path');
var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017');
var Schema = mongoose.Schema;
var Model = mongoose.Model;
var util = require('../lib/utility');

db.urls = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
}, { collection: 'urls'}
);

db.users = new Schema({
  username: String,
  password: String
}, { collection: 'users'});

db.users.pre('save', function(next) {
  var user = this;
  util.hashPassword(user.password, function(hash) {
    user.password = hash;
    next();
  });
});

// db.User = mongoose.model('users', users);
// console.log(db.User, 'user');



// var ameliaCollection = new User({username: 'amelia', password: 'hiii'});
// var userArray = [{username: 'amelia', password: 'hiii'}, {username: 'dani', password: 'hello'}];
// User.create(userArray, function(err, users) {
//   //console.log(users);
// });
// console.log(db, 'connection');

// console.log(db.users.find({username: 'dani'}));
// var amelia = mongoose.model('Me', users);

// var userArray = [{username: 'amelia', password: 'hiii'}, {username: 'dani', password: 'hello'}];
// db.User.create(userArray);
// console.log(db.User);
// var Collection = Model.create(userArray, User);
// console.log(Collection);
// console.log(db.users.find({username: 'amelia'}));

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

module.exports = db;
