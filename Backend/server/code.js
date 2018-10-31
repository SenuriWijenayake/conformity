//import the data from the database
var utils = require('./utils');
var bigVar = require('../db/bigFiveVariables');
var db = require('../db/database');

//Function to get data for the feedback
exports.getDataForChart = function(userAnswer) {

  var question = utils.getQuestionByNumber(userAnswer.questionId);
  var answers = question.answers;
  var sizeValues = utils.randValues(question.isMajority, question.sizeValues);

  final = [];

  //Set the first answer
  var selected = utils.getAnswerById(answers, userAnswer.answerId);
  selected.value = sizeValues[0];
  final.push(selected);

  //Get other answers
  var others = utils.getUnselectedAnswersOrdered(answers, userAnswer.answerId, question.correctOrder);

  //Set values of the other answers
  for (var i = 0; i < others.length; i++) {
    others[i].value = sizeValues[i + 1];
    final.push(others[i]);
  }

  //Order for display
  final.sort(function(a, b) {
    return a.id - b.id
  });

  var res = {};
  res.answers = final;
  res.question = question.questionText;
  console.log(res);
  return (res);
};

//Function to create the questions and answers
exports.getAllQuestions = function() {
  var questions = utils.questions;
  var response = [];

  for (var i = 0; i < questions.length; i++) {
    var ques = questions[i];

    var q = {};
    q.questionId = ques.questionNumber;
    q.questionText = ques.questionText;
    q.questionImg = ques.img ? ques.img : null;
    q.answers = ques.answers;

    response.push(q);
  }
  return (response);
};

//Function to process the big five data
exports.processBigFive = function(answers) {

  var allScores = {};

  for (var i = 0; i < bigVar.length; i++) {
    var trait = bigVar[i].key;
    var indexes = bigVar[i].values;
    var score = 0;

    for (var j = 0; j < indexes.length; j++) {
      if (answers[indexes[j].id]) {
        var answer = parseInt(answers[indexes[j].id]);
        if (indexes[j].isReverse) {
          answer = (5 - answer) + 1;
        }
        score = score + answer;
      }
    }
    allScores[trait] = score;
  }
  db.saveBigFiveResults(allScores);
};

//Function to get all big five questions
exports.getBigFiveQuestions = function() {
  var questions = db.getBigFiveQuestions();
  return (questions);
};

//Function to save user data
exports.saveUserData = function(user) {
  return new Promise(function(resolve, reject) {
    db.saveUser(user).then(function(userId) {
      resolve(userId);
    });
  });
};
