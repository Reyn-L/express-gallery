
/*jshint esversion: 6 */
const express = require('express');
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

function getAllGalleries(req, res) {
  Photos.findAll({
    include: [{model: Authors}]
  })
  .then( function (fotos) {
    let locals = { databaseEntries: fotos };
    res.render('gallery/index', locals);
  })
  .catch((err) => {
    console.log(err);
  });
}

//Display Gallery Form
function newGalleryForm(req, res) {
  res.render('gallery/new');
}
//Displays a gallery photo based on request ID
function displayGalleryPhoto(req, res) {
  Photos.findById(req.params.id,
    {include: [{model: Authors}]})
  .then((photoById) => {
    let locals = {link: photoById.link, description: photoById.description, name: photoById.author.name };
    console.log(locals);
    res.render('gallery/photo', locals);
  })
  .catch((err) => {
    console.log(err);
  });
}

function editPhoto(req, res){
  res.render('/views/gallery');
}

function loadNewPhoto(req, res) {
  //create link, uploader, descriptio
  let name = req.body.author;
  console.log(name);
  let url = req.body.link;
  let description = req.body.description;

  let auId;

  Authors.findAll( { where: {name: name} } )
  .then( result => {
    if (result[0] === undefined) {
      Authors.create( {name: name} )
      .then( ret => {
        auId = ret.dataValues.id;
        Photos.create( {link: url, description: description, authorId: auId} );
        let locals = {link: url, description: description, name: name };
        res.render('gallery/photo', locals);
      });
    } else {
      auId = result[0].dataValues.id;
      Photos.create({link: url, description: description, authorId: auId});
      let locals = {link: url, description: description, name: name };
      res.render('gallery/photo', locals);
    }
  });
}

function updatePhoto(req, res){
  res.render('views/gallery');
}

function deletePhoto(req, res){
  res.render('gallery/:id/edit');
}

function updatePhoto(req, res){
  res.render('views/gallery');
}

module.exports = router;