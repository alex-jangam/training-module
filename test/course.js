/*globals require, module, console, exports, describe */

require('./portconfig')();
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var constants = require("../config");
var utils = require("../plugins/utils");
chai.use(chaiHttp);

var rndm = utils.random(5), addlog = 0, dellog = 0,
    superuser = {
        "username": "superadmin@training.com",
        "password": "password"
    },
    user = {
        "password": "password",
        "username": "usertest@training.com"
    },
    user2 = {
        "password": "password",
        "username": "testuser@training.com"
    },
    npv = 1,
    superToken,
    userToken,
    user2Token,
    header = {
        "content-type" : "application/json"
    },
    newSUserCatogory = "testcatogory-1-" + utils.random(3),
    newSUserCourse = "testCourse-1-" + utils.random(3),
    newSUserCatogoryCode,
    newSUserCourseCode,
    newUserCatogory = "testcatogory-2-" + utils.random(3),
    newUserCourse = "testCourse-2-" + utils.random(3),
    newUserCatogoryCode,
    newUserCourseCode,
    tempCourseCode;

/** Pre conditions:
  * superuser login
  * user1, user2 login
  * Add catogory1 by superuser
  * Add category2 by user1

  Test conditions:
  * Add course11 by superuser in catogory1
  * Add course20 in catogory2 shall not fail by superuser
  * Add course21 in category2 by user1 before approve
  * User2 shall not see course21
  * superuser shall approve catogory2 (runtime pre condition not a test)
  * Add course22 in category2 by user1 after approve
  * No duplicate course by user/superuser(2 cases)
  * User1 cannot ask admin rights from Superuser for course11 before enroll
  * User1 can enroll to course11 a superuser created course
  * User1 can ask admin rights from Superuser for course11
  * Users can get all courses for viewed catogory
  * User2 shall see course21 user created course
  * User2 can enroll to course21;
  * User cannot delete courses
  * superuser can delete courses created by superuser/admin

  * Post conditions: Delete catogories created for testing.
  *Note: Use TEST category for course functions.
*/


