var app = angular.module('app', []);

app.controller('BigFiveController', function($scope, $http) {
  var api = 'http://localhost:8080';
  $http({
       method: 'GET',
       url: api + '/bigFiveQuestions'
    }).then(function (response){
      $scope.questions = response.data;
    },function (error){
      console.log("Error occured when loading the big five questions");
    });
});
