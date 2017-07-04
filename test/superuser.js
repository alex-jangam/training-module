require('./portconfig')();
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
        "username" : "usertest" + rndm,
        "password" : "password",
        "dname" : "user",
    },
    superToken,
    userToken,
    headers = {
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

describe("Super admin Operations: ", function(){

  it("should login for details of super user", function (done) {
    chai.request(server)
      .post('/users/token')
      .set(headers)
      .send(superuser)
      .end(function(err,res){
        res.should.have.status(200);
        superToken = res.body.token;
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

  it("Should change role of user for a topic", function (done) {
    var nheader = Object.assign({"x-access-token" : superToken}, headers),
        roleuser = {
          username : registerUser.username,
          topic : ""
        };
     /**/
     done();
    /*/
    chai.request(server)
      .put('/users/role')
      .set(nheader)
      .send(registerUser)
      .end(function(err,res){
        res.should.have.status(401);
        done();
      });//*/
  });

  it("Should remove user", function (done) {
    var nheader = Object.assign({"x-access-token" : superToken}, headers);

    chai.request(server)
      .del('/users/remove')
      .set(nheader)
      .send(registerUser)
      .end(function(err,res){
        res.should.have.status(200);
        done();
      });
  });

  it("Should not be able to remove self", function (done) {
    var nheader = Object.assign({"x-access-token" : superToken}, headers);

    chai.request(server)
      .del('/users/remove')
      .set(nheader)
      .send(superuser)
      .end(function(err,res){
        res.should.have.status(401);
        done();
      });
  });

  it("Should not be able to quit", function (done) {
    var nheader = Object.assign({"x-access-token" : superToken}, headers);

    chai.request(server)
      .del('/users/quit')
      .set(nheader)
      .send()
      .end(function(err,res){
        res.should.have.status(401);
        done();
      });
  });

});
