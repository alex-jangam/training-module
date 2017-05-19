//models\schema\users.js

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
var utils = require("../plugins/utils");
var cnst = require("../config");
var mongConn = require('./connection');
var mongooseClient = mongConn.mongooseClient;
var Schema = mongConn.Schema;

var userSchema = new Schema({
    "username": { type: String, unique: true  },
    "dname": String,
    "password":String,
    "role": String,
    "lastLogin": {type : Number , default : null},
},{versionKey: false});
userSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret._id;
        delete ret.password;
        return ret;
    }
});
var collection = 'users';
var paginate = 50, defKeys = ["username","dname","role","lastLogin"],
sortItem = {item:"username",order:1};
// userSchema.index( { username: 1,});
userSchema.methods.findByName = function(name){
  var newProm = utils.getpromise();
  this.model(collection).findOne({ username: utils.noCase(name) },newProm.post);
  return newProm.prom;
}
userSchema.methods.getCount = function(account){
  var newProm = utils.getpromise();
  var query = {"account.name":account};
  this.model(collection).count(query, newProm.post);
  return newProm.prom;
}
userSchema.methods.findByNameAndCompany = function(name,company,callB){
  var newProm = utils.getpromise();if(typeof callB =='function')newProm.prom.then(callB);
  this.model(collection).findOne({ username: utils.noCase(name),"account.name":company },newProm.post);
  return newProm.prom;
}
userSchema.methods.findById = function(id){
  var newProm = utils.getpromise();
  this.model(collection).findOne({ _id: id }, newProm.post);
  return newProm.prom;
}
userSchema.methods.findByNameAndPassword = function (name, password) {
  var newProm = utils.getpromise();
  var query = { username: utils.noCase(name),password:password};
  this.model(collection).findOne(query, newProm.post);
  return newProm.prom;
}
userSchema.methods.updateByNameAndPassword = function(username,password){
  var newProm = utils.getpromise();
  var query = { username: utils.noCase(username),password:password};
  this.model(collection).findOneAndUpdate(query,{lastLogin: utils.getTime()}, newProm.post);
  return newProm.prom;
}
userSchema.methods.findByRole = function(role,callB){
  var newProm = utils.getpromise();if(typeof callB =='function')newProm.prom.then(callB);
  this.model(collection).find({role: role}, newProm.post);
  return newProm.prom;
}
userSchema.methods.findByRoleAccount = function(account,role,page,count){
  var newProm = utils.getpromise();
  var query = {account:{name:account,role:role}};
  var pagequery = utils.paginate();
  var aggList = pagequery.form(query,defKeys,page,count*1||paginate,sortItem,newProm.post);
  this.model(collection).aggregate(aggList).exec(pagequery.post)
  return newProm.prom;
}
userSchema.methods.findByCompany = function(company,page,count){
  var newProm = utils.getpromise();
  var query = {"account.name": company};
  var pagequery = utils.paginate();
  // if(!page || page < 2 || isNaN(page))page=1;
  var aggList = pagequery.form(query,defKeys,page,count*1||paginate,sortItem,newProm.post);
  this.model(collection).aggregate(aggList).exec(pagequery.post)
  // this.model(collection).find({"account.name": company}, newProm.post);
  return newProm.prom;
}
userSchema.methods.findAll = function(page, count){
  var newProm = utils.getpromise();
  var query = {"role": cnst.admin};
  var pagequery = utils.paginate();
  // if(!page || page < 2 || isNaN(page))page=1;
  var aggList = pagequery.form(query, defKeys, page, count * 1 || paginate, sortItem, newProm.post);
  this.model(collection).aggregate(aggList).exec(pagequery.post)
  // this.model(collection).find({"account.name": company}, newProm.post);
  return newProm.prom;
}

userSchema.methods.findOrderedByCompany = function(sort,order,company,page,count){
  var newProm = utils.getpromise();
  var query = {"account.name": company};
  if(sort == "role")sort="account.role";
  var pagequery = utils.paginate(),sortq = {item:sort,order: order|| -1};
  var aggList = pagequery.form(query,defKeys,page,count*1||paginate,sortq,newProm.post);
  this.model(collection).aggregate(aggList).exec(pagequery.post)
  return newProm.prom;
}

userSchema.methods.findAndRemove = function(username,callB){
  var newProm = utils.getpromise();if(typeof callB =='function')newProm.prom.then(callB);
  this.model(collection).findOneAndRemove({username: utils.noCase(username)},newProm.post);
  return newProm.prom;
}
userSchema.methods.updateOne = function(usr){
  var newProm = utils.getpromise();
  var user = utils.clone(usr);
  delete user._id;
  var userFind = {"username":usr.username};
  this.model(collection).findOneAndUpdate(userFind,user,{new: true},newProm.post);
  return newProm.prom;
}

userSchema.methods.userAddAccount = function(user,name,role){
  var newProm = utils.getpromise();
  this.model(collection).findOneAndUpdate({username:utils.noCase(user)},{$push:{account:{name:name,role:role}}},{new: true},newProm.post);
  return newProm.prom;
}

userSchema.methods.updatePasswordOne = function(usr){
  var newProm = utils.getpromise();
  var user = utils.clone(usr);user.isDeleted = false;
  delete user.newpassword;
  this.model(collection).findOneAndUpdate(user,{"password":usr.newpassword},{new: true}, newProm.post);
  return newProm.prom;
}

userSchema.methods.updateMany = function(user,updateuser,callB){
  var newProm = utils.getpromise();if(typeof callB =='function')newProm.prom.then(callB);
  user.isDeleted = false;
  this.model(collection).update(user,updateuser,{multi:true}, newProm.post);
  return newProm.prom;
}
userSchema.methods.updateAll = function(cursor) {

}

var user = mongooseClient.model('users', userSchema);

module.exports.query = new user();// Export the whole 'userSchema' with all the methods
module.exports.add = function(name, password, dname, role){// Export the save, which is separate from the search, as we need pass new obj to 'userSchema' constructor
  var newProm = utils.getpromise(), userOb = {
    username : name,
    dname : dname,
    password : password,
    role : role || cnst.admin,
    lastLogin : utils.getTime()
  };
  var userSave = new user(userOb);
  delete userSave.password;// delete password on saved data
  userSave.save(newProm.post);
  return newProm.prom;
}
module.exports.update = function(data,callB){// Export the save, which is separate from the search, as we need pass new obj to 'userSchema' constructor
  var id= data._id;
  delete data._id;
  user.update({_id:id},data,callB);
}
