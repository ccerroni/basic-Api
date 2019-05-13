const express = require('express');
const animalController = require('../controllers/animal.controller');
const md_auth = require('../middlewares/auth.middelware');
const api = express.Router();
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/animals'});
const md_admin = require('../middlewares/isAdmin.middleware');

api.get('/test', md_auth.ensureAuth, animalController.test);
api.get('/list', md_auth.ensureAuth, animalController.getAnimals);
api.get('/:id', md_auth.ensureAuth, animalController.getAnimal);
api.put('/update/:id', [md_auth.ensureAuth, md_admin.isAdmin], animalController.updateAnimal);
api.post('/add', [md_auth.ensureAuth, md_admin.isAdmin], animalController.saveAnimal);
api.post('/upload-image-animal/:id', [md_auth.ensureAuth, md_upload], animalController.uploadImage);
api.get('/get-image-animal/:imageFile', animalController.getImageFile);
api.delete('/delete/:id', [md_auth.ensureAuth, md_admin.isAdmin], animalController.deleteAnimal);


module.exports = api;