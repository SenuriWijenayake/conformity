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
  $scope.user = {};

  $('#gender-specified').change(function() {
    if (this.checked) {
      $('#gender-text').prop('required', true);
    } else {
      $('#gender-text').prop('required', false);
    }
  });

  $scope.submitDetails = function(user) {
    if (user.gender && user.age && user.education && user.field && (user.gender == 'specified'? user.genderSpecified : true)) {
      $http({
        method: 'POST',
        url: api + '/user',
        data: user,
        type: JSON,
      }).then(function(response) {
        $window.sessionStorage.setItem('userId', response.data);
        $window.location.href = './quiz.html';
      }, function(error) {
        console.log("Error occured when submitting user details");
      });
    }

  };
});

app.controller('QuizController', function($scope, $http, $window) {

  $window.onbeforeunload = function(e) {
    var dialogText = 'You have unsaved changes. Are you sure you want to leave the site?';
    e.returnValue = dialogText;
    return dialogText;
  };

  $scope.count = 0;
  $scope.myAnswer = {};
  $scope.myAnswer.confidence = 50;
  $scope.userId = $window.sessionStorage.getItem('userId');

  $scope.clicked = function() {
    $("#confidence-container").css("display", "block");
  };

  $scope.question = {
    "questionNumber": 0,
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
    if ($scope.myAnswer.confidence != 50) {

      //Remove the button
      $("#submit-button").css("display", "none");
      //Disbling the input
      $("input[type=radio]").attr('disabled', true);
      $("input[type=range]").attr('disabled', true);
      //Loader activated
      $("#loader").css("display", "block");
      $("#loader-text").css("display", "block");

      $scope.myAnswer.answerId = parseInt($scope.myAnswer.answerId);
      $scope.myAnswer.questionId = $scope.question.questionNumber;
      $scope.myAnswer.userId = $scope.userId;

      $http({
        method: 'POST',
        url: api + '/chartData',
        data: $scope.myAnswer,
        type: JSON,
      }).then(function(response) {
        $scope.myAnswer.answerId = $scope.myAnswer.answerId.toString();
        setTimeout(function() {
          $scope.createChart(response.data);
        }, 3000);
      }, function(error) {
        console.log("Error occured when loading the chart");
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
        'height': 500,
        'vAxis': {
          'ticks': [{
              v: 0,
              f: '0%'
            }, {
              v: 10,
              f: '10%'
            }, {
              v: 20,
              f: '20%'
            }, {
              v: 30,
              f: '30%'
            },
            {
              v: 40,
              f: '40%'
            },
            {
              v: 50,
              f: '50%'
            },
            {
              v: 60,
              f: '60%'
            },
            {
              v: 70,
              f: '70%'
            },
            {
              v: 80,
              f: '80%'
            },
            {
              v: 90,
              f: '90%'
            },
            {
              v: 100,
              f: '100%'
            }
          ]
        }
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }
  };

  $scope.yes = function() {
    $scope.count = 1;
    //Make the submit button visible and the input enabled
    $("input[type=radio]").attr('disabled', false);
    $("input[type=range]").attr('disabled', false);
    $("#submit-button").css("display", "block");

    //Remove change section buttons
    $("#change-section").css("display", "none");
  };

  $scope.update = function() {
    //Disable the button
    $("#submit-button").attr("disabled", "disabled");
    $("#confidence-container").css("display", "none");

    $scope.myAnswer.answerId = parseInt($scope.myAnswer.answerId);
    $scope.myAnswer.questionId = $scope.question.questionNumber;
    $scope.myAnswer.userId = $scope.userId;

    $http({
      method: 'POST',
      url: api + '/updateAnswer',
      data: $scope.myAnswer,
      type: JSON,
    }).then(function(response) {
      $scope.next();
    }, function(error) {
      console.log("Error occured when updating the answers");
    });
  };

  $scope.next = function() {
    $scope.count = 0;
    //Make the submit button visible and the input enabled
    $("input[type=radio]").attr('disabled', false);
    $("input[type=range]").attr('disabled', false);
    $("#submit-button").css("display", "block");
    $("#confidence-container").css("display", "none");

    $scope.userId = $window.sessionStorage.getItem('userId');
    var data = {
      id: parseInt($scope.myAnswer.questionId) + 1
    };

    $http({
      method: 'POST',
      url: api + '/question',
      data: data,
      type: JSON,
    }).then(function(response) {

      $scope.myAnswer = {};
      $scope.myAnswer.confidence = 50;
      $scope.question = response.data;

      $("#loader").css("display", "none");
      $("#loader-text").css("display", "none");
      $("#chart_div").css("display", "none");
      $("#change-section").css("display", "none");
      $("#submit-button").prop("disabled", false);

    }, function(error) {
      console.log("Error occured when loading the question");
    });

  };
});
