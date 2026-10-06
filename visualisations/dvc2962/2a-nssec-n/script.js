let graphic = d3.select('#graphic');
let legend = d3.select('#legend');
let pymChild = null;

function drawGraphic() {
	// clear out existing graphics
	graphic.selectAll('*').remove()
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

	// //set up scales
	// const x = d3.scaleLinear().range([0, chart_width]).domain(xDomain);



  //set up scales
  const x = d3.scaleLog()
  .base(2)
    .range([0, chart_width])
    .domain(xDomain);


	const colour = d3
		.scaleOrdinal()
		.range(config.essential.colour_palette)
		.domain(Object.keys(config.essential.legendLabels));

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

	//set up xAxis generator
	let xAxis = d3.axisBottom(x).ticks(config.optional.xAxisTicks[size]).tickFormat(d3.format(config.essential.xAxisTickFormat));

	divs = graphic.selectAll('div.categoryLabels').data(groups).join('div');

	// divs
	// 	.append('p')
	// 	.attr('class', 'groupLabels')
	// 	.html((d) => d[0]);

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
			.call(wrap, margin.left - 20);

		d3.select(this)
			.append('g')
			.attr('transform', (d) => 'translate(0,' + d[2] + ')')
			.attr('class', 'x axis')
			.each(function () {
				d3.select(this)
					.call(xAxis.tickSize(-d[2]))
					.selectAll('line')
					.each(function (e) {
						if (e == 1) {
							d3.select(this).attr('class', 'zero-line');
						}
					});
			});
	});




	charts
		.selectAll('line.between')
		.data((d) => d[1])
		.join('line')
		.attr('class', 'between1')
		.attr('x1', (d) => x(d.min1))
		.attr('x2', (d) => x(d.min2))
		.attr('y1', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name))
		.attr('y2', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name))
		.attr('stroke', '#c6c6c6')
		.attr('stroke-width', '3px')
		.attr('stroke-linecap', 'round')
		.attr("transform","translate(0,-5)");


		charts
	.selectAll('rect.min1')
	.data((d) => d[1])
	.join('rect')
	.attr('class', 'min1')
	.attr('x', (d) => x(d.min)-5)
	.attr('y', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name)-6)
	.attr('width', 10)
	.attr('height', 10)
	.attr('transform', (d) => `rotate(45 ${x(d.min) +0} ${groups.filter((f) => f[0] == d.group)[0][3](d.name)-0}),translate(0,-6)`)
	.attr('fill', colour('min'));
		charts
		.selectAll('line.between2')
		.data((d) => d[1])
		.join('line')
		.attr('class', 'between2')
		.attr('x1', (d) => x(d.max1))
		.attr('x2', (d) => x(d.max2))
		.attr('y1', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name))
		.attr('y2', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name))
		.attr('stroke', colour('max'))
		.attr('stroke-width', '3px')
		.attr('stroke-linecap', 'round')
		.attr("transform","translate(0,5)");

	// charts
	// 	.selectAll('rect.min1')
	// 	.data((d) => d[1])
	// 	.join('rect')
	// 	.attr('class', 'min1')
	// 	.attr('x', (d) => x(d.min)-5)
	// 	.attr('y', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name))
	// 	.attr('width', 10)
	// 	.attr('height', 10)
	// 	.attr('transform', (d) => `rotate(45 ${x(d.min) +0} ${groups.filter((f) => f[0] == d.group)[0][3](d.name)})`)
	// 	.attr('fill', colour('max'));

		


	charts
		.selectAll('circle.max')
		.data((d) => d[1])
		.join('circle')
		.attr('class', 'max')
		.attr('cx', (d) => x(d.max))
		.attr('cy', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name)+5)
		.attr('r', 6)
		.attr('fill', colour('max'))
		;

	// charts
	// 	.selectAll('text.min')
	// 	.data((d) => d[1])
	// 	.join('text')
	// 	.attr('class', 'dataLabels')
	// 	.attr('x', (d) => x(d.min))
	// 	.attr('y', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name))
	// 	.text((d) => d3.format(config.essential.numberFormat)(d.min))
	// 	.attr('fill', colour('min'))
	// 	.attr('dy', -10)
	// 	.attr('dx', (d) => (+d.min < +d.max ? 10 : -10))
	// 	.attr('text-anchor', (d) => (+d.min < +d.max ? 'end' : 'start'));

	// charts
	// 	.selectAll('text.max')
	// 	.data((d) => d[1])
	// 	.join('text')
	// 	.attr('class', 'dataLabels')
	// 	.attr('x', (d) => x(d.max))
	// 	.attr('y', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name))
	// 	.text((d) => d3.format(config.essential.numberFormat)(d.max))
	// 	.attr('fill', colour('max'))
	// 	.attr('dy', -10)
	// 	.attr('dx', (d) => (+d.min > +d.max ? 10 : -10))
		// .attr('text-anchor', (d) => (+d.min > +d.max ? 'end' : 'start'));

	// This does the x-axis label
	charts.each(function (d, i) {
		if (i == groups.length - 1) {
			d3.select(this)
				.append('text')
				.attr('x', chart_width)
				.attr('y', (d) => d[2] + 45)
				.attr('class', 'axis--label')
				.text(config.essential.xAxisLabel)
				.attr('text-anchor', 'end');
		}
	});



	// // Set up the legend
	// let legenditem = d3
	// 	.select('#legend')
	// 	.selectAll('div.legend--item')
	// 	.data(
	// 		d3.zip(
	// 			Object.values(config.essential.legendLabels),
	// 			config.essential.colour_palette
	// 		)
	// 	)
	// 	.enter()
	// 	.append('div')
	// 	.attr('class', 'legend--item');


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
	// 	.append('circle')
	// 	.attr('class', 'legend--icon--circle')
	// 	.style('background-color', function (d) {
	// 		return d[1];
	// 	});

	// legenditem
	// 	.append('div')
	// 	.append('p')
	// 	.attr('class', 'legend--text')
	// 	.html(function (d) {
	// 		return d[0];
	// 	});



  d3.selectAll("g.x.axis")
    .selectAll(".tick")
    .attr("class", function (d, i) { return "tick ticky ticky" + i })
	if(size=="sm"){	d3.select("svg.chart").append('text')
	.attr('x', chart_width+margin.left)
	.attr('y',100)
	.attr('dy',35)
		.attr('class',"annotation-text")
	.attr('text-anchor',"end")
	.text('Comparison with Higher managerial, administrative and professional occupations')
	.call(wrap,300);
}else{
	d3.select("svg.chart").append('text')
	.attr('x', margin.left+x(1))
	.attr('y',100)
	.attr('dy',35)
		.attr('class',"annotation-text")
	.attr('text-anchor',"middle")
	.text('Comparison with Higher managerial, administrative and professional occupations')
	.call(wrap,300);
}


	console.log(chart_width - (margin.left+x(1.65)))
	console.log(chart_width)
	console.log(chart_width- x(1.65))
	console.log(x(1.65))
	console.log(margin.left)
	console.log(margin.left+x(1.65))
  //adds direction arrow
  addDirectionArrow(
    //name of your svg, normally just SVG
	
	"svg.chart",
    //direction of arrow: left, right, up or down
    'right',

    //anchor end or start (end points the arrow towards your x value, start points away)
    'start',

    //x value
    margin.left+x(1),

    //y value
    margin.top-10,

    //alignment - left or right for vertical arrows, above or below for horizontal arrows
    'below',

    //annotation text
    "More likely",

    //wrap width
    200,

    //text adjust y
    0,

    //Text vertical align: top, middle or bottom (default is middle)
    'bottom',
    //

    // you can also optionally add a colour here to make the arrow (but not text) a different colour
  )

	
  //adds direction arrow
  addDirectionArrow(
    //name of your svg, normally just SVG
	
	"svg.chart",
    //direction of arrow: left, right, up or down
    'left',

    //anchor end or start (end points the arrow towards your x value, start points away)
    'start',

    //x value
    margin.left+x(1),

    //y value
    margin.top-10,

    //alignment - left or right for vertical arrows, above or below for horizontal arrows
    'below',

    //annotation text
    "Less likely",

    //wrap width
    200,

    //text adjust y
    0,

    //Text vertical align: top, middle or bottom (default is middle)
    'bottom',
    //

    // you can also optionally add a colour here to make the arrow (but not text) a different colour
  )
