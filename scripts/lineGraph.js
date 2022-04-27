var lineWidth, lineHeight, lineInnerWidth, lineInnerHeight;
var lineMargin = { top: 70, bottom: 5, left: 50, right: 10 };
var lineSvg;

function queryPoliceData(statePostal) {
    queried = policeData;
    queried = queried.filter(function(d) {
      return d["Incident.Location.State"] === statePostal
    });
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
  
//TODO: move to file
function drawline(postal) {
  lineSvg = d3.select("#Scatter");
  lineWidth = +lineSvg.style("width").replace("px", "");
  lineHeight = +lineSvg.style("height").replace("px", "");
  lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;
  lineInnerHeight = lineHeight - lineMargin.top - lineMargin.bottom;
  console.log("drawing linegraph");
  lineSvg.selectAll("*").remove();

  var lineData = queryPoliceData(postal);
  lineData = reducePoliceData(lineData);

  let max = d3.max(lineData, d => +d["Frequency"])

  //axes
  var x = d3.scaleTime()
                  .domain([new Date(year = 2015), new Date(year = 2021)])
                  .range([lineMargin.left, lineInnerWidth]);

  var y = d3.scaleLinear()
                  .domain([max+5, 0])
                  .range([lineMargin.top, lineInnerHeight]);

  var xAxis = d3.axisBottom(x);
  
  var yAxis = d3.axisLeft(y);

  lineSvg.append('text')
    .attr('x', 30)
    .attr('y', lineMargin.bottom+30)
    .text("Frequency of Shootings over Time")
    .style('font-size', '20px');

  lineSvg.append("g")
          .attr("transform", `translate(0,${lineInnerHeight})`)
          .call(xAxis)
          .selectAll("text")  
            .style("text-anchor", "end")
            .attr("transform", "rotate(-90)" );

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
  
  xAxis.ticks(d3.timeYear, 1)
        .tickFormat(d3.timeFormat('%Y'))

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
                      return x(new Date(year = d["Year"]))})
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
          .attr("cx", function (d) { return x(new Date(d["Year"])); } )
          .attr("cy", function (d) { return y(d["Frequency"]); } )
          .attr("r", 4)
          .style("fill", "black");
}