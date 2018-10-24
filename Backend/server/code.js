//import the data from the database
var utils = require('./utils');

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
