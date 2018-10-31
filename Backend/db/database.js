//Import the mongoose module
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/conformity';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

//Importing schemas
var Result = require('./schemas/result');
var User = require('./schemas/user');
var bigFiveQuestions = require('./bigFiveQuestions');

//Function to save the big five results to the database
exports.saveBigFiveResults = function(results) {
  var result = new Result({
    extraversion: results.extraversion,
    agreeableness: results.agreeableness,
    conscientiousness: results.conscientiousness,
    neuroticism: results.neuroticism,
    openness: results.openness
  });

  result.save(function(err) {
    if (err) throw err;
    console.log('Results saved successfully!');
  });
};

//Function to save user details
exports.saveUser = function (user){
  return new Promise(function(resolve, reject) {
    var newUser = new User({
      gender: user.gender,
      age: user.age,
      education: user.education
    });

    newUser.save(function(err, newUser) {
      if (err) reject(err);
      resolve(newUser._id.toString());
    });
  });
};


//Function to get the big five questions
exports.getBigFiveQuestions = function() {
  return (bigFiveQuestions);
};

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
