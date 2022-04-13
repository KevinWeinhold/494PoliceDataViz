var mapWidth, mapHeight, mapInnerWidth, mapInnerHeight;
var mapMargin = { top: 10, bottom: 10, left: 10, right: 20 };
var mapData, policeData;

//TODO: move to file
var lineWidth, lineHeight, lineInnerWidth, lineInnerHeight;
var lineMargin = { top: 20, bottom: 30, left: 50, right: 10 };
var lineSvg;

document.addEventListener("DOMContentLoaded", () => {
  mapSvg = d3.select("#Map");

  //TODO: move to file
  lineSvg = d3.select("#Scatter");
  lineWidth = +lineSvg.style("width").replace("px", "");
  lineHeight = +lineSvg.style("height").replace("px", "");
  lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;
  lineInnerHeight = lineHeight - lineMargin.top - lineMargin.bottom;


  mapWidth = +mapSvg.style("width").replace("px", "");
  mapHeight = +mapSvg.style("height").replace("px", "");
  mapInnerWidth = mapWidth - mapMargin.left - mapMargin.right;
  mapInnerHeight = mapHeight - mapMargin.top - mapMargin.bottom;

  // Load both files before doing anything else
  Promise.all([
    d3.json("data/us.geojson"),
    d3.csv("data/police_shootings.csv"),
  ]).then(function (values) {
    mapData = values[0];
    policeData = values[1];
    console.log(policeData);
    // stateData contains the number of occurences in each state
    stateData = {};
    policeData.forEach(e => {
      if(stateData[e["Incident.Location.State"]] != null)
        stateData[e["Incident.Location.State"]] += 1;
      else 
        stateData[e["Incident.Location.State"]] = 1;
    });
    console.log(stateData)
    drawMap();

    //TODO: move to file
    drawline();

  });
});

function drawMap() {
  mapSvg.selectAll("*").remove();
  // create the map projection and geoPath
  let usaProjection = d3
    .geoAlbersUsa()
    .fitSize([mapInnerWidth, mapInnerHeight], mapData);
  let geoPath = d3.geoPath().projection(usaProjection);

  let min, max;
  min = stateData[Object.keys(stateData).reduce((key, v) => stateData[v] < stateData[key] ? v : key)];
  max = stateData[Object.keys(stateData).reduce((key, v) => stateData[v] > stateData[key] ? v : key)];
  console.log(max)

  let colorScale = d3.scaleSequential(d3.interpolateInferno)
                      .domain([min,max]);

  let g = mapSvg.append("g");
  drawColorScale(g, colorScale);

  g.selectAll(".stateMap")
    .data(mapData.features)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .classed("stateMap", true)
    .attr("id", (d) => d.properties.postal)
    .attr("fill", (d) => {
      if(stateData[d.properties.postal] == null)
        console.log(d.properties.postal)
      return colorScale(stateData[d.properties.postal])
    })
    .on("click", function (d, i) {
      
    });
}

function drawColorScale(g, colorScale) {
  const linearGradient = g.append("defs")
                          .append("linearGradient")
                          .attr("id", "linear-gradient");
  linearGradient.selectAll("stop")
                .data(colorScale.ticks()
                .map((t, i, n) => ({ 
                  offset: `${100*i/n.length}%`, 
                  color: colorScale(t) })))
                .enter()
                  .append("stop")
                  .attr("offset", d => d.offset)
                  .attr("stop-color", d => d.color);
  g.append("rect")
   .attr('transform', `translate(20,100)`)
   .attr("width", 200)
   .attr("height", 20)
   .style("fill", "url(#linear-gradient)");
  const colorAxis = d3.axisBottom(d3.scaleLinear()
                      .domain(colorScale.domain())
                      .range([0,200]))
                      .ticks(5).tickSize(-20);
  g.append('g').call(colorAxis)
   .attr('class','colorLegend')
   .attr('transform','translate(20,120)')
   .selectAll('text')
   .style('text-anchor','end')
   .attr('dx','-0px')
   .attr('dy', '0px')
   .attr('transform','rotate(-45)');
   g.append('text')
     .attr('x',20)
     .attr('y',90)
     .style('font-size','.9em')
     .text("Shootings");
}

function queryPoliceData() {
  queried = policeData;
  queried = queried.filter(function(d) {
    // console.log(d["Incident.Location.State"] === "CO")
    return d["Incident.Location.State"] === "CO"
  });
  console.log(queried)
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
    let obj = {
      "Year": i,
      "Frequency": policeDataFrequency[i]
    }
    objArr.push(obj)
  }
  return objArr
}

//TODO: move to file
function drawline() {
  console.log("drawing linegraph");
  lineSvg.selectAll("*").remove();

  var lineData = queryPoliceData();
  lineData = reducePoliceData(lineData);
  // console.log(lineData)

  // let max = d3.max(lineData, d => +d["Frequency"])
  // let min = d3.min(lineData, d => +d["Frequency"])

  //axes
  var x = d3.scaleTime()
                  .domain([new Date(year = 2015), new Date(year = 2021)])
                  .range([lineMargin.left, lineInnerWidth]);

  var y = d3.scaleLinear()
                  .domain([60, 0])
                  .range([lineMargin.top, lineInnerHeight]);

  var xAxis = d3.axisBottom(x);
  
  var yAxis = d3.axisLeft(y);

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
      .attr("x",0 - (lineInnerHeight / 2) + 20)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Frequency"); 

  lineSvg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", (lineInnerWidth / 2))
      .attr("y", lineMargin.top)
      .text(`Seleted state: Colorado`);

  var line = d3.line()
                  .x(function(d) {
                    console.log(new Date(year = d["Year"]))
                      return x(new Date(year = d["Year"]))})
                  .y(function(d) {
                    console.log(d["Frequency"])
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