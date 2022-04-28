var marginBubble = { top: 10, bottom: 10, left: 10, right: 20 };

function filterPoliceData(statePostal) {
  queried = policeData;
  queried = queried.filter(function (d) {
    return d["Incident.Location.State"] === statePostal;
  });
  return queried;
}

function drawBubbles(statePostal) {
  var filteredData = filterPoliceData(statePostal);
  console.log(filteredData);
  var bubbleSVG = d3.select("#PieChart");
  const width = +bubbleSVG.style("width").replace("px", "");
  const height = +bubbleSVG.style("height").replace("px", "");
  const innerWidth = width - marginBubble.left - marginBubble.right;
  const innerHeight = height - marginBubble.top - marginBubble.bottom;

  // TODO: filter the police data by state
  // calculating counts
  var hispanicCount = _.filter(filteredData, function (d) {
    if (d["Person.Race"] == "Hispanic") return d;
  }).length;
  console.log("HispanicCount", hispanicCount);

  var whiteCount = _.filter(filteredData, function (d) {
    if (d["Person.Race"] == "White") return d;
  }).length;
  console.log("whiteCount", whiteCount);

  var asianCount = _.filter(filteredData, function (d) {
    if (d["Person.Race"] == "Asian") return d;
  }).length;
  console.log("asianCount", asianCount);

  var africanAmericanCount = _.filter(filteredData, function (d) {
    if (d["Person.Race"] == "African American") return d;
  }).length;
  console.log("africanAmericanCount", africanAmericanCount);

  var nativeAmericanCount = _.filter(filteredData, function (d) {
    if (d["Person.Race"] == "Native American") return d;
  }).length;
  console.log("nativeAmericanCount", nativeAmericanCount);

  var otherCount = _.filter(filteredData, function (d) {
    if (d["Person.Race"] == "Other") return d;
  }).length;
  console.log("otherCount", otherCount);

  var unknownCount = _.filter(filteredData, function (d) {
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

  var diameter = 280;
  var color = d3.scaleOrdinal(d3.schemeSet1);

  var bubble = d3.pack(raceObject).size([diameter, diameter]).padding(1.5);

  var svg = d3
    .select("#PieChart")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble")
    .attr("translate", (500, 0));

  let toolTipDiv = d3
    .select("body")
    .append("div")
    .attr("class", "tooltipItem")
    .style("opacity", 0);

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
    })
    .on("mouseover", function (d) {
      console.log("d", d.data);
      let tInfo = `Race: ${d.data.Name}<br/>Count: ${d.data.Count}`;
      d3.select(this)
        .transition()
        .duration("120")
        .attr("opacity", "0.88")
        .attr("stroke-width", "4");
      toolTipDiv
        .html(tInfo)
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 5 + "px");
      toolTipDiv.transition().duration("120").style("opacity", 1);
    })
    .on("mouseout", function (d, i) {
      d3.select(this)
        .transition()
        .duration("50")
        .attr("stroke-width", 1)
        .attr("opacity", "1.0");
      toolTipDiv.transition().duration("500").style("opacity", 0);
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
      if (d.r / 5 <= 15) {
        return 9;
      } else {
        return d.r / 5;
      }
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
