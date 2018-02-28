const express = require('express');
const MongoWrapper = require('../db');

var router = express.Router();   

/* GET Collections */
router.get('/collections', function (req, res) {
    MongoWrapper.getCollectionNames(req, res);
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
            res.status(200).json({message:"To be"});
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
            res.status(200).json({message:"Or not to be"});
            break;
        default:
            res.status(405).json({message: `HTTP Method #${req.method.toUpperCase()} Not Allowed`});
    }
});

module.exports = (req, res, next) => {
   router(req,res,next);
};