//This file puts the graph on the page
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
//Initial line is Alabama's data
var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.Alabama); });

var svg = d3.select("#svg-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var states = [];
var statesOnGraph = [];

d3.csv("states.csv", function(error, data) {
if (error) throw error;
//get an array of state names so that we can put them as options in the select menu later on
for (var i = 1; i < Object.keys(data[0]).length ; i++){
      states[i-1] = Object.keys(data[0])[i];
    }
    states.sort();
// set up axes
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

//Function to draw the line

  function drawLine(line, data, state){

    function isOnGraph (e){
      return statesOnGraph.indexOf(e) > -1;
    }

    var stroke = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);})

console.log(isOnGraph(state));

//check if the state has already been plotted
if(!isOnGraph(state)){

  //draw the line if it has not been plotted
    svg.append("path")
      .datum(data)
      .attr("class", "line ")
      .attr("d", line)
      .attr("stroke", stroke);

    d3.select("#legend").append("p")
        .data("data")
        .text(state)
        .attr("style", "background-color:" + stroke )
        .attr("fill", stroke);
        //add the state to the list of states plotted
        statesOnGraph.push(state);
      }
    }

// select menu
  var select_state = d3.select("#controls").append("select").attr("id", "state-select");


  for(var l in states){
    select_state.append("option").text(states[l]);
  }
  //function to change state shown
  var state = "";
  function newLine(state){
    line = d3.svg.line()
                  .x(function(d) { return x(d.year); })
                  .y(function(d) { return y(d[state]); });

    drawLine(line, data, state);
  }
// the handler for changing the line
$("#state-select").on("change", function(){
  newLine($("#state-select option:selected").text());
});
$("#reset").click(function(){
  statesOnGraph = [];
  $('.line').hide();
  $('#legend p').hide();
});
//Draw the initial line on the graph
drawLine(line, data, "Alabama");
});
