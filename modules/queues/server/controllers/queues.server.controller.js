'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Queue = mongoose.model('Queue'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a queue
 */
exports.create = function (req, res) {
  var queue = new Queue(req.body);
  queue.user = req.user;

  queue.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(queue);
    }
  });
};

/**
 * Show the current queue
 */
exports.read = function (req, res) {
  res.json(req.queue);
};

/**
 * Update a queue
 */
exports.update = function (req, res) {
  var queue = req.queue;

  queue.title = req.body.title;
  queue.content = req.body.content;

  queue.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(queue);
    }
  });
};

/**
 * Delete an queue
 */
exports.delete = function (req, res) {
  var queue = req.queue;

  queue.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(queue);
    }
  });
};

/**
 * List of Queues
 */
exports.list = function (req, res) {
  Queue.find().sort('-created').populate('user', 'displayName').exec(function (err, queues) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(queues);
    }
  });
};

/**
 * Queue middleware
 */
exports.queueByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Queue is invalid'
    });
  }

  Queue.findById(id).populate('user', 'displayName').exec(function (err, queue) {
    if (err) {
      return next(err);
    } else if (!queue) {
      return res.status(404).send({
        message: 'No queue with that identifier has been found'
      });
    }
    req.queue = queue;
    next();
  });
};
