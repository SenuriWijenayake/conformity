var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  id: String,
  gender: String,
  age: String,
  education: String,
  field : String,
  genderSpecified : {type : String, required: false}
});

var Result = mongoose.model('User', userSchema);

module.exports = Result;
