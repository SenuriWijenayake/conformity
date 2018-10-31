var app = angular.module('app', []);
var api = 'http://localhost:8080';

app.controller('BigFiveController', function($scope, $http) {
  $http({
       method: 'GET',
       url: api + '/bigFiveQuestions'
    }).then(function (response){
      $scope.questions = response.data;
    },function (error){
      console.log("Error occured when loading the big five questions");
    });
});

app.controller('HomeController', function($scope, $http, $window) {
  $scope.submitDetails = function(user){
    $http({
         method: 'POST',
         url: api + '/user',
         data: user,
         type: JSON,
      }).then(function (response){
        $window.sessionStorage.setItem ('userId', response.data);
        $window.location.href = './quiz.html';
      },function (error){
        console.log("Error occured when loading the big five questions");
      });
  };
});

app.controller('QuizController', function($scope, $http, $window) {
  $scope.myAnswer = {};
  $scope.myAnswer.confidence = 1;
  $scope.userId = $window.sessionStorage.getItem('userId');

  $scope.question = {"questionId": 0, "questionText":"What is the capital of Spain?","questionImg":null,"answers":[{"answer":"Barcelona","id":1},{"answer":"Madrid","id":2},{"answer":"Seville","id":3},{"answer":"Lisbon","id":4}]};

  $scope.submitAnswer = function(){
    if ($scope.myAnswer.confidence != 1){
      $scope.myAnswer.answerId = parseInt($scope.myAnswer.answerId);
      $scope.myAnswer.questionId =  $scope.question.questionId;
      $scope.myAnswer.userId = $scope.userId;

      console.log($scope.myAnswer);
      $http({
           method: 'POST',
           url: api + '/chartData',
           data : $scope.myAnswer,
           type : JSON,
        }).then(function (response){
          console.log(response);

        },function (error){
          console.log("Error occured when loading the quiz questions");
        });
    }
  }
});
