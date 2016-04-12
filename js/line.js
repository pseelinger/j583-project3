var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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

var totalLine = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.total); })
    .interpolate("linear");

var shelteredLine = d3.svg.line()
    .x(function(d){ return x(d.year); })
    .y(function(d){return y(d.sheltered);})

var unshelteredLine = d3.svg.line()
    .x(function(d){ return x(d.year); })
    .y(function(d){return y(d.unsheltered);})

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv('totals.csv', function(data) {

  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain(d3.extent(data, function(d) { return d.total; }));

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

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", totalLine);

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", shelteredLine);

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", unshelteredLine);
});
