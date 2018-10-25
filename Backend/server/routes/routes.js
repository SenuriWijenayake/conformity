var logic = require('../code');

var appRouter = function (app) {
  app.get('/chartData/:question/:id/:answer/:confidence', function(req, res) {

    var userAnswer = {};
    userAnswer.id = parseInt(req.params.id);
    userAnswer.answer = req.params.answer;
    userAnswer.confidence = parseFloat(req.params.confidence);

    var ques = parseInt(req.params.question);

    data = logic.getDataForChart(ques, userAnswer);
    result = JSON.stringify(data);
    res.status(200).send(result);
  });

  //Endpoint to get all the questions and answers
  app.get('/questions', function(req, res) {
    data = logic.getAllQuestions();
    result = JSON.stringify(data);
    res.status(200).send(result);
  });

  //Endpoint to process the big five data
  app.get('/bigFiveData', function(req, res) {
    console.log("Request received at big five");
    //answerData = JSON.stringify(req.body);
    response = logic.processBigFive();
    res.status(200).send("<h2>Thank You!</h2><p>Responses were submited successfully</p>");
  });
}

module.exports = appRouter;
