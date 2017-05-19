/*globals require, module, console, exports, process */

var hostname = require("os").hostname(), defaultHost = process.env.USER_MONGO || "localhost", conn;


module.exports.local = "localhost";
module.exports.admin = "admin";
module.exports.super = "super";
module.exports.user = "user";
if (hostname.includes("PC") || hostname.includes(".local")) {
		module.exports.local = hostname;
	   defaultHost = hostname;
}

conn = {
		uri: "mongodb://" + defaultHost + "/training",
		options: { server: { auto_reconnect: true } }
};
module.exports.secret = "Pa$$";
module.exports.session = { expiresIn: "1h"};
module.exports.conn = conn;
module.exports.authorizedroles = {
	"/users:GET" : ["super"]
}

module.exports.excempt = ["/users/token", "/users/register"]
