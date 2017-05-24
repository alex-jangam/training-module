/*globals require, module, console, exports */
/*jslint node: true, nomen: true, unparam: true */


var emsg = require("../emessages"), utils = require("../plugins/utils"), generic = require("../plugins/common-ops")(emsg, utils);

module.exports = function (dao, config) {
		/* Supportive functions */
		var suffix = "course";

		/* Supportive functions end */
		function add(req, res, next) {
				var code, num = 0, data = req.body, post = {}, user = req.user, isSuper = (user.role === config.super), role = config.admin, uName = user.username;
				if (generic.checkFields(data, "name", "category")) {
						dao.courses.getLast().
						then(function (err, resp) {
								if (err) {
										generic.gCall(err, resp, res);
										return;
								}
								if (resp) {
										num = parseInt(resp.code.split("-")[1], 10) + 1;
								}
								code = suffix + "-" + num;
								//Super admin default approved : name, code, category, suffix, user, role, approved
								if (isSuper) {
										uName = ""; role = "";
								}
								dao.courses.add(data.name, code, data.category, (data.suffix || data.name).toLowerCase(), uName, role, isSuper).
								then(function (err2, data) {
									generic.gCall(err2, data, res);
								});
						});
				} else {
						res.status(emsg.invalidData.status).send(emsg.invalidData);
				}
		}

		// dao.category.getAllTopicsCount().then(function (err3, cnts) {
		// 	console.log(err3, cnts);
		// });

		function getAll(req, res, next) {
				var user = req.user, isSuper = (user.role === config.super), uName = user.username, params = req.params;
				if (isSuper) {
						uName = "";
				}
				if (generic.checkFields(data, "category")) {
						dao.courses.getAll(category, uName, params.page, params.count).
						then(function (err, data) {
							generic.gCall(err, data, res)
						});
				} else {
						res.status(emsg.invalidData.status).send(emsg.invalidData);
				}
		}

		//Approve is only for super admin.
		function approve(req, res, next) {
				var data = req.body, user = data.user, course = data.course;
				dao.courses.approve(user, course).
				then(function (err, resp) {
						var blank = utils.clone(resp);
						if (err || !resp) {
							return generic.gCall(err, resp, res);
						}
						dao.courses.add(resp.name, resp.code, resp.category, resp.suffix, "", "", true).
						then(function (err2, resp2) {
								generic.gCall(err2, resp2, res);
						});
				})
		}

		function registered(req, res, next) {
				res.send()
		}

		return {
				add : add,
				approve : approve,
				getAll : getAll,
				registered : registered
		}

}
