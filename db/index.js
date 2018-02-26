"use strict";
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const EventEmitter = require('events');

const addr = "mongo", port = "27017", db = "test";
const uri = `mongodb://${addr}:${port}`;

class MongoWrapper extends EventEmitter {
    constructor(uri){
        super();
        MongoClient.connect(uri, (err, client) => this.onConnect(err, client));
    }
    onConnect(err, client){
        if (err) { throw err; }
        this.db = client.db(db);
        this.seed().then(()=>{ 
            this.collectionNames = [];
            this.db.listCollections({}).forEach((collection)=>{
                this.collectionNames.push(collection.name);
            });
            this.emit('ready');
        });
    }
    seed(){    
        function populate(resolve, reject){
            var schema = require('./mock.json');
            var collectionsToPopulate = Object.keys(schema).length;
            for(let col in schema){
                let collection = this.db.collection(col);
                collection.deleteMany({});
                collection.insertMany(schema[col], function (err, result) {
                    collectionsToPopulate--;
                    if(collectionsToPopulate==0){
                        resolve('Success!');
                    }
                    console.log(`Inserted mock data into ${col.toUpperCase()} collection`);
                });
            }
        }
        return new Promise(populate.bind(this));
    }
}

const mongo = new MongoWrapper(uri);

module.exports = mongo;

module.exports.middleware = (req, res, next) => {
    req.db = mongo.db;
    req.mongo = mongo;
    next();
}

module.exports.param = (req, res, next, col) => {
    if(col in mongo.collectionNames === false)
        return res.status(404).json({message: `Collection ${col} not found.`});

    next();
}
