'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Song = mongoose.model('Song'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, song;

/**
 * Song routes tests
 */
describe('Song CRUD tests', function () {
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

    // Save a user to the test db and create new song
    user.save(function () {
      song = {
        title: 'Song Title',
        content: 'Song Content'
      };

      done();
    });
  });

  it('should be able to save an song if logged in', function (done) {
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

        // Save a new song
        agent.post('/api/songs')
          .send(song)
          .expect(200)
          .end(function (songSaveErr, songSaveRes) {
            // Handle song save error
            if (songSaveErr) {
              return done(songSaveErr);
            }

            // Get a list of songs
            agent.get('/api/songs')
              .end(function (songsGetErr, songsGetRes) {
                // Handle song save error
                if (songsGetErr) {
                  return done(songsGetErr);
                }

                // Get songs list
                var songs = songsGetRes.body;

                // Set assertions
                (songs[0].user._id).should.equal(userId);
                (songs[0].title).should.match('Song Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an song if not logged in', function (done) {
    agent.post('/api/songs')
      .send(song)
      .expect(403)
      .end(function (songSaveErr, songSaveRes) {
        // Call the assertion callback
        done(songSaveErr);
      });
  });

  it('should not be able to save an song if no title is provided', function (done) {
    // Invalidate title field
    song.title = '';

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

        // Save a new song
        agent.post('/api/songs')
          .send(song)
          .expect(400)
          .end(function (songSaveErr, songSaveRes) {
            // Set message assertion
            (songSaveRes.body.message).should.match('Title cannot be blank');

            // Handle song save error
            done(songSaveErr);
          });
      });
  });

  it('should be able to update an song if signed in', function (done) {
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

        // Save a new song
        agent.post('/api/songs')
          .send(song)
          .expect(200)
          .end(function (songSaveErr, songSaveRes) {
            // Handle song save error
            if (songSaveErr) {
              return done(songSaveErr);
            }

            // Update song title
            song.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing song
            agent.put('/api/songs/' + songSaveRes.body._id)
              .send(song)
              .expect(200)
              .end(function (songUpdateErr, songUpdateRes) {
                // Handle song update error
                if (songUpdateErr) {
                  return done(songUpdateErr);
                }

                // Set assertions
                (songUpdateRes.body._id).should.equal(songSaveRes.body._id);
                (songUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of songs if not signed in', function (done) {
    // Create new song model instance
    var songObj = new Song(song);

    // Save the song
    songObj.save(function () {
      // Request songs
      request(app).get('/api/songs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single song if not signed in', function (done) {
    // Create new song model instance
    var songObj = new Song(song);

    // Save the song
    songObj.save(function () {
      request(app).get('/api/songs/' + songObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', song.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single song with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/songs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Song is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single song which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent song
    request(app).get('/api/songs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No song with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an song if signed in', function (done) {
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

        // Save a new song
        agent.post('/api/songs')
          .send(song)
          .expect(200)
          .end(function (songSaveErr, songSaveRes) {
            // Handle song save error
            if (songSaveErr) {
              return done(songSaveErr);
            }

            // Delete an existing song
            agent.delete('/api/songs/' + songSaveRes.body._id)
              .send(song)
              .expect(200)
              .end(function (songDeleteErr, songDeleteRes) {
                // Handle song error error
                if (songDeleteErr) {
                  return done(songDeleteErr);
                }

                // Set assertions
                (songDeleteRes.body._id).should.equal(songSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an song if not signed in', function (done) {
    // Set song user
    song.user = user;

    // Create new song model instance
    var songObj = new Song(song);

    // Save the song
    songObj.save(function () {
      // Try deleting song
      request(app).delete('/api/songs/' + songObj._id)
        .expect(403)
        .end(function (songDeleteErr, songDeleteRes) {
          // Set message assertion
          (songDeleteRes.body.message).should.match('User is not authorized');

          // Handle song error error
          done(songDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Song.remove().exec(done);
    });
  });
});
