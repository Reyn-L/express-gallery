
/*jshint esversion: 6 */
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const router = express.Router();
let db = require('../models');
let Authors = db.authors;
let Photos = db.photos;

router.get('/', getAllGalleries);

//done
router.get('/new', newGalleryForm);

router.get('/:id', displayGalleryPhoto);
router.get('/:id/edit', editPhoto);

//done
router.post('/', loadNewPhoto);

router.put('/:id', updatePhoto);

router.delete('/:id', deletePhoto);

let errorMessages = [
{
  key: 'permission_denied',
  value: "You do not have permission to edit this file."
},
{
  key: 'not_logged_in',
  value: "You must log in to perform that operation."
}];

function getAllGalleries(req, res) {
  let currUser = getSessionPassportId(req.session);

  Photos.findAll({
    include: [{model: Authors}]
  })
  .then( function (fotos) {
    fotos.forEach( item => {
      if (currUser && currUser === item.id) {
        item.showEditButton = true;
      } else {
        item.showEditButton = false;
      }
    });
    let locals = { databaseEntries: fotos };
    res.render('gallery/index', locals);
  })
  .catch((err) => {
    console.log(err);
  });
}

//Display Gallery Form
function newGalleryForm(req, res) {
  req.flash(errorMessages);
  let currUser = getSessionPassportId(req.session);
  if (currUser === false ) {
    res.render('gallery/login', { errorMessage : req.flash('not_logged_in') });
    return;
  }
  res.render('gallery/new');
}

//Displays a gallery photo based on request ID
function displayGalleryPhoto(req, res) {
  Photos.findById(req.params.id,
    {include: [{model: Authors}]})
  .then((photoById) => {
    let locals = {link: photoById.link, description: photoById.description, name: photoById.author.name };
    res.render('gallery/photo', locals);
  })
  .catch((err) => {
    console.log(err);
  });
}

function editPhoto(req, res){
 req.flash(errorMessages);
 let currUser = getSessionPassportId(req.session);

 Photos.findById(req.params.id,
  {include: [{model: Authors}]})
 .then((photoById) => {
  if (currUser !== photoById.owner){
    res.render('gallery/login', { errorMessage: req.flash(not_logged_in) });
    return;
  }
  let locals = {id : photoById.id, link: photoById.link, description: photoById.description, name: photoById.author.name };
  res.render('gallery/edit', locals);
});
}

function loadNewPhoto(req, res) {
  let name = req.body.author;
  let url = req.body.link;
  let description = req.body.description;
  req.flash(errorMessages);
  let currUser = getSessionPassportId(req.session);
  if (currUser === false ) {
    res.render('gallery/login', { errorMessage : req.flash('not_logged_in') });
    return;
  }

  let auId;

  Authors.findAll( { where: {name: name} } )
  .then( result => {
    if (result[0] === undefined) {
      Authors.create( {name: name} )
      .then( ret => {
        auId = ret.dataValues.id;
        Photos.create( {link: url, description: description, authorId: auId, owner: currUser} );
        let locals = {link: url, description: description, name: name };
        res.render('gallery/photo', locals);
      });
    } else {
      auId = result[0].dataValues.id;
      Photos.create({link: url, description: description, authorId: auId, owner: currUser });
      let locals = {link: url, description: description, name: name };
      res.render('gallery/photo', locals);
    }
  });
}

function updatePhoto(req, res){

  let sessionId = getSessionPassportId(req.session);
  if (!sessionId) {
    res.render('gallery/login', { errorMessage : req.flash('not_logged_in') });
    return;
  }
  Photos.findById(req.params.id)
  .then( photoById => {
    Photos.update( { description : req.body.description }, { where: { id: req.params.id } } )
    .then( photoById => res.redirect('/gallery/') );
  });
}

function deletePhoto(req, res){
  Photos.destroy( { where: { id:req.params.id } } );
  res.redirect('/gallery/');
}

function getSessionPassportId(sess){
  if (!sess.passport){
    return false;
  }
  return sess.passport.user;
}

module.exports = router;

