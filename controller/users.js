

module.exports = function (app, dao, config) {
  var action = require("../modules/users")(dao, config), auth = require("../auth/authorize").users;
  app.post("/users/token", action.verify, action.generate);
  app.post("/users/register", action.addself, action.generate);
  app.get("/users", auth, action.getusers);
  app.post("/users/change", auth, action.change);
  app.delete("/users/quit", auth, action.removeself);
  app.delete("/users/remove", auth, action.remove);

}
