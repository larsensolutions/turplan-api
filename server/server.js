const port = process.env.PORT || 3000; 

const EventEmitter = require('events').EventEmitter;
const express = require('express');
const bodyParser = require('body-parser');
const readline = require('readline');
const MongoWrapper = require('../db');
const router = require('./router');
const app  = express();

//Set up middlewares
app.use(bodyParser.urlencoded({ extended: true })); // Enables getting data from POST
app.use(bodyParser.json());
app.use('/api/v1', router); 


//TODO: Refactor this
EventEmitter.call(app);
app.close = function(){
    MongoWrapper.disconnect();
    app.server.close();
}
MongoWrapper.once('ready', function(){
    app.server = app.listen(port);
    console.log('turplan.no API live on port ' + port);
    app.emit('ready');
})
if(process.env.NODE_ENV==="dev"){
    MongoWrapper.connect();
}

module.exports = { app, MongoWrapper };