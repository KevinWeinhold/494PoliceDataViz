function drawPie(postal) {
  pieSvg = d3.select("#PieChart");
  margin = { left: 10, right: 10, top: 10, bottom: 10 };
  width = +pieSvg.style("width").replace("px", "");
  height = +pieSvg.style("height").replace("px", "");
  pieWidth = width / 2 - margin.left - margin.right;
  pieHeight = height / 2 - margin.top - margin.bottom;
  pieRadius = Math.min(pieWidth, pieHeight) / 2;

  pieSvg.selectAll("*").remove();
  let genderData = { Male: 0, Female: 0 };
  let raceData = {};
  let stateData = policeData.filter(
    (d) => d["Incident.Location.State"] == postal
  );
  stateData.forEach((e) => {
    if (e["Person.Gender"] == "Male") genderData["Male"]++;
    else genderData["Female"]++;
    if (raceData[e["Person.Race"]] == null) raceData[e["Person.Race"]] = 1;
    else raceData[e["Person.Race"]]++;
  });
  let colorScaleGender = d3
    .scaleOrdinal()
    .domain(genderData)
    .range(d3.schemeSet1);
  let colorScaleRace = d3.scaleOrdinal().domain(raceData).range(d3.schemeSet2);
  let pie = d3.pie().value((d) => d.value);
  let pieGenderData = pie(d3.entries(genderData));
  let pieRaceData = pie(d3.entries(raceData));
  let arcGen = d3.arc().innerRadius(0).outerRadius(pieRadius);

  pieSvg
    .append("text")
    .attr("x", width / 2 - 100)
    .attr("y", margin.top + 20)
    .text("Distribution of Victims by")
    .style("font-size", "20px");

  let genderSvg = pieSvg
    .append("g")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
    .attr(
      "transform",
      `translate(${pieWidth / 2 + margin.left},${height / 2})`
    );

  // let raceSvg = pieSvg.append("g")
  // 	.attr("width", pieWidth)
  // 	.attr("height", pieHeight)
  // 	.attr('transform', `translate(${pieWidth/2*3+margin.left*2},${height/2})`)

  genderSvg
    .selectAll("genderSlices")
    .data(pieGenderData)
    .enter()
    .append("path")
    .attr("d", arcGen)
    .attr("fill", (d) => colorScaleGender(d.data.key))
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);
  // raceSvg.selectAll('raceSlices')
  // 	.data(pieRaceData)
  // 	.enter()
  // 	.append('path')
  // 		.attr('d', arcGen)
  // 		.attr('fill', d => colorScaleRace(d.data.key))
  // 		.attr("stroke", "black")
  // 		.style("stroke-width", "2px")
  // 		.style("opacity", 0.7)
  pieSvg
    .append("text")
    .attr("x", pieWidth / 2 + margin.left - 27)
    .attr("y", height / 2 - pieHeight / 2 - 20)
    .text("Gender")
    .style("font-size", "20px");
  pieSvg
    .append("text")
    .attr("x", (pieWidth / 2) * 3 + margin.left * 2 - 20)
    .attr("y", height / 2 - pieHeight / 2 - 20)
    .text("Race")
    .style("font-size", "20px");
  pieSvg
    .append("circle")
    .attr("cx", margin.left * 2)
    .attr("cy", height / 2 + pieHeight / 2 + margin.bottom)
    .attr("r", 4)
    .style("fill", colorScaleGender("Male"));
  pieSvg
    .append("circle")
    .attr("cx", margin.left * 2)
    .attr("cy", height / 2 + pieHeight / 2 + margin.bottom + 15)
    .attr("r", 4)
    .style("fill", colorScaleGender("Female"));
  pieSvg
    .append("text")
    .attr("x", margin.left * 2 + 15)
    .attr("y", height / 2 + pieHeight / 2 + margin.bottom + 5)
    .text("Male")
    .style("font-size", "15px");
  pieSvg
    .append("text")
    .attr("x", margin.left * 2 + 15)
    .attr("y", height / 2 + pieHeight / 2 + margin.bottom + 20)
    .text("Female")
    .style("font-size", "15px");
  spacing = 0;
  // pieSvg.selectAll('raceCircles')
  // 	.data(pieRaceData)
  // 	.enter()
  // 	.append('circle')
  // 		.attr('cx', pieWidth/2*2+margin.left*2)
  // 		.attr('cy', () => {
  // 			cy = height/2+pieHeight/2+margin.bottom+spacing;
  // 			spacing+=15;
  // 			return cy;
  // 		})
  // 		.attr('r', 4)
  // 		.style('fill', d => colorScaleRace(d.data.key));
  spacing = 5;
  // pieSvg.selectAll('raceTexts')
  // 	.data(pieRaceData)
  // 	.enter()
  // 	.append('text')
  // 		.attr('x', pieWidth/2*2+margin.left*2+15)
  // 		.attr('y', () => {
  // 			y = height/2+pieHeight/2+margin.bottom+spacing;
  // 			spacing+=15;
  // 			return y;
  // 		})
  // 		.text(d => d.data.key)
  // 		.style('font-size', '15px');
}
