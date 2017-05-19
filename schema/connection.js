/*global console : true, require : true,process : true,module : true */

/*
* Common mongo connection for all user operations
* mongooseClient exports mongoose client object and Schema exports Schema object
*/
var mongoose = require('mongoose'),
    config = require("../config"), mongooseClient, Schema;
    dbUrl = config.conn.uri;
if (process.argv.indexOf("mocha") !== -1) {
    //For mocha testing
    dbUrl += "test";
}

mongooseClient = mongoose.createConnection(dbUrl, config.conn.options);
mongooseClient.on('error', console.error.bind(console, 'mongoose connection error: '));
Schema = mongoose.Schema;
module.exports.mongooseClient = mongooseClient;
module.exports.Schema = Schema;
