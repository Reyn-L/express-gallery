/*jshint esversion: 6*/
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));

let db = require('./models');

let photos = db.Photos;

app.get('/', function(req, res) {
  photos.findAll()
  .then(function (photos) {
    res.json(photos);
  });
});

// app.post('/', function (req, res) {
//   Photo.create({ name: req.body.name, unique: true })
//   .then(function (user) {
//     res.json(user);
//   });
// });


app.get('/gallery/:id', (req, res) => {
  res.render('views/gallery');
});

app.listen(PORT, () => {
  db.sequelize.drop();
  db.sequelize.sync({force: true});
  console.log(`server running on ${PORT}`);
});