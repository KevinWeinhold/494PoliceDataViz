var lineWidth, lineHeight, lineInnerWidth, lineInnerHeight;
var lineMargin = { top: 10, bottom: 10, left: 10, right: 20 };
var lineData, policeData;

document.addEventListener("DOMContentLoaded", () => {
  lineSvg = d3.select("#Scatter");

  lineWidth = +lineSvg.style("width").replace("px", "");
  lineHeight = +lineSvg.style("height").replace("px", "");
  lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;
  lineInnerHeight = lineHeight - lineMargin.top - lineMargin.bottom;

  // Load both files before doing anything else
  Promise.all([
    d3.csv("data/police_shootings.csv"),
  ]).then(function (values) {
    policeData = values[0];
    console.log(policeData)

    drawline();
  });
});

function drawline() {
    console.log("Drawing line")
}