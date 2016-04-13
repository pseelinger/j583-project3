var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatDate = d3.time.format("%d-%b-%y");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.Alaska); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var states= [];

d3.csv("states.csv", function(error, data) {
  if (error) throw error;
  for (var i = 1; i < Object.keys(data[0]).length ; i++){
    states[i-1] = Object.keys(data[0])[i];
  }

  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain([0,100]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  function drawLine(line){
        svg.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);
        }
  drawLine(line);
  var select_state = d3.select("body").append("select");
  var lines=[];
  for(i in states){
    select_state.append("option").text(states[i]);
    lines[i] = d3.svg.line()
                  .x(function(d) { return x(d.year); })
                  .y(function(d) { return y(d[states[i]]); });
  }
console.log(lines);
drawLine(lines[20]);
});

function type(d) {
  d.date = formatDate.parse(d.date);
  d.Alaska = +d.Alaska;
  return d;
}
