/*globals require, module, console, exports, describe */
//Topic : Contains Questions
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
    topic2 = "test-topic2-" + utils.random(3), topic2Code,
    question1 = "Question number one", q1code,
    question2 = "Question number two", q2code;

/** Pre conditions:
  * superuser login
  * user1, user2 login
  * Add catogory1 by superuser
  * Add course11 by superuser in catogory1
  * User1 can enroll to course11 a superuser created course
  * User1 can ask admin rights from Superuser for course11
  * Create Topic by Superuser (topic1)
  * Non Admin(user2) can enroll to its course.
  * Non Admin(user2) can start the topic after enrolling.

  Test conditions:Sub-Course is Topic
  * Super admin can Add Questions in a topic.
  * Admin can add a question
  * User can not add a question
  * Super admin can Open Questions in a topic.
  * Admin(user1) can open Questions in a topic without starting.
  * User cannot open Questions withouc starting the topic.
  * Superuser can delete Question(q1code)
  * User can delete Question(q2code)

  * Post conditions:
  * Superuser can delete Topic(topic2)
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

  /* Create Topic by Superuser (topic1) */
  it("Superuser should be able to create Topic", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    var newTopic = {
      course : newSUserCourseCode,
      name: topic1
    }
    chai.request(server)
      .post('/topic')
      .set(nheader)
      .send(newTopic)
      .end(function (err,res) {
        if (res.status != 200) {
          console.log("Sper Admin Req", JSON.stringify(res.body));
        }
        topic1Code = res.body.code;
        res.should.have.status(200);
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


  /* Main Test cases for Topic(Sub-Course is Topic).////////////////////////////////////////////////////////*/
  /* Super admin can Add Questions in a topic */
  it("Super admin can Add Questions in a topic", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    var newQuestion1 = {
      question : question1,
      topic: topic1Code
    }
    chai.request(server)
      .post('/question')
      .set(nheader)
      .send(newQuestion1)
      .end(function (err,res) {
        if (res.status != 200) {
          console.log("Superuser Req", JSON.stringify(res.body));
        } else {
          q1code = res.body.code
        }
        res.should.have.status(200);
        done();
      });
  });
  /* Admin can add a question */
  it(" Admin(user1) can Add Questions in a topic with guides", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    var newQuestion2 = {
      question : question2,
      topic: topic1Code,
      guides : ["http://www.google.com"]
    }
    chai.request(server)
      .post('/question')
      .set(nheader)
      .send(newQuestion2)
      .end(function (err,res) {
        if (res.status != 200) {
          console.log("User Req", JSON.stringify(res.body));
        } else {
          q2code = res.body.code
        }
        res.should.have.status(200);
        done();
      });
  });

  /* User can not add a question */
  it(" User(user2)) can not add Questions in a topic", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header);
    var newQuestion2 = {
      question : question2,
      topic: topic1Code,
      guides : ["http://www.google.com"]
    }
    chai.request(server)
      .post('/question')
      .set(nheader)
      .send(newQuestion2)
      .end(function (err,res) {
        if (res.status != 401) {
          console.log("User Req", JSON.stringify(res.body));
        }
        res.should.have.status(401);
        done();
      });
  });

  /* Super admin can Open Questions in a topic.*/
  it("Superuser should be able to get Questions for Topic", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    var newTopic = {
      topic: topic1Code
    }
    chai.request(server)
      .get('/questions')
      .set(nheader)
      .query(newTopic)
      .end(function (err,res) {
        if (res.status != 200) {
          console.log("Superuser Req", JSON.stringify(res.body));
        }
        res.should.have.status(200);
        done();
      });
  });

  /* Admin(user1) can open Questions in a topic without starting.*/
  it("Admin should be able to get Questions for Topic", function (done) {
    var nheader = Object.assign({"x-access-token" : user.token}, header);
    var newTopic = {
      topic: topic1Code
    }
    chai.request(server)
      .get('/questions')
      .set(nheader)
      .query(newTopic)
      .end(function (err,res) {
        if (res.status != 200) {
          console.log("User Req", JSON.stringify(res.body));
        }
        res.should.have.status(200);
        done();
      });
  });


  /* User cannot open Questions withouc starting the topic.*/
  it("User(user2) should not be able to get Questions withouc starting the topic", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header);
    var newTopic = {
      topic: topic1Code
    }
    chai.request(server)
    .get('/questions')
    .set(nheader)
    .query(newTopic)
    .end(function (err,res) {
      if (res.status != 401) {
        console.log("User Req", JSON.stringify(res.body));
      }
      res.should.have.status(401);
      done();
    });
  });

  /* Non Admin(user2) can start the topic after enrolling: Part of Supprot event*/
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

  /* User can open Questions after starting the topic.*/
  it("User(user2) should not be able to get Questions withouc starting the topic", function (done) {
    var nheader = Object.assign({"x-access-token" : user2.token}, header);
    var newTopic = {
      topic: topic1Code
    }
    chai.request(server)
    .get('/questions')
    .set(nheader)
    .query(newTopic)
    .end(function (err,res) {
      if (res.status != 200) {
        console.log("User Req", JSON.stringify(res.body));
      }
      res.should.have.status(200);
      done();
    });
  });

  /* Superuser can delete Question(q1code) */
  it("Superuser should be able to delete Question", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    var qCode = {
      question: q1code
    }
    chai.request(server)
      .delete('/question')
      .set(nheader)
      .send(qCode)
      .end(function (err,res) {
        if (res.status != 200) {
          console.log("Superuser Req", JSON.stringify(res.body));
        }
        res.should.have.status(200);
        done();
      });
  });

  /* Superuser can delete Question(q1code) */
  it("User should be able to delete Question", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    var qCode = {
      question: q2code
    }
    chai.request(server)
      .delete('/question')
      .set(nheader)
      .send(qCode)
      .end(function (err,res) {
        if (res.status != 200) {
          console.log("Superuser Req", JSON.stringify(res.body));
        }
        res.should.have.status(200);
        done();
      });
  });

  //*/
  //Post conditions.

  /* Superuser can delete Topic(topic1) */
  it("Superuser should be able to delete Topic", function (done) {
    var nheader = Object.assign({"x-access-token" : superuser.token}, header);
    var newTopic = {
      topic: topic1Code
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
