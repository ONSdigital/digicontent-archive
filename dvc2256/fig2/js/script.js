var graphic = d3.select('#graphic');
var legend = d3.select('#legend');
var pymChild = null;
var x, y;



// Create the dropdown once when the page loads
var optns = d3.select('#select')
	.append('div')
	.attr('id', 'sel')
	.append('select')
	.attr('id', 'optionsSelect')
	.attr('style', 'width:calc(100% - 6px)')
	.attr('class', 'chosen-select');


function drawGraphic() {
	graphic.selectAll('*').remove();

	//population accessible summmary
	d3.select('#accessibleSummary').html(config.essential.accessibleSummary);

	uniqueOptions = [...new Set(graphic_data.map((d) => d.option))];

	console.log([...new Set(graphic_data.map((d) => d.option))])

	optns
		.selectAll('option.option')
		.data(uniqueOptions)
		.enter()
		.append('option')
		.attr('value', (d) => d)
		.text((d) => d)

	//add some more accessibility stuff
	d3.select('input.chosen-search-input').attr('id', 'chosensearchinput');
	d3.select('div.chosen-search')
		.insert('label', 'input.chosen-search-input')
		.attr('class', 'visuallyhidden')
		.attr('for', 'chosensearchinput')
		.html('Select an option');


	let labelPositions = new Map();  // Create a map to store label positions


	$('#optionsSelect').chosen({
		disable_search: true,
	}).on('change', function () { //this is the change event listener...
		selectedOption = $(this).val();

		//...it's a function that is executed when the value of an input element or select element is changed by the user
		//this example the .change() method from jQuery
		//it defines the function to be executed when the event occurs

		if (selectedOption) {
			updateLegend(selectedOption);
			changeData(selectedOption, 1000);

		} else {
			// Clear the chart if no option is selected
			clearChart();
		}
	});

	function clearChart() {
		graphic.selectAll('*').remove();
	}


	function updateLegend(option) {
		// console.log(option, group)
		// return [option, group];

		legend.selectAll('*').remove();
		
		legend
			.append('div')
			.attr('class', 'legend--item--here')
			.append('div').attr('class', 'legend--icon--circle')
			.style('background-color', config.essential.colour_palette)

		d3.select(".legend--item--here")
			.append('div')
			.append('p').attr('class', 'legend--text')
			.html(option)

		legend
			.append('div')
			.attr("class", "legend--item--here refline")
			.append('div')
			.attr('class', 'legend--icon--refline')
			.style('background-color', "#222")

		d3.select(".legend--item--here.refline")
			.append('div')
			.append('p').attr('class', 'legend--text')
			.html("Sector qualification index score")
	}


	function changeData(selectedOption, transitionDuration) {
		let filteredData = graphic_data.filter((d) => d.option === selectedOption);


		// Update the y scale domain based on the filtered data
		y.domain(filteredData.map((d) => d.name));

		// Update the height of the SVG and the y-axis
		var height =
			config.optional.seriesHeight[size] * y.domain().length + 10 * (y.domain().length - 1) + 12;

		svg = d3.select('#graphic svg');

		svg
			.transition()
			.duration(transitionDuration)
			.attr('height', height + margin.top + margin.bottom);

		y.range([0, height]);

		svg
			.select('.y.axis')
			.call(yAxis.tickValues(filteredData.map((d) => d.name)))
			.selectAll('text')
			.call(wrap, margin.left - 10)


		svg
			.select('.x.axis')
			.transition()
			.duration(transitionDuration)
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis.tickSize(-height))

		// Store the current positions of the labels in the map
		svg.selectAll('text.dataLabels').each(function (d) { labelPositions.set(d.name, x(d.value)); });



		// Enter and update
		let confidenceBands = svg_g.selectAll('rect.confidenceBand').data(filteredData, (d) => d.name);

		toLength = confidenceBands._enter[0].length
		fromLength = confidenceBands._exit[0].length

		if (toLength > fromLength) {

			confidenceBands
				.exit()
				.transition()
				.delay(function (d, i) {
					return i * 30;
				})
				.duration(transitionDuration)
				.style('opacity', 0)
				.remove();
		} else {
			confidenceBands
				.exit()
				.transition()
				.delay(function (d, i) {
					return (toLength * 50) - (i * 50);
				})
				.duration(transitionDuration)
				.style('opacity', 0)
				.remove();
		}


		if (toLength > fromLength) {
			confidenceBands
				.enter()
				.append('rect')
				.attr('class', 'confidenceBand')
				.attr('x', (d) => x(d.LCI))
				.attr('y', (d) => y(d.name))
				.attr('height', y.bandwidth())
				.attr('width', (d) => x(d.UCI) - x(d.LCI))
				.attr('fill', config.essential.colour_palette)
				.style('opacity', 0)
				.transition()
				.delay(function (d, i) {
					return i * 50;
				})
				.duration(transitionDuration)
				.style('opacity', 1);
			// .ease(d3.easeCubic);

		} else {
			confidenceBands
				.enter()
				.append('rect')
				.attr('class', 'confidenceBand')
				.attr('x', (d) => x(d.LCI))
				.attr('y', (d) => y(d.name))
				.attr('height', y.bandwidth())
				.attr('width', (d) => x(d.UCI) - x(d.LCI))
				.attr('fill', config.essential.colour_palette)
				.style('opacity', 0)
				.transition()
				.delay(function (d, i) {
					return (toLength * 50) - (i * 50);
				})
				.duration(transitionDuration)
				.style('opacity', 1);
			// .ease(d3.easeCubic);

		}



			// Enter and update
			let lines = svg_g.selectAll('line.bar').data(filteredData, (d) => d.name);

			// Exit
			lines.exit().transition().duration(transitionDuration).attr('stroke-width', 0).remove();
			// to do: work out transition for lines


			lines
			.enter()
			.append('line')
			.attr('class', 'bar')
			.attr('x1', (d) => x(d.value))
			.attr('x2', (d) => x(d.value))
			.attr('y1', (d) => y(d.name)-5)
			.attr('y2', (d) => y(d.name)+config.optional.seriesHeight[size]+3)
			//.attr('width', (d) => x(d.value))
			.attr('stroke', "#222")
			.attr('stroke-width', '3px')	
			.transition()
			.duration(transitionDuration);


			//Update the data labels
			if (config.essential.dataLabels.show === true) {
				// Remove existing data labels
				svg.selectAll('text.dataLabels').remove();

				// Enter and update
				svg
					.selectAll('text.dataLabels')
					.data(filteredData)
					.enter()
					.append('text')
					.attr('class', 'dataLabels')
					.attr('x', (d) => labelPositions.get(d.name) || x(0))  // Use the stored position or x(0) if not found
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
					)
					.transition()
					.duration(transitionDuration)
				//.ease(d3.easeCubic)
				// .tween('text', function (d) {
				// 	// Parse this.textContent as a float and multiply it by 0.001 to get the start value. This need to match the data.
				// 	let startValue = parseFloat(this.textContent) * 0.001;

				// 	// Create an interpolator
				// 	const i = d3.interpolate(startValue, d.value);

				// 	// Create a position interpolator
				// 	const xi = d3.interpolate(labelPositions.get(d.name) || x(0), x(d.value) - (x(d.value) - x(0) < chart_width / 10 ? -3 : 3));

				// 	return function (t) {
				// 		// Calculate the interpolated value
				// 		let interpolatedValue = i(t);

				// 		// Update the label's text
				// 		this.textContent = d3.format(config.essential.dataLabels.numberFormat)(interpolatedValue);

				// 		// Update the label's x position
				// 		d3.select(this).attr('x', xi(t));
				// 	};
				// });
			}
		}


		var threshold_md = config.optional.mediumBreakpoint;
		var threshold_sm = config.optional.mobileBreakpoint;

		//set variables for chart dimensions dependent on width of #graphic
		if (parseInt(graphic.style('width')) < threshold_sm) {
			size = 'sm';
		} else if (parseInt(graphic.style('width')) < threshold_md) {
			size = 'md';
		} else {
			size = 'lg';
		}

		var margin = config.optional.margin[size];
		var chart_width =
			parseInt(graphic.style('width')) - margin.left - margin.right;
		//height is set by unique options in column name * a fixed height + some magic because scale band is all about proportion

		if (config.essential.xDomain == "auto") {
			let min = 1000000
			let max = 0
			for (i = 2; i < graphic_data.columns.length; i++) {
				min = d3.min([min, d3.min(graphic_data, (d) => +d[graphic_data.columns[i]])])
				max = d3.max([max, d3.max(graphic_data, (d) => +d[graphic_data.columns[i]])])
			}
			xDomain = [min, max]
		} else {
			xDomain = config.essential.xDomain
		}


		var uniqueNames = [...new Set(graphic_data.map((d) => d.name))];
		var height =
			config.optional.seriesHeight[size] * uniqueNames.length +
			10 * (uniqueNames.length - 1) +
			12;

		// clear out existing graphics
		graphic.selectAll('*').remove();

		//set up scales
		x = d3
			.scaleLinear()
			.range([0, chart_width])
			.domain(xDomain);;

		y = d3
			.scaleBand()
			.paddingOuter(0.2)
			.paddingInner(((graphic_data.length - 1) * 10) / (graphic_data.length * 30))
			.range([0, height])
			.round(true);

		//use the data to find unique entries in the name column
		y.domain([...new Set(graphic_data.map((d) => d.name))]);

		//x.domain([0,d3.max(graphic_data.map(({ value }) => Number(value)))])

		//set up yAxis generator
		var yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10);

		// if (config.essential.xDomain == 'auto') {
		// 	x.domain([
		// 		0,
		// 		d3.max(graphic_data.map(({ value }) => Number(value)))]); //modified so it converts string to number
		// } else {
		// 	x.domain(config.essential.xDomain);
		// }


		//set up xAxis generator
		var xAxis = d3
			.axisBottom(x)
			//.tickSize(-height)
			.tickFormat(d3.format(''))
			.ticks(config.optional.xAxisTicks[size]);

		var xAxisTop = d3
			.axisTop(x)
			//.tickSize(-height)
			.tickFormat(d3.format(''))
		// .ticks(config.optional.xAxisTicks[size]);	


		//create svg for chart
		svg_g = d3
			.select('#graphic')
			.append('svg')
			.attr('width', chart_width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.attr('class', 'chart')
			.style('background-color', '#fff')
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		svg_g
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

		svg_g
			.append('g')
			// .attr('transform', 'translate(0,' + height + ')')
			.attr('class', 'x axis')
			.call(xAxisTop)
			.selectAll('line')
			.each(function (d) {
				if (d == 0) {
					d3.select(this).attr('class', 'zero-line');
				}
			});

		// Append y-axis to SVG
		svg_g.append('g')
			.attr('class', 'y axis')
			.call(yAxis)
			.selectAll('text')
			.call(wrap, margin.left - 10)

		// svg_g.append("rect")
		// .attr("class", "vertical-rect")
		// .attr("x", x(0.05))
		// .attr("y", 0)
		// .style('width', 10)
		// .attr("height", height)
		// .attr('stroke-opacity', 0.005)
		// .attr("fill", "#dadada");

		// svg_g.append("line")
		// .attr("class", "vertical-line")
		// .attr("x1", x(0.05))
		// .attr("x2", x(0.05))
		// .attr("y1", 0)
		// .attr("y2", height)
		// .style('stroke-width', 4)
		// .attr("stroke-dasharray", "5,5")
		// .attr("stroke", "#888888")
		// .attr("position", "middle");;


		// This does the x-axis label
		svg_g
			.append('g')
			// .attr('transform', 'translate(0,' + height + ')')
			.append('text')
			.attr('x', chart_width)
			.attr('y', -25)
			.attr('class', 'axis--label')
			.text(config.essential.xAxisLabel)
			.attr('text-anchor', 'end');

		//create link to source
		d3.select('#source').text('Source: ' + config.essential.sourceText);

		$('#optionsSelect').val("Agriculture, forestry and fishing").trigger('chosen:updated');
		changeData("Agriculture, forestry and fishing", 0)
		updateLegend("Agriculture, forestry and fishing", 0)


		//use pym to calculate chart dimensions
		if (pymChild) {
			pymChild.sendHeight();
		}
	}

	function wrap(text, width) {
		text.each(function () {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.1, // ems
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr('x', x);
			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr('x', x).attr("dy", lineHeight + "em").text(word);
				}
			}
			var breaks = text.selectAll("tspan").size();
			text.attr("y", function () {
				return -6 * (breaks - 1);
			});
		});

	}

	d3.csv(config.essential.graphic_data_url).then((data) => {
		//load chart data
		graphic_data = data;

		//use pym to create iframed chart dependent on specified variables
		pymChild = new pym.Child({
			renderCallback: drawGraphic, polling: 500
		});
	});