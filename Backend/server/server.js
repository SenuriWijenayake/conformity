var http = require('http');
var logic = require('./code');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var userAnswer = {
      id : 2,
      answer : 'Seville',
      confidence : 0.67
    };
    data = logic.getDataForChart(3, userAnswer);
    console.log(data);
    result = JSON.stringify(data);
    res.end(result);
}).listen(8080);
