/*This file contains the utilities required for the logic on code.js*/

//Importing the questions
exports.questions = require('../db/questions');
exports.questionsTwo = require('../db/questionsTwo');

//Function to randomize the distribution size values
exports.randValues = function(isMajority, sizeValues){
  //Remove zeros
  var noZeros = [];
  var offset = Math.floor(Math.random() * 4) + 1;

  //Determine the offset
  if (this.areArraysEqual(sizeValues, [50, 40, 10, 0]) ||
      this.areArraysEqual(sizeValues, [40, 30, 30, 0]) ||
      this.areArraysEqual(sizeValues, [40, 50, 10, 0]) ||
      this.areArraysEqual(sizeValues, [30, 40, 30, 0])) {

        offset = 2;
  }

  for (var i = 0; i < sizeValues.length; i++) {
    if (sizeValues[i] != 0){
      noZeros.push(sizeValues[i]);
    }
  }

  var arrayLength = noZeros.length;

  if (isMajority){
    if (arrayLength == 1){
      noZeros.push(0);
      noZeros.push(0);
      noZeros.push(0);
    }

    if (arrayLength == 2){
      noZeros[0] = noZeros[0] - offset;
      noZeros[1] = noZeros[1] + offset;
      noZeros.push(0);
      noZeros.push(0);
    }

    if (arrayLength == 3){
      noZeros[0] = noZeros[0] - offset*2;
      noZeros[1] = noZeros[1] + offset;
      noZeros[2] = noZeros[2] + offset;
      noZeros.push(0);
    }
    noZeros.sort(function(a, b){return b-a});
  }

  else{

    if (arrayLength == 2){
      noZeros[0] = noZeros[0] + offset;
      noZeros[1] = noZeros[1] - offset;
      noZeros.push(0);
      noZeros.push(0);
    }

    if (arrayLength == 3){
      noZeros[0] = noZeros[0] + offset;
      noZeros[1] = noZeros[1] - offset*2;
      noZeros[2] = noZeros[2] + offset;
      noZeros.push(0);
    }
  }

  return(noZeros);
};

//Function to get question by questionNumber
exports.getQuestionByNumber = function(set, number){
  var questions = (set == "1" ? this.questions : this.questionsTwo);
  for (var i = 0; i < questions.length; i++) {
    if(questions[i].questionNumber == number){
      return (questions[i]);
    }
  }
};

//Returns the unselected answers in the ranked order
exports.getUnselectedAnswersOrdered = function (allAnswers, selectedId, order){
	var others = [];
  console.log(allAnswers, selectedId, order);
	for (var i = 0; i < allAnswers.length; i++) {
		if (allAnswers[i].id != selectedId) {
			others.push(allAnswers[i]);
		}
	}

  //Order based on correctness
  var final = [];
  for (var i = 0; i < order.length; i++) {
    if (order[i] != selectedId){
      final.push(this.getAnswerById(others, order[i]));
    }
  }

	return (final);
};

//Returns the answer given the answer id
exports.getAnswerById = function(answers, id){
  for (var i = 0; i < answers.length; i++) {
    if(answers[i].id == id){
      return(answers[i]);
    }
  }
}

//Function to compare two arrays
exports.areArraysEqual = function(arr1, arr2){
  for (var i = 0; i < arr1.length; i++) {
    if(arr1[i] != arr2[i]){
      return(false);
    }
  }
  return(true);
}

exports.getChartDescription = function (data){
  console.log(data);
  var text = "";

  //Determine how many minorities are there
  var noZeroes = [];
  for (var i = 0; i < data.others.length; i++) {
    if(data.others[i].value != 0){
      noZeroes.push(data.others[i]);
    }
  }
  var numOthers = noZeroes.length;
  console.log(numOthers);
  //No minorities scenario
  if(data.isMajority & numOthers == 0){
    text = "Looks like all the other participants agree with your answer " + data.selected.answer.toString() + " as well!";
  }
  //One minority scenario
  else if(data.isMajority & numOthers == 1){
    text = "You are in the lead! " + data.selected.value.toString() + "% of the participants agree with your answer " + data.selected.answer.toString() +".";
    text = text + "However, " + noZeroes[0].value.toString() + "% of others have selected " + noZeroes[0].answer.toString() + " as the correct answer!";
  }
  //Two minorities scenario
  else if (data.isMajority & numOthers == 2){
    text = "You are in the lead! " + data.selected.value.toString() + "% of the participants agree with your answer " + data.selected.answer.toString() +".";
    text = text + "However, " + noZeroes[0].value.toString() + "% of others have selected " + noZeroes[0].answer.toString() + " and a group of " + noZeroes[1].value.toString() + "% has selected " + noZeroes[1].answer.toString() + " as the correct answer!";
  }
  //One majority
  else if (!data.isMajority & numOthers == 1){
    text = "One minority scenario";
  }
  //One Majority
  else if (!data.isMajority & numOthers == 2){
    text = "Two minorities scenario";
  }
  else {
    text = "Oops! I can't seem to interprete this chart."
  }
  return ({name : "QuizBot", msg : text});
}
