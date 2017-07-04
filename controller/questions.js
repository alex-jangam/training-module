//UI(Catogory) > HTML(course) > Form validation > Questions related to Forms.

module.exports = function (app, dao, config) {
  var action = require("../modules/courses")(dao, config), auth = require("../auth").questions;
  app.post("/courses", auth, action.add);
  app.get("/courses", auth, action.getAll);
}
