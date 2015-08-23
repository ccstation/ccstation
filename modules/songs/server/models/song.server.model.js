'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Song Schema
 */
var SongSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  language: {
    type: String,
    default: '',
    trim: true,
  },
  year: {
    type: String,
    default: '',
    trim: true,
  },
  company: {
    type: String,
    default: '',
    trim: true,
  },
  composer: {
    type: String,
    default: '',
    trim: true,
  },
  lyricist: {
    type: String,
    default: '',
    trim: true,
  },
  video: {
    type: String,
    default: '',
    trim: true,
  },
  audio: {
    type: String,
    default: '',
    trim: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Song', SongSchema);
