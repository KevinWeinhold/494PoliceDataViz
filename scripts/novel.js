var novelSvg;

function drawNovel(postal)
{
	console.log("novel")
	novelSvg = d3.select("#Novel");
	margin = {left : 10, right: 10, top: 30, bottom: 10};
	width = +novelSvg.style("width").replace("px", "");
	height = +novelSvg.style("height").replace("px", "");
	innerWidth = width - margin.left - margin.right;
	innerHeight = height - margin.top - margin.bottom;

	novelSvg.selectAll('*').remove();
	novelSvg.append('text')
		.attr('x', margin.left)
		.attr('y', margin.top)
		.text("In Memory Of...")
		.style('font-size', '20px')

	let stateData = policeData.filter(d => (d["Incident.Location.State"] == postal) && (d["Person.Name"] != "Unknown"));
	
	let container = novelSvg.append('g')
		.attr('width', innerWidth)
		.attr('height', innerHeight/3)
		.attr('transform', `translate(${margin.left},${margin.top+30})`);

	let spacing = 0;
	let wrap = 0;
	container.selectAll('deaths')
		.data(stateData)
		.enter()
		.append("svg")
			.attr('width', 24)
			.attr('height', 24)
			.attr('transform', () => {
				trans = `translate(${spacing},${wrap})`;
				spacing += 20;
				if(spacing > innerWidth)
				{
					spacing = 0;
					wrap += 20;
				}
				return trans;
			})
			.on('mouseover', function(d){
				d3.select(this.childNodes[0])
					.style('fill', 'red');
			})
			.on('mouseout', function(d){
				d3.select(this.childNodes[0])
					.style('fill', 'black');
			})
			.on('click', function(d){
				novelSvg.selectAll('.deathText').remove();
				string = `${d["Person.Name"]}, age ${d["Person.Age"]}, shot on ${d["Incident.Date.Full"]}`;
				let text = novelSvg.append('text')
					.attr('x', margin.left + 140)
					.attr('y', margin.top)
					.attr('class', 'deathText')
					.text(string)
					.style('font-size', '20px')
					.attr('opacity', '0');

				bbox = text.node().getBBox();

				let gradient = novelSvg.append("defs")
					.attr('class', 'deathText')
					.append("linearGradient")
						.attr("id", "gradient")
						.attr("x1", "0%")
						.attr("x2", "0%")
						.attr("spreadMethod", "pad");

				gradient.append("stop")
					.attr("offset", "0%")
					.attr("stop-color", "#fff")
					.attr("stop-opacity", 1);

				gradient.append("stop")
					.attr("offset", "100%")
					.attr("stop-color", "#fff")
					.attr("stop-opacity", 0);

				fadeBox = novelSvg.append('rect')
					.attr('class', 'deathText')
					.attr('x', bbox.x)
					.attr('y', bbox.y)
					.attr('width', bbox.width)
					.attr('height', bbox.height)
					.style("fill", "url(#gradient)");

				text.transition()
					.duration(500)
					.attr('opacity', '100');

				fadeBox.transition()
					.duration(2000)
					.attr('x', bbox.width*2)

				gradient.transition()
					.duration('2000')
					.attr('x1','100%')
			})
			.each(function () {
				this.appendChild(personSvg.cloneNode(true))
				d3.select(this).append('rect')
					.attr('width', 24)
					.attr('height', 24)
					.attr('opacity', 0);
			});
	i = 10;
	container.selectAll('.death')
			.transition()
			.duration(1000)
			.attr('opacity', '100')
			.delay(() => {
				i += 10;
				return i;
			});

}