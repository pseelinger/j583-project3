var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

//Initial line will show Alaska's data
var lineInit = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.Alaska); })
    .interpolate("linear");
var lines= [];
var states= [];
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//Dropdown Menu
var select_state = d3.select("body").append("select")
    .attr("class", "select_state");

//Get the data
d3.csv('states.csv', function(data) {
//Make a list of states in the dropdown menu and a line for each state
    for(var i = 1; i <= Object.keys(data[0]).length - 1; i++ ){
      states[i-1] = Object.keys(data[0])[i];
    }
    for(var i = 1; i <= Object.keys(data[0]).length - 1; i++ ){
      select_state.append("option").text(Object.keys(data[0])[i]);
      
      console.log(states[i-1]);
      lines[i-1] = d3.svg.line()
          .x(function(d) { return x(d["year"]); })
          .y(function(d) { var currentState = String(states[i-1]); return y(d[currentState]); })
          .interpolate("linear");
    }
//Scale data to fit in graph
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
      .text("Percent");

var drawline = function(line){ svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
};
drawline(lines[4]);

});
