var novelSvg, personSvg;
var width, height;
var innerWidth, innerHeight;
var margin = {left : 10, right: 10, top: 10, bottom: 10};
var policeData;

document.addEventListener("DOMContentLoaded", () => {
	novelSvg = d3.select("#Novel");
  
	width = +pieSvg.style("width").replace("px", "");
	height = +pieSvg.style("height").replace("px", "");
	innerWidth = width - margin.left - margin.right;
	innerHeight = height - margin.top - margin.bottom;
  
	// Load both files before doing anything else
	Promise.all([
	  d3.csv("data/police_shootings.csv"),
	  d3.xml("data/person.svg")
	]).then(function (values) {
	  policeData = values[0];
	  personSvg = values[1];
	});
});

function drawNovel()
{
	novelSvg.selectAll('*').remove();
	
}