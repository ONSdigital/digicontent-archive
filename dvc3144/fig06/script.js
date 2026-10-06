let graphic = d3.select('#graphic');
let legend = d3.select('#legend');
let pymChild = null;

function drawGraphic() {
	// Remove any existing chart elements
	graphic.selectAll('*').remove();
	legend.selectAll('*').remove();

	//population accessible summmary
	d3.select('#accessibleSummary').html(config.essential.accessibleSummary);




	let threshold_md = config.optional.mediumBreakpoint;
	let threshold_sm = config.optional.mobileBreakpoint;

	//set variables for chart dimensions dependent on width of #graphic
	if (parseInt(graphic.style('width')) < threshold_sm) {
		size = 'sm';
	} else if (parseInt(graphic.style('width')) < threshold_md) {
		size = 'md';
	} else {
		size = 'lg';
	}

	let margin = config.optional.margin[size];
	let chart_width =
		parseInt(graphic.style('width')) - margin.left - margin.right;

	groups = d3.groups(graphic_data, (d) => d.group);

	if (config.essential.xDomain == 'auto') {
		let min = 1000000;
		let max = 0;
		for (i = 2; i < graphic_data.columns.length; i++) {
			min = d3.min([
				min,
				d3.min(graphic_data, (d) => +d[graphic_data.columns[i]])
			]);
			max = d3.max([
				max,
				d3.max(graphic_data, (d) => +d[graphic_data.columns[i]])
			]);
		}
		xDomain = [min, max];
	} else {
			xDomain = config.essential.xDomain;
	}

	//set up scales
	const x = d3.scaleLinear().range([0, chart_width]).domain(xDomain);

	const colour = d3
		.scaleOrdinal()
		.range(config.essential.colour_palette)
		.domain(Object.keys(config.essential.legendLabels));

		// do colours of legend
		d3.select("#legendmin")
			.attr("fill", colour("max"))

		d3.select("#legendmax")
			.attr("fill", colour("min"))


let categoriesUnique = Object.keys(config.essential.legendLabels);

// categoriesUnique.forEach(function(d,i){
// 	d3.select("#legend"+d)
// 		.attr("fill", colour(d))
// })

	// create the y scale in groups
	groups.map(function (d) {
		//height
		d[2] = config.optional.seriesHeight[size] * d[1].length;

		// y scale
		d[3] = d3
			.scalePoint()
			.padding(0.5)
			.range([0, d[2]])
			.domain(d[1].map((d) => d.name));
		//y axis generator
		d[4] = d3.axisLeft(d[3]).tickSize(0).tickPadding(10);
	});

tickValues=x.ticks(config.optional.xAxisTicks[size])

// if (size="sm"){
// 	tickValues.push(xDomain[1])
// }

// tickValues.push(graphic_data[0].date)




	//set up xAxis generator
	let xAxis = d3.axisBottom(x)
		// .ticks(config.optional.xAxisTicks[size])
		.tickValues(tickValues)
		.tickFormat(d => d3.format(config.essential.xAxisTickFormat)(d));

	divs = graphic.selectAll('div.categoryLabels').data(groups).join('div');



if (groups.length>1){
	divs
		.append('p')
		.attr('class', 'groupLabels')
		.html((d) => d[0]!="Group1" ? d[0]: "");
}


	svgs = divs
		.append('svg')
		.attr('class', 'chart')
		.attr('height', (d) => d[2] + margin.top + margin.bottom)
		.attr('width', chart_width + margin.left + margin.right);

	charts = svgs
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	charts.each(function (d) {
		d3.select(this)
			.append('g')
			.attr('class', 'y axis')
			.call(d[4])
			.selectAll('text')
			.call(wrap, margin.left - 10);

		d3.select(this)
			.append('g')
			.attr('transform', (d) => 'translate(0,' + d[2] + ')')
			.attr('class', 'x axis')
			.each(function () {
				d3.select(this)
					.call(xAxis.tickSize(-d[2]))
					.selectAll('line')
					.each(function (e) {
						if (e == 0) {
							d3.select(this).attr('class', 'zero-line');
						}
					});
			});
	});



	charts
		.selectAll('line.between1')
		.data((d) => d[1])
		.join('line')
		.attr('class', 'between1')
		.attr('x1', (d) => x(0))
		.attr('x2', (d) => x(config.essential.xDomain[1]))
		.attr('y1', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name))
		.attr('y2', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name))
		// .attr('stroke', '#c6c6c6')
		.attr('stroke', '#d9d9d9')
		.attr('stroke-dasharray','2 2')
		.attr('stroke-width', '1px');




		charts
		.selectAll('line.band')
		.data((d) => d[1])
		.join('rect')
		.attr('class', 'between')
		.attr('x', (d) => d.est=="[c]" ? 0: x(d.min))
		.attr('width',(d) => d.est=="[c]" ? 0: x(d.max)-x(d.min))
		.attr('height', 16)
		.attr('y', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name)-8)
		// .attr('y2', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name))
		.attr('fill',(d) => d.ref=="no" ? '#27a0cc': "silver")
		.attr('opacity',0.7)
		.attr("display",d => d.est=="[c]" ? "none" : "block")
		;

		charts
		.selectAll('line.band1')
		.data((d) => d[1])
		.join('rect')
		.attr('class', 'between')
		.attr('x', (d) => d.est2=="[c]" ? 0: x(d.min2))
		.attr('width',(d) => d.est2=="[c]" ? 0: x(d.max2)-x(d.min2))
		.attr('height', 16)
		.attr('y', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name)-8)
		// .attr('y2', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name))
		.attr('fill','silver')
		.attr('opacity',0.7)
		.attr("display",d => d.est2=="[c]" ? "none" : "block")
		;



		charts
	.selectAll('rect.estimate1')
	.data((d) => d[1])
	.join('rect')
	.attr('class', 'estimate1')
	.attr('x', (d) => d.est=="[c]" ? 0:x(d.est)-4)
	.attr('y', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name))
	.attr('width', 8)
	.attr('height', 8)
	.attr('transform', (d) => d.est=="[c]" ? 'translate(0,0)':`rotate(45 ${x(d.est) +0} ${groups.filter((f) => f[0] == d.group)[0][3](d.name)-0}),translate(0,-4)`)
	.attr('fill', (d) => d.ref=="no" ? colour('min'): colour('max'))
	.attr('stroke','black')
	.attr('stroke-linejoin','round')
	.attr("display",d => d.est=="[c]" ? "none" : "block");

	charts
	.selectAll('rect.estimate2')
	.data((d) => d[1])
	.join('rect')
	.attr('class', 'estimate2')
	.attr('x', (d) => d.est2=="[c]" ? 0: x(d.est2)-4)
	.attr('y', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name)-4)
	.attr('width', 8)
	.attr('height', 8)
	.attr('transform', (d) => d.est2=="[c]" ? 'translate(0,0)':`rotate(45 ${x(d.est2) +0} ${groups.filter((f) => f[0] == d.group)[0][3](d.name)-0}),translate(0,0)`)
	.attr('fill', colour('max'))
	.attr('stroke','black')
	.attr('stroke-linejoin','round')
	.attr("display",d => d.est2=="[c]" ? "none" : "block");



	if (config.essential.showDataLabels) {
		charts
			.selectAll('text.min')
			.data((d) => d[1])
			.join('text')
			.attr('class', 'dataLabels')
			.attr('x', (d) => x(d.min))
			.attr('y', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name))
			.text((d) => d3.format(config.essential.numberFormat)(d.min))
			.attr('fill', colour('min'))
			.attr('dy', 6)
			.attr('dx', (d) => (+d.min < +d.max ? -8 : 8))
			.attr('text-anchor', (d) => (+d.min < +d.max ? 'end' : 'start'));

		charts
			.selectAll('text.max')
			.data((d) => d[1])
			.join('text')
			.attr('class', 'dataLabels')
			.attr('x', (d) => x(d.max))
			.attr('y', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name))
			.text((d) => d3.format(config.essential.numberFormat)(d.max))
			.attr('fill', colour('max'))
			.attr('dy', 6)
			.attr('dx', (d) => (+d.min > +d.max ? -8 : 8))
			.attr('text-anchor', (d) => (+d.min > +d.max ? 'end' : 'start'));
	}



	// This does the x-axis label
	charts.each(function (d, i) {
		if (i == groups.length - 1) {
			d3.select(this)
				.append('text')
				.attr('x', chart_width)
				.attr('y', (d) => d[2] + 35)
				.attr('class', 'axis--label')
				.text(config.essential.xAxisLabel)
				.attr('text-anchor', 'end');
		}
	});

	// Set up the legend

