var logic = require('../code');

var appRouter = function(app) {
  app.post('/chartData', function(req, res) {
    var userAnswer = {};

    userAnswer.userId = req.body.userId;
    userAnswer.questionId = parseInt(req.body.questionId);
    userAnswer.answerId = parseInt(req.body.answerId);
    userAnswer.confidence = parseFloat(req.body.confidence);

    data = logic.getDataForChart(userAnswer);
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
    res.status(200).send("<img src='http://blog.postable.com/wp-content/uploads/2017/07/TY_wedding_header.png' width='100%' height='100%'>");
  });

  //Endpoint to save user demographic data
  app.post('/user', function(req, res) {
    console.log("Request received at user data");
    return new Promise(function(resolve, reject) {
      logic.saveUserData(req.body).then(function(id) {
        resolve(res.status(200).send(id));
      });
    });
  });

};

module.exports = appRouter;
