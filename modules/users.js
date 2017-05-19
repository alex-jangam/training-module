/*globals require, module, console, exports */

var jwt = require('jsonwebtoken'), emsg = require("../emessages"), utils = require("../plugins/utils");

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

    function getCustomers(req,res,next) {
       var body = req.body;
       dao.getCollection( function (err, items) {
           var userlist = [];
           for (var i = 0; i < items.length; i++) {
               userlist.push(items[i].username);
           }
           res.send(userlist);
      });

    }

    function verify(req, res, next) {
        var user = req.body || {};
        if (user && user.username && user.password) {
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
        if (user && user.username && user.password && user.dname) {
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

    return {
        verify : verify,
        generate : generate,
        addself : addself,
        getusers : getusers
    }
}
