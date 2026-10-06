import { initialise, wrap, addSvg, addAxisLabel, setupArrowhead, addAnnotationArrow, addDirectionArrow, setupArrowhead_left, setupArrowhead_right, setupArrowhead_same } from "../lib2/helpers.js";

let graphic = d3.select('#graphic');
let legend = d3.select('#legend');
let pymChild = null;
let graphic_data, size, svgs, xDomain, divs, charts, var_group, var_group2, var_group3, svg;

function drawGraphic() {

	//Set up some of the basics and return the size value ('sm', 'md' or 'lg')
	size = initialise(size);

	let margin = config.optional.margin[size];
	let chart_width =
		parseInt(graphic.style('width')) - margin.left - margin.right;

	let groups = d3.groups(graphic_data, (d) => d.group);

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


// to work out when the minimum size of arrow to show is
let size_20_pixels=x.invert(config.essential.minimum_arrow_size)-x.domain()[0] // gets the value of 20 pixels
// let size_20_pixels_rounded=Math.ceil(size_20_pixels/10000)*10000  // rounds it to a 'sensible' number - used in the legend OR
// just set the numeric difference yourself
let size_20_pixels_rounded=61100
let min_difference=x(x.domain()[0]+size_20_pixels_rounded -1)  // calculates that in terms of pixels - used in the if statement for show the arrow/circle


	const colour = d3
		.scaleOrdinal()
		.range(config.essential.colour_palette)
		.domain(Object.keys(config.essential.legendLabels));

// get a unique list of categories
	let categories=[...new Set(graphic_data.map(d=>d.name))];


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
		d[4] = d3.axisLeft(d[3]).tickSize(-(chart_width+margin.left+margin.right)).tickPadding(10);
	});

	// calculate the bandwidth, as .bandwidth() does not work
	let bandwidth=groups[0][3](groups[0][3].domain()[1])-groups[0][3](groups[0][3].domain()[0])


	//set up xAxis generator
	let xAxis = d3.axisBottom(x)
		.ticks(config.optional.xAxisTicks[size])
		.tickPadding([55])
		.tickFormat(d3.format(config.essential.xAxisNumberFormat));

	divs = graphic.selectAll('div.categoryLabels').data(groups).join('div');

	if (groups.length > 1) { divs.append('p').attr('class', 'groupLabels').html((d) => d[0]) }

	let charts = addSvg({
		svgParent: divs,
		chart_width: chart_width,
		height: (d) => d[2] + margin.top + margin.bottom,
		margin: margin
	})

	charts.each(function (d) {
		d3.select(this)
			.append('g')
			.attr('transform', (d) => 'translate('+(30-margin.left-margin.right)+',0)')
			.attr('class', 'y axis')
			.call(d[4])
			.selectAll('text')
			.attr('transform', (d) => 'translate('+(margin.left+margin.right)+',-10)')

			.call(wrap, chart_width);

		// d3.select(this)
		// 	.append('g')
		// 	.attr('transform', (d) => 'translate(0,' + d[2] + ')')
		// 	.attr('class', 'x axis')
		// 	.each(function () {
		// 		d3.select(this)
		// 			// .call(xAxis.tickSize(-d[2]))
		// 			.call(xAxis.tickSize(0))
		// 			.selectAll('line')
		// 			.each(function (e) {
		// 				if (e == 0) {
		// 					d3.select(this).attr('class', 'zero-line');
		// 				}
		// 			});
		// 	});
	});



setupArrowhead_left(d3.select("svg"));
setupArrowhead(d3.select("svg"));
setupArrowhead_right(d3.select("svg"));
setupArrowhead_same(d3.select("svg"));

	charts
		.selectAll('line.between')
		.data((d) => d[1])
		.join('line')
		.attr('class', 'between')
		.attr('x1', (d) => x(d.min))
		.attr('x2', (d) => x(d.max))
		.attr('y1', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name))
		.attr('y2', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name))
		.attr('stroke', (d) =>
			+d.min > +d.max
				? config.essential.colour_palette[1]
				: +d.min < +d.max
					? config.essential.colour_palette[0]
					: config.essential.colour_palette[2]
		)
		.attr('stroke-width', '3px')
		// .attr("marker-end", "url(#annotation_arrowhead)");
		.attr("marker-end", (d) => // add left or right arrowhead
			x(d.min) > x(d.max)+min_difference
				? "url(#annotation_arrowhead_left)"
				: x(d.min)+min_difference < x(d.max)
					? "url(#annotation_arrowhead_right)"
					: "url(#annotation_arrowhead_same)"
		);

