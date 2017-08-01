
/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
let db = require('../models');
let Authors = db.authors;
let photos = db.photos;

router.get('/', getAllGalleries);
router.get('new', newGalleryForm);
router.get('/:id', displayGalleryPhoto);
router.get('/:id/edit', editPhoto);

router.post('/', loadNewPhoto);

router.put('/:id', updatePhoto);

router.delete('/:id', deletePhoto);

function getAllGalleries(req, res) {
  photos.findAll()
  .then(function (photos) {
    console.log(photos);
    res.render('gallery');
  });
}

//Display Gallery Form
function newGalleryForm(req, res) {
  res.render('/views/gallery');
}

//Displays a gallery photo based on request ID
function displayGalleryPhoto(req, res) {
  photos.findOne()
  .then(Photo => {
    console.log(photo.get('name'));
    res.render('views/gallery');
  });
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

function updatePhoto(req, res){
  res.render('views/gallery');
}

module.exports = router;