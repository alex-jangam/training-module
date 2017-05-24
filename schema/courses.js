/*globals require, module, console, exports */
/*jslint node : true, nomen : true, unparam : true */
"use strict";
/**
  * Courses are sub catogories,
  * EX : HTML is part of UI. So Courses are requested for admin permissions by users
  * A Default Course with blank USER is always created, and a course object for each user who registers and admin requests.
  * Once registered, user can request for admin permissions which will make role as admin and approved false.
  * User will have one course object with role user with username. This helps in identifying permissions to the course.
**/
var utils = require("../plugins/utils");
var cnst = require("../config");
var mongConn = require('./connection');
var mongooseClient = mongConn.mongooseClient;
var Schema = mongConn.Schema;
var aggr = require("../plugins/aggrigation")();

var schema = new Schema({
    "name" : String,//Display name for course like HTML, JS , Java, Spring
    "code" : String, //category code which is auto generated
    "category" : String,//category under which it comes up like UI, Server etc
    "suffix" : String,//Suffix to be dsplayed for items under it
    // "count" : {type : Number , default : 0},//Count of total items under this course. -get from topic collection
    // "rcount" : {type : Number , default : 0},//Count of registered items under this course.- get from topic collection
    "approved" : Boolean,//to be approved by superadmin for permission as admin.
    "user" : String,//Username of user who accesses the course
    "role" : String //role of registered
}, {versionKey : false,  timestamps : { createdAt : 'created', updatedAt : 'lastUpdated'}});

schema.index({ name : 1, user : 1}, { unique : true });
schema.index({ code : 1, user : 1}, { unique : true });


var collection = 'courses';
var paginate = 10, defKeys = ["name", "code", "category", "suffix", "user", "role", "created", "lastUpdated"],
    sortItem = [{item : "user", order : 1}];

schema.methods.findByName = function (name) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ username : utils.noCase(name)}, newProm.post);
    return newProm.prom;
};
schema.methods.getCount = function (category) {
    var newProm = utils.getpromise(), query = {"category" : category};
    this.model(collection).count(query, newProm.post);
    return newProm.prom;
};

schema.methods.findLatest = function () {
    var newProm = utils.getpromise();
    this.model(collection).findOne({}).sort({created : -1}).limit( 5 ).exec(newProm.post);
    return newProm.prom;
};

schema.methods.categoryCounts = function () {
    var newProm = utils.getpromise();
    // this.model(collection).count({category: category, user : ""}, newProm.post);
    this.model(collection).aggregate(aggr.getUniqueCount("category")).exec(newProm.post);
    return newProm.prom;
};

schema.methods.findById = function (id) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ _id : id }, newProm.post);
    return newProm.prom;
};
//
schema.methods.approve = function (user, course) {
    var newProm = utils.getpromise();
    this.model(collection).findOneAndUpdate({ user : user, code : course, approved : false}, {approved : true}, newProm.post);
    return newProm.prom;
};

schema.methods.findAll = function (category, name, page, count) {
    var newProm = utils.getpromise(),
        query = {
             category : category,
            "$or": [
                {user: name},
                {user : "", approved : true},
            ]
        }, sort = {user : 1},
        aggList = aggr.getUnique(query, "code", sort, defKeys);

    this.model(collection).aggregate(aggList).exec(pagequery.post);
    return newProm.prom;
};

schema.methods.findAndRemove = function (username) {
    var newProm = utils.getpromise();
    this.model(collection).findOneAndRemove({username : utils.noCase(username)}, newProm.post);
    return newProm.prom;
};


var SchemaModel = mongooseClient.model(collection, schema);

module.exports.query = new SchemaModel();// Export the whole 'schema' with all the methods
module.exports.add = function (name, code, category, suffix, user, role, approved) {// Export the save, which is separate from the search, as we need pass new obj to 'schema' constructor
    var newProm = utils.getpromise(), ObModel = {
        "name" : name,
        "code" : code,
        "category" : category,
        "suffix" : suffix,
        "approved" : approved || false,
        "user" : user,
        "role" : role
    }, schemaSave = new SchemaModel(ObModel);
    schemaSave.save(newProm.post);
    return newProm.prom;
};
module.exports.update = function (data, callB) {// Export the save, which is separate from the search, as we need pass new obj to 'schema' constructor
    var id = data._id;
    delete data._id;
    SchemaModel.update({_id : id}, data, callB);
};
