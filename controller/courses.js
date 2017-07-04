// UI(catogory) > HTML, CSS, JS

module.exports = function (app, dao, config) {
  var action = require("../modules/course")(dao, config), auth = require("../auth/authorize").course;

  app.post("/courses", auth, action.add);
  app.get("/courses", auth, action.getAll);
  app.get("/courses/registered", auth, action.registered);
  app.put("/courses/approve", auth, action.approve);

}
