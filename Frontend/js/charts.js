// Load the Visualization API and the corechart package.
google.charts.load('current', {
  'packages': ['corechart']
});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Get the data for the chart
var chartData = {};
$.get("http://localhost:8080/chartData/1/2/309/0.67", function(data) {
  chartData = JSON.parse(data);
});

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
    'title': chartData.question,
    'width': 700,
    'height': 500
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}
