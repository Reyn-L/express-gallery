
/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();

router.get('/', getAllGalleries);
router.get('new', newGalleryForm);
router.get('/:id', displayGalleryPhoto);
router.get('/:id/edit', editPhoto);

router.post('/', loadNewPhoto);

router.put('/:id', updatePhoto);

router.delete('/:id', deletePhoto);

function getAllGalleries(req, res) {
  res.render('gallery/new');
  // photos.findAll()
  // .then(function (photos) {
  //   res.json(photos);
  // });
}

//Display Gallery Form
function newGalleryForm(req, res) {
  res.render('/views/gallery');
}

//Displays a gallery photo based on request ID
function displayGalleryPhoto(req, res) {
  res.render('/views/gallery');
}

function editPhoto(req, res){
  res.render('/views/gallery');
}

function loadNewPhoto(req, res){
  res.render('views/gallery.new');
}

function updatePhoto(req, res){
  res.render('views/gallery');
}

function deletePhoto(req, res){
  res.render('views/gallery');
}

module.exports = router;