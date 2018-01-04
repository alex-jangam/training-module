//UI(Catogory) > HTML(course) > Form validation, Types of Inputs

module.exports = function (app, dao, config) {
  var action = require("../modules/topic")(dao, config), auth = require("../auth/authorize").topic;
  app.get("/topics", auth, action.verifyCourse, action.getAll);//?course=courseCode.
  app.post("/topic", auth, action.verifyAdminCourse, action.check, action.add);
  app.put("/topic/start", auth, action.verifyTopic, action.verifyCourse, action.startTopic);//?topic=code
  app.delete("/topic/reset", auth, action.remove);//{topic: code, name: username}
  app.delete("/topic", auth, action.verifyTopic, action.verifyAdminCourse, action.removeAll);//{topic: code}

}
