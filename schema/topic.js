/*globals require, module, console, exports */
/*jslint node : true, nomen : true, unparam : true */
"use strict";

/**
  * Topic are sub Courses,
  * EX : HTML Basic is part of HTML. So admin permissions are copied from Courses
  * A Default topic with blank USER is always created,
  * a topic object for each user who registers and admin permission is copied from the parent with approval status.
  * User will have one topic object with role user with username. This helps in identifying permissions to the topic.
**/

var utils = require("../plugins/utils");
var cnst = require("../config");
var mongConn = require('./connection');
var mongooseClient = mongConn.mongooseClient;
var Schema = mongConn.Schema;
var aggr = require("../plugins/aggrigation")();

var schema = new Schema({
    "name" : String, //Topic is the Courses topic in which questions will come up
    "code" : String, //Topic code which is auto generated
    "course" : String, //Under which course this topic has to appear
    "coursename" : String,
    "suffix" : String, //Suffix for topic to display
    "count" : Number, //Number of questions in the topic
    "user" : String, //User name who has registered to the topic
    "approved" : Boolean, //State of approval - To be approved by admin.
    "submitted" : Boolean, // Submit is state of the topic, once submitted it goes for admin to review
    "status" : String,//Status varies from started, inprogress, pending to Ended.
    "guides" : [String],//Add related links
    "role" : String //role of the user
}, {versionKey : false,  timestamps : { createdAt : 'created', updatedAt : 'lastUpdated'}});

schema.index({ code : 1, user : 1}, { unique : true });

var collection = 'topic',
    paginate = 10,
    defKeys = ["name", "code", "course", "suffix", "count", "user", "approved", "submitted", "guides", "role",  "created", "lastUpdated"],
    sortItem = [{item : "user", order : 1}, {item : "count", order : 1}];

schema.methods.findByName = function (name) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ name : name}, newProm.post);
    return newProm.prom;
};

schema.methods.findByCode = function (code) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ code : code, user : ""}, newProm.post);
    return newProm.prom;
};

schema.methods.findByCodeOptUser = function (code, user) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ code : code, $or : [{user : user}, {user : ""}] }, newProm.post).sort({user : -1});
    return newProm.prom;
};

schema.methods.findByCodeName = function (code, user) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ code : code, user : user}, newProm.post);
    return newProm.prom;
};

schema.methods.findLatest = function () {
    var newProm = utils.getpromise();
    this.model(collection).findOne({}).sort({created : -1}).exec(newProm.post);
    return newProm.prom;
};

schema.methods.getCount = function (course) {
    var newProm = utils.getpromise(), query = {"course" : course};
    this.model(collection).count(query, newProm.post);
    return newProm.prom;
};

schema.methods.incrementCount = function (course) {
    var newProm = utils.getpromise(), query = {"course" : course};
    this.model(collection).findAndUpdate(query,{ $inc: { course: 1 }}, newProm.post);
    return newProm.prom;
};

schema.methods.decrementCount = function (course) {
    var newProm = utils.getpromise(), query = {"course" : course};
    this.model(collection).findAndUpdate(query,{ $dec: { course: 1 }}, newProm.post);
    return newProm.prom;
};

schema.methods.courseCounts = function () {
    var newProm = utils.getpromise();
    this.model(collection).aggregate(aggr.getUniqueCount("course")).exec(newProm.post);
    return newProm.prom;
};

schema.methods.findById = function (id) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ _id : id }, newProm.post);
    return newProm.prom;
};

schema.methods.findAll = function (course, user, page, count) {
    var newProm = utils.getpromise(),
        query = {course: course,
          "$or": [
            {user: user},
            {user : ""},
          ]}, pagequery = utils.paginate(), aggList;
        if (!course) {
          delete query.course;
        }
        aggList = pagequery.form(query, defKeys, page, parseInt(count, 10) || paginate, sortItem, newProm.post);
    this.model(collection).aggregate(aggList).exec(pagequery.post);
    return newProm.prom;
};


schema.methods.findAndRemove = function (user, code) {
    var newProm = utils.getpromise();
    this.model(collection).findOneAndRemove({user: user, code : code}, newProm.post);
    return newProm.prom;
};

schema.methods.findCourseAndRemoveMany = function (coursecode) {
    var newProm = utils.getpromise();
    this.model(collection).remove({course : coursecode}, newProm.post);
    return newProm.prom;
};
schema.methods.findAndRemoveMany = function (code) {
    var newProm = utils.getpromise();
    this.model(collection).remove({code : code}, newProm.post);
    return newProm.prom;
};

var SchemaModel = mongooseClient.model(collection, schema);

module.exports.query = new SchemaModel();// Export the whole 'schema' with all the methods
module.exports.add = function (name, code, course, coursecode,suffix, user, role, status) {// Export the save, which is separate from the search, as we need pass new obj to 'schema' constructor
    var newProm = utils.getpromise(), ObModel = {
        "name" : name,
        "code" : code,
        "coursename" : course,
        "course" : coursecode,
        "suffix" : suffix,
        "count" : 0,
        "user" : user || "",
        "role" : role || "",
        "status" : status || "",
    }, schemaSave = new SchemaModel(ObModel);
    schemaSave.save(newProm.post);
    return newProm.prom;
};
module.exports.update = function (data, callB) {// Export the save, which is separate from the search, as we need pass new obj to 'schema' constructor
    var id = data._id;
    delete data._id;
    SchemaModel.update({_id : id}, data, callB);
};
