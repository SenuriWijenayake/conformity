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
  app.post('/bigFiveData', function(req, res) {
    res.status(200).send("Success");
  });
}

module.exports = appRouter;
