var dao = require("./dao");
module.exports = function() {

    function getCustomers(req,res,next) {
       var body = req.body;
       dao.getCollection( function (err, items) {
           var userlist = [];
           for (var i = 0; i < items.length; i++) {
               userlist.push(items[i].username);
           }
           res.send(userlist)
      });

    }

    return {
        getCustomers : getCustomers
    }
}
