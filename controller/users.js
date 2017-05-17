

module.exports = function (app, db) {
  var action = require("../modules/users")();

  app.get("/users/getCustomers", action.getCustomers);

}
