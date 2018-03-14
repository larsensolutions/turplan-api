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
    get(req, res) {
        var options = {
            "limit": Number(req.query.limit) || 20,
            "skip": Number(req.query.skip) || 0
        }
        var cursor = this.db.collection(req.params.collection).find({}, options);
        cursor.count(false, (err, total) => {
            cursor.toArray((err, docs) => { // Loads all into memory, should avoid this, use stream/pipe instead
                if (err) {
                    res.status(500).json(new Error(err));
                } else {
                    res.status(200).json({ "documents": docs, "count": docs.length, "total": total });
                }
            });
        });
    }
    post(req, res) {
        var cursor = this.db.collection(req.params.collection).insertOne(req.body, null, (err, result) => {
            if (err) {
                res.status(422).json(new Error(err));
            }
            else {
                res.status(201).json(result);
            }
        })
    }

    getDocument(req, res) {
        this.db.collection(req.params.collection).findOne({ "_id": Number(req.params.id) }, (err, doc) => {
            if (err) {
                res.status(500).json(new Error(err));
            } else if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ "message": "Not found" });
            }
        });
    }
    putDocument(req, res) {
        this.db.collection(req.params.collection).replaceOne({ "_id": Number(req.params.id) }, req.body, (err, doc) => {
            if (err) {
                res.status(500).json(new Error(err));
            } else if (doc) {
                res.status(204).json(doc);
            } else {
                res.status(404).json({ "message": "Not found" });
            }
        });
    }
    patchDocument(req, res) {
        this.db.collection(req.params.collection).update({ "_id": Number(req.params.id) }, {
            $currentDate: {
                lastModified: true,
                "lastModified": { $type: "timestamp" }
            }, "$set": req.body
        }, (err, doc) => {
            if (err) {
                res.status(500).json(new Error(err));
            } else if (doc) {
                res.status(204).json(doc);
            } else {
                res.status(404).json({ "message": "Not found" });
            }
        });
    }
    deleteDocument(req, res){
        this.db.collection(req.params.collection).deleteOne({ "_id": Number(req.params.id) }, (err, doc) => {
            if (err) {
                res.status(500).json(new Error(err));
            } else if (doc.deletedCount > 0) {
                res.status(204).json({ "message": "No Content" });;
            } else {
                res.status(404).json({ "message": "Not found" });
            }
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


/*Parameter validations */

module.exports.collectionParam = (req, res, next, col) => {
    if (!mongo.collectionNames.includes(col)) {
        return res.status(404).json({ message: `Collection ${col} not found.` });
    }
    next();
}

module.exports.documentParam = (req, res, next, id) => {
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid id' })
    }
    next();
}