// dotted vertical lines - note first and last are not shown
		charts
			.selectAll('line.down')
			.data((d) => d[1])
			.join('line')
			.attr('class', 'down')
			.attr('x1', (d) => x(d.min))
			.attr('x2', (d) => x(d.min))
			.attr('y1', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name))
			.attr('y2', (d, i) => -bandwidth+groups.filter((e) => e[0] == d.group)[0][3](d.name))
			.attr('display',(d,i) => i==0 || i==categories.length-0 ? "none" : "block")
			.attr('stroke', "#707071")
			.attr('stroke-width', '2px')
			.style('stroke-dasharray', '5 5');




// add flag poll lines
charts
	.selectAll('line.flag')
	.data((d) => d[1])
	.join('line')
	.attr('class',(d,i) => 'flag')
	.attr('x1', (d,i) => i==0 ? x(d.min): x(d.max))
	.attr('x2', (d,i) => i==0 ? x(d.min): x(d.max))
	.attr('y1', (d, i) => groups.filter((e) => e[0] == d.group)[0][3](d.name))
	.attr('y2', (d, i) => i==0 ? -config.essential.flag_size+groups.filter((e) => e[0] == d.group)[0][3](d.name) : config.essential.flag_size+groups.filter((e) => e[0] == d.group)[0][3](d.name))
	.attr('stroke', "#707071")
	.attr('stroke-width', '2px')
	// .attr("display",(d,i) => i==0 ? "block" : "none")
	.attr("display",(d,i) => [0,(-1+groups.filter((e) => e[0] == d.group)[0][1].length)].includes(i)==true ? "block" : "none")


	// console.log(groups);
	let post_radius=6

