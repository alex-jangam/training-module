

module.exports = function (app, dao, config) {
  var action = require("../modules/courses")(dao, config), auth = require("../auth").topic;
  app.post("/topic", auth, action.add);
  app.get("/topic", auth, action.getAll);
  app.get("/topic/registered", auth, action.registered);

}
