/*globals require, module, console, exports */
/*jslint node : true, nomen : true, unparam : true */
"use strict";

/**
  * Questions come up under each topic.
  * EX : Q1. Write down html snippet for sumbitable form in part of HTML Basic.
  * Question edit permissions are verified from topic code and user role permissions, and no user data is saved.
**/

var utils = require("../plugins/utils");
var cnst = require("../config");
var mongConn = require('./connection');
var mongooseClient = mongConn.mongooseClient;
var Schema = mongConn.Schema;

var schema = new Schema({
    "question" : String,//Question code for which its tagged
    "submitted" : Boolean,//is Submitted state? It can be in saved or submitted.
    "user" : String,//User who submitted the answer
    "role" : String, //Role of user who submitted the answer.
    "answer" : String,//Answer to the question goes here.
    "approved" : Boolean //Pending(submitted but yet to review) or accepted(Answer was accepted)
}, {versionKey : false,  timestamps : { createdAt : 'created', updatedAt : 'lastUpdated'}});

schema.index({ question : 1, user : 1}, { unique : true });//One answer for question for user.

var collection = 'answers';
var paginate = 10, defKeys = ["question", "submitted",  "user", "role", "answer", "approved", "created", "lastUpdated"],
    sortItem = {item : "priority", order : 1};

schema.methods.findByName = function (name) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ username : utils.noCase(name)}, newProm.post);
    return newProm.prom;
};

schema.methods.findById = function (id) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ _id : id }, newProm.post);
    return newProm.prom;
};

schema.methods.findAll = function (page, count) {
    var newProm = utils.getpromise(),
        query = {approved : true},
        pagequery = utils.paginate(),
        aggList = pagequery.form(query, defKeys, page, parseInt(count, 10) || paginate, sortItem, newProm.post);
    this.model(collection).aggregate(aggList).exec(pagequery.post);
    return newProm.prom;
};


schema.methods.findAndRemove = function (username) {
    var newProm = utils.getpromise();
    this.model(collection).findOneAndRemove({username : utils.noCase(username)}, newProm.post);
    return newProm.prom;
};

schema.methods.updateOne = function (usr) {
    var newProm = utils.getpromise(),
        user = utils.clone(usr),
        userFind = {"username" : usr.username};
    this.model(collection).findOneAndUpdate(userFind, user, {new : true}, newProm.post);
    return newProm.prom;
};


var SchemaModel = mongooseClient.model(collection, schema);

module.exports.query = new SchemaModel();// Export the whole 'schema' with all the methods
module.exports.add = function (question, answer, user, role, submitted) {// Export the save, which is separate from the search, as we need pass new obj to 'schema' constructor
    var newProm = utils.getpromise(), ObModel = {
        "question" : question,
        "answer" : answer,//Answer to the question goes here.
        "user" : user,//User who submitted the answer
        "role" : role, //Role of user who submitted the answer.
        "submitted" : submitted || false,//is Submitted state? It can be in saved or submitted.
        "approved" : false
    }, schemaSave = new SchemaModel(ObModel);
    schemaSave.save(newProm.post);
    return newProm.prom;
};

module.exports.update = function (data, callB) {// Export the save, which is separate from the search, as we need pass new obj to 'schema' constructor
    var id = data._id;
    delete data._id;
    SchemaModel.update({_id : id}, data, callB);
};
