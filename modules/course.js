/*globals require, module, console, exports */
/*jslint node: true, nomen: true, unparam: true */


var emsg = require("../emessages"), utils = require("../plugins/utils"), generic = require("../plugins/common-ops")(emsg, utils);

module.exports = function (dao, config) {
		/* Supportive functions */
		var suffix = "course";


		/* Supportive functions end */
		function add(req, res, next) {
				var code, num = 0, data = req.body, post = {}, user = req.user, isSuper = (user.role === config.super), role = config.admin, uName = user.username;
				function addCourse(data, uName, role, isSuper) {
					dao.courses.getCourse(data.name).then(function (err, resp) {
							if(resp) {
									res.status(emsg.duplicateData.status).send(emsg.duplicateData);
							} else {
									dao.courses.add(data.name, code, data.category, (data.suffix || data.name).toLowerCase(), uName, role, isSuper).
									then(function (err2, data) {
										generic.gCall(err2, data, res);
									});
							}
					})
				}
				if (generic.checkFields(data, "name", "category")) {
						dao.courses.getLast().
						then(function (err, resp) {
								if (err) {
										generic.gCall(err, resp, res);
								} else {
									if (resp) {
										num = parseInt(resp.code.split("-")[1], 10) + 1;
									}
									code = suffix + "-" + num;
									//Super admin default approved : name, code, category, suffix, user, role, approved
									if (isSuper) {
										uName = ""; role = "";
									}
									addCourse(data, uName, role, isSuper);
								}
						});
				} else {
						res.status(emsg.invalidData.status).send(emsg.invalidData);
				}
		}

		function getAll(req, res, next) {
				var user = req.user, isSuper = (user.role === config.super), uName = user.username, params = req.params;
				if (generic.checkFields(params, "category")) {
					if (isSuper) {
						dao.courses.getByCategory(params.category).
						then(function (err, data) {
							generic.gCall(err, data, res)
						});
					} else {
						dao.courses.getAll(params.category, uName, params.page, params.count).
						then(function (err, data) {
							generic.gCall(err, data, res)
						});
					}
				} else {
					res.status(emsg.invalidData.status).send(emsg.invalidData);
				}
		}

		function enrolledAll(req, res, next) {
			var user = req.user, isSuper = (user.role === config.super), uName = user.username, params = req.params;
			if (isSuper) {
					uName = undefined;
					dao.courses.getByCategory().
					then(function (err, data) {
						generic.gCall(err, data, res)
					});
			} else {
				dao.courses.getEnrolled(uName, params.page, params.count).
				then(function (err, data) {
					generic.gCall(err, data, res)
				});
			}
		}
		//Approve is only for super admin.
		function approve(req, res, next) {
				var data = req.body, user = data.user, course = data.course;
				if (generic.checkFields(data, "user", "course")) {
						dao.courses.approve(user, course).
						then(function (err, resp) {
								var blank = utils.clone(resp);
								if (err || !resp) {
										return generic.gCall(err, resp, res);
								}
								dao.courses.add(resp.name, resp.code, resp.category, resp.suffix, "", "", true, resp.created).
								then(function (err2, resp2) {
										generic.gCall(err2, resp2, res);
								});
						})
				} else {
					res.status(emsg.invalidData.status).send(emsg.invalidData);
				}
		}

		function remove(req, res, next) {
      var data = req.body;
      if (generic.checkFields(data, "code")) {
        dao.courses.remove(data.code).then(function (err1, data1) {
          generic.gCall(err1, data1, res);
        });
      } else {
        res.status(emsg.invalidData.status).send(emsg.invalidData);
      }
    }

		function removeMany(req, res, next) {
      var data = req.body;
      if (generic.checkFields(data, "code")) {
        dao.courses.removeMany(data.code).then(function (err1, data1) {
          generic.gCall(err1, data1, res);
        });
      } else {
        res.status(emsg.invalidData.status).send(emsg.invalidData);
      }
    }

		function registered(req, res, next) {
				res.send()
		}

		function adminRequest(req, res, next) {
			var data = req.params, user = req.user;
			if (generic.checkFields(data, "code")) {
				dao.courses.getCourseCodeName(data.code, user.username).then(function (err, resp) {
					if (err) {
						generic.gCall(err, resp, res);
					} else if (!resp) {
						res.status(emsg.invalidData.status).send(emsg.invalidData)
					} else {
						dao.courses.approveAdmin(user.name, resp.code).
						then(function (err2, resp2) {
							generic.gCall(err2, resp2, res);
						});
					}
				});
			} else {
				res.status(emsg.invalidData.status).send(emsg.invalidData);
			}
		}

		function enrollRequest(req, res, next) {
			var data = req.params, user = req.user;
			if (generic.checkFields(data, "code")) {
				dao.courses.getCourseCodeName(data.code, "").then(function (err, resp) {
					if (err) {
						generic.gCall(err, resp, res);
					} else if (!resp) {
						res.status(emsg.invalidData.status).send(emsg.invalidData)
					} else {
						dao.courses.add(resp.name, resp.code, resp.category, resp.suffix, user.username, config.user, true).
						then(function (err2, resp2) {
							generic.gCall(err2, resp2, res);
						});
					}
				});
			} else {
				res.status(emsg.invalidData.status).send(emsg.invalidData);
			}
		}

		return {
				add : add,
				approve : approve,
				getAll : getAll,
				registered : registered,
				remove: remove,
				removeMany: removeMany,
				enroll: enrollRequest,
				enrolled: enrolledAll,
				adminRequest : adminRequest
		}

}
