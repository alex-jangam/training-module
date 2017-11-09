/*globals require, module, console, exports */
/*jslint node : true, nomen : true, unparam : true */
"use strict";

var utils = require("../plugins/utils");
var cnst = require("../config");
var mongConn = require('./connection');
var mongooseClient = mongConn.mongooseClient;
var Schema = mongConn.Schema;

var schema = new Schema({
        "name" : String,//Display name for course like HTML, JS , Java, Spring
        "code" : String, //category code which is auto generated
        "suffix" : String,//Suffix to be dsplayed for items under it
        "approved" : Boolean,
        "user" : String// created user
    }, {versionKey : false, timestamps : { createdAt : 'created', updatedAt : 'lastUpdated'}});

schema.index({ name : 1}, { unique : true });

var collection = 'category',
    paginate = 10,
    defKeys = ["name", "code", "suffix", "approved", "created", "lastUpdated"],
    sortItem = {item : "name", order : 1};

schema.methods.findByName = function (name) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ name : utils.noCase(name)}, newProm.post);
    return newProm.prom;
};

schema.methods.findByCode = function (code) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ code : code}, newProm.post);
    return newProm.prom;
};

schema.methods.findLatest = function () {
    var newProm = utils.getpromise();
    this.model(collection).findOne({}).sort({created : -1}).limit( 5 ).exec(newProm.post);
    return newProm.prom;
};

// find by code and update.
schema.methods.updateOne = function (code, categoryData) {
    var newProm = utils.getpromise();
    delete categoryData.code;
    this.model(collection).findOneAndUpdate({code: code}, categoryData, {"new" : true}, newProm.post);
    return newProm.prom;
};

schema.methods.getCount = function (account) {
    var newProm = utils.getpromise(), query = {"account.name" : account};
    this.model(collection).count(query, newProm.post);
    return newProm.prom;
};

schema.methods.findById = function (id) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ _id : id }, newProm.post);
    return newProm.prom;
};


schema.methods.findAll = function (user, isSuper, page, count) {
    var newProm = utils.getpromise(),
        query = (isSuper && {}) || {$or: [{approved : true}, {user : user}]},
        pagequery = utils.paginate(),
        aggList = pagequery.form(query, defKeys, page, parseInt(count, 10) || paginate, sortItem, newProm.post);
    this.model(collection).aggregate(aggList).exec(pagequery.post);
    return newProm.prom;
};


schema.methods.findAndRemove = function (code) {
    var newProm = utils.getpromise();
    this.model(collection).findOneAndRemove({code : code}, newProm.post);
    return newProm.prom;
};


var SchemaModel = mongooseClient.model(collection, schema);

module.exports.query = new SchemaModel();// Export the whole 'schema' with all the methods
module.exports.add = function (name, category, suffix, user, approved) {// Export the save, which is separate from the search, as we need pass new obj to 'schema' constructor
    var newProm = utils.getpromise(), ObModel = {
        "name" : name,
        "code" : category,
        "suffix" : suffix,
        "approved" : approved,
        "count" : 0,
        "user" : user
    }, schemaSave = new SchemaModel(ObModel);
    schemaSave.save(newProm.post);
    return newProm.prom;
};
module.exports.update = function (data, callB) {// Export the save, which is separate from the search, as we need pass new obj to 'schema' constructor
    var id = data._id;
    delete data._id;
    SchemaModel.update({_id : id}, data, callB);
};
