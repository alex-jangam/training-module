

module.exports = function (app, dao, config) {
  var action = require("../modules/courses")(dao, config), auth = require("../auth/courses").courses;
  app.post("/courses", auth, action.addCourse);
  app.get("/courses", auth, action.getAll);
  app.get("/courses/registered", auth, action.getRegistered);
}
