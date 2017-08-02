/*jshint esversion: 6*/
const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const db = require('./models');
const Photos = db.photos;
const Users = db.users;

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

passport.serializeUser((user, cb)=> {
  cb(null, user.id);
});

passport.deserializeUser((user, cb) => {
  Users.findById(userId, cb);
});

passport.use(new LocalStrategy((name, password, done) => {
  console.log(name);
  Users.findOne({name: name}, function (err,user) {
    if(err) {
      console.log('err', err);
      return done(err);
    }
    if(!user) {
      console.log('!user');
      return done(null, false, {
        message: 'Incorrect name'
      });
    }
    if(user.password !== password) {
      console.log('password');
      return done(null, false, {
        message: "Incorrect password"
      });
    }
    console.log('success');
    return done(null, user);
  });
}));

app.post('/login', passport.authenticate('local', {
  successRedirect: '/index',
  failureRedirect: '/'
}));

app.get('/index', isAuthenticated, (req, res) => {
  res.send('it works!');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

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

function isAuthenticated(req, res ,next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/index');
}