// add flag post circle
	charts
		.selectAll('circle.flag')
		.data((d) => d[1])
		.join('circle')
		.attr('class',(d,i) => 'flag_circle '+d.min)
		.attr('cx', (d,i) => i==0 ? x(d.min): x(d.max))
		.attr('cy', (d, i) => i==0 ? -post_radius-config.essential.flag_size+groups.filter((e) => e[0] == d.group)[0][3](d.name) : post_radius+config.essential.flag_size+groups.filter((e) => e[0] == d.group)[0][3](d.name))
    .attr('r', 6)
		.attr('stroke', '#707071')
		.attr('stroke-width', 2)
    .attr('fill', "white")
		// .attr("display",(d,i) => i==0 ? "block" : "none")
		.attr("display",(d,i) => [0,(-1+groups.filter((e) => e[0] == d.group)[0][1].length)].includes(i)==true ? "block" : "none")


	//   charts.selectAll('circle.min')
	//     .data(d => d[1])
	//     .join('circle')
	//     .attr('class', 'min')
	//     .attr('cx', d => x(d.min))
	//     .attr('cy', d => groups.filter(f => f[0] == d.group)[0][3](d.name))
	//     .attr('r', 6)
	//     .attr('fill', colour('min'))

	// charts
	// 	.selectAll('circle.max')
	// 	.data((d) => d[1])
	// 	.join('circle')
	// 	.attr('class', 'max')
	// 	.attr('cx', (d) => x(d.max))
	// 	.attr('cy', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name))
	// 	.attr('r', config.essential.dotsize)
	// 	.attr('fill', (d) =>
	// 		+d.min > +d.max
	// 			? config.essential.colour_palette[1]
	// 			: +d.min < +d.max
	// 				? config.essential.colour_palette[0]
	// 				: config.essential.colour_palette[2]
	// 	);

	if (config.essential.showDataLabels == true) {
		// charts
		// 	.selectAll('text.min')
		// 	.data((d) => d[1])
		// 	.join('text')
		// 	.attr('class', 'dataLabels min')
		// 	.attr('x', (d) => x(d.min))
		// 	.attr('y', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name))
		// 	.text((d) => d3.format(config.essential.numberFormat)(d.min))
		// 	.attr('fill', (d) =>
		// 		+d.min > +d.max
		// 			? config.essential.colour_palette[1]
		// 			: +d.min < +d.max
		// 				? config.essential.colour_palette[0]
		// 				: 'none'
		// 	)
		// 	.attr('dy', 6)
		// 	.attr('dx', (d) => (+d.min < +d.max ? -5 : 5))
		// 	.attr('text-anchor', (d) => (+d.min < +d.max ? 'end' : 'start'));
		//
		// charts
		// 	.selectAll('text.max')
		// 	.data((d) => d[1])
		// 	.join('text')
		// 	.attr('class', 'dataLabels max')
		// 	.attr('x', (d) => x(d.max))
		// 	.attr('y', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name))
		// 	.text((d) => d3.format(config.essential.numberFormat)(d.max))
		// 	.attr('fill', (d) =>
		// 		+d.min > +d.max
		// 			? config.essential.colour_palette[1]
		// 			: +d.min < +d.max
		// 				? config.essential.colour_palette[0]
		// 				: config.essential.colour_palette[2]
		// 	)
		// 	.attr('dy', 6)
		// 	.attr('dx', (d) =>
		// 		+d.min > +d.max
		// 			? -(config.essential.dotsize + 5)
		// 			: config.essential.dotsize + 5
		// 	)
		// 	.attr('text-anchor', (d) => (+d.min > +d.max ? 'end' : 'start'));

		charts
			.selectAll('text.start')
			.data((d) => d[1])
			.join('text')
			.attr('class', 'dataLabels start')
			.attr("display",d=>d.change<0 ? "block" : "none")
			.attr('x', (d) => x(d.max))
			.attr('y', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name))
			.text((d) => d3.format(config.essential.numberFormat)(d.change))
			.attr('fill',  config.essential.colour_palette[1])
			.attr('dy', 6)
			.attr('dx', (d) =>
				+d.min > +d.max
					? -(config.essential.dotsize + 5)
					: config.essential.dotsize + 5
			)
			.attr('text-anchor',  'end');





			charts
				.selectAll('text.end')
				.data((d) => d[1])
				.join('text')
				.attr('class', 'dataLabels end')
				.attr("display",d=>d.change>=0 ? "block" : "none")
				.attr('x', (d) => x(d.max))
				.attr('y', (d) => groups.filter((f) => f[0] == d.group)[0][3](d.name))
				.text((d) => d3.format(config.essential.numberFormat)(d.change))
				.attr('fill',  config.essential.colour_palette[0])
				.attr('dy', 6)
				.attr('dx', (d) =>
					+d.min > +d.max
						? -(config.essential.dotsize + 5)
						: config.essential.dotsize + 5
				)
				.attr('text-anchor',  'start');








	}

	// This does the x-axis label
	charts.each(function (d, i) {
		if (i == groups.length - 1) {
			addAxisLabel({
				svgContainer: d3.select(this),
				xPosition: (chart_width + 10),
				yPosition: d[2] + 85,
				text: config.essential.xAxisLabel,
				textAnchor: "end",
				wrapWidth: chart_width
			});
		}
	});

