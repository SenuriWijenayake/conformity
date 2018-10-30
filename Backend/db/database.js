//Import the mongoose module
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/conformity';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

//Importing schemas
var Result = require('./schemas/result');

//Function to save the big five results to the database
exports.saveBigFiveResults = function(results) {
    var result = new Result({
      Extraversion: results.Extraversion,
      Agreeableness: results.Agreeableness,
      Conscientiousness: results.Conscientiousness,
      Neuroticism: results.Neuroticism,
      Openness: results.Openness
    });

    result.save(function(err) {
      if (err) throw err;
      console.log('Results saved successfully!');
    });
};

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
