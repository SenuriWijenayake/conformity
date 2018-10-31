var app = angular.module('app', []);
var api = 'http://localhost:8080';

app.controller('BigFiveController', function($scope, $http) {
  $http({
    method: 'GET',
    url: api + '/bigFiveQuestions'
  }).then(function(response) {
    $scope.questions = response.data;
  }, function(error) {
    console.log("Error occured when loading the big five questions");
  });
});

app.controller('HomeController', function($scope, $http, $window) {
  $scope.submitDetails = function(user) {
    $http({
      method: 'POST',
      url: api + '/user',
      data: user,
      type: JSON,
    }).then(function(response) {
      $window.sessionStorage.setItem('userId', response.data);
      $window.location.href = './quiz.html';
    }, function(error) {
      console.log("Error occured when loading the big five questions");
    });
  };
});

app.controller('QuizController', function($scope, $http, $window) {
  $scope.count = 0;
  $scope.myAnswer = {};
  $scope.myAnswer.confidence = 1;
  $scope.userId = $window.sessionStorage.getItem('userId');

  $scope.question = {
    "questionId": 0,
    "questionText": "What is the capital of Spain?",
    "questionImg": null,
    "answers": [{
      "answer": "Barcelona",
      "id": 1
    }, {
      "answer": "Madrid",
      "id": 2
    }, {
      "answer": "Seville",
      "id": 3
    }, {
      "answer": "Lisbon",
      "id": 4
    }]
  };

  $scope.submitAnswer = function() {
    if ($scope.myAnswer.confidence != 1) {
      //Disable the button
      $("#submit-button").attr("disabled", "disabled");

      document.getElementById("loader").style.display = "block";
      document.getElementById("loader-text").style.display = "block";

      $scope.myAnswer.answerId = parseInt($scope.myAnswer.answerId);
      $scope.myAnswer.questionId = $scope.question.questionId;
      $scope.myAnswer.userId = $scope.userId;

      $http({
        method: 'POST',
        url: api + '/chartData',
        data: $scope.myAnswer,
        type: JSON,
      }).then(function(response) {
        $scope.myAnswer.answerId = $scope.myAnswer.answerId.toString();
        setTimeout(function(){
          $scope.createChart(response.data);
        }, 3000);


      }, function(error) {
        console.log("Error occured when loading the quiz questions");
      });
    }
  };

  $scope.createChart = function(chartData) {
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {
      'packages': ['corechart']
    });
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    $("#loader").css("display", "none");
    $("#loader-text").css("display", "none");
    $("#chart_div").css("display", "block");
    $("#change-section").css("display", "block");

    function drawChart() {

      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Answer');
      data.addColumn('number', 'Votes (%)');
      data.addColumn({
        type: 'string',
        role: 'annotation'
      });

      data.addRows([
        [chartData.answers[0].answer.toString(), chartData.answers[0].value, chartData.answers[0].value.toString() + ' %'],
        [chartData.answers[1].answer.toString(), chartData.answers[1].value, chartData.answers[1].value.toString() + ' %'],
        [chartData.answers[2].answer.toString(), chartData.answers[2].value, chartData.answers[2].value.toString() + ' %'],
        [chartData.answers[3].answer.toString(), chartData.answers[3].value, chartData.answers[3].value.toString() + ' %']
      ]);

      // Set chart options
      var options = {
        'width': 640,
        'height': 500
      };
      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }
  };

  $scope.yes = function(){
    $scope.count = 1;
    $("#submit-button").prop("disabled", false);
    $("#change-section").css("display", "none");
  };

  $scope.next = function(){
    //Create the second answer object
  };

});
