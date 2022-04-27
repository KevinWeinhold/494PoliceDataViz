var mapWidth, mapHeight, mapInnerWidth, mapInnerHeight;
var mapMargin = { top: 10, bottom: 10, left: 100, right: 20 };
var mapData, policeData;

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
  });
});

function drawMap() {
  mapSvg.selectAll("*").remove();
  // create the map projection and geoPath
  let usaProjection = d3
    .geoAlbersUsa()
    .fitSize([mapWidth+mapMargin.left, mapHeight], mapData);
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
      return colorScale(stateData[d.properties.postal])
    })
    .on("click", function (d, i) {
      drawline(d.properties.postal)
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
