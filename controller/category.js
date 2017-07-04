//UI , Server, Regex

module.exports = function (app, dao, config) {
  var action = require("../modules/category")(dao, config), auth = require("../auth/authorize").category;
  app.post("/category", auth, action.add);// Post : {name: '{{catogory name}}' }
  app.get("/category", auth, action.getAll);
  app.put("/category", auth, action.update);
  app.put("/category/approve", auth, action.approve);
  app.delete("/category", auth, action.remove);// {code : '{{catogory code}}'}
}
