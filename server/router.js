const express = require('express');
const mongoDB = require('../db');

var router = express.Router();

/* GET  / */
router.get('/', function (req, res) {
    res.status(200).json({ message: 'What you are is what you have been. What you’ll be is what you do now.' });
});

/* GET collections */
router.get('/collections', function (req, res) {
    mongoDB.getCollectionNames(req, res);
});

/* ALL /{collection} */
router.param('collection', mongoDB.collectionParam);
router.all('/:collection', function (req, res) {
    switch (req.method) {
        case 'GET':
            mongoDB.get(req, res);
            break;
        case 'POST':
            mongoDB.post(req, res);
            break;
        default:
            res.status(405).json({ message: `HTTP Method #${req.method.toUpperCase()} Not Allowed` });
    }
});

/* ALL /{collection}/{id} */
router.param('id', mongoDB.documentParam);
router.all('/:collection/:id', function (req, res) {
    switch (req.method) {
        case 'GET':
            mongoDB.getDocument(req, res);
            break;
        case 'PUT':
            mongoDB.putDocument(req, res);
            break;
        case 'PATCH':
            mongoDB.patchDocument(req, res);
            break;
        case 'DELETE':
            mongoDB.deleteDocument(req, res);
            break;
        default:
            res.status(405).json({ message: `HTTP Method #${req.method.toUpperCase()} Not Allowed` });
    }
});

module.exports = (req, res, next) => {
    router(req, res, next);
};