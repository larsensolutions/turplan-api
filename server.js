
const express = require('express');
const app  = express();
const bodyParser = require('body-parser');
const readline = require('readline');
const MongoWrapper = require('./db');


// Configure app to use bodyParser()
// Enables getting data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(MongoWrapper.middleware)

const port = process.env.PORT || 3000; 

// ROUTES
// =============================================================================
var router = express.Router();             

// Test route
router.get('/', function (req, res) {
    res.status(200).json({ message: 'You better believe it!' });
});


// REGISTER OUR ROUTES -------------------------------
// prefix routes with /api/v1
app.use('/api/v1', router);

/* START SERVER */
var server;
MongoWrapper.once('ready', function(){
    server = app.listen(port);
    console.log('turplan.no API live on port ' + port);
})

module.exports = { app, server};