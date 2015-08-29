'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Song = mongoose.model('Song'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a song
 */
exports.create = function (req, res) {
  var song = new Song(req.body);
  song.user = req.user;

  song.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(song);
    }
  });
};

/**
 * Show the current song
 */
exports.read = function (req, res) {
  res.json(req.song);
};

/**
 * Update a song
 */
exports.update = function (req, res) {
  var song = req.song;

  song.title = req.body.title;
  song.content = req.body.content;
  song.video = req.body.video;
  song.type = req.body.type;
  song.titlealign = req.body.titlealign;
  song.background = req.body.background;
  song.sequence = req.body.sequence;

  song.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(song);
    }
  });
};

/**
 * Delete an song
 */
exports.delete = function (req, res) {
  var song = req.song;

  song.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(song);
    }
  });
};

/**
 * List of Songs
 */
exports.list = function (req, res) {
  Song.find().sort('sequence').populate('user', 'displayName').exec(function (err, songs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(songs);
    }
  });
};

/**
 * Song middleware
 */
exports.songByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Song is invalid'
    });
  }

  Song.findById(id).populate('user', 'displayName').exec(function (err, song) {
    if (err) {
      return next(err);
    } else if (!song) {
      return res.status(404).send({
        message: 'No song with that identifier has been found'
      });
    }
    req.song = song;
    next();
  });
};
