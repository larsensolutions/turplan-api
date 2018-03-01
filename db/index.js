"use strict";
//TODO: Refactor all

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const Seeder = require('./seeder')

const addr = "mongo", port = "27017", db = "test";
const uri = `mongodb://${addr}:${port}`;

class MongoWrapper {
    constructor(uri){
        this.data = require('./mock.json');
        this.uri = uri;
    }
    onConnect(err, client, resolve, reject){
        if (err) { throw err; }
        this.client = client;
        this.db = client.db(db);

        Seeder.seed(this.db).with(this.data).then((ok)=>{
            console.log(ok.status);
            this.collectionNames = ok.collectionNames;
            resolve();
        }, (error)=>{
            console.log(error);
        });
    }
    getCollectionNames(req, res){
        var names = [];
        this.db.listCollections().toArray(function(err, items) {
            names = items.map(item => {
                return item.name;
            });
            res.status(200).json({Items: names});
        });
    }
    disconnect(){
        this.client.close();
    }
    connect(){
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.uri, (err, client) => this.onConnect(err, client, resolve, reject));
        });
    }
}

const mongo = new MongoWrapper(uri);

module.exports = mongo;

module.exports.param = (req, res, next, col) => {
    if(col in mongo.collectionNames === false)
        return res.status(404).json({message: `Collection ${col} not found.`});
    next();
}
