/*jshint esversion: 6*/
const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const app = express();

const expHbs = require('express-handlebars');

let PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const hbs = expHbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const gal = require('./routes/gallery');
app.use('/gallery', gal);

let db = require('./models');
let Photos = db.photos;
let Users = db.users;

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login.html'
}));

app.post('/register', addNewUser);

app.listen(PORT, () => {
  db.sequelize.drop();
  db.sequelize.sync({force: true});
  console.log(`server running on ${PORT}`);
});

module.exports = app;

function addNewUser(req, res){
  let username = req.body.username;
  let password = req.body.password;

  Users.create( { name: username, password: password } )
  .then( data => {
    res.redirect('/index.html');
  });
}