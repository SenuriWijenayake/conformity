$(document).ready(function() {
  $("#finish").click(function() {
    var answersList = [];
    //Loop over all questoins
    $(".question").each(function() {
      var questionId = $(this).attr("id");
      var answer = $('input[name=' + questionId + ']:checked').val();

      //if Answer isnt provided do not update the answersList
      if (answer !== undefined) {
        answersList.push({
          question: questionId,
          answer: parseInt(answer)
        });
      }
    });
    console.log(answersList);
    $.post("http://localhost:8080/bigFiveData", answersList, function( data ) {
      console.log(data);
    });
  });
});
