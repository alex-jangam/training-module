/*globals require, module, console, exports */
/*jslint node: true, nomen: true, unparam: true */
//Topic is Sub Course.

var emsg = require("../emessages"), utils = require("../plugins/utils"), generic = require("../plugins/common-ops")(emsg, utils);

module.exports = function (dao, config) {
		/* Supportive functions */
		var suffix = "topic";

		function validateTopic(req, res, next) {
			var data = req.body, params = req.params, alldata = Object.assign({}, params, data), user = req.user, isSuper = (user.role === config.super), uName = isSuper? "" : user.username;
			if (generic.checkFields(alldata, "topic")) {
				dao.topics.getTopicOptUser(alldata.topic, uName).then(function (err, resp) {
					if (err) {
						generic.gCall(err, resp, res);
					} else if (!resp) {
						res.status(emsg.invalidData.status).send(emsg.invalidData);
					} else {
						req.topicData = resp;
						req.params.course = resp.course;
						next();
					}
				})
			} else {
				res.status(emsg.invalidData.status).send(emsg.invalidData);
			}
		}

		function getOneCourse(req, res, next) {
			var user = req.user, isSuper = (user.role === config.super), data = req.body, params = req.params, alldata = Object.assign({}, params, data), uName = isSuper? "" : user.username;
			if (generic.checkFields(alldata, "course")) {
				dao.courses.getCourseCodeName(alldata.course, uName).then(function (err, resp) {
					if (err) {
						generic.gCall(err, resp, res);
					} else if (!resp) {
						res.status(emsg.unauthorized.status).send(emsg.unauthorized)
					} else {
						req.courseData = resp;
						next();
					}
				});
			} else {
				res.status(emsg.invalidData.status).send(emsg.invalidData);
			}
		}

		function getCourse(req, res, next) {
			var user = req.user, isSuper = (user.role === config.super), uName = isSuper ? "" : user.username, data = req.body, params = req.params, alldata = Object.assign({}, params, data);
			if (generic.checkFields(alldata, "course")) {
				dao.courses.getCourseCodeNameOrApproved(alldata.course, uName).then(function (err, resp) {
					if (err) {
						generic.gCall(err, resp, res);
					} else if (!resp) {
						// console.log("invalid course", alldata);
						res.status(emsg.invalidData.status).send(emsg.invalidData)
					} else {
						req.courseData = resp;
						next();
					}
				});
			} else {
				// console.log("invalid course", params, data);
				res.status(emsg.invalidData.status).send(emsg.invalidData);
			}
		}

		function validateDuplicate(req, res, next) {
			var data = req.body;
			if (generic.checkFields(data, "name")) {
				dao.topics.getName(data.name).then(function (err, resp) {
				if (resp) {
					req.duplicate = true,
					req.topicData = resp;
					req.course = resp.course;
				}
				next();
				})
			} else {
					res.status(emsg.invalidData.status).send(emsg.invalidData);
			}

		}
		/* Supportive functions end */

		function add(req, res, next) {
				var code, num = 0, data = req.body, post = {}, user = req.user, isSuper = (user.role === config.super), role = config.admin, uName = user.username, course = req.courseData || {};
				if (req.duplicate) {
					res.status(emsg.duplicateData.status).send(emsg.duplicateData);
				} else	if (generic.checkFields(data, "name", "course")) {
						dao.topics.getLast().
						then(function (err, resp) {
								if (err) {
										generic.gCall(err, resp, res);
								} else {
									if (resp) {
										num = parseInt(resp.code.split("-")[1], 10) + 1;
									}
									code = suffix + "-" + num;
									dao.topics.add(data.name, code, course.name, course.code, (data.suffix || data.name).toLowerCase()).then(function (err2, resp2) {
										generic.gCall(err2, resp2, res);
									})
								}
						});
				} else {
						res.status(emsg.invalidData.status).send(emsg.invalidData);
				}
		}

		function startTopic(req, res, next) {
			var course = req.courseData, topic = req.topicData, user = req.user, isSuper = (user.role === config.super), uName = isSuper? "" : user.username;
			if (course.user != uName) {
				res.status(emsg.notEnrolled.status).send(emsg.notEnrolled);
			} else if (config.topicstates.includes(topic.status)) {
				res.status(emsg.inprogress.status).send(emsg.inprogress);
			} else {
				dao.topics.add(topic.name, topic.code, topic.coursename, topic.course, topic.suffix, course.user, course.role, config.topicstates[0]).then(function (err, resp) {
					generic.gCall(err, resp, res);
				});
			}
		}

		function getQCount(req, res, next) {
				var course = req.params.course, qCounts = {};
				dao.topics.getQuestionsCount(course).then(function (err, resp) {
					var counts = resp || [];
					for (var i = 0; i < counts.length; i++) {
						qCounts[counts[i]._id] = counts[i].total;
					}
					next();
				})
		}

		function getAll(req, res, next) {
				var user = req.user, isSuper = (user.role === config.super), uName = user.username, params = req.params, course = req.courseData || {};
				if (isSuper) {
					uName = "";
				}
				if (generic.checkFields(params, "course")) {
					dao.topics.getAll(params.course, uName, params.page, params.count).
					then(function (err, data) {
						var udata = {role :  course.role || config.user}, nData = data;
						if (data.length == 0) {
							nData = {all :  []}
						}
						nData.data = udata;
						generic.gCall(err, nData, res);
					}).error(function (err) {
						console.log(err);
					});
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
      if (generic.checkFields(data, "topic")) {
        dao.topics.remove(data.topic).then(function (err1, data1) {
          generic.gCall(err1, data1, res);
        });
      } else {
        res.status(emsg.invalidData.status).send(emsg.invalidData);
      }
    }

		function removeMany(req, res, next) {
      var data = req.body;
      if (generic.checkFields(data, "topic")) {
        dao.courses.removeMany(data.topic).then(function (err1, data1) {
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
				verifyTopic: validateTopic,
				verifyAdminCourse : getOneCourse,
				verifyCourse : getCourse,
				count : getQCount,
				approve : approve,
				getAll : getAll,
				registered : registered,
				remove: remove,
				removeMany: removeMany,
				enroll: enrollRequest,
				enrolled: enrolledAll,
				adminRequest : adminRequest,
				removeAll : removeMany,
				check : validateDuplicate,
				startTopic : startTopic
		}

}
