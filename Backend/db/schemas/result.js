var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var resultSchema = new Schema({
  extraversion: Number,
  agreeableness: Number,
  conscientiousness: Number,
  neuroticism: Number,
  openness: Number
});

var Result = mongoose.model('Result', resultSchema);

module.exports = Result;
