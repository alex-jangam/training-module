//UI(Catogory) > HTML(course) > Form validation > Questions related to Forms.

module.exports = function (app, dao, config) {
  var action = require("../modules/question")(dao, config), auth = require("../auth/authorize").questions;
  app.post("/question", auth, action.verifyTopic, action.verifyCourse, action.add);//send question, topic, (optional)guides[].
  app.get("/questions", auth, action.verifyTopic, action.verifyCourse, action.getAll);//?topic=topicCode
  app.put("/question", auth, action.edit);
  app.delete("/question", auth, action.remove);//{code : questionCode}

}
