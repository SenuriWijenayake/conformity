// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var resultSchema = new Schema({
  Extraversion: Number,
  Agreeableness: Number,
  Conscientiousness: Number,
  Neuroticism: Number,
  Openness: Number
});

var Result = mongoose.model('Result', resultSchema);

module.exports = Result;
