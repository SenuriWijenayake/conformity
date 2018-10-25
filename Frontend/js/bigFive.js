$(document).ready(function() {
  $("#finish").click(function() {
    var answersList = {};
    //Loop over all questoins
    $(".question").each(function() {
      var questionId = $(this).attr("id");
      var answer = $('input[name=' + questionId + ']:checked').val();

      //if Answer isnt provided do not update the answersList
      if (answer !== undefined) {
        answersList[questionId] = parseInt(answer);
      }
    });

    console.log(answersList);

    $.ajax({
       type: "POST",
       data: answersList,
       url: "http://localhost:8080/bigFiveData",
       success: function(msg){
         alert("Data submitted successfully!");
       }
    });
  });
});
