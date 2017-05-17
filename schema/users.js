var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/ux', db;

MongoClient.connect(url, function(err, mdb) {
  db = mdb;
});
module.exports = function () {

  function findCollections(cb) {
    db.collection('users', function (err, collection) {
      collection.find({}).toArray(function(err, items) {
        cb(err,items);
      });
    });
  }

  return {
    findCollections : findCollections
  }
}