// add annotation for initial point line
	charts.each(function (d, i) {
		// console.log(d);
		let year_before=+d[0].substring(4,9)-1
		let first_point=0;
		// check direction of last arrow, so we know which point is end
		let direction_first=d[1][(0)].min-d[1][(0)].max
		// console.log(direction_first);
		if (direction_first>0) {
			first_point=d3.min([d[1][(0)].min,d[1][(0)].max]);
			// console.log(direction_first);

		} else {
			first_point=d3.max([d[1][(0)].min,d[1][(0)].min]);
			// console.log(direction_first);

		}
// console.log("first_point:" +first_point);
		// let initial_text="Population at mid-"+year_before+": "+d3.format(config.essential.xAxisNumberFormat)(first_point)
		//
		// 	addAxisLabel({
		// 		svgContainer: d3.select(this),
		// 		xPosition: x(d[1][(0)].min),
		// 		yPosition: -config.essential.flag_size,
		// 		text: initial_text,
		// 		textAnchor: "middle",
		// 		wrapWidth: 300
		// 	});




			d3.select(this).append("g")
			.append("foreignObject")
			.attr("id","flag_holder_top")
		  .attr("x", x(d[1][(0)].min)-100)
		  .attr("y", (0-config.essential.flag_size-20))
		  .attr("width", 200)
		  .attr("height", 25)
		  .append("xhtml:body")
		  .html("<span class='flag'>"+year_before+ " population: </span><span class='flag_highlight'>"+d3.format(config.essential.xAxisNumberFormat)(first_point)+"</span");


	});




	// add annotation for end point line
		charts.each(function (d, i) {

			// check direction of last arrow, so we know which point is end
			let direction_last=d[1][-1+d[1].length].max-d[1][-1+d[1].length].min
			let year_before=+d[0].substring(4,9)-1
			let last_point=0
			if (direction_last>0) {
				last_point=d[1][(-1+d[1].length)].max;
				// console.log("direction_last: "+direction_last);


			} else {
				last_point=d[1][(-1+d[1].length)].min;
				// console.log("direction_last: "+direction_last);

			}
	// console.log("last_point: "+last_point);

			let final_text="Population at mid-2024: "+d3.format(config.essential.xAxisNumberFormat)(last_point)

				// addAxisLabel({
				// 	svgContainer: d3.select(this),
				// 	xPosition: x(d[1][(-1+d[1].length)].max),
				// 	yPosition: d[2] + config.essential.flag_size+12,
				// 	text: final_text,
				// 	textAnchor: "middle",
				// 	wrapWidth: 300
				// });


				d3.select(this).append("g")
				.append("foreignObject")
				.attr("id","flag_holder_bottom")
				.attr("x", x(d[1][(0)].max)-60)
				.attr("y", d[2] + config.essential.flag_size)
				.attr("width", 200)
				.attr("height", 25)
				.append("xhtml:body")
				.html("<span class='flag'>"+(year_before+1)+ " population: </span><span class='flag_highlight'>"+d3.format(config.essential.xAxisNumberFormat)(last_point)+"</span");




		});







	// // Set up the legend
	let legenditem = d3
		.select('#legend')
		.selectAll('div.legend--item')
		.data(config.essential.legendItems)
		.enter()
		.append('div')
		.attr('class', (d) => 'legend--item ' + [d]);

	drawLegend();

	function drawLegend() {
		var_group = d3
			.select('#legend')
			.selectAll('div.legend--item.Inc')
			.append('svg')
			.attr('height', config.optional.legendHeight[size])
			.attr('width', config.essential.legendItemWidth);
		var_group2 = d3
			.select('#legend')
			.selectAll('div.legend--item.Dec')
			.append('svg')
			.attr('height', config.optional.legendHeight[size])
			.attr('width', config.essential.legendItemWidth);
		var_group3 = d3
			.select('#legend')
			.selectAll('div.legend--item.No')
			.append('svg')
			.attr('height', config.optional.legendHeight[size])
			.attr('width', config.essential.legendItemWidth);

		//Increase legend item
		var_group
			.append('text')
			.attr('y', 30)
			.attr('x', 0)
			.attr('text-anchor', 'start')
			.attr('class', 'mintext legendLabel')
			.attr('fill', config.essential.colour_palette[0])
			.text(config.essential.legendLabels.min);

		//this measures how wide the "min" value is so that we can place the legend items responsively
		let minTextWidth = d3.select('text.mintext').node().getBBox().width + 5;

		var_group
			.append('line')
			.attr('stroke', config.essential.colour_palette[0])
			.attr('stroke-width', '3px')
			.attr('y1', 26)
			.attr('y2', 26)
			.attr('x1', minTextWidth)
			.attr('x2', minTextWidth + config.essential.legendLineLength);

		var_group
			.append('circle')
			.attr('r', config.essential.dotsize)
			.attr('fill', config.essential.colour_palette[0])
			.attr('cx', minTextWidth + config.essential.legendLineLength)
			.attr('cy', 26);

		var_group
			.append('text')
			.attr('y', 30)
			.attr(
				'x',
				minTextWidth +
				config.essential.legendLineLength +
				config.essential.dotsize +
				5
			)
			.attr('text-anchor', 'start')
			.attr('class', 'maxtext legendLabel')
			.attr('fill', config.essential.colour_palette[0])
			.text(config.essential.legendLabels.max);

		//this measures how wide the "max" value is so that we can place the legend items responsively
		let maxTextWidth = d3.select('text.maxtext').node().getBBox().width + 5;

		var_group
			.append('text')
			.attr('y', 15)
			.attr(
				'x',
				(minTextWidth +
					config.essential.legendLineLength +
					config.essential.dotsize +
					maxTextWidth) /
				2
			)
			.attr('text-anchor', 'middle')
			.attr('class', 'legendLabel')
			.attr('fill', config.essential.colour_palette[0])
			.text('Increase');

		//Decrease legend item
		var_group2
			.append('line')
			.attr('stroke', config.essential.colour_palette[1])
			.attr('stroke-width', '3px')
			.attr('y1', 26)
			.attr('y2', 26)
			.attr('x1', maxTextWidth + config.essential.dotsize)
			.attr(
				'x2',
				maxTextWidth +
				config.essential.dotsize +
				config.essential.legendLineLength
			);

		var_group2
			.append('circle')
			.attr('r', config.essential.dotsize)
			.attr('fill', config.essential.colour_palette[1])
			.attr('cx', maxTextWidth + config.essential.dotsize)
			.attr('cy', 26);

		var_group2
			.append('text')
			.attr('y', 30)
			.attr('x', 0)
			.attr('text-anchor', 'start')
			.attr('class', 'legendLabel')
			.attr('fill', config.essential.colour_palette[1])
			.text(config.essential.legendLabels.max);

		var_group2
			.append('text')
			.attr('y', 30)
			.attr(
				'x',
				maxTextWidth +
				config.essential.legendLineLength +
				config.essential.dotsize +
				5
			)
			.attr('text-anchor', 'start')
			.attr('class', 'legendLabel')
			.attr('fill', config.essential.colour_palette[1])
			.text(config.essential.legendLabels.min);

		var_group2
			.append('text')
			.attr('y', 15)
			.attr(
				'x',
				(maxTextWidth +
					config.essential.legendLineLength +
					config.essential.dotsize +
					minTextWidth) /
				2
			)
			.attr('text-anchor', 'middle')
			.attr('class', 'legendLabel')
			.attr('fill', config.essential.colour_palette[1])
			.text('Decrease');

		//No change legend item
		var_group3
			.append('circle')
			.attr('r', config.essential.dotsize)
			.attr('fill', config.essential.colour_palette[2])
			.attr('cx', 10)
			.attr('cy', 26);

		var_group3
			.append('text')
			.attr('y', 30)
			.attr('x', config.essential.dotsize + 15)
			.attr('text-anchor', 'start')
			.attr('class', 'legendLabel label_same')
			.attr('fill', config.essential.colour_palette[2])
			// .text('Change of less than '+d3.format(config.essential.xAxisNumberFormat)(size_20_pixels_rounded)+" (0.1%)")
			.text('Change of less than 0.1%')
			.call(wrap, 120);
	} //End drawLegend

	//create link to source
	d3.select('#source').text('Source: ' + config.essential.sourceText);

	//use pym to calculate chart dimensions
	if (pymChild) {
		pymChild.sendHeight();
	}
}

d3.csv(config.essential.graphic_data_url).then((data) => {
	//load chart data
	graphic_data = data;

	//use pym to create iframed chart dependent on specified variables
	pymChild = new pym.Child({
		renderCallback: drawGraphic
	});
});
