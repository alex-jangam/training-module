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
        "dname" : "usertest",
    },npv = 1,
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

describe("User Operations", function(){


  it("should register the user", function (done) {
    chai.request(server)
      .post('/users/register')
      .set(header)
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
      .send(invalid)
      .end(function(err,res){
        res.should.have.status(401);
        done();
      });
  });

  it("User should be able to login with user credentials", function (done) {
    chai.request(server)
      .post('/users/token')
      .set(header)
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



  it("Should get unauthorized for wrong token", function (done) {
    var nheader = Object.assign({"x-access-token" : (userToken + "1")}, header);

    chai.request(server)
      .get('/users')
      .set(nheader)
      .end(function(err,res){
        res.should.have.status(401);
        done();
      });
  });

  it("Should not get the list of users as user", function (done) {
    var nheader = Object.assign({"x-access-token" : userToken}, header);

    chai.request(server)
      .get('/users')
      .set(nheader)
      .end(function(err,res){
        res.should.have.status(401);
        done();
      });
  });

  it("Should be able to change password", function (done) {
     var nheader = Object.assign({"x-access-token" : userToken}, header);
     var nOb = {
       password : registerUser.password,
       newpassword : registerUser.password + npv
     }
     chai.request(server)
       .post('/users/change')
       .set(nheader)
       .send(nOb)
       .end(function(err,res){
         res.should.have.status(200);
         done();
       });
   });

   it("Should not be able to login with old password", function (done) {
     var nheader = Object.assign({"x-access-token" : userToken}, header);
     var nOb = {
       password : registerUser.username,
       newPassword : registerUser.password
     }
     chai.request(server)
       .post('/users/token')
       .send(nOb)
       .end(function(err,res){
         userToken = res.body.token;
         res.should.have.status(406);
         done();
       });
   });

   it("Should be able to login with new password", function (done) {
     var nheader = Object.assign({"x-access-token" : userToken}, header);
     var nOb = {
       username : registerUser.username,
       password : registerUser.password + npv
     }
     chai.request(server)
       .post('/users/token')
       .send(nOb)
       .end(function(err,res){
         userToken = res.body.token;
         registerUser.password = registerUser.password + npv;
         res.should.have.status(200);
         done();
       });
   });

   it("Should be able to remove account", function (done) {
     var nheader = Object.assign({"x-access-token" : userToken}, header);
     chai.request(server)
       .delete('/users/quit')
       .set(nheader)
       .end(function(err,res){
         res.should.have.status(200);
         done();
       });
   });

});
