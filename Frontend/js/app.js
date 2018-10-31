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

app.controller('HomeController', function($scope, $http) {
  var api = 'http://localhost:8080';
  $scope.submitDetails = function(user){
    $http({
         method: 'POST',
         url: api + '/user',
         data: user,
         type: JSON,
      }).then(function (response){

      },function (error){
        console.log("Error occured when loading the big five questions");
      });
  };
});
