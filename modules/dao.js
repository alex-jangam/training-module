/*globals require, module, console, exports */
/*jslint node: true, nomen: true, unparam: true */
"use strict";

var users = require("../schema/users"),
    category = require("../schema/category"),
    courses = require("../schema/courses"),
    topics = require("../schema/topic"),
    questions = require("../schema/questions");


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
    add : function (name, code, suffix, user, approved, time) {
        return category.add(name, code, suffix, user, approved, time)
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
    getLast : function () {
        return courses.query.findLatest();
    },
    getCourse : function (name) {
        return courses.query.findByName(name);
    },
    getCourseCode : function (code) {
      return courses.query.findByCode(code);
    },
    getApprovedCourse : function (code) {
      return courses.query.findByCodeApproved(code);
    },
    getCourseCodeName : function (code, name) {
      return courses.query.findByCodeName(code, name);
    },
    getCourseCodeNameOrApproved : function (code, name) {
      return courses.query.findByCodeNameApproved(code, name);
    },
    add : function (name, code, category, suffix, user, role, approved, time) {
        return courses.add(name, code, category, suffix, user, role, approved, time)
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
    getAllCourses : function (category, name, page, count) {
        return courses.query.findAll(category, name, page, count);
    },
    getEnrolled: function (name, page, count) {
        return courses.query.findEnrolled(name, page, count);
    },
    getByCategory: function (category) {
        return courses.query.findAllbyCategory(category);
    },
    remove : function (code) {
        return courses.query.findAndRemove(code);
    },
    removeMany : function (code) {
        return courses.query.findAndRemoveMany(code);
    },
    getTopicsCount : function () {
      return topics.query.courseCounts()
    }

};

module.exports.topics = {
  getLast : function () {
      return topics.query.findLatest();
  },
  getName : function (name) {
      return topics.query.findByName(name);
  },
  getTopic : function (code) {
      return topics.query.findByCode(code);
  },
  getTopicOptUser : function (code, user) {
      return topics.query.findByCodeOptUser(code, user);
  },
  add : function (name, code, course, coursecode, suffix, user, role, status) {
    return topics.add(name, code, course, coursecode, suffix, user, role, status);
  },
  getAll : function (course, name, page, count) {
    return topics.query.findAll(course, name, page, count);
  },
  removeCourse : function (coursecode) {
    return topics.query.findCourseAndRemoveMany(coursecode);
  },
  removeMany : function (code) {
      return topics.query.findAndRemoveMany(code);
  },
  getQuestionsCount : function (course) {
    return questions.query.questionsCounts(course)
  }
}

module.exports.questions = {
  getLast : function () {
      return questions.query.findLatest();
  },
  add : function (question, topic, course, code, priority, guides) {
    return questions.add(question, topic, course, code, priority, guides);
  },
  getAll : function (topic, page, count) {
    return questions.query.findAll(topic, page, count);
  },
  remove : function (questionCode) {
    return questions.query.findAndRemove(questionCode);
  },
  /*/
  getName : function (name) {
      return questions.query.findByName(name);
  },
  getTopic : function (code) {
      return questions.query.findByCode(code);
  },
  getTopicOptUser : function (code, user) {
      return questions.query.findByCodeOptUser(code, user);
  },
  removeMany : function (code) {
      return questions.query.findAndRemoveMany(code);
  },//*/
}
