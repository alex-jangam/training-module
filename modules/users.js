/*globals require, module, console, exports */
/*jslint node: true, nomen: true, unparam: true */
"use strict";

var jwt = require('jsonwebtoken'), emsg = require("../emessages"), utils = require("../plugins/utils"), generic = require("../plugins/common-ops")(emsg, utils);

module.exports = function(dao, config) {

    function verify(req, res, next) {
        var user = req.body || {};
        if (generic.checkFields(user, "username", "password")) {
            dao.user.getbyCred(user.username, user.password).
            then(function (err, data) {
              if (err || !data) {
                res.status(emsg.invalidCred.status).send(emsg.invalidCred);
              } else {
                req.user = utils.clone(data);
                next();
              }
            })
        } else {
            res.status(emsg.invalidData.status).send(emsg.invalidData)
        }
    }

    function generate(req, res, next) {
        var user = req.user || {}, token = jwt.sign(user, config.secret, config.session), userOb = { user: user, token : token};
        generic.gCall(null, userOb, res);
    }

    function addself(req, res, next) {
        var user = req.body;
        if (generic.checkFields(user, "username", "password", "dname")) {
          dao.user.add(user.username, user.password, user.dname).
          then(function (err, data) {
            if (err) {
              generic.gCall(err, null, res);
            } else {
              req.user = utils.clone(data);
              next();
            }
          })
        } else {
            res.status(emsg.invalidData.status).send(emsg.invalidData)
        }
    }

    function getusers(req, res) {
        var params = req.params, page = params.page, count = params.count;
        dao.user.getUsers(page, count).
        then(function (err, data) {
            generic.gCall(err, data, res);
        })
    }

    function remove(req, res, next) {
        var duser = req.body, user = req.user;
        if (generic.checkFields(duser, "username") && user.username === duser.username) {
            res.status(emsg.unauthorized.status).send(emsg.unauthorized);
        } else if (generic.checkFields(duser, "username")) {
          dao.user.remove(duser.username).
          then(function (err, data) {
            generic.gCall(err, data, res);
          });
        } else {
            res.status(emsg.invalidData.status).send(emsg.invalidData)
        }
    }

    function removeSelf(req, res, next) {
        var user = req.user, isSuper = (user.role === config.super);
        if (isSuper) {
            res.status(emsg.unauthorized.status).send(emsg.unauthorized);
        } else {
            dao.user.remove(user.username).
            then(function (err, data) {
                generic.gCall(err, data, res);
            });
        }
    }

    function changePswd(req, res, next) {
        var user = req.user, data = req.body || {};
        if (generic.checkFields(data, "password", "newpassword")) {
            dao.user.updatePswd(user.username, data.password, data.newpassword).
            then(function (err, data) {
                generic.gCall(err, data, res);
            });
        } else {
            res.status(emsg.invalidData.status).send(emsg.invalidData)
        }
    }


    return {
        verify : verify,
        generate : generate,
        addself : addself,
        getusers : getusers,
        removeself : removeSelf,
        remove : remove,
        change: changePswd
    }
}
