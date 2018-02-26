const port = process.env.PORT || 3000; 

const EventEmitter = require('events').EventEmitter;
const express = require('express');
const bodyParser = require('body-parser');
const readline = require('readline');
const MongoWrapper = require('./db');



const app  = express();
EventEmitter.call(app);

app.use(bodyParser.urlencoded({ extended: true })); // Enables getting data from POST
app.use(bodyParser.json());
app.use(MongoWrapper.middleware)

app.use((req, res, next)=> {
    req.self = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    res.self = req.self
    next();
})

/* Routes */
var router = express.Router();   

/* GET Collections */
router.get('/collections', function (req, res) {
    res.status(200).json({Items: req.mongo.collectionNames});
});

/* GET  / */
router.get('/', function (req, res) {
    res.status(200).json({ message: 'You better believe it!'});
});

/* ALL /{collection} */
router.param('collection', MongoWrapper.param);
router.get('/:collection', function (req, res) {
    switch (req.method){
        case 'GET':
            res.status(200).json({Items: req.mongo.collectionNames});
            break;
        default:
            res.status(405).json({message: `HTTP Method #${req.method.toUpperCase()} Not Allowed`});
    }
});

/* ALL /{collection}/{id} */
router.param('id', MongoWrapper.param);
router.get('/:collection/:id', function (req, res) {
    switch (req.method){
        case 'GET':
            res.status(200).json({Items: req.mongo.collectionNames});
            break;
        default:
            res.status(405).json({message: `HTTP Method #${req.method.toUpperCase()} Not Allowed`});
    }
});

app.use('/api/v1', router); // prefix routes with /api/v1

MongoWrapper.once('ready', function(){
    app.listen(port);
    console.log('turplan.no API live on port ' + port);
    app.emit('ready');
})

module.exports = { app };