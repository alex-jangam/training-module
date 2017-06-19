/*globals require, module, console, exports */

var express = require('express'),
    app = express(),
    assert = require('assert'),
    config = require("./config");
    url = 'mongodb://localhost:27017/ux',
    logger = require("./plugins/logger"),
    dao = require("./modules/dao"),
    jwt = require('jsonwebtoken');


    logger.enableHosts(config.local);
// var url1 = 'mongodb://localhost:27017/storage';

app.use(require("body-parser").json());
require("./controller/setters")(app, express);

app.use(require("./auth/authenticate"));
require("./controller/users")(app, dao, config);
require("./controller/category")(app, dao, config);
require("./controller/courses")(app, dao, config);


app.listen(4000, function () {
    console.log('app listening on port 4000...');
});
module.exports = app;
