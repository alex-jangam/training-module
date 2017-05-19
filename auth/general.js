
var config = require("../config"), emsg = require("../emessages"), utils = require("../plugins/utils");
module.exports = function (req, res, next) {
		var user = req.user, urlroles = req.path.concat(":").concat(req.method), newProm = utils.getpromise();
		if (user.role === config.super) {
				newProm.post();
		} else if (urlroles.includes(user.role)) {
				newProm.post();
		} else {
				newProm.error(emsg.unauthorized)
		}
		return newProm.prom;
}
