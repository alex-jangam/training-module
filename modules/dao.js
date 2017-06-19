/*globals require, module, console, exports */
/*jslint node: true, nomen: true, unparam: true */
"use strict";

var users = require("../schema/users"),
    category = require("../schema/category"),
    courses = require("../schema/courses");


module.exports.user = {
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
    getAll : function (user, page, count) {
        return category.query.findAll(user, page, count);
    },
    getLast : function (page, count) {
        return category.query.findLatest();
    },
    add : function (name, code, suffix, user, approved) {
        return category.add(name, code, suffix, user, approved)
    },
    getAllCourseCount : function () {
      return courses.query.categoryCounts();
    }

};

module.exports.courses = {
    getLast : function (page, count) {
        return courses.query.findLatest();
    },
    add : function (name, code, category, suffix, user, role, approved) {
        return courses.add(name, code, category, suffix, user, role, approved)
    },
    approve : function (user, course) {
        return courses.query.approve(user, course);
    },
    getAll : function (category, name, page, count) {
        return courses.query.findAll(category, name, page, count);
    }
};
