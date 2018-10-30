//import the data from the database
var utils = require('./utils');
var bigVar = require('../db/bigFiveVariables');
var db = require('../db/database');

//Function to get data for the feedback
exports.getDataForChart = function (questionNumber, userAnswer) {

		var question = utils.getQuestionByNumber(questionNumber);
		var answers = question.answers;
		var sizeValues = utils.randValues(question.isMajority, question.sizeValues);

    final = [];

    //Set the first answer
		var selected = utils.getAnswerById(answers, userAnswer.id);
		selected.value = sizeValues[0];
		final.push(selected);

  	//Get other answers
  	var others = utils.getUnselectedAnswersOrdered(answers, userAnswer.id, question.correctOrder);

  	//Set values of the other answers
  	for (var i = 0; i < others.length; i++) {
			others[i].value = sizeValues[i+1];
  		final.push(others[i]);
  	}

		//Order for display
		final.sort(function(a, b){return a.id - b.id});

		var res = {};
		res.answers = final;
		res.question = question.questionText;
    return (res);
};

//Function to create the questions and answers
exports.getAllQuestions = function (){
	var questions = utils.questions;
	var response = [];

	for (var i = 0; i < questions.length; i++) {
		var ques = questions[i];

		var q = {};
		q.questionText = ques.questionText;
		q.questionImg = ques.img ? ques.img : null;
		q.answers = ques.answers;

		response.push(q);
	}
	return(response);
};

//Function to process the big five data
exports.processBigFive = function (){

	answers = {"1":"1","2":"1","3":"1","4":"1","5":"1","6":"1","7":"1","8":"1","9":"1","10":"1","11":"1","12":"1",
								"13":"2","14":"2","15":"2","16":"2","17":"2","18":"2","19":"2","20":"2","21":"2","22":"2","23":"3",
								"24":"3","25":"3","26":"3","27":"3","28":"3","29":"3","30":"3","31":"3","32":"3","33":"3","34":"4",
								"35":"4","36":"4","37":"4","38":"4","39":"4","40":"4","41":"4","42":"4","43":"4","44":"4"};

	var allScores = {};

	for (var i = 0; i < bigVar.length; i++) {
		var trait = bigVar[i].key;
		var indexes = bigVar[i].values;
		var score = 0;

		for (var j = 0; j < indexes.length; j++) {
			var answer = parseInt(answers[indexes[j].id]);
			if (indexes[j].isReverse){
				answer = (5 - answer) + 1;
			}
			score = score + answer;
		}

		allScores[trait] = score;
	}
	db.saveBigFiveResults (allScores);
}
