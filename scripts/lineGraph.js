var lineWidth, lineHeight, lineInnerWidth, lineInnerHeight;
var lineMargin = { top: 70, bottom: 60, left: 50, right: 10 };
var lineSvg;
var genderSelection = "All";
var raceSelection = ["All"];
var currentPostal;

function queryPoliceData(statePostal) {
    queried = policeData;
    queried = queried.filter(function(d) {
      return d["Incident.Location.State"] === statePostal;
    });

    if (genderSelection !== "All") {
      queried = queried.filter(function(d) {
        return d["Person.Gender"] === genderSelection;      
      });
    }

    if (!raceSelection.includes("All")) {
      queried = queried.filter(function(d) {
        return raceSelection.includes(d["Person.Race"]);      
      });
    }
    return queried;
}
  
function reducePoliceData(lineData) {
  var policeDataFrequency = {}
  lineData.forEach(e => {
    if(policeDataFrequency[+e["Incident.Date.Year"]] != null)
      policeDataFrequency[+e["Incident.Date.Year"]] += 1;
    else 
      policeDataFrequency[+e["Incident.Date.Year"]] = 1;
  });
  
  var objArr = []
  for (let i=2015; i<=2021; i++) {
    freq = policeDataFrequency[i];
    if(freq == null)
      freq = 0;
    let obj = {
      "Year": i,
      "Frequency": freq
    }
    objArr.push(obj)
  }
  return objArr
}
  
function drawline(postal) {
  d3.select("#lineSelectors").property("hidden", false);

  if (postal == undefined) {
    postal = selectedStatePostal;
  }

  lineSvg = d3.select("#Scatter");
  lineWidth = +lineSvg.style("width").replace("px", "");
  lineHeight = +lineSvg.style("height").replace("px", "");
  lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;
  lineInnerHeight = lineHeight - lineMargin.top - lineMargin.bottom;
  console.log("drawing linegraph");
  lineSvg.selectAll("*").remove();

  //genderSelection = d3.select("#genderSelect").property("value");
  //d3.select("#raceSelect").property("value");

  var lineData = queryPoliceData(postal);
  lineData = reducePoliceData(lineData);

  let max = d3.max(lineData, d => +d["Frequency"])

  //axes
  var x = d3.scaleTime()
                  .domain([new Date(year = 2015, monthIndex = 0), new Date(year = 2021, monthIndex = 0)])
                  .range([lineMargin.left, lineInnerWidth]);

  var y = d3.scaleLinear()
                  .domain([max+5, 0])
                  .range([lineMargin.top, lineInnerHeight]);

  var xAxis = d3.axisBottom(x)
                //.ticks(d3.timeYear, 1)
                .tickFormat(d3.timeFormat('%Y'));
  
  var yAxis = d3.axisLeft(y);

  lineSvg.append('text')
    .attr('x', 30)
    .attr('y', lineMargin.bottom - 10)
    .text("Frequency of Shootings over Time")
    .style('font-size', '20px');

  lineSvg.append("g")
          .attr("transform", `translate(0,${lineInnerHeight})`)
          .call(xAxis)
          .selectAll("text")  
            .style("text-anchor", "end")
            //.attr("transform", "rotate(0)" );

  lineSvg.append("g")
          .attr("transform", `translate(${lineMargin.left},0)`)
          .call(yAxis);

  //ticks
  lineSvg.append("g")
          .attr("transform", `translate(${lineMargin.left}, 0)`)
          .call(d3.axisRight(y)
                      .tickSize(lineInnerWidth - lineMargin.left + 2)
                      .tickFormat(""))
          .call(g => g.select(".domain").remove())
          .call(g => g.selectAll(".tick line")
                      .attr("stroke-opacity", 0.5)
                      .attr("stroke-dasharray", "5.10"));

  //Axis labels
  lineSvg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", lineInnerWidth / 2)
      .attr("y", lineInnerHeight + 45)
      .text("Year");

  lineSvg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", lineMargin.left - 50)
      .attr("x",0 - (lineInnerHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Frequency"); 

  var line = d3.line()
                  .x(function(d) {
                    console.log(new Date(year = d["Year"], monthIndex = 0))
                      return x(new Date(year = d["Year"], monthIndex = 0))})
                  .y(function(d) {
                      return y(d["Frequency"])})
  
  // Add the line
  lineSvg.append("path")
          .datum(lineData)
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .attr("d", line)

  //draw points
  lineSvg.append("g")
          .selectAll("dot")
          .data(lineData)
          .enter()
          .append("circle")
          .attr("cx", function (d) { return x(new Date(d["Year"], monthIndex = 0)); } )
          .attr("cy", function (d) { return y(d["Frequency"]); } )
          .attr("r", 4)
          .style("fill", "black");
}