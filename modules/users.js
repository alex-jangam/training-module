/*globals require, module, console, exports */
/*jslint node: true, nomen: true, unparam: true */
"use strict";

var jwt = require('jsonwebtoken'), emsg = require("../emessages"), utils = require("../plugins/utils"), ops = require("../plugins/common-ops")(emsg, utils);

module.exports = function(dao, config) {

    function gCallback(error, result, response) {
        if(error){
            var obj = emsg.dberror;
            if(error.code == "11000" || error.code == "11001") {
                obj = emsg.duplicateuser
            } else {
                obj.message = error.toString();
            }
            response.status(obj.status).send(obj);
        } else if(!result && result!=0){
            response.status(emsg.noData.status).send(emsg.noData);
        } else {
            var resTmp = utils.clone(result)
            response.send(resTmp);
        }
    }

    function verify(req, res, next) {
        var user = req.body || {};
        if (ops.checkFields(user, "username", "password")) {
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
        res.status(200).send(userOb);
    }

    function addself(req, res, next) {
        var user = req.body;
        if (ops.checkFields(user, "username", "password", "dname")) {
          dao.user.add(user.username, user.password, user.dname).
          then(function (err, data) {
            if (err) {
              gCallback(err, null, res);
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
            gCallback(err, data, res);
        })
    }

    function remove(req, res, next) {
        var duser = req.body, user = req.user;
        if (ops.checkFields(duser, "username") && user.username === duser.username) {
            res.status(emsg.unauthorized.status).send(emsg.unauthorized);
        } else if (ops.checkFields(duser, "username")) {
          dao.user.remove(duser.username).
          then(function (err, data) {
            gCallback(err, data, res);
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
                gCallback(err, data, res);
            });
        }
    }

    function changePswd(req, res, next) {
        var user = req.user, data = req.body || {};
        if (ops.checkFields(data, "password", "newpassword")) {
            dao.user.updatePswd(user.username, data.password, data.newpassword).
            then(function (err, data) {
                gCallback(err, data, res);
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
