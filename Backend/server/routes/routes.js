var logic = require('../code');

var appRouter = function(app) {
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

  //Endpoint to get the big five questions
  app.get('/bigFiveQuestions', function(req, res) {
    data = logic.getBigFiveQuestions();
    res.status(200).send(data);
  });

  //Endpoint to process the big five data
  app.post('/bigFiveData', function(req, res) {
    console.log("Request received at big five");
    response = logic.processBigFive(req.body);
    res.status(200).send("<h2>Thank You!</h2><p>Responses were submited successfully</p>");
  });

};

module.exports = appRouter;
