const express = require('express');
const userController = require('../controllers/user.controller');
const md_auth = require('../middlewares/auth.middelware');
const api = express.Router();
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/users'});

api.get('/test', userController.test);
api.post('/login', userController.login);
api.post('/register', userController.saveUser);
api.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], userController.uploadImage);
api.get('/get-image-file/:imageFile', userController.getImageFile);
api.get('/keepers', userController.getKeepers);

module.exports = api;