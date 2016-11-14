"use strict";

const mongo = require('mongodb').MongoClient;
const config = require('../../config');

let db;

//TODO add index for 'key' field in sessions collection
//TODO implement o

mongo.connect(config.get('mongo.uri'), function(err, database) {
    if (err) {
        console.log("Mongo error: ", err);
        return;
    }
    db = database;
    /*db.collection('robots').find().toArray((err, data) => {
        console.log(data)
    })*/
});

module.exports.collection = function (collection) {
    return db.collection(collection);
};