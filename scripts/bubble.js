var marginBubble = { top: 10, bottom: 10, left: 10, right: 20 };

document.addEventListener("DOMContentLoaded", () => {
  Promise.all([d3.csv("data/police_shootings.csv")]).then(function (values) {
    policeData = values[0];
    drawBubbles();
  });
});

function drawBubbles() {
  var bubbleSVG = d3.select("body");
  const width = +bubbleSVG.style("width").replace("px", "");
  const height = +bubbleSVG.style("height").replace("px", "");
  const innerWidth = width - marginBubble.left - marginBubble.right;
  const innerHeight = height - marginBubble.top - marginBubble.bottom;

  // TODO: filter the police data by state
  // calculating counts
  var hispanicCount = _.filter(policeData, function (d) {
    if (d["Person.Race"] == "Hispanic") return d;
  }).length;
  console.log("HispanicCount", hispanicCount);

  var whiteCount = _.filter(policeData, function (d) {
    if (d["Person.Race"] == "White") return d;
  }).length;
  console.log("whiteCount", whiteCount);

  var asianCount = _.filter(policeData, function (d) {
    if (d["Person.Race"] == "Asian") return d;
  }).length;
  console.log("asianCount", asianCount);

  var africanAmericanCount = _.filter(policeData, function (d) {
    if (d["Person.Race"] == "African American") return d;
  }).length;
  console.log("africanAmericanCount", africanAmericanCount);

  var nativeAmericanCount = _.filter(policeData, function (d) {
    if (d["Person.Race"] == "Native American") return d;
  }).length;
  console.log("nativeAmericanCount", nativeAmericanCount);

  var otherCount = _.filter(policeData, function (d) {
    if (d["Person.Race"] == "Other") return d;
  }).length;
  console.log("otherCount", otherCount);

  var unknownCount = _.filter(policeData, function (d) {
    if (d["Person.Race"] == "Unknown") return d;
  }).length;
  console.log("unknownCount", unknownCount);

  const raceObject = {
    children: [
      { Name: "Hispanic", Count: hispanicCount },
      { Name: "White", Count: whiteCount },
      { Name: "Asian", Count: asianCount },
      { Name: "AfricanAmerican", Count: africanAmericanCount },
      { Name: "NativeAmerican", Count: nativeAmericanCount },
      { Name: "Other", Count: otherCount },
      { Name: "Unknown", Count: unknownCount },
    ],
  };

  var diameter = 300;
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var bubble = d3.pack(raceObject).size([diameter, diameter]).padding(1.5);

  var svg = d3
    .select("#PieChart")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

  var nodes = d3.hierarchy(raceObject).sum(function (d) {
    return d.Count;
  });

  var node = svg
    .selectAll(".node")
    .data(bubble(nodes).descendants())
    .enter()
    .filter(function (d) {
      return !d.children;
    })
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  node.append("title").text(function (d) {
    return d.Name + ": " + d.Count;
  });

  node
    .append("circle")
    .attr("r", function (d) {
      return d.r;
    })
    .style("fill", function (d, i) {
      return color(i);
    });

  node
    .append("text")
    .attr("dy", ".2em")
    .style("text-anchor", "middle")
    .text(function (d) {
      return d.data.Name.substring(0, d.r / 3);
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", function (d) {
      return d.r / 5;
    })
    .attr("fill", "white");

  node
    .append("text")
    .attr("dy", "1.3em")
    .style("text-anchor", "middle")
    .text(function (d) {
      return d.data.Count;
    })
    .attr("font-family", "Gill Sans", "Gill Sans MT")
    .attr("font-size", function (d) {
      return d.r / 5;
    })
    .attr("fill", "white");

  d3.select(self.frameElement).style("height", diameter + "px");
}
