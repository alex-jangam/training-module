var users = require("../schema/users"),
    courses = require("../schema/courses");

module.exports.getCollection = function (cb) {
    userconnect.findCollections(cb)
}

module.exports.user = {
  getbyCred : function (name, password) {
      return users.query.updateByNameAndPassword(name, password);
  },
  add : function (name, password, dname, role) {
      return users.add(name, password, dname, role);
  },
  getUsers : function (page, count) {
      return users.query.findAll(page, count)
  }
}


module.exports.courses = {
    getAllCourses : function (page, count) {
        return users.query.findAll(page, count)
    }
}
