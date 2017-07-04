/*globals require, module, console, exports */
/*jslint node: true, nomen: true, unparam: true */
"use strict";

var emsg = require("../emessages"), utils = require("../plugins/utils"), generic = require("../plugins/common-ops")(emsg, utils);

module.exports = function (dao, config) {
    var suffix = "category";
		/* Supportive functions */

		/* Supportive functions end */
		function add(req, res, next) {
			var code, num = 0, data = req.body, post = {},  isSuper = (req.user.role === config.super);
			if (generic.checkFields(data, "name")) {
				dao.category.getLast().
				then(function (err, resp) {
					if (err) {
						generic.gCall(err, resp, res);
						return;
					}
					if (resp) {
						num = parseInt(resp.code.split("-")[1], 10) + 1;
					}
					code = suffix + "-" + num;
					//Super admin default approved
					dao.category.add(data.name, code, (data.suffix || data.name).toLowerCase(), req.user.username, isSuper).then(function (err2, data) {
						generic.gCall(err2, data, res);
					});
				})
			} else {
				res.status(emsg.invalidData.status).send(emsg.invalidData);
			}
		}


		function getAll(req, res, next) {
      var user = req.user,  isSuper = (user.role === config.super);
			dao.category.getAll(user.username, isSuper).
			then(function (err, data) {
        var dta = utils.clone(data), counts = {};
        if (err) {
          generic.gCall(err, data, res)
        } else {
          dao.category.getAllCourseCount().then(function (err3, cnts) {
              for (var i = 0; i < cnts.length; i++) {
                counts[cnts[i]._id] = cnts[i].total
              }
              for (var i = 0; i < dta.all.length; i++) {
                var fld = dta.all[i];
                dta.all[i].count  = counts[fld.code];
              }
              generic.gCall(err3, dta, res);
          })
        }
			})
		}

    function approve(req, res, next) {
			var data = req.body;
			if (generic.checkFields(data, "code")) {
        dao.category.update(data.code, {user: "", approved : true}).then(function (err2, data) {
          generic.gCall(err2, data, res);
        });
			} else {
				res.status(emsg.invalidData.status).send(emsg.invalidData);
			}
		}

    function update(req, res, next) {
      var data = req.body, user = req.user, isSuper = (user.role === config.super);
      if (generic.checkFields(data, "code", "name")) {
        dao.category.getOne(data.code).then(function (erm, catogory) {
            if((isSuper && catogory.approved) || (!isSuper && !catogory.approved && catogory.user === user.username)) {
              dao.category.update(data.code, {name : data.name}).then(function (err1, data1) {
                generic.gCall(err1, data1, res);
              });
            } else {
              res.status(emsg.unauthorized.status).send(emsg.unauthorized);
            }
        })
      } else {
        res.status(emsg.invalidData.status).send(emsg.invalidData);
      }
    }

    function remove(req, res, next) {
      var data = req.body;
      if (generic.checkFields(data, "code")) {
        dao.category.remove(data.code).then(function (err1, data1) {
          generic.gCall(err1, data1, res);
        });
      } else {
        res.status(emsg.invalidData.status).send(emsg.invalidData);
      }
    }

		return {
			add : add,
			getAll : getAll,
      approve: approve,
      update : update,
      remove: remove,
		}
}