d3.select('#legend')
.append('div')
.attr('id','legendDiamond')
	.attr('class', 'legend--item')
		.append('svg')
		.attr('width',20)
		.attr('height',20)
		.append('rect')
		.attr('id','legendDiamondSVG')
		.attr('class', 'legend--icon--diamond')
		.attr('x',5)
		.attr('y',2)
		.attr('width',10)
		.attr('height',10)
		.attr('fill', colour('min'))
		.attr('transform','rotate(45,10,10)')

d3.select('#legendDiamond')
.append('p')
	.attr('class', 'legend--text')
.html(config.essential.legendLabels.min)

d3.select('#legend')
.append('div')
.attr('id','legendCircle')
.attr('class', 'legend--item')
		.append('svg')
		.attr('width',20)
		.attr('height',20)
		.append('circle')
			.attr('id','legendCircleSVG')
				.attr('class', 'legend--icon--circle')
		.attr('cx',10)
		.attr('cy',6)
		.attr('r',6)
		.attr('fill', colour('max'))
		.attr('transform','rotate(45,10,10)')

		d3.select('#legendCircle')
		.append('p')
			.attr('class', 'legend--text')
			.html(config.essential.legendLabels.max)

// move CI legend stuff over, as there's only one category
let move_ci_legend=0

d3.select("#arrow1").attr("transform","translate("+move_ci_legend+",0)")
d3.select("#arrow2").attr("transform","translate("+move_ci_legend+",0)")
d3.select("#CI_bkgnd").attr("transform","translate("+move_ci_legend+",0)")
d3.select("#diamond").attr("transform","translate("+move_ci_legend+",0)")
// d3.selectAll("g.y.axis").selectAll(".tick").select("text")
// // .style("fill","red")
// .text(d => d.replace("/ ","/"))

	//create link to source
	d3.select('#source').text('Source: ' + config.essential.sourceText);

	//use pym to calculate chart dimensions
	if (pymChild) {
		pymChild.sendHeight();
	}
}

function wrap(text, width) {
	text.each(function () {
		let text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.1, // ems
			// y = text.attr("y"),
			x = text.attr('x'),
			dy = parseFloat(text.attr('dy')),
			tspan = text.text(null).append('tspan').attr('x', x);
		while ((word = words.pop())) {
			line.push(word);
			tspan.text(line.join(' '));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(' '));
				line = [word];
				tspan = text
					.append('tspan')
					.attr('x', x)
					.attr('dy', lineHeight + 'em')
					.text(word);
			}
		}
		let breaks = text.selectAll('tspan').size();
		text.attr('y', function () {
			return -6 * (breaks - 1);
		});
	});
}

d3.csv(config.essential.graphic_data_url).then((data) => {
	//load chart data
	graphic_data = data;

	//use pym to create iframed chart dependent on specified variables
	pymChild = new pym.Child({
		renderCallback: drawGraphic
	});
});
