

module.exports = function (app, db) {
  app.get('/', function (req,res) {
    res.send("Hello Rahul");
  })
  app.get('/public', function(req, res){
    res.sendfile('./ui/this.html');
  });

  require("./users")(app);
  // require("./someother")(app);

}
