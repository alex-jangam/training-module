//models\schema\users.js

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
var utils = require("../plugins/utils");
var cnst = require("../config");
var mongConn = require('./connection');
var mongooseClient = mongConn.mongooseClient;
var Schema = mongConn.Schema;

var schema = new Schema({
    "name": String, //Topic is the Courses topic in which questions will come up
    "code" : String, //Topic code which is auto generated
    "course": String, //Under which course this topic has to appear
    "suffix": String, //Suffix for topic to display
    "count": Number, //Number of questions in the topic
    "user": String, //User name who has registered to the topic
    "approved": Boolean, //State of approval - To be approved by admin.
    "submitted": Boolean, // Submit is state of the topic, once submitted it goes for admin to review
    "role": String //role of the user
}, {versionKey: false,  timestamps :{ createdAt: 'created', updatedAt: 'lastUpdated'}});

schema.index({ code: 1, user: 1}, { unique: true });
schema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret._id;
        delete ret.password;
        return ret;
    }
});
var collection = 'topic';
var paginate = 10, defKeys = ["name", "code", "course", "suffix", "count", "user", "approved", "submitted", "role",  "created", "lastUpdated"],
sortItem = {item:"count", order:1};

schema.methods.findByName = function(name){
  var newProm = utils.getpromise();
  this.model(collection).findOne({ username: utils.noCase(name) },newProm.post);
  return newProm.prom;
}

schema.methods.getCount = function(account){
  var newProm = utils.getpromise();
  var query = {"account.name":account};
  this.model(collection).count(query, newProm.post);
  return newProm.prom;
}

schema.methods.findById = function(id){
  var newProm = utils.getpromise();
  this.model(collection).findOne({ _id: id }, newProm.post);
  return newProm.prom;
}

schema.methods.findAll = function(page, count){
  var newProm = utils.getpromise();
  var query = {approved : true};
  var pagequery = utils.paginate();
  // if(!page || page < 2 || isNaN(page))page=1;
  var aggList = pagequery.form(query, defKeys, page, count * 1 || paginate, sortItem, newProm.post);
  this.model(collection).aggregate(aggList).exec(pagequery.post)
  // this.model(collection).find({"account.name": company}, newProm.post);
  return newProm.prom;
}


schema.methods.findAndRemove = function(username,callB){
  var newProm = utils.getpromise();
  this.model(collection).findOneAndRemove({username: utils.noCase(username)},newProm.post);
  return newProm.prom;
}

schema.methods.updateOne = function(usr){
  var newProm = utils.getpromise();
  var user = utils.clone(usr);
  delete user._id;
  var userFind = {"username":usr.username};
  this.model(collection).findOneAndUpdate(userFind,user,{new: true},newProm.post);
  return newProm.prom;
}


var lschame = mongooseClient.model(collection, schema);

module.exports.query = new user();// Export the whole 'schema' with all the methods
module.exports.add = function(name, catogory, suffix){// Export the save, which is separate from the search, as we need pass new obj to 'schema' constructor
  var newProm = utils.getpromise(), userOb = {
    "name": name,
    "catogory": catogory,
    "suffix": suffix,
    "count": 0
  };
  var schemaSave = new lschame(userOb);
  schemaSave.save(newProm.post);
  return newProm.prom;
}
module.exports.update = function(data,callB){// Export the save, which is separate from the search, as we need pass new obj to 'schema' constructor
  var id= data._id;
  delete data._id;
  user.update({_id:id},data,callB);
}
