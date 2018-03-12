const express = require('express');
const mongoDB = require('../db');

var router = express.Router();

/* GET  / */
router.get('/', function (req, res) {
    res.status(200).json({ message: 'You better believe it!' });
});

/* GET collections */
router.get('/collections', function (req, res) {
    mongoDB.getCollectionNames(req, res);
});

/* GET all /{collection} */
router.param('collection', mongoDB.param);
router.get('/:collection', function (req, res) {
    switch (req.method) {
        case 'GET':
            mongoDB.getDocuments(req, res);
            break;
        default:
            res.status(405).json({ message: `HTTP Method #${req.method.toUpperCase()} Not Allowed` });
    }
});

/* GET single /{collection}/{id} */
router.param('id', mongoDB.param);
router.get('/:collection/:id', function (req, res) {
    switch (req.method) {
        case 'GET':
            res.status(200).json({ message: "Or not to be" });
            break;
        default:
            res.status(405).json({ message: `HTTP Method #${req.method.toUpperCase()} Not Allowed` });
    }
});

module.exports = (req, res, next) => {
    router(req, res, next);
};