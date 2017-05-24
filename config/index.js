/*globals require, module, console, exports, process */

var hostname = require("os").hostname(), defaultHost = process.env.USER_MONGO || "localhost", conn;

var superu = "super", admin = "admin", user = "user";
module.exports.local = "localhost";
module.exports.admin = "admin";
module.exports.super = superu;
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
	"/users:GET" : [superu],

	"/category:GET" : [superu, admin],


	"/courses:POST" : [superu, admin],
	"/courses/approve:PUT" : [superu]
}

module.exports.excempt = ["/users/token", "/users/register"]
