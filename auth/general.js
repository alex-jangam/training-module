
var config = require("../config"), emsg = require("../emessages"), utils = require("../plugins/utils");
module.exports = function (req, res, next) {
		var user = req.user, urlroles = req.path.concat(":").concat(req.method), newProm = utils.getpromise(), roles = config.authorizedroles[urlroles];
		// console.log(user.role, roles);
		if (user.role === config.super) {
				newProm.post();
		} else if (roles.includes(user.role)) {
				newProm.post();
		} else {
				newProm.error(emsg.unauthorized)
		}
		return newProm.prom;
}
