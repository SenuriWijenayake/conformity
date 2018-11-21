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
    if (user.questionSet && user.gender && user.age && user.education && user.field && (user.gender == 'specified' ? user.genderSpecified : true)) {
      $http({
        method: 'POST',
        url: api + '/user',
        data: user,
        type: JSON,
      }).then(function(response) {
        $window.sessionStorage.setItem('userId', response.data);
        $window.sessionStorage.setItem('questionSet', user.questionSet);
        $window.location.href = './quiz.html';
      }, function(error) {
        console.log("Error occured when submitting user details");
      });
    }

  };
});

app.controller('QuizController', function($scope, $http, $window) {

  $scope.userId = $window.sessionStorage.getItem('userId');
  $scope.questionSet = $window.sessionStorage.getItem('questionSet');
  $scope.question = {};
  $scope.sliderChanged = false;

  //Chatbot related variables
  $scope.history = [{
      name: "QuizBot",
      msg: "Hi! I am the QuizBot! I can help you answer the questions in this quiz."
    },
    {
      name: "QuizBot",
      msg: "This quiz contains 34 subjective and objective MCQ questions. Subjective questions will ask for your opinion and objective questions will test your IQ. To get started, enter 'GO'."
    }
  ];

  $("input[type='range']").change(function() {
    $scope.sliderChanged = true;
    $("#submit-button").css("display", "block");
    $("#output").css("color", "green");
  });

  //Setting the question one
  $http({
    method: 'POST',
    url: api + '/question',
    data: {
      set: $scope.questionSet,
      id: 0
    },
    type: JSON,
  }).then(function(response) {
    $scope.question = response.data;
    if ($scope.question.img) {
      $("#image-container").css("display", "inline");
    } else {
      $("#image-container").css("display", "none");
    }
  }, function(error) {
    console.log("Error occured when getting the first question");
  });

  //Confirmation message before reload and back
  $window.onbeforeunload = function(e) {
    var dialogText = 'You have unsaved changes. Are you sure you want to leave the site?';
    e.returnValue = dialogText;
    return dialogText;
  };

  //Initialization
  $scope.count = 0;
  $scope.myAnswer = {};
  $scope.myAnswer.confidence = 50;
  $scope.myAnswer.userId = $scope.userId;
  $scope.myAnswer.questionSet = $scope.questionSet;

  //Show only when the answer is selected
  $scope.clicked = function() {
    $("#confidence-container").css("display", "block");
    $scope.history.push({
      name: "QuizBot",
      msg: "Move the slider to show how sure you are of the selected answer. Click on submit when done!"
    });
  };

  $scope.submitAnswer = function() {
    if ($scope.sliderChanged) {
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
      $scope.myAnswer.questionSet = $scope.questionSet;

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

        //Setting the answer
        $scope.history.push(response.data.description);
        $scope.history.push({
          name: "QuizBot",
          msg: "Would you like to change your answer? Click on 'YES' to make a change or 'NO' to go to the next question."
        });

        $scope.scrollAdjust();

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
        'width': 500,
        'height': 370,
        'title': "See how others have answered this question..",
        'titleTextStyle': {
          fontSize: 16
        },
        'hAxis': {
          'title': 'Selected answer'
        },
        'vAxis': {
          'title': '% of votes by others',
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
    $("#submit-button").css("display", "none");
    $scope.history.push({
      name: "QuizBot",
      msg: "You can now change your answer and confidence. Click on 'Submit' to confirm your answer."
    });
    $scope.scrollAdjust();

    $scope.count = 1;
    //Make the input enabled
    $("input[type=radio]").attr('disabled', false);
    $("input[type=range]").attr('disabled', false);

    //Remove change section buttons
    $("#change-section").css("display", "none");

    //Set the confidence to 50
    $scope.myAnswer.confidence = 50;
    $scope.sliderChanged = false;
    $("#output").val("Not Specified");
    $("#output").css("color", "red");
  };

  $scope.update = function() {

    if ($scope.sliderChanged) {
      //Disable the button
      $("#submit-button").attr("disabled", "disabled");
      $("#confidence-container").css("display", "none");

      $scope.myAnswer.answerId = parseInt($scope.myAnswer.answerId);
      $scope.myAnswer.questionId = $scope.question.questionNumber;
      $scope.myAnswer.userId = $scope.userId;
      $scope.myAnswer.questionSet = $scope.questionSet;

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
    }
  };

  $scope.next = function() {
    $scope.count = 0;

    //Make the input enabled and submit invisible
    $("input[type=radio]").attr('disabled', false);
    $("input[type=range]").attr('disabled', false);
    $("#submit-button").css("display", "none");
    $("#confidence-container").css("display", "none");

    $scope.userId = $window.sessionStorage.getItem('userId');
    var data = {
      set: $scope.questionSet,
      id: parseInt($scope.myAnswer.questionId) + 1
    };

    $http({
      method: 'POST',
      url: api + '/question',
      data: data,
      type: JSON,
    }).then(function(response) {

      $scope.myAnswer = {};
      $scope.sliderChanged = false;
      $scope.myAnswer.confidence = 50;
      $scope.question = response.data;

      $scope.history.push({
        name: "QuizBot",
        msg: "Moving to the next question (" + ($scope.question.questionNumber + 1).toString() + "/34). If you need my help with words type 'HELP'."
      });
      $scope.scrollAdjust();

      if ($scope.question.img) {
        $("#image-container").css("display", "inline");
      } else {
        $("#image-container").css("display", "none");
      }

      $("#loader").css("display", "none");
      $("#loader-text").css("display", "none");
      $("#chart_div").css("display", "none");
      $("#change-section").css("display", "none");
      $("#submit-button").prop("disabled", false);
      $("#output").val("Not Specified");
      $("#output").css("color", "red");

    }, function(error) {
      console.log("Error occured when loading the question");
    });

  };

  //Chatbot function to start the quiz
  $scope.userState = "ready"; //Ready to start

  //Function to adjust scrolling - not working
  $scope.scrollAdjust = function() {
    var element = document.getElementById("text-area");
    element.scrollTop = element.scrollHeight;
  };

  $scope.go = function() {
    $("#question-area").css("display", "inline");
    $scope.history.push({
      name: "QuizBot",
      msg: "I can help you understand the question by explaining what certain words in the question mean. If you need my help type 'HELP'."
    });
    $scope.userState = "started"; //Started the quiz
    $scope.scrollAdjust();
  };

  $scope.words = function(words) {
    words = [{
        "key": "capital",
        "explaination": "This is the main city of the country/state"
      },
      {
        "key": "senuri",
        "explaination": "My name"
      },
      {
        "key": "Dam",
        "explaination": "Explanation for Dam"
      }
    ];
    $scope.history.push({
      name: "QuizBot",
      msg: "I can explain the following words related to this question."
    });

    for (var i = 0; i < words.length; i++) {
      var text = "";
      text += (i + 1).toString() + " : " + words[i].key;
      $scope.history.push({
        msg: text
      });
    }

    $scope.history.push({
      msg: "Type 'EXPLAIN' and the number of the word to find the meaning."
    });


  };

  $scope.sendMessage = function() {
    if ($scope.message != undefined) {
      $scope.history.push({
        name: "You",
        msg: $scope.message.toString()
      });
      $scope.scrollAdjust();

      //Handle requests
      var handle = $scope.message.toLowerCase();
      if (handle == 'go') {
        if ($scope.userState == "ready") {
          $scope.go();
        } else {
          $scope.history.push({
            name: "QuizBot",
            msg: "You have already started the quiz."
          });
        }
        $scope.message = "";
      } else if (handle == 'help') {
        $scope.words($scope.question.words);
        $scope.message = "";
      } else if (handle.includes('explain')) {
        $scope.message = "";
      } else {
        $scope.history.push({
          name: "QuizBot",
          msg: "Oops! I don't recognize this command. Please try again."
        });
        $scope.message = "";
      }
    }
  };
});
