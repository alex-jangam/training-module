

module.exports = function (app, dao, config) {
  var action = require("../modules/category")(dao, config), auth = require("../auth/authorize").category;
  app.post("/category", auth, action.add);
  app.get("/category", auth, action.getAll);
}
