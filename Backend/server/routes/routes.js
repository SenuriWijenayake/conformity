var logic = require('../code');

var appRouter = function (app) {
  app.get('/chartData/:id/:answer/:confidence', function(req, res) {

    var userAnswer = {};
    userAnswer.id = parseInt(req.params.id);
    userAnswer.answer = req.params.answer;
    userAnswer.confidence = parseFloat(req.params.confidence);

    data = logic.getDataForChart(2, userAnswer);
    result = JSON.stringify(data);
    res.status(200).send(result);
  });

  //Endpoint to get all the questions and answers
  app.get('/questions', function(req, res) {
    data = logic.getAllQuestions();
    result = JSON.stringify(data);
    res.status(200).send(result);
  });
}

module.exports = appRouter;
