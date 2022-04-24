google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
function drawChart() {
  var data = google.visualization.arrayToDataTable([
  ['Task', 'Количество анкетируемых'],
  ['Мужчины', 8],
  ['Женщины', 2],
]);

  // Optional; add a title and set the width and height of the chart
  var options = {'title':'Пол анкетируемых', 'width':600, 'height':600, 'legend': 'top', colors: ['#4169E1', '#DD4492']};

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
}
drawChart();