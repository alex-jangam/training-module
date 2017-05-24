var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var constants = require("../config")
var utils = require("../plugins/utils");
chai.use(chaiHttp);

var rndm = utils.random(5),
    superuser = {
      "username": "superadmin@training.com",
      "password": "password",
    },
    registerUser = {
        "username" : "usertest",
        "password" : "password",
        "dname" : "user" + rndm,
    },
    superToken,
    userToken,
    header = {
      "content-type":"application/json"
    };

/**
  * Operations involve
  * 1. Login as super admin
  * 2. Register a user
  * 3. Login as user
  * 4. Get list of users as superadmin.
  * 5. Get list of users as admin shall fail
  * 6. Delete the user, and data from courses, topics, answers.
  *
**/

/*superToken
* 6. Register the user to a course.
* 7. User shall get list of all courses, with registered firt.
* 8. Request for admin permissions.
* 9. Reject request for admin permissions
* 10. Request for admin permission again
* 11. Accept request.

*/

describe("User login as super admin", function(){

  it("should login for details of super user", function (done) {
    chai.request(server)
      .post('/users/token')
      .send(superuser)
      .end(function(err,res){
        superToken = res.body.token;
        res.should.have.status(200);
        done();
      });
  });

  it("should register the user", function (done) {
    chai.request(server)
      .post('/users/register')
      .send(registerUser)
      .end(function(err,res){
        userToken = res.body.token;
        res.should.have.status(200);
        done();
      });
  });

  it("User should not be able to login with user invalid credentials", function (done) {
    var invalid = utils.clone(registerUser);
    invalid.password = "invalid";
    chai.request(server)
      .post('/users/token')
      .send(registerUser)
      .end(function(err,res){
        res.should.have.status(406);
        done();
      });
  });

  it("User should be able to login with user credentials", function (done) {
    chai.request(server)
      .post('/users/token')
      .send(registerUser)
      .end(function(err,res){
        userToken = res.body.token;
        res.should.have.status(200);
        done();
      });
  });

  it("User should be able to login with user credentials", function (done) {
    chai.request(server)
      .post('/users/token')
      .send(registerUser)
      .end(function(err,res){
        userToken = res.body.token;
        res.should.have.status(200);
        done();
      });
  });

  it("Should get the list of users as super user", function (done) {
    var nheader = Object.assign({"x-access-token" : superToken}, headers);
    chai.request(server)
      .get('/users')
      .set(nheader)
      .end(function(err,res){
        res.should.have.status(200);
        done();
      });
  });

  it("Should get unauthorized for wrong token for superadmin", function (done) {
    var nheader = Object.assign({"x-access-token" : (superToken + "1")}, headers);

    chai.request(server)
      .get('/users')
      .set(nheader)
      .end(function(err,res){
        res.should.have.status(401);
        done();
      });
  });

  it("Should not get the list of users as user", function (done) {
    var nheader = Object.assign({"x-access-token" : userToken}, headers);

    chai.request(server)
      .get('/users')
      .set(nheader)
      .end(function(err,res){
        res.should.have.status(401);
        done();
      });
  });



});
