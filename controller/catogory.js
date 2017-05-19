

module.exports = function (app, dao, config) {
  var action = require("../modules/courses")(dao, config), auth = require("../auth").category;
  app.post("/category", auth, action.add);
  app.get("/category", auth, action.getAll);
}
