

module.exports = function (app, dao, config) {

  app.get('/public', function(req, res){
    res.sendfile('./ui/this.html');
  });
  require("./users")(app, dao, config);
  require("./category")(app, dao, config);
  require("./courses")(app, dao, config);
  require("./topic")(app, dao, config);
}