// 	d3.selectAll(".ticky0 text")
// 	.attr('x',0)
// .text("Half as likely")
//   .call(wrap, 70)
//   .attr('transform', 'translate(0, 13)')

	d3.selectAll(".ticky0 text")
	.attr('x',0)	
  .text("Just as likely")
  .call(wrap, 70)
  .attr('transform', 'translate(0, 13)')

  if(size!="sm"){
	d3.selectAll(".ticky1 text")
	.attr('x',0)
  .text("1.5x")
  .call(wrap, 70)
  .attr('transform', 'translate(0, 13)')

	d3.selectAll(".ticky2 text")
	.attr('x',0)

  .text("Twice as likely")
  .call(wrap, 70)
	.attr('transform', 'translate(0, 13)')
    
    
	d3.selectAll(".ticky3 text")
	.attr('x',0)
  .text("2.5x")
  .call(wrap, 70)
	.attr('transform', 'translate(0, 13)')

	d3.selectAll(".ticky4 text")
	.attr('x',0)
  .text("3x as likely")
  .call(wrap, 60)
  .attr('transform', 'translate(0, 13)')

  d3.selectAll(".ticky5 text")
  .attr('x',0)
.text("3.5x")
.call(wrap, 60)
.attr('transform', 'translate(0, 13)')
} else {
  d3.selectAll(".ticky1 text")
  .attr('x',0)

.text("Twice as likely")
.call(wrap, 70)
  .attr('transform', 'translate(0, 13)')
}



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
