var mapWidth, mapHeight, mapInnerWidth, mapInnerHeight;
var mapMargin = { top: 40, bottom: 20, left: 150, right: 20 };
var mapData, policeData;
var selectedState;

document.addEventListener("DOMContentLoaded", () => {
  mapSvg = d3.select("#Map");

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
    // stateData contains the number of occurences in each state
    stateData = {};
    policeData.forEach(e => {
      if(stateData[e["Incident.Location.State"]] != null)
        stateData[e["Incident.Location.State"]] += 1;
      else 
        stateData[e["Incident.Location.State"]] = 1;
    });
    drawMap();
  });
});

function drawMap() {
  // create the map projection and geoPath
  let usaProjection = d3
    .geoAlbersUsa()
    .fitSize([mapInnerWidth, mapInnerHeight], mapData);
  let geoPath = d3.geoPath().projection(usaProjection);

  let min, max;
  min = stateData[Object.keys(stateData).reduce((key, v) => stateData[v] < stateData[key] ? v : key)];
  max = stateData[Object.keys(stateData).reduce((key, v) => stateData[v] > stateData[key] ? v : key)];

  let colorScale = d3.scaleSequential(d3.interpolateInferno)
                      .domain([min,max]);

  let g = mapSvg.append("g");
  drawColorScale(g, colorScale);

  g.append('text')
    .attr('x', mapMargin.right)
    .attr('y', mapMargin.top)
    .text("Police Shooting Heatmap")
    .style('font-size', '25px');

  d3.select("#mapDesc")
    .attr('transform', `translate(${mapMargin.right},${mapMargin.top+25})`);

  g.append('text')
    .attr('x', mapMargin.right)
    .attr('y', mapInnerHeight/2)
    .text("Selected State:")
    .style('font-size', '25px');
  
  let stateText = g.append('text')
    .attr('x', mapMargin.right)
    .attr('y', mapInnerHeight/2+50)
    .text("")
    .style('font-size', '25px');

  g.selectAll(".stateMap")
    .data(mapData.features)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .classed("stateMap", true)
    .attr("id", (d) => d.properties.postal)
    .attr("fill", (d) => {
      return colorScale(stateData[d.properties.postal])
    })
    .on("click", function (d, i) {
      drawline(d.properties.postal);
      drawPie(d.properties.postal);
      stateText.text(d.properties.name);
    })
    .attr('transform', `translate(${mapMargin.left}, ${mapMargin.top})`);
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
   .attr('transform', `translate(${mapMargin.right},${mapInnerHeight-mapMargin.bottom})`)
   .attr("width", 200)
   .attr("height", 20)
   .style("fill", "url(#linear-gradient)");
  const colorAxis = d3.axisBottom(d3.scaleLinear()
                      .domain(colorScale.domain())
                      .range([0,200]))
                      .ticks(5).tickSize(-20);
  g.append('g').call(colorAxis)
   .attr('class','colorLegend')
   .attr('transform',`translate(${mapMargin.right},${mapInnerHeight-mapMargin.bottom+20})`)
   .selectAll('text')
   .style('text-anchor','end')
   .attr('dx','-0px')
   .attr('dy', '0px')
   .attr('transform','rotate(-45)');
   g.append('text')
     .attr('x',mapMargin.right)
     .attr('y',mapInnerHeight-mapMargin.bottom-5)
     .style('font-size','.9em')
     .text("Shootings");
}
