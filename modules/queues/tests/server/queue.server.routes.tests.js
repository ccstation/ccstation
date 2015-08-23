'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Queue = mongoose.model('Queue'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, queue;

/**
 * Queue routes tests
 */
describe('Queue CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new queue
    user.save(function () {
      queue = {
        title: 'Queue Title',
        content: 'Queue Content'
      };

      done();
    });
  });

  it('should be able to save an queue if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new queue
        agent.post('/api/queues')
          .send(queue)
          .expect(200)
          .end(function (queueSaveErr, queueSaveRes) {
            // Handle queue save error
            if (queueSaveErr) {
              return done(queueSaveErr);
            }

            // Get a list of queues
            agent.get('/api/queues')
              .end(function (queuesGetErr, queuesGetRes) {
                // Handle queue save error
                if (queuesGetErr) {
                  return done(queuesGetErr);
                }

                // Get queues list
                var queues = queuesGetRes.body;

                // Set assertions
                (queues[0].user._id).should.equal(userId);
                (queues[0].title).should.match('Queue Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an queue if not logged in', function (done) {
    agent.post('/api/queues')
      .send(queue)
      .expect(403)
      .end(function (queueSaveErr, queueSaveRes) {
        // Call the assertion callback
        done(queueSaveErr);
      });
  });

  it('should not be able to save an queue if no title is provided', function (done) {
    // Invalidate title field
    queue.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new queue
        agent.post('/api/queues')
          .send(queue)
          .expect(400)
          .end(function (queueSaveErr, queueSaveRes) {
            // Set message assertion
            (queueSaveRes.body.message).should.match('Title cannot be blank');

            // Handle queue save error
            done(queueSaveErr);
          });
      });
  });

  it('should be able to update an queue if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new queue
        agent.post('/api/queues')
          .send(queue)
          .expect(200)
          .end(function (queueSaveErr, queueSaveRes) {
            // Handle queue save error
            if (queueSaveErr) {
              return done(queueSaveErr);
            }

            // Update queue title
            queue.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing queue
            agent.put('/api/queues/' + queueSaveRes.body._id)
              .send(queue)
              .expect(200)
              .end(function (queueUpdateErr, queueUpdateRes) {
                // Handle queue update error
                if (queueUpdateErr) {
                  return done(queueUpdateErr);
                }

                // Set assertions
                (queueUpdateRes.body._id).should.equal(queueSaveRes.body._id);
                (queueUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of queues if not signed in', function (done) {
    // Create new queue model instance
    var queueObj = new Queue(queue);

    // Save the queue
    queueObj.save(function () {
      // Request queues
      request(app).get('/api/queues')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single queue if not signed in', function (done) {
    // Create new queue model instance
    var queueObj = new Queue(queue);

    // Save the queue
    queueObj.save(function () {
      request(app).get('/api/queues/' + queueObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', queue.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single queue with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/queues/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Queue is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single queue which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent queue
    request(app).get('/api/queues/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No queue with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an queue if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new queue
        agent.post('/api/queues')
          .send(queue)
          .expect(200)
          .end(function (queueSaveErr, queueSaveRes) {
            // Handle queue save error
            if (queueSaveErr) {
              return done(queueSaveErr);
            }

            // Delete an existing queue
            agent.delete('/api/queues/' + queueSaveRes.body._id)
              .send(queue)
              .expect(200)
              .end(function (queueDeleteErr, queueDeleteRes) {
                // Handle queue error error
                if (queueDeleteErr) {
                  return done(queueDeleteErr);
                }

                // Set assertions
                (queueDeleteRes.body._id).should.equal(queueSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an queue if not signed in', function (done) {
    // Set queue user
    queue.user = user;

    // Create new queue model instance
    var queueObj = new Queue(queue);

    // Save the queue
    queueObj.save(function () {
      // Try deleting queue
      request(app).delete('/api/queues/' + queueObj._id)
        .expect(403)
        .end(function (queueDeleteErr, queueDeleteRes) {
          // Set message assertion
          (queueDeleteRes.body.message).should.match('User is not authorized');

          // Handle queue error error
          done(queueDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Queue.remove().exec(done);
    });
  });
});
