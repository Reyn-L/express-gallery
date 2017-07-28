/*jshint esversion: 6*/
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));

let db = require('./models');

let Users = db.Users;

app.post('/users', function (req, res) {
  Users.create({ username: req.body.username })
  .then(function (user) {
    res.json(user);
  });
});

app.get('/users', function(req, res) {
  Users.findAll()
  .then(function (users) {
    res.json(users);
  });
});

app.get('/', (req, res) => {
  res.send('hello, is it me you\'re looking for?');
});

app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`server running on ${PORT}`);
});