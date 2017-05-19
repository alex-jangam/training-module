
/**
  * Courses are sub catogories,
  * EX: HTML is part of UI. So Courses are requested for admin permissions by users
  * A Default Course with blank USER is always created, and a course object for each user who registers and admin requests.
  * Once registered, user can request for admin permissions which will make role as admin and approved false.
  * User will have one course object with role user with username. This helps in identifying permissions to the course.
**/
var utils = require("../plugins/utils");
var cnst = require("../config");
var mongConn = require('./connection');
var mongooseClient = mongConn.mongooseClient;
var Schema = mongConn.Schema;

var schema = new Schema({
    "name": String,//Display name for course like HTML, JS , Java, Spring
    "code": String //category code which is auto generated
    "category": String,//category under which it comes up like UI, Server etc
    "suffix": String,//Suffix to be dsplayed for items under it
    // "count": {type : Number , default : 0},//Count of total items under this course. -get from topic collection
    // "rcount": {type : Number , default : 0},//Count of registered items under this course.- get from topic collection
    "approved": Boolean,//to be approved by superadmin for permission as admin.
    "user": String,//Username of user who accesses the course
    "role": String //role of registered
}, {versionKey: false,  timestamps :{ createdAt: 'created', updatedAt: 'lastUpdated'}});

schema.index({ code: 1, user: 1}, { unique: true });

schema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret._id;
        delete ret.password;
        return ret;
    }
});
var collection = 'courses';
var paginate = 10, defKeys = ["name", "code", "category", "count", "suffix", "created","lastUpdated"],
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
module.exports.add = function(name, category, suffix){// Export the save, which is separate from the search, as we need pass new obj to 'schema' constructor
  var newProm = utils.getpromise(), userOb = {
    "name": name,
    "category": category,
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
