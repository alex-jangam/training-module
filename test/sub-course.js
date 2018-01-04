/*globals require, module, console, exports, describe */
//Topics or Sub Courses
require('./portconfig')();
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var constants = require("../config");
var utils = require("../plugins/utils");
chai.use(chaiHttp);

var rndm = utils.random(5),
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
    newSUserCatogoryCode, newUserCatogoryCode,
    newSUserCourseCode, newUserCourseCode,
    topic1 = "test-topic1-" + utils.random(3), topic1Code,
    topic2 = "test-topic2-" + utils.random(3), topic2Code;

/** Pre conditions:
  * superuser login
  * user1, user2 login
  * Add catogory1 by superuser
  * Add course11 by superuser in catogory1
  * User1 can enroll to course11 a superuser created course
  * User1 can ask admin rights from Superuser for course11

  Test conditions:Sub-Course is Topic
  * Create Topic by Superuser (topic2)
  * Create Topic(topic1) by User(user1) with admin rights.
  * Create Duplicate Topic(topic1) under same course by User(user1) with admin rights shall fail.
  * Create Topic(topic3) under by Admin User(user1) for Invalid Course shall fail.
  * Create Topic by Non Admin(user2) shall fail.
  * Non Admin Users(user2) shall see Topics without enrolling for Course(user2 shall see topic1).
  * Non Admin(user2) cannot delete Topic(topic1)
  * Non Admin(user2) cannot start a topic without enrolling to its course.
  * Non Admin(user2) can enroll to its course.
  * Non Admin(user2) can start the topic after enrolling.
  * Non Admin(user2) can start the started topic after enrolling.
  * Admin can delete Topic(topic1)
  * Superuser can delete Topic(topic2)

  * Post conditions:
    Delete courses created for testing.
    Delete catogories created for testing.
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

  /* Support Test Conditions */
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
        if (res.status != 200) {
          console.log("added", res.body);
        }
        newSUserCourseCode = res.body.code;
        res.should.have.status(200);
        done();
      });
  })

  /** User1 can enroll to course11 a superuser created course */
  it("User1 should be able to enroll for a course", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    chai.request(server)
      .get('/courses/enroll')
      .set(nheader)
      .query({course : newSUserCourseCode})
      .end(function (err,res) {
        if (res.status != 200) {
          console.log("Enroll", JSON.stringify({code : newSUserCourseCode}));
        }
        res.should.have.status(200);
        done();
      });
  });

  /** User1 can ask admin rights from Superuser for course11 */
  it("User1 should be able to request admin rights for a course after enroll", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    chai.request(server)
      .get('/courses/request')
      .set(nheader)
      .query({course : newSUserCourseCode})
      .end(function (err,res) {
        if (res.status != 200) {
          console.log("Admin Req", JSON.stringify(res.body));
        }
        res.should.have.status(200);
        done();
      });
  });

  /* Main Test cases for courses.////////////////////////////////////////////////////////*/
  // Test conditions:

  /* Create Topic by Superuser (topic2) */
  it("Superuser should be able to create Topic", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    var newTopic = {
      course : newSUserCourseCode,
      name: topic2
    }
    chai.request(server)
      .post('/topic')
      .set(nheader)
      .send(newTopic)
      .end(function (err,res) {
        if (res.status != 200) {
          console.log("Sper Admin Req", JSON.stringify(res.body));
        }
        topic2Code = res.body.code;
        res.should.have.status(200);
        done();
      });
  });

  /* Create Topic(topic1) by User(user1) with admin rights. */
  it("user should be able to create topic", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    var newTopic = {
      course : newSUserCourseCode,
      name: topic1
    }
    chai.request(server)
      .post('/topic')
      .set(nheader)
      .send(newTopic)
      .end(function(err,res){
        if (res.status != 200) {
          console.log("Admin Req", JSON.stringify(res.body));
        }
        topic1Code = res.body.code;
        res.should.have.status(200);
        done();
      });
  })

  /* Create Duplicate Topic(topic1) under same course by User(user1) with admin rights shall fail. */
  it("admin user should not be able to create topic with existing name", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    var newTopic = {
      course : newSUserCourseCode,
      name: topic1
    }
    chai.request(server)
      .post('/topic')
      .set(nheader)
      .send(newTopic)
      .end(function(err,res){
        if (res.status != 409) {
          console.log("Admin Req", JSON.stringify(res.body));
        }
        res.should.have.status(409);
        done();
      });
  })
  /* Create Topic(topic3) under by Admin User(user1) for Invalid Course shall fail. */
  it("admin user should not be able to create topic with invalid course", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    var newTopic = {
      course : newSUserCourseCode + "a",
      name: topic1 + "a"
    }
    chai.request(server)
      .post('/topic')
      .set(nheader)
      .send(newTopic)
      .end(function(err,res){
        if (res.status != 401) {
          console.log("Admin Req", JSON.stringify(res.body));
        }
        res.should.have.status(401);
        done();
      });
  })

  /* Create Topic by Non Admin(user2) shall fail. */
  it("non admin user should not be able to create topic", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header);
    var newTopic = {
      course : newSUserCourseCode,
      name: topic1 + "b"
    }
    chai.request(server)
      .post('/topic')
      .set(nheader)
      .send(newTopic)
      .end(function(err,res){
        if (res.status != 401) {
          console.log("Admin Req", JSON.stringify(res.body));
        }
        res.should.have.status(401);
        done();
      });
  })

  /* Non Admin Users(user2) shall see Topics without enrolling for Course(user2 shall see topic1). */
  it("non admin user should be able see topics for non enrolled courses", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header);
    var newTopic = {
      course : newSUserCourseCode,
    }
    chai.request(server)
      .get('/topics')
      .set(nheader)
      .query(newTopic)
      .end(function(err,res){
        var resps = (res.body || {}).all || [], hasTop = false;
        for (var i = 0; i < resps.length; i++) {
          if (resps[i].code === topic1Code)hasTop = true;
        }
        if (hasTop) {
          res.should.have.status(200);
        } else {
          res.should.have.status(406);
          if (res.status != 200 || !hasTop) {
            console.log("Admin Req", JSON.stringify(res.body));
          }
        }
        done();
      });
  })
  /* Non Admin(user2) cannot delete Topic(topic1) */
  it("Non Admin User should not be able to delete Topic", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header);
    var newTopic = {
      topic: topic1Code
    }
    chai.request(server)
      .delete('/topic')
      .set(nheader)
      .send(newTopic)
      .end(function (err,res) {
        if (res.status != 401) {
          console.log("Admin Req", JSON.stringify(res.body));
        }
        res.should.have.status(401);
        done();
      });
  });

  /* Non Admin(user2) cannot start a topic without enrolling to its course.*/
  it("User2 should be able to start for a topic", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header);
    chai.request(server)
    .put('/topic/start')
    .set(nheader)
    .send({topic : topic1Code})
    .end(function (err,res) {
      if (res.status != 401) {
        console.log("Enroll", JSON.stringify(res.body));
      }
      res.should.have.status(401);
      done();
    });
  });

  /* Non Admin(user2) can enroll to its course.*/
  it("User2 should be able to enroll for a course", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header);
    chai.request(server)
    .get('/courses/enroll')
    .set(nheader)
    .query({course : newSUserCourseCode})
    .end(function (err,res) {
      if (res.status != 200) {
        console.log("Enroll", JSON.stringify({code : newSUserCourseCode}));
      }
      res.should.have.status(200);
      done();
    });
  });

  /* Non Admin(user2) can start the topic after enrolling.*/
  it("User2 should be able to start for a topic after enrolling", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header);
    chai.request(server)
    .put('/topic/start')
    .set(nheader)
    .send({topic : topic1Code})
    .end(function (err,res) {
      if (res.status != 200) {
        console.log("Enroll", JSON.stringify(res.body));
      }
      res.should.have.status(200);
      done();
    });
  });

  /* Non Admin(user2) can start the started topic after enrolling. */
  it("User2 should not be able to start for a topic already started", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header);
    chai.request(server)
    .put('/topic/start')
    .set(nheader)
    .send({topic : topic1Code})
    .end(function (err,res) {
      if (res.status != 403) {
        console.log("Enroll ", res.body);
      }
      res.should.have.status(403);
      done();
    });
  });

  /* Admin can delete Topic(topic1) */
  it("Admin User should be able to delete Topic", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    var newTopic = {
      topic: topic1Code
    }
    chai.request(server)
      .delete('/topic')
      .set(nheader)
      .send(newTopic)
      .end(function (err,res) {
        if (res.status != 200) {
          console.log("Admin Req", JSON.stringify(res.body));
        }
        res.should.have.status(200);
        done();
      });
  });

  /* Superuser can delete Topic(topic2) */
  it("Superuser should be able to delete Topic", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    var newTopic = {
      topic: topic2Code
    }
    chai.request(server)
      .delete('/topic')
      .set(nheader)
      .send(newTopic)
      .end(function (err,res) {
        if (res.status != 200) {
          console.log("Superuser Req", JSON.stringify(res.body));
        }
        res.should.have.status(200);
        done();
      });
  });

  //Post conditions.
  /* Delete Course by super admin as above test is passed *///Post condition.//
  it("Super user should be able to delete the course", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    chai.request(server)
      .delete('/courses/all')
      .set(nheader)
      .send({course : newSUserCourseCode})
      .end(function(err,res){
        if (res.status != 200) {
          console.log("Delete", newSUserCourseCode, JSON.stringify(res.body));
        }
        res.should.have.status(200);
        done();
      });
  });//*/


  /* Delete Course by super admin as above test is passed *///Post condition.//
  //Delete Categories Post condition.////////////////////////////////////////////////////
  it("Super user should be able to delete Catogory created by super admin", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    chai.request(server)
      .delete('/category')
      .set(nheader)
      .send({code : newSUserCatogoryCode})
      .end(function(err,res){
        res.should.have.status(200);
        done();
      });
  })//*/

});
