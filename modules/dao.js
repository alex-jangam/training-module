/*globals require, module, console, exports */
/*jslint node: true, nomen: true, unparam: true */
"use strict";

var users = require("../schema/users"),
    category = require("../schema/category"),
    courses = require("../schema/courses");


module.exports.user = {
    getUser : function (name) {
      return users.query.findByName(name)
    },
    getbyCred : function (name, password) {
        return users.query.updateByNameAndPassword(name, password);
    },
    add : function (name, password, dname, role) {
        return users.add(name, password, dname, role);
    },
    getUsers : function (page, count) {
        return users.query.findAll(page, count);
    },
    updatePswd : function (name, oldps, nwps) {
        return users.query.updatePasswordOne(name, oldps, nwps);
    },
    remove : function (name) {
      return users.query.findAndRemove(name);
    }
};

module.exports.category = {
    getAll : function (user, isSuper, page, count) {
        return category.query.findAll(user, isSuper, page, count);
    },
    getOne : function (code) {
        return category.query.findByCode(code);
    },
    getLast : function (page, count) {
        return category.query.findLatest();
    },
    add : function (name, code, suffix, user, approved) {
        return category.add(name, code, suffix, user, approved)
    },
    update : function (code, catogory) {
        return category.query.updateOne(code, catogory);
    },
    remove : function (code) {
        return category.query.findAndRemove(code);
    },
    getAllCourseCount : function () {
      return courses.query.categoryCounts();
    }

};

module.exports.courses = {
    getLast : function (page, count) {
        return courses.query.findLatest();
    },
    getCourse : function (name) {
        return courses.query.findByName(name);
    },
    getCourseCode : function (code) {
      return courses.query.findByCode(code);
    },
    getCourseCodeName : function (code, name) {
      return courses.query.findByCodeName(code, name);
    },
    add : function (name, code, category, suffix, user, role, approved) {
        return courses.add(name, code, category, suffix, user, role, approved)
    },
    approve : function (user, course) {
        return courses.query.approve(user, course);
    },
    approveAdmin : function (user, course) {
        return courses.query.approveAdmin(user, course);
    },
    getAll : function (category, name, page, count) {
        return courses.query.findAll(category, name, page, count);
    },
    remove : function (code) {
        return courses.query.findAndRemove(code);
    },
    removeMany : function (code) {
        return courses.query.findAndRemoveMany(code);
    },

};
