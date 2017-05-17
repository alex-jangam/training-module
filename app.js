var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/ux';
// var url1 = 'mongodb://localhost:27017/storage';

require("./controller/setters")(app, express);

MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");

  require("./controller/routes")(app);
});



app.listen(4000, function () {
  console.log('app listening on port 4000...');
});
