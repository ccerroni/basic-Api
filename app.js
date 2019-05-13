'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//load routes
const userRoutes = require('./routes/user.routes');
const animalRoutes = require('./routes/animal.routes');

//middelware of body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//set headers and cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

//ruotes base
app.use('/api/user', userRoutes);
app.use('/api/animal', animalRoutes);

module.exports = app;
