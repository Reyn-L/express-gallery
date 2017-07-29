/*jshint esversion: 6*/
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));

let db = require('./models');

let users = db.Users;

app.get('/', function(req, res) {
  users.findAll()
  .then(function (users) {
    res.json(users);
  });
});

app.post('/', function (req, res) {
  users.create({ username: req.body.username, unique: true })
  .then(function (user) {
    res.json(user);
  });
});


app.get('/gallery/:id', (req, res) => {
  res.render('views/gallery');
});

app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`server running on ${PORT}`);
});