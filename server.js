
const express = require('express');
const app  = express();
const bodyParser = require('body-parser');
const readline = require('readline');

// Configure mongo
var mongodb = require('mongodb');
var client = mongodb.MongoClient;
var uri = "mongodb://mongo/dummy-app";

// Configure app to use bodyParser()
// Enables getting data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000; 

// ROUTES
// =============================================================================
var router = express.Router();             

// Test route
router.get('/', function (req, res) {
    // client.connect(uri, function (err, db) {
    //     console.log(db);
	//     if (err) return next(err);    
    // 	var collection = db.collection('dummy');
    // 	collection.find({}).toArray(function(err, docs) {
	// 		if (err) return next(err);
	// 		return res.json(docs);
    //     });			
    //     res.status(200).json({ message: 'Did not find any database' });
    // });
    res.status(200).json({ message: 'You better believe it!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// prefix routes with /api/v1
app.use('/api/v1', router);

// START THE SERVER
// =============================================================================
const server = app.listen(port);

console.log('turplan.no API live on port ' + port);

module.exports = { app, server};