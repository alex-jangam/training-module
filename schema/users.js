/*globals require, module, console, exports */
/*jslint node: true, nomen: true, unparam: true */
"use strict";

var utils = require("../plugins/utils");
var cnst = require("../config");
var mongConn = require('./connection');
var mongooseClient = mongConn.mongooseClient;
var Schema = mongConn.Schema;

var userSchema = new Schema({
        "username" : { type : String, unique : true    },
        "dname" : String,
        "password" : String,
        "role" : String,
        "lastLogin" : {type : Number, default : null}
    }, {versionKey : false});
userSchema.set('toJSON', {
    transform : function (doc, ret) {
        delete ret._id;
        delete ret.password;
        return ret;
    }
});
var collection = 'users';
var paginate = 50, defKeys = ["username", "dname", "role", "lastLogin"], sortItem = {item : "username", order : 1};
// userSchema.index( { username : 1, });
userSchema.methods.findByName = function (name) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ username : utils.noCase(name) }, newProm.post);
    return newProm.prom;
};

userSchema.methods.getCount = function (account) {
    var newProm = utils.getpromise(), query = {"account.name" : account};
    this.model(collection).count(query, newProm.post);
    return newProm.prom;
};

userSchema.methods.findByNameAndCompany = function (name, company) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ username : utils.noCase(name), "account.name" : company }, newProm.post);
    return newProm.prom;
};

userSchema.methods.findById = function (id) {
    var newProm = utils.getpromise();
    this.model(collection).findOne({ _id : id }, newProm.post);
    return newProm.prom;
};

userSchema.methods.findByNameAndPassword = function (name, password) {
    var newProm = utils.getpromise(), query = { username : utils.noCase(name), password : password};
    this.model(collection).findOne(query, newProm.post);
    return newProm.prom;
};

userSchema.methods.updateByNameAndPassword = function (username, password) {
    var newProm = utils.getpromise(), query = { username : utils.noCase(username), password : password};
    this.model(collection).findOneAndUpdate(query, {lastLogin : utils.getTime()}, {"new" : true}, newProm.post);
    return newProm.prom;
};

userSchema.methods.findByRole = function (role) {
    var newProm = utils.getpromise();
    this.model(collection).find({role : role}, newProm.post);
    return newProm.prom;
};


userSchema.methods.findAll = function (page, count) {
    var newProm = utils.getpromise(),
        query = {"role" : cnst.user},
        pagequery = utils.paginate(),
        aggList = pagequery.form(query, defKeys, page, parseInt(count, 10) || paginate, sortItem, newProm.post);
    this.model(collection).aggregate(aggList).exec(pagequery.post);
    // this.model(collection).find({"account.name" : company}, newProm.post);
    return newProm.prom;
};


userSchema.methods.findAndRemove = function (username) {
    var newProm = utils.getpromise();
    this.model(collection).findOneAndRemove({username : utils.noCase(username)}, newProm.post);
    return newProm.prom;
};

userSchema.methods.updateOne = function (usr) {
    var newProm = utils.getpromise(), user = utils.clone(usr), userFind = {"username" : usr.username};
    delete user._id;
    this.model(collection).findOneAndUpdate(userFind, user, {"new" : true}, newProm.post);
    return newProm.prom;
};


userSchema.methods.updatePasswordOne = function (name, oldpswd, newpswd) {
    var newProm = utils.getpromise();
    this.model(collection).findOneAndUpdate({username : name, password : oldpswd}, {"password" : newpswd}, {"new" : true}, newProm.post);
    return newProm.prom;
};

userSchema.methods.updateMany = function (user, updateuser) {
    var newProm = utils.getpromise();
    user.isDeleted = false;
    this.model(collection).update(user, updateuser, {multi : true}, newProm.post);
    return newProm.prom;
};


var User = mongooseClient.model(collection, userSchema);

module.exports.query = new User();// Export the whole 'userSchema' with all the methods
module.exports.add = function (name, password, dname, role) {// Export the save, which is separate from the search, as we need pass new obj to 'userSchema' constructor
    var newProm = utils.getpromise(), ObModel = {
        username : name,
        dname : dname,
        password : password,
        role : role || cnst.user,
        lastLogin : utils.getTime()
    }, userSave = new User(ObModel);
    delete userSave.password;// delete password on saved data
    userSave.save(newProm.post);
    return newProm.prom;
};
module.exports.update = function (data) {// Export the save, which is separate from the search, as we need pass new obj to 'userSchema' constructor
    var id = data._id;
    delete data._id;
    User.update({_id : id}, data);
};
