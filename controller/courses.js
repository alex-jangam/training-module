// UI(catogory) > HTML, CSS, JS

module.exports = function (app, dao, config) {
  var action = require("../modules/course")(dao, config), auth = require("../auth/authorize").course;

  app.post("/courses", auth, action.add);
  app.get("/courses/all", auth, action.enrolled);//
  app.get("/courses", auth, action.getAll);//?category="required catogory"
  app.get("/courses/registered", auth, action.registered);
  app.get("/courses/request", auth, action.adminRequest);//course={{code}}
  app.get("/courses/enroll", auth, action.enroll);//course={{code}}
  app.put("/courses/approve", auth, action.approve);//
  app.delete("/courses", auth, action.remove);// {name : '{{course code}}'}
  app.delete("/courses/all", auth, action.removeMany);// {name : '{{course code}}'}

}
