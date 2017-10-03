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
    user = {
      "password": "password",
      "username": "usertest@training.com"
    }, user2 = {
      "password": "password",
      "username": "testuser@training.com"
    },npv = 1,
    superToken,
    userToken,user2Token,
    header = {
      "content-type":"application/json"
    }, newUserCatogory = "catogory-" + utils.random(3), newUserCatogoryCode, newSUserCatogory = "catogory-" + utils.random(3), newSUserCatogoryCode;

/**
  * user login
  * Add catogory by user
  * Add catogory by superadmin
  * No duplicate catogory
  * Users can get all approved categories including self created
  * Users can edit category before approval
  * After approval, superadmin can modify the category
  * User cannot delete category
  * Superadmin can delete category

*/


describe("Catogory Operations", function(){


  it("User should be able to login", function (done) {
    chai.request(server)
      .post('/users/token')
      .send(user)
      .end(function(err,res){
        user = utils.clone(res.body)
        res.should.have.status(200);
        done();
      });
  })
  it("User2 should be able to login", function (done) {
    chai.request(server)
      .post('/users/token')
      .send(user2)
      .end(function(err,res){
        user2 = utils.clone(res.body)
        res.should.have.status(200);
        done();
      });
  })
  it("Super user should be able to login", function (done) {
    chai.request(server)
      .post('/users/token')
      .set(header)
      .send(superuser)
      .end(function(err,res){

        superuser = utils.clone(res.body)
        res.should.have.status(200);
        done();
      });
  })

  it("User should be able to add catogory", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    chai.request(server)
      .post('/category')
      .set(nheader)
      .send({name : newUserCatogory})
      .end(function(err,res){
        newUserCatogoryCode = res.body.code;
        res.should.have.status(200);
        done();
      });
  })

  it("Super user should be able to add catogory", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    chai.request(server)
      .post('/category')
      .set(nheader)
      .send({name : newSUserCatogory})
      .end(function(err,res){
        newSUserCatogoryCode = res.body.code;
        res.should.have.status(200);
        done();
      });
  })

  it("Super user should not be able to add duplicate catogory", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    chai.request(server)
      .post('/category')
      .set(nheader)
      .send({name : newUserCatogory})
      .end(function(err,res){
        res.should.have.status(409);
        done();
      });
  })

  it("User should be able get All catogories including his created", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header), userCat = false;
    chai.request(server)
      .get('/category')
      .set(nheader)
      .end(function(err,res){
        for (var i = 0; i < res.body.all.length; i++) {
          if (res.body.all[i].name === newUserCatogory) {
            userCat = true;
          }
        }
        if (userCat)
        res.should.have.status(200);
        else
        res.should.have.status(504);
        done();
      });
  })

  it("User2 should be able get All catogories excluding user1 created", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header), userCat = true;
    chai.request(server)
      .get('/category')
      .set(nheader)
      .end(function(err,res){
        for (var i = 0; i < res.body.all.length; i++) {
          if (res.body.all[i].name === newUserCatogory) {
            userCat = false;
          }
        }
        if (userCat)
        res.should.have.status(200);
        else
        res.should.have.status(504);
        done();
      });
  })

  it("Super user should be able get All catogories including all user created", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header), userCat = false;
    chai.request(server)
      .get('/category')
      .set(nheader)
      .end(function(err,res){
        for (var i = 0; i < res.body.all.length; i++) {
          if (res.body.all[i].name === newUserCatogory) {
            userCat = true;
          }
        }
        if (userCat)
        res.should.have.status(200);
        else
        res.should.have.status(504);
        done();
      });
  })

  it("User should be able to update Catogory name before approvals", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header), userCat = false;
    chai.request(server)
      .put('/category')
      .set(nheader)
      .send({code : newUserCatogoryCode, name: newUserCatogory})
      .end(function(err,res){
        res.should.have.status(200);
        done();
      });
  })

  it("Super user should not be able to update Catogory name before approvals", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header), userCat = false;
    chai.request(server)
      .put('/category')
      .set(nheader)
      .send({code : newUserCatogoryCode, name: newUserCatogory})
      .end(function(err,res){
        res.should.have.status(401);
        done();
      });
  })

  it("Super user should be able approve User created", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header), userCat = false;
    chai.request(server)
      .put('/category/approve')
      .set(nheader)
      .send({code : newUserCatogoryCode})
      .end(function(err,res){
        if (res.body.approved) {
          res.should.have.status(200);
        } else {
          res.should.have.status(504);
        }
        done();
      });
  })

  it("User2 should be able get All catogories including user1 created after approval", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header), userCat = false;
    chai.request(server)
      .get('/category')
      .set(nheader)
      .end(function(err,res){
        for (var i = 0; i < res.body.all.length; i++) {
          if (res.body.all[i].name === newUserCatogory) {
            userCat = true;
          }
        }
        if (userCat)
        res.should.have.status(200);
        else
        res.should.have.status(504);
        done();
      });
  })

  it("User should not be able to update Catogory name after approvals", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header), userCat = false;
    chai.request(server)
      .put('/category')
      .set(nheader)
      .send({code : newUserCatogoryCode, name: newUserCatogory})
      .end(function(err,res){
        res.should.have.status(401);
        done();
      });
  })

  it("Super user should be able to update Catogory name after approvals", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header), userCat = false;
    chai.request(server)
      .put('/category')
      .set(nheader)
      .send({code : newUserCatogoryCode, name: newUserCatogory})
      .end(function(err,res){
        res.should.have.status(200);
        done();
      });
  })

  it("User should not be able to delete Catogory created by user", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header), userCat = false;
    chai.request(server)
      .delete('/category')
      .set(nheader)
      .send({code : newUserCatogoryCode})
      .end(function(err,res){

        res.should.have.status(401);
        done();
      });
  })

  it("User should not be able to delete Catogory created by Super user", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header), userCat = false;
    chai.request(server)
      .delete('/category')
      .set(nheader)
      .send({code : newUserCatogoryCode})
      .end(function(err,res){

        res.should.have.status(401);
        done();
      });
  })

  it("Super user should be able to delete Catogory created by super admin", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header), userCat = false;
    chai.request(server)
      .delete('/category')
      .set(nheader)
      .send({code : newSUserCatogoryCode})
      .end(function(err,res){
        res.should.have.status(200);
        done();
      });
  })

  it("Super user should be able to delete Catogory created by user", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header), userCat = false;
    chai.request(server)
      .delete('/category')
      .set(nheader)
      .send({code : newUserCatogoryCode})
      .end(function(err,res){
        res.should.have.status(200);
        done();
      });
  })

});
