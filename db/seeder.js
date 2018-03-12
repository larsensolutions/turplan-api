'use strict'
//TODO: Refactor all

/* Private functions */
var _populate = function(resolve, reject){
    this.resolve = resolve, this.reject = reject;
    this.collectionsToPopulate = Object.keys(this.schema).length;
    if(this.collectionsToPopulate===0){
        resolve("No data");
        return;
    }
    for(var collectionName in this.schema){
        
        var collection = this.db.collection(collectionName);
        var data = this.schema[collectionName];

        collection.deleteMany({});
        collection.insertMany(this.schema[collectionName], _insertManyCallback.bind(this));
    }
}
var _insertManyCallback = function(err, result) {
    if (err) { this.reject(err); }
    this.collectionsToPopulate--;
    if(this.collectionsToPopulate < 1){
        this.resolve({status:'Database seed complete', collectionNames:Object.keys(this.schema)});
    }
}

/**
 * Public class, Used to insert test data into mongodb
 */
class Seeder{
    constructor(){
        this.db = null;
    }
    seed(db){
        this.db = db;
        return this;
    }
    with(data){
        this.schema = data || {};
        return new Promise(_populate.bind(this));
    }
}

module.exports = new Seeder();