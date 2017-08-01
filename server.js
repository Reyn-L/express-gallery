/*jshint esversion: 6*/
const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const app = express();

const expHbs = require('express-handlebars');

let PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const gal = require('./routes/gallery');
app.use('/gallery', gal);

let db = require('./models');

let photos = db.photos;

const hbs = expHbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.listen(PORT, () => {
  db.sequelize.drop();
  db.sequelize.sync({force: true});
  console.log(`server running on ${PORT}`);
});