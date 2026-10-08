let graphic = d3.select('#graphic');
let legend = d3.select('#legend');
let pymChild = null;

function drawGraphic() {
	//population accessible summmary
	d3.select('#accessibleSummary').html(config.essential.accessibleSummary);

	let threshold_md = config.optional.mediumBreakpoint;
	let threshold_sm = config.optional.mobileBreakpoint;

	if (parseInt(graphic.style('width')) < threshold_sm) {
		size = 'sm';
	} else if (parseInt(graphic.style('width')) < threshold_md) {
		size = 'md';
	} else {
		size = 'lg';
	}

	// Clear out existing graphics
	graphic.selectAll('*').remove();
	legend.selectAll('*').remove();

	//Set up the legend
	// legend
	// 	.append('div')
	// 	.attr('class', 'legend--item--here')
	// 	.append('div').attr('class', 'legend--icon--circle')
	// 	.style('background-color', config.essential.colour_palette)

	// d3.select(".legend--item--here")
	// 	.append('div')
	// 	.append('p').attr('class', 'legend--text')
	// 	.html("Value")

	// legend
	// 	.append('div')
	// 	.attr("class", "legend--item--here refline")
	// 	.append('div')
	// 	.attr('class', 'legend--icon--refline')
	// 	.style('background-color', "#222")
	// 	.style('border-radius', '5px');

	// d3.select(".legend--item--here.refline")
	// 	.append('div')
	// 	.append('p').attr('class', 'legend--text')
	// 	.html("95% confidence interval")
		
	// Nest the graphic_data by the 'series' column
	let nested_data = d3.group(graphic_data, (d) => d.series);

	// Create a container div for each small multiple
	let chartContainers = graphic
		.selectAll('.chart-container')
		.data(Array.from(nested_data))
		.join('div')
		.attr('class', 'chart-container');

	function drawChart(container, data, chartIndex) {
		// Log the data being used for each small multiple
		// console.log('Data for this small multiple:', data);
		// console.log(chartIndex);


		function calculateChartWidth(size) {
			const chartEvery = config.optional.chart_every[size];
			const chartMargin = config.optional.margin[size];

			if (config.optional.dropYAxis) {
				// Chart width calculation allowing for 10px left margin between the charts
				const chartWidth = ((parseInt(graphic.style('width')) - chartMargin.left - ((chartEvery - 1) * 10)) / chartEvery) - chartMargin.right;
				return chartWidth;
			} else {
				const chartWidth = ((parseInt(graphic.style('width')) / chartEvery) - chartMargin.left - chartMargin.right);
				return chartWidth;
			}
		}


		// Calculate the height based on the data
		let height = config.optional.seriesHeight[size] * data.length +
			10 * (data.length - 1) +
			12;


		let chartsPerRow = config.optional.chart_every[size];
		let chartPosition = chartIndex % chartsPerRow;

		let margin = { ...config.optional.margin[size] };

		// If the chart is not in the first position in the row, reduce the left margin
		if (config.optional.dropYAxis) {
			if (chartPosition !== 0) {
				margin.left = 10;
			}
		}

		let chart_width = calculateChartWidth(size)

		//set up scales
		const x = d3.scaleLinear().range([0, chart_width]);

		const y = d3
			.scaleBand()
			.paddingOuter(0.2)
			.paddingInner(((data.length - 1) * 10) / (data.length * 30))
			.range([0, height])
			.round(true);

		//use the data to find unique entries in the name column
		y.domain([...new Set(data.map((d) => d.name))]);

		//set up yAxis generator

		let yAxis = d3.axisLeft(y)
			.tickSize(0)
			.tickPadding(10)
			.tickFormat((d) => config.optional.dropYAxis !== true ? (d) :
			chartPosition == 0 ? (d) : "");

		//set up xAxis generator
		let xAxis = d3
			.axisBottom(x)
			.tickSize(-height)
			.tickFormat(d3.format('.0%'))
			.ticks(config.optional.xAxisTicks[size]);

		//create svg for chart
		svg = container
			.append('svg')
			.attr('width', chart_width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.attr('class', 'chart')
			.style('background-color', '#fff')
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		if (config.essential.xDomain == 'auto') {
			x.domain([
				0,
				//x domain is the maximum out of the value and the reference value
				Math.max((d3.max(graphic_data.map(({ value }) => Number(value))),
					d3.max(graphic_data.map(({ max }) => Number(max)))))
			])
		} else {
			x.domain(config.essential.xDomain);
		}

		svg
			.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.attr('class', 'x axis')
			.call(xAxis)
			.selectAll('line')
			.each(function (d) {
				if (d == 0) {
					d3.select(this).attr('class', 'zero-line');
				}
			});

		// if (chartPosition == 0) {
			svg
				.append('g')
				.attr('class', 'y axis')
				.call(yAxis)
				.selectAll('text')
				.call(wrap, margin.left - 15);
		// }


		// svg
		// 	.selectAll('rect')
		// 	.data(data)
		// 	.join('rect')
		// 	.attr('x', x(0))
		// 	.attr('y', (d) => y(d.name))
		// 	.attr('width', (d) => x(d.value) - x(0))
		// 	.attr('height', y.bandwidth())
		// 	.attr('fill', config.essential.colour_palette);


		svg.append("text")
		.text("Earning less than a ◀")
		.attr("text-anchor", "end")
		.attr('y',-40)
		.attr('x',x(0) - 10)
		.attr("font-family", "'Open Sans', sans-serif")
		.attr("font-size", "14px")
		.attr("fill", "#666")
		svg.append("text")
		  .text("White British employee")
		  .attr("text-anchor", "end")
		  .attr('y',-20)
		  .attr('x',x(0) - 17)
		  .attr("font-family", "'Open Sans', sans-serif")
		  .attr("font-size", "14px")
		  .attr("fill", "#666")
		

	if (parseInt(graphic.style("width")) > 600) {
		svg.append("text")
		  .text("▶ Earning more than a")
		  .attr("text-anchor", "start")
		  .attr('y',-40)
		  .attr('x',x(0) + 10)
		  .attr("font-family", "'Open Sans', sans-serif")
		  .attr("font-size", "14px")
		  .attr("fill", "#666")
		  svg.append("text")
		  .text("White British employee")
			.attr("text-anchor", "start")
			.attr('y',-20)
			.attr('x',x(0) + 17)
			.attr("font-family", "'Open Sans', sans-serif")
			.attr("font-size", "14px")
			.attr("fill", "#666")
	}

		svg.append("line")
          .attr('y1', -60)
          .attr('y2', height)
          .attr('x1', x(0))
          .attr('x2', x(0))
          .attr("stroke","#666")

		svg
			.selectAll('line.bar')
			.data(data)
			.join('line')
			.attr('class', 'bar')
			.attr('x1', x(0))
			.attr('x2', (d) => x(d.value))
			.attr('y1', (d) => y(d.name) + y.bandwidth()/2)
			.attr('y2', (d) => y(d.name) + y.bandwidth()/2)
			.attr('stroke-width', y.bandwidth())
			.attr('stroke', (d) => d.value < 0 ? config.essential.neg_colour : config.essential.pos_colour);


		svg
			.selectAll('line.minline')
			.data(data)
			.join('line')
			.attr('class', 'minline')
			.attr('x1', (d) => x(d.min))
			.attr('x2', (d) => x(d.min))
			.attr('y1', (d) => y(d.name) + y.bandwidth() * 0.25)
			.attr('y2', (d) => y(d.name) + y.bandwidth() * 0.75)
			.style('display', (d) => d.min == "c" ? "none" : "block")
		
		svg
			.selectAll('line.maxline')
			.data(data)
			.join('line')
			.attr('class', 'maxline')
			.attr('x1', (d) => x(d.max))
			.attr('x2', (d) => x(d.max))
			.attr('y1', (d) => y(d.name) + y.bandwidth() * 0.25)
			.attr('y2', (d) => y(d.name) + y.bandwidth() * 0.75)
			.style('display', (d) => d.min == "c" ? "none" : "block")

		svg
			.selectAll('line.midline')
			.data(data)
			.join('line')
			.attr('class', 'midline')
			.attr('x1', (d) => x(d.max))
			.attr('x2', (d) => x(d.min))
			.attr('y1', (d) => y(d.name) + y.bandwidth() * 0.5)
			.attr('y2', (d) => y(d.name) + y.bandwidth() * 0.5)
			.style('display', (d) => d.min == "c" ? "none" : "block")


		if (config.essential.dataLabels.show == true) {
			svg
				.selectAll('text.dataLabels')
				.data(data)
				.join('text')
				.attr('class', 'dataLabels')
				.attr('x', (d) => x(d.value))
				.attr('dx', (d) => (x(d.value) - x(0) < chart_width / 10 ? 3 : -3))
				.attr('y', (d) => y(d.name) + 19)
				.attr('text-anchor', (d) =>
					x(d.value) - x(0) < chart_width / 10 ? 'start' : 'end'
				)
				.attr('fill', (d) =>
					x(d.value) - x(0) < chart_width / 10 ? '#414042' : '#ffffff'
				)
				.text((d) =>
					d3.format(config.essential.dataLabels.numberFormat)(d.value)
				);
		} //end if for datalabels

		// This does the chart title label
		svg
			.append('g')
			.attr('transform', 'translate(0, 0)')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.attr('dy', -15)
			.attr('class', 'title')
			.text(d => d[0])
			.attr('text-anchor', 'start')
			.call(wrap, chart_width);

		// This does the x-axis label
		if (chartIndex % chartsPerRow === chartsPerRow - 1 || chartIndex === [...nested_data].length-1) {
			svg
				.append('g')
				.attr('transform', `translate(0, ${height})`)
				.append('text')
				.attr('x', chart_width)
				.attr('y', 35)
				.attr('class', 'axis--label')
				.text(config.essential.xAxisLabel)
				.attr('text-anchor', 'end');
		}
	}

	// Draw the charts for each small multiple
	chartContainers.each(function ([key, value], i) {
		drawChart(d3.select(this), value, i);
	});

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
