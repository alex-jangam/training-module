/*globals require, module, console, exports, process */

var hostname = require("os").hostname(), defaultHost = process.env.USER_MONGO || "localhost", conn;

var superu = "super", admin = "admin", user = "user", all = [superu,admin,user], onlysu = [superu], self = "self";
module.exports.local = "localhost";
module.exports.admin = admin;
module.exports.super = superu;
module.exports.user = user;
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

	"/courses:GET" : [superu, admin, user],
	"/courses/enroll:GET" : [admin],
	"/courses/all:GET" : [superu, admin, user],
	"/courses/request:GET" : [admin],
	"/courses:POST" : [superu, admin],
	"/courses:DELETE" : [superu],
	"/courses/all:DELETE" : [superu],
	"/courses/approve:PUT" : onlysu,

	"/topic:POST": [superu, admin],
	"/topics:GET": [superu, admin, user],
	"/topic/start:PUT": [superu, admin, user],
	"/topic:DELETE": [superu, admin],

	"/question:POST": [superu, admin],
	"/questions:GET": all,
	"/question:DELETE": [superu, admin],

}

module.exports.excempt = ["/users/token", "/users/register"]
module.exports.topicstates = ["start", "inprogress", "pending", "ended"];
