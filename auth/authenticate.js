/*globals require, module, console, exports */

var config = require("../config"),
		jwt = require('jsonwebtoken'),
		emessage = require("../emessages");
module.exports = function (req, res, next) {
		var headers = req.headers, token = headers["x-access-token"];
		if (req.method.toUpperCase() === 'OPTIONS') {
				res.header('Access-Control-Allow-Origin', '*');
				res.header('Access-Control-Allow-Headers', 'x-access-token,content-type');
				res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
				return res.status(200).send({});
		}
		if (config.excempt.includes(req.path)) {
					next();
		} else if (!token) {
				res.status(emessage.wrongToken.status).send(emessage.wrongToken);
		} else {
				jwt.verify(token, config.secret, function (err, decoded) {
					var emsg = err && err.message;
					if (emsg) {
						switch (emsg) {
							// case "invalid signature":
							// res.status(config.invalidToken.status).send(config.invalidToken);
							// break;
							case "jwt expired":
							res.status(emessage.wrongToken.status).send(emessage.wrongToken);
							break;
							default:
							res.status(emessage.invalidToken.status).send(emessage.invalidToken)
						}
					} else {
						req.user = decoded;
						next();
					}
				});
		}



}
