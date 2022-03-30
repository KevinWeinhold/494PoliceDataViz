var mapWidth, mapHeight, mapInnerWidth, mapInnerHeight;
var mapMargin = { top: 10, bottom: 10, left: 10, right: 20 };

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
    drawMap();
  });
});

function drawMap() {
  mapSvg.selectAll("*").remove();
  // create the map projection and geoPath
  let usaProjection = d3
    .geoAlbersUsa()
    .fitSize([mapInnerWidth, mapInnerHeight], mapData);
  let geoPath = d3.geoPath().projection(usaProjection);

  let selectedColorValue = d3.interpolateInferno;
  let colorScale = d3.scaleLinear().domain([0]);

  let g = mapSvg.append("g");

  g.selectAll(".stateMap")
    .data(mapData.features)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .classed("stateMap", true)
    .attr("id", (d) => d.properties.postal)
    .attr("fill", (d) => {
      return "black";
    })
    .on("click", function (d, i) {
      drawLineChart(d.properties.name);
    });
}
