
var config = require("../config"), emsg = require("../emessages"), common = require("./general");
module.exports = function (req, res, next) {
		common(req, res, next).then(function () {
				next();
		}).error(function (err) {
				res.status(err.status).send(err)
		});
}
