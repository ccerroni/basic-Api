'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3200;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/basicAppDb', { useNewUrlParser: true }).then(
    () => {
        console.log('Database conection success');
        app.listen(port, ()=>{
            console.log('Local server with Node and Express is running successfully')
        });
    }
).catch( err => console.log(err));
