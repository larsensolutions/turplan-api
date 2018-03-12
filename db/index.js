"use strict";
//TODO: Refactor all

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const Seeder = require('./seeder')

const addr = "mongo", port = "27017", db = "test";
const uri = `mongodb://${addr}:${port}`;

class MongoWrapper {
    constructor(uri) {
        this.data = require('./mock.json');
        this.uri = uri;
    }
    onConnect(err, client, resolve, reject) {
        if (err) { throw err; }
        this.client = client;
        this.db = client.db(db);

        Seeder.seed(this.db).with(this.data).then((ok) => {
            console.log(ok.status);
            this.collectionNames = ok.collectionNames;
            resolve();
        }, (error) => {
            console.log(error);
        });
    }
    getCollectionNames(req, res) {
        var names = [];
        this.db.listCollections().toArray(function (err, items) {
            names = items.map(item => {
                return item.name;
            });
            res.status(200).json({ Items: names });
        });
    }
    getDocuments(req, res) {
        var options = {
            "limit": Number(req.query.limit) || 20,
            "skip": Number(req.query.skip) || 0
        }
        var cursor = this.db.collection(req.params.collection).find({}, options);
        cursor.count(false, (err, total) => {
            cursor.toArray((err, docs) => { // Loads all into memory, should avoid this
                if (err) {
                    res.status(500).json(new Error(err));
                } else {
                    res.status(200).json({ "documents": docs, "count": docs.length, "total": total });
                }
            });
        });
    }

    disconnect() {
        this.client.close();
    }
    connect() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.uri, (err, client) => this.onConnect(err, client, resolve, reject));
        });
    }
}

const mongo = new MongoWrapper(uri);

module.exports = mongo;

module.exports.param = (req, res, next, col) => {
    if (!mongo.collectionNames.includes(col)) {
        return res.status(404).json({ message: `Collection ${col} not found.` });
    }
    next();
}
