var userconnect = require("../schema/users")();
console.log("userconnect",userconnect);
module.exports.getCollection = function (cb) {
    userconnect.findCollections(cb)
}