describe("Catogory Operations", function () {

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

  /* Main Test cases for courses.////////////////////////////////////////////////////////* /

  Test conditions:
  /** Add course11 by superuser in catogory1 */
  it("Super user should be able to add course in SA created catogory", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    var newCourse = {
      category : newSUserCatogoryCode,
      name: newSUserCourse
    }
    chai.request(server)
      .post('/courses')
      .set(nheader)
      .send(newCourse)
      .end(function(err,res){
        console.log("added", res.body, res.status, newCourse);
        newSUserCourseCode = res.body.code;
        res.should.have.status(200);
        done();
      });
  })

  /** Add course20 in catogory2 shall not fail by superuser */
  it("Super user should be able to add course in user created catogory", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    var newCourse = {
      category : newSUserCatogoryCode,
      name: newUserCourse
    }
    chai.request(server)
      .post('/courses')
      .set(nheader)
      .send(newCourse)
      .end(function(err,res){
        if (res.status != 200) {
          console.log("adding to fail", res.status, res.body, newCourse);
        }
        tempCourseCode = res.body.code;
        console.log(tempCourseCode)
        res.should.have.status(200);
        done();
      });
  })

  /* Delete Course by super admin as above test is passed */
  it("Super user should be able to delete the course", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);

    chai.request(server)
      .delete('/courses/all')
      .set(nheader)
      .send({course : tempCourseCode})
      .end(function(err,res){
        if (res.status != 200) {
          console.log("Delete", tempCourseCode, JSON.stringify(res.body));
        }
        res.should.have.status(200);
        done();
      });
  })


  /** Add course21 in category2 by user1 before approve */
  it("user should be able to add course in user created catogory", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    var newCourse = {
      category : newUserCatogoryCode,
      name: newUserCourse
    }
    chai.request(server)
      .post('/courses')
      .set(nheader)
      .send(newCourse)
      .end(function(err,res){
        if (res.status != 200) {
          console.log("added ", res.body, newCourse);
        }
        tempCourseCode = res.body.code;
        res.should.have.status(200);
        done();
      });
  })
  /* Delete Course by super admin as above test is passed */
  it("Super user should be able to delete the course", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    chai.request(server)
      .delete('/courses/all')
      .set(nheader)
      .send({course : tempCourseCode})
      .end(function(err,res){
        if (res.status != 200) {
          console.log("Delete", tempCourseCode, JSON.stringify(res.body));
        }
        res.should.have.status(200);
        done();
      });
  })
  /** User2 shall not see course21 - Invalid scenario*/

  /** superuser shall approve catogory2 (runtime pre condition not a test) */
  it("Super user should be able approve User created category", function (done) {
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
  });
  /** Add course22 in category2 by user1 after approve */
  it("user should be able to add course in approved catogory", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    var newCourse = {
      category : newUserCatogoryCode,
      name: newUserCourse
    }
    chai.request(server)
      .post('/courses')
      .set(nheader)
      .send(newCourse)
      .end(function(err,res){
        if (res.status != 200) {
          console.log("adding", res.body.name, res.body.code);
        }
        newUserCourseCode = res.body.code;
        res.should.have.status(200);
        done();
      });
  })

  /** No duplicate course by user/superuser(2 cases) */
  it("Super user should not be able to add duplicate course", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    var newCourse = {
      category : newUserCatogoryCode,
      name: newUserCourse
    }
    chai.request(server)
      .post('/courses')
      .set(nheader)
      .send(newCourse)
      .end(function(err,res){
        if (res.status != 409) {
          console.log("adding to fail", res.body);
        }
        tempCourseCode = res.body.code;
        res.should.have.status(409);
        done();
      });
  })

  /** User1 cannot ask admin rights from Superuser for course11 before enroll */
  it("User1 should not be able to request admin rights for a course before enroll", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header), userCat = true;
    chai.request(server)
      .get('/courses/request')
      .set(nheader)
      .query({course : newSUserCourseCode})
      .end(function (err,res) {
        res.should.have.status(406);
        done();
      });
  });

  /** User1 can enroll to course11 a superuser created course */
  it("User1 should be able to enroll for a course", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header), userCat = true;
    chai.request(server)
      .get('/courses/enroll')
      .set(nheader)
      .query({course : newSUserCourseCode})
      .end(function (err,res) {
        console.log("Enroll", JSON.stringify({code : newSUserCourseCode}));
        res.should.have.status(200);
        done();
      });
  });

  /** User1 can ask admin rights from Superuser for course11 */
  it("User1 should be able to request admin rights for a course after enroll", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header), userCat = true;
    chai.request(server)
      .get('/courses/request')
      .set(nheader)
      .query({course : newSUserCourseCode})
      .end(function (err,res) {
        console.log("Admin Req", JSON.stringify(res.body));
        res.should.have.status(200);
        done();
      });
  });

  /** Users can get all courses for viewed catogory */
  it("User2 should be able to view all courses created by super admin", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header), userCat = true;
    chai.request(server)
      .get('/courses')
      .set(nheader)
      .query({category : newSUserCatogoryCode})
      .end(function (err,res) {
        console.log("View SA Course",newSUserCourse, JSON.stringify(res.body));
        if (res.body.length > 0) {
          res.should.have.status(200);
        } else {
          res.should.have.status(204);
        }
        done();
      });
  });

  /** User2 shall see course21 user created course */
  it("User2 should not be able to view courses created by user1 which are not approved.", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header), userCat = true;
    chai.request(server)
      .get('/courses')
      .set(nheader)
      .query({category : newUserCatogoryCode})
      .end(function (err,res) {
        console.log(newUserCourse, newUserCatogoryCode, JSON.stringify(res.body));
        for (var i = 0; i < res.body.length; i++) {
          if (res.body[i].name === newUserCourse) {
            userCat = false;
          }
        }
        if (userCat)
          res.should.have.status(200);
        else
          res.should.have.status(504);
        done();
      });
  });

  /** superuser shall approve course2 */
  it("Super user should be able approve User created course", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header), userCat = false;
    chai.request(server)
      .put('/courses/approve')
      .set(nheader)
      .send({user: user.user.username, course : newUserCourseCode})
      .end(function (err,res){
        console.log("Approval", res.body.code);
        if (res.body.approved) {
          res.should.have.status(200);
        } else {
          res.should.have.status(504);
        }
        done();
      });
  });

  /** User2 shall see course21 user created course */
  it("User2 should be able to view all courses created by user1 which are approved.", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header), userCat = false;
    chai.request(server)
      .get('/courses')
      .set(nheader)
      .query({category : newUserCatogoryCode})
      .end(function (err,res) {
        for (var i = 0; i < res.body.length; i++) {
          if (res.body[i].name === newUserCourse) {
            userCat = true;
          }
        }
        if (userCat)
        res.should.have.status(200);
        else
        res.should.have.status(504);
        done();
      });
  });

  /** User2 can enroll to course21; */
  it("User2 should be able to enroll for a course", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header), userCat = true;
    chai.request(server)
      .get('/courses/enroll')
      .set(nheader)
      .query({course : newUserCourseCode})
      .end(function (err,res) {
        console.log("Enroll 2", JSON.stringify({code : newUserCourseCode}));
        res.should.have.status(200);
        done();
      });
  });

  /** User2 can see all enrolled */
  it("User2 should be able to get enrolled courses", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header), userCat = false;
    chai.request(server)
      .get('/courses/all')
      .set(nheader)
      .end(function (err,res) {
        for (var i = 0; i < res.body.length; i++) {
          if (res.body[i].name === newUserCourse) {
            userCat = true;
          }
        }
        if (userCat)
        res.should.have.status(200);
        else
        res.should.have.status(504);
        done();
      });
  });

  /** User cannot delete courses */
  it("user should not be able to delete the course", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header);
    chai.request(server)
      .delete('/courses')
      .set(nheader)
      .send({code : newUserCourseCode})
      .end(function(err,res){
        console.log("Delete", newSUserCourseCode, JSON.stringify(res.body));
        res.should.have.status(401);
        done();
      });
  });


  /** superuser can delete courses created by superuser/admin */
  //Post conditions.
  /* Delete Course by super admin as above test is passed *///Post condition.//
  it("Super user should be able to delete the course", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    chai.request(server)
      .delete('/courses/all')
      .set(nheader)
      .send({course : newSUserCourseCode})
      .end(function(err,res){
        console.log("Delete", newSUserCourseCode, JSON.stringify(res.body));
        res.should.have.status(200);
        done();
      });
  });//*/
  /* Delete Course by super admin as above test is passed *///Post condition.//
  it("Super user should be able to delete the course", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    chai.request(server)
      .delete('/courses/all')
      .set(nheader)
      .send({course : newUserCourseCode})
      .end(function(err,res){
        console.log("Delete", newUserCourseCode, JSON.stringify(res.body));
        res.should.have.status(200);
        done();
      });
  });//*/


  //Delete Categories Post condition.////////////////////////////////////////////////////
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
