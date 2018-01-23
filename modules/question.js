/*globals require, module, console, exports */
/*jslint node: true, nomen: true, unparam: true */
//Questions

var emsg = require("../emessages"), utils = require("../plugins/utils"), generic = require("../plugins/common-ops")(emsg, utils);

module.exports = function (dao, config) {
		/* Supportive functions */
		var suffix = "question";

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
						req.course = resp.course;
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
						res.status(emsg.invalidData.status).send(emsg.invalidData)
					} else {
						req.courseData = resp;
						next();
					}
				});
			} else {
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
				var code, num = 0, data = req.body, post = {}, user = req.user, isSuper = (user.role === config.super), role = config.admin, uName = user.username, topic = req.topicData || {}, course = req.courseData;

				if (!isSuper &&  (course.user !== uName || course.role != config.admin)) {
					res.status(emsg.unauthorized.status).send(emsg.unauthorized);
				} else if (generic.checkFields(data, "question", "topic")) {
						dao.questions.getLast().
						then(function (err, resp) {
								if (err) {
										generic.gCall(err, resp, res);
								} else {
									if (resp) {
										num = parseInt(resp.code.split("-")[1], 10) + 1;
									}
									code = suffix + "-" + num;
									dao.questions.add(data.question, topic.code, course.code, code, data.priority, data.guides).then(function (err2, resp2) {
										generic.gCall(err2, resp2, res);
									});
								}
						});
				} else {
						res.status(emsg.invalidData.status).send(emsg.invalidData);
				}
		}

		function getAll(req, res, next) {
				var user = req.user, isSuper = (user.role === config.super), uName = user.username, params = req.params, topic = req.topicData, course = req.course, courseData = req.courseData;
				if (isSuper) {
					uName = "";
				}
				if (uName != topic.user && courseData.role != config.admin) {
					res.status(emsg.unauthorized.status).send(emsg.unauthorized);
				} else if (generic.checkFields(params, "topic")) {
					dao.questions.getAll(params.topic, params.page, params.count).
					then(function (err, data) {
						generic.gCall(err, data, res)
					}).error(function (err) {
						console.log(err);
					});
				} else {
					res.status(emsg.invalidData.status).send(emsg.invalidData);
				}
		}

		function edit() {

		}

		function remove(req, res, next) {
      var data = req.body;
      if (generic.checkFields(data, "question")) {
        dao.questions.remove(data.question).then(function (err1, data1) {
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


		return {
				add : add,
				edit : edit,
				verifyTopic: validateTopic,
				verifyAdminCourse : getOneCourse,
				verifyCourse : getCourse,
				getAll : getAll,
				remove: remove,
				removeMany: removeMany,
				check : validateDuplicate,
		}

}
