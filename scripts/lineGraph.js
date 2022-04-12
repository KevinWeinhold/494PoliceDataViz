var lineWidth, lineHeight, lineInnerWidth, lineInnerHeight;
var lineMargin = { top: 20, bottom: 30, left: 50, right: 10 };
var lineSvg;

document.addEventListener("DOMContentLoaded", () => {
    lineSvg = d3.select("#Scatter");
    lineWidth = +lineSvg.style("width").replace("px", "");
    lineHeight = +lineSvg.style("height").replace("px", "");
    lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;
    lineInnerHeight = lineHeight - lineMargin.top - lineMargin.bottom;

    drawline();
}