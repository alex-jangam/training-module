/*globals require, module, console, exports, process */

var hostname = require("os").hostname(), defaultHost = process.env.USER_MONGO || "localhost", conn;

var superu = "super", admin = "admin", user = "user", all = [superu,admin,user], onlysu = [superu], self = "self";
module.exports.local = "localhost";
module.exports.admin = "admin";
module.exports.super = superu;
module.exports.user = "user";
module.exports.self = self;
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
module.exports.port = Number(process.env.PORT) || 4000;

module.exports.authorizedroles = {
	"/users:GET" : onlysu,
	"/users/remove:DELETE" : onlysu,
	"/users/quit:DELETE" : self,
	"/users/change:POST" : all,

	"/category:POST" : all,
	"/category:PUT" : all,
	"/category:GET" : all,
	"/category/approve:PUT" : onlysu,
	"/category:DELETE" : onlysu,

	"/courses:POST" : [superu, user],
	"/courses/approve:PUT" : onlysu
}

module.exports.excempt = ["/users/token", "/users/register"]
