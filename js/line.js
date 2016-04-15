//File for putting the graph and associated controls on the page
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
//construct the svg
var svg = d3.select("#svg-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var states = [];
var statesOnGraph = [];
//read the data from the csv file
d3.csv("states.csv", function(error, data) {
if (error) throw error;
//get an array of state names so that we can put them as options in the select menu later on
for (var i = 1; i < Object.keys(data[0]).length ; i++){
      states[i-1] = Object.keys(data[0])[i];
    }
    states.sort();
//max and min values for the graph
  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain([0,100]);
//title
  svg.append("text")
      .text("Percent of Homeless Population Without Shelter by State")
      .attr("transform", "translate(" + width/2 + ",0)")
      .attr("text-anchor", "middle")
      .attr("style", "font-size: 30px; font-family: Estandar;");
// set up axes
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .text("Year")
      .attr("transform", "translate(" + width/2 + ",60)")
      .style("font-size", "24px")
      .attr("text-anchor", "middle");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "translate(-80," + height/2 + ") rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .style("font-size", "24px")
      .text("Percent");
//Function to draw the line
  function drawLine(line, data, state){
//Function returns whether or not the state has been plotted
    function isOnGraph (e){
      return statesOnGraph.indexOf(e) > -1;
    }
//If it hasn't been plotted, plot the state's data
    if(!isOnGraph(state)){
      //generate a random color for the line and its identifier in the legend
      var stroke = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);})
      //tooltip
      var div = d3.select("body").append("div")
   .attr("class", "tooltip")
   .style("opacity", 0);
   //the line
        svg.append("path")
          .datum(data)
          .attr("class", "line ")
          .attr("d", line)
          .attr("stroke", stroke);
  //points on the line that you can hover over
        svg.selectAll("point")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "point")
          .attr("cx", function(d){ return x(d.year) ;})
          .attr("cy", function(d){ return y(d[state]) ;})
          .attr("r", 5)
          .attr("fill", stroke)
          //controls the tooltip
          .on("mouseover", function(d) {
            div.transition()
                .duration(300)
                .style("opacity", 1);
            div .html(state + " " + d.year + ": " + Number(d[state]).toFixed(2) + "%")
                .style("left", (d3.event.pageX - 15) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
            })
          .on("mouseout", function(d) {
              div.transition()
                  .duration(500)
                  .style("opacity", 0);
        });
        //the legend shows the state on a background of the color its line is
        d3.select("#legend").append("p")
            .data("data")
            .text(state)
            .attr("style", "background-color:" + stroke )
            .attr("fill", stroke);
            //add the state to the array of states already plotted
            statesOnGraph.push(state);
          }
}
// select menu
  var select_state = d3.select("#controls").append("select").attr("id", "state-select");
  for(var l in states){
    select_state.append("option").text(states[l]);
  }
  //function to plot another state on the graph
  var state = "";
  function newLine(state){
    //get data relevant to the state
    line = d3.svg.line()
                  .x(function(d) { return x(d.year); })
                  .y(function(d) { return y(d[state]); });
    //draw the new line using the data gathered here
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
  $('.point').hide();
});
//Draw the initial line on the graph
drawLine(line, data, "Alabama");
});
