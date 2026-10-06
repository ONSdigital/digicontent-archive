import { initialise, wrap, addSvg, addAxisLabel } from "../lib/helpers.js";

let graphic = d3.select('#graphic');
let select = d3.select('#select');
let legend = d3.select('#legend');
let graphic_data, size;
//console.log(`Graphic selected: ${graphic}`);

let pymChild = null;

function drawGraphic() {

	select.selectAll('*').remove(); // Clear any existing content in the select element

	//Set up some of the basics and return the size value ('sm', 'md' or 'lg')
	size = initialise(size);
	const aspectRatio = config.optional.aspectRatio[size]

	let uniqueOptions = [...new Set(graphic_data.map((d) => d.option))];

	// console.log(graphic_data);

	// console.log(uniqueOptions);

	// console.log(`dropdownData contains: ${JSON.stringify(uniqueOptions)}`);

	const optns = select
		.append('div')
		.attr('id', 'sel')
		.append('select')
		.attr('id', 'optionsSelect')
		.attr('style', 'width:calc(100% - 6px)')
		.attr('class', 'chosen-select')
		.attr('data-placeholder', 'Select a local area');

	// Add the placeholder option
	// optns.append('option').attr('value', '').text('Select an option'); // Placeholder text

	optns
		.selectAll('option.option')
		.data(uniqueOptions)
		.enter()
		.append('option')
		.attr('value', (d) => d)
		.text((d) => d);

	//add some more accessibility stuff
	d3.select('input.chosen-search-input').attr('id', 'chosensearchinput');
	d3.select('div.chosen-search')
		.insert('label', 'input.chosen-search-input')
		.attr('class', 'visuallyhidden')
		.attr('for', 'chosensearchinput')
		.html('Type to select an area');


	//$('#optionsSelect').trigger('chosen:updated');  // Initialize Chosen

	let labelPositions = new Map();  // Create a map to store label positions

	$('#optionsSelect').chosen().change(function () {
		const selectedOption = $(this).val();
		// console.log(`Selected option: ${selectedOption}`);

		if (selectedOption) {
			changeData(selectedOption);

		} else {
			// Clear the chart if no option is selected
			clearChart();
		}
	});

	// Clear the chart if no option is selected

	function clearChart() {

		$('#optionsSelect').val('').trigger('chosen:updated');

		// Clear the chart graphics
		svg.selectAll('path')
		// .transition().duration(2000)
		.attr('width', 0).remove();

		svg.selectAll('circle.line-end')
			// .transition().duration(2000)
			// .attr('r', 0)
			.remove();

		svg
			.selectAll('text.directLineLabel')
			// .transition()
			// .duration(1000)
			// .attr('x', -100)
			.remove();
	};

// Function to change the data based on the selected option
function changeData(selectedOption) {
	// Remove all existing lines and circles
	svg.selectAll('path.line').remove();
	svg.selectAll('circle.line-end').remove();
	svg.selectAll('text.directLineLabel').remove();
	svg.selectAll('line.label-leader-line').remove();

	svg.selectAll('.placeholder-text').remove(); // Remove any placeholder text

	d3.selectAll('.y.axis .tick').attr('opacity', 1); // Reveal y-axis ticks

	// Clear existing legend
	d3.select('#legend').selectAll('div.legend--item').remove();

	// Show legend when an option is selected
	d3.select('#legend').style('display', null);

	// Filter data for the selected option
	let filteredData = graphic_data.filter((d) => d.option === selectedOption);
	if (filteredData.length === 0) return;

	// Get categories (series) for this option
	const categories = Object.keys(filteredData[0]).filter((k) => k !== 'date' && k !== 'option');

	// Set y domain for "auto" (per selected option)
	if (config.essential.yDomain === "auto") {
		// Collect all valid (non-null, non-undefined, non-NaN) values for all categories
		let allValues = [];
		filteredData.forEach(d => {
			categories.forEach(c => {
				if (d[c] !== null && d[c] !== undefined && !isNaN(d[c])) {
					allValues.push(d[c]);
				}
			});
		});
		let minY = d3.min(allValues);
		let maxY = d3.max(allValues);		
		y.domain([minY, maxY]);
		// console.log("auto y domain:", minY, maxY);
		// Update y axis
		svg.select('.y.axis.numeric')
			.transition()
			.duration(500)
			.call(d3.axisLeft(y).ticks(config.optional.yAxisTicks[size])
				.tickFormat(d3.format(config.essential.yAxisNumberFormat)));
		// Update grid lines
		svg.select('.grid')
			.transition()
			.duration(500)
			.call(
				d3.axisLeft(y)
					.ticks(config.optional.yAxisTicks[size])
					.tickSize(-chart_width)
					.tickFormat('')
			);
	}

	// Draw all lines and circles with staggered transitions
	categories.forEach(function (category, index) {
		const lineGenerator = d3.line()
			.x((d) => x(d.date))
			.y((d) => y(d[category]))
			.defined(d => d[category] !== null)
			.curve(d3[config.essential.lineCurveType]);

		const path = svg.append('path')
			.datum(filteredData)
			.attr('class', 'line')
			.attr('fill', 'none')
			.attr('stroke', config.essential.colour_palette[index % config.essential.colour_palette.length])
			.attr('stroke-width', 3)
			.attr('d', lineGenerator)
			.style('stroke-linejoin', 'round')
			.style('stroke-linecap', 'round');

		// Get the total length of the path for the transition
		const totalLength = path.node().getTotalLength();

		// Set up the transition - first line appears immediately, others after first line completes
		const firstLineDuration = 600; // Faster first line
		const otherLinesDuration = 500; // Faster subsequent lines
		const delay = index === 0 ? 0 : firstLineDuration + 100; // Others start 100ms after first completes
		const duration = index === 0 ? firstLineDuration : otherLinesDuration;

		path
			.attr('stroke-dasharray', totalLength + ' ' + totalLength)
			.attr('stroke-dashoffset', totalLength)
			.transition()
			.delay(delay)
			.duration(duration)
			.ease(index === 0 ? d3.easeQuadOut : d3.easeQuadInOut) // Different easing for first vs others
			.attr('stroke-dashoffset', 0);

		// Add circle at the end of the line with coordinated timing
		const lastDatum = filteredData[filteredData.length - 1];
		const circle = svg.append('circle')
			.attr('class', 'line-end')
			.attr('cx', x(lastDatum.date))
			.attr('cy', y(lastDatum[category]))
			.attr('r', 0) // Start with radius 0
			.attr('fill', config.essential.colour_palette[index % config.essential.colour_palette.length]);

		// Animate circle to appear at the end of line drawing
		circle
			.transition()
			.delay(delay + duration - 150) // Appear 150ms before line finishes
			.duration(250) // Faster circle animation
			.ease(d3.easeBackOut)
			.attr('r', 4);
	});

	svg.selectAll('path.migration-area-shade').remove(); // Remove any existing shaded areas

	// Shade area between last two categories (e.g., 'high migration' and 'Zero net migration')
    if (categories.length >= 2) {
        const catA = categories[categories.length - 2];
        const catB = categories[categories.length - 1];
        const areaGen = d3.area()
            .x(d => x(d.date))
            .y0(d => y(d[catA]))
            .y1(d => y(d[catB]))
            .defined(d => d[catA] != null && d[catB] != null)
            .curve(d3[config.essential.lineCurveType]);
        svg.append('path')
            .datum(filteredData)
            .attr('class', 'migration-area-shade')
            .attr('fill', '#bbb') // or a color of your choice, or use opacity
            .attr('opacity', 0)
            .attr('d', areaGen)

		svg.selectAll('path.migration-area-shade')
			.transition()
			.duration(500) // Match the second line's duration
			.delay(600 + 100) // Match the second line's delay
			.attr('opacity', 0.25);
    }

	// Handle legend vs direct labels (with delay for direct labels)
	if (config.essential.drawLegend || size === 'sm') {
		// For mobile, remove last two entries and add custom shaded square
		let legendData = categories.map((c, i) => [c, config.essential.colour_palette[i % config.essential.colour_palette.length]]);
		if (size === 'sm' && legendData.length > 2) {
			legendData = legendData.slice(0, -2); // Remove last two
		}
		let legenditem = d3
			.select('#legend')
			.selectAll('div.legend--item')
			.data(legendData)
			.enter()
			.append('div')
			.attr('class', 'legend--item');

		legenditem
			.append('div')
			.attr('class', 'legend--icon--circle')
			.style('background-color', function (d) {
				return d[1];
			});

		legenditem
			.append('div')
			.append('p')
			.attr('class', 'legend--text')
			.html(function (d) {
				return d[0];
			});

		// Add custom shaded square for migration range
		if (size === 'sm') {
			let custom = d3.select('#legend')
				.append('div')
				.attr('class', 'legend--item')
				.style('display', 'flex')
				.style('align-items', 'center'); // Flexbox for vertical centering
			custom.append('svg')
				.attr('width', 22)
				.attr('height', 22)
				.style('vertical-align', 'middle')
				.append('rect')
				.attr('x', 2)
				.attr('y', 2)
				.attr('width', 18)
				.attr('height', 18)
				.attr('fill', '#bbb')
				.attr('opacity', 0.25)
				.attr('stroke', 'none');
			// Top border
			custom.select('svg')
				.append('line')
				.attr('x1', 2).attr('y1', 2).attr('x2', 20).attr('y2', 2)
				.attr('stroke', '#959495').attr('stroke-width', 2);
			// Bottom border
			custom.select('svg')
				.append('line')
				.attr('x1', 2).attr('y1', 20).attr('x2', 20).attr('y2', 20)
				.attr('stroke', '#959495').attr('stroke-width', 2);
			custom.append('div')
				.style('margin-left', '8px')
				.style('display', 'flex')
				.style('align-items', 'center')
				.append('p')
				.attr('class', 'legend--text legend--text--custom')
				.style('margin', '0')
				.text('High migration to Zero migration range');
		}
	} else {
		// Handle direct labels with collision detection
		// Delay label creation until after lines are drawn
		setTimeout(() => {
			createDirectLabels(categories, filteredData);
		}, 1200); // Adjusted timing for faster animations
	}
}

// Separate function to handle direct label creation and positioning
function createDirectLabels(categories, filteredData) {
	let labelData = [];
	const lastDatum = filteredData[filteredData.length - 1];

	// Create all labels first and collect their data
	categories.forEach(function (category, index) {
		// Skip if the last value is null (no data point to label)
		if (lastDatum[category] === null) return;

		const label = svg.append('text')
			.attr('class', 'directLineLabel')
			.attr('x', x(lastDatum.date) + 10)
			.attr('y', y(lastDatum[category]))
			.attr('dy', '.35em')
			.attr('text-anchor', 'start')
			.attr('fill', config.essential.text_colour_palette[index % config.essential.text_colour_palette.length])
			.attr('opacity', 0) // Start invisible
			.text(category)
			.call(wrap, margin.right - 10);

		// Get the actual height of the text element after wrapping
		const bbox = label.node().getBBox();
		
		labelData.push({
			node: label,
			x: x(lastDatum.date) + 10,
			y: y(lastDatum[category]),
			originalY: y(lastDatum[category]),
			height: bbox.height,
			category: category
		});
	});

	// Only run collision detection if we have multiple labels
	if (labelData.length > 1) {
		// Sort labels by their y position for easier collision detection
		labelData.sort((a, b) => a.y - b.y);

		// Simple collision detection and adjustment
		const minSpacing = 18; // Minimum pixels between label centers
		
		for (let i = 1; i < labelData.length; i++) {
			const current = labelData[i];
			const previous = labelData[i - 1];
			
			// Check if current label overlaps with previous
			const overlap = (previous.y + previous.height/2 + minSpacing/2) - (current.y - current.height/2 - minSpacing/2);
			
			if (overlap > 0) {
				// Move current label down
				current.y += overlap;
				
				// Make sure it doesn't go below chart bounds
				if (current.y + current.height/2 > height) {
					// If it would go below, try moving the previous label up instead
					const pushUp = (current.y + current.height/2) - height;
					
					// Move all previous labels up by the required amount
					for (let j = i - 1; j >= 0; j--) {
						labelData[j].y -= pushUp;
						// Don't let them go above the chart
						if (labelData[j].y - labelData[j].height/2 < 0) {
							labelData[j].y = labelData[j].height/2;
						}
					}
					
					// Adjust current label to fit
					current.y = height - current.height/2;
				}
			}
		}
	}

	// Apply the adjusted positions and fade in labels
	labelData.forEach((label) => {
		label.node
			.attr('y', label.y)
			.transition()
			.duration(500) // All labels transition at the same time
			.ease(d3.easeBackOut)
			.attr('opacity', 1);

        // Draw leader lines if labels are offset vertically from their original positions
        if (Math.abs(label.y - label.originalY) > 1) {
            svg.append('line')
                .attr('class', 'label-leader-line')
                .attr('x1', label.x - 10) // End of the line (before label offset)
                .attr('y1', label.originalY)
                .attr('x2', label.x) // Start of the label
                .attr('y2', label.y)
                .attr('stroke', config.essential.colour_palette[categories.indexOf(label.category) % config.essential.colour_palette.length])
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '2,2'); // Optional: dashed line
        }
	});
}

// Alternative force-based approach (if you prefer the d3.force method)
function createDirectLabelsWithForce(categories, filteredData) {
	let labelData = [];
	const lastDatum = filteredData[filteredData.length - 1];

	// Create all labels first
	categories.forEach(function (category, index) {
		if (lastDatum[category] === null) return;

		const label = svg.append('text')
			.attr('class', 'directLineLabel')
			.attr('x', x(lastDatum.date) + 10)
			.attr('y', y(lastDatum[category]))
			.attr('dy', '.35em')
			.attr('text-anchor', 'start')
			.attr('fill', config.essential.text_colour_palette[index % config.essential.text_colour_palette.length])
			.text(category)
			.call(wrap, margin.right - 10);

		const bbox = label.node().getBBox();
		
		labelData.push({
			node: label,
			x: x(lastDatum.date) + 10,
			y: y(lastDatum[category]),
			originalY: y(lastDatum[category]),
			height: bbox.height,
			width: bbox.width
		});
	});

	if (labelData.length > 1) {
		// Use d3 force simulation for more sophisticated positioning
		const simulation = d3.forceSimulation(labelData)
			.force('y', d3.forceY(d => d.originalY).strength(0.8))
			.force('collide', d3.forceCollide().radius(d => d.height/2 + 2))
			.force('bounds', () => {
				labelData.forEach(d => {
					d.y = Math.max(d.height/2, Math.min(height - d.height/2, d.y));
				});
			})
			.stop();

		// Run simulation
		for (let i = 0; i < 120; i++) {
			simulation.tick();
		}

		// Apply final positions
		labelData.forEach(d => {
			d.node.attr('y', d.y);
		});
	}
}

// Separate function to handle direct label creation and positioning
function createDirectLabels(categories, filteredData) {
	let labelData = [];
	const lastDatum = filteredData[filteredData.length - 1];

	// Create all labels first and collect their data
	categories.forEach(function (category, index) {
		// Skip if the last value is null (no data point to label)
		if (lastDatum[category] === null) return;

		const label = svg.append('text')
			.attr('class', 'directLineLabel')
			.attr('x', x(lastDatum.date) + 10)
			.attr('y', y(lastDatum[category]))
			.attr('dy', '.35em')
			.attr('text-anchor', 'start')
			.attr('fill', config.essential.text_colour_palette[index % config.essential.text_colour_palette.length])
			.attr('opacity', 0) // Start invisible
			.text(category)
			.call(wrap, margin.right - 10);

		// Get the actual height of the text element after wrapping
		const bbox = label.node().getBBox();
		
		labelData.push({
			node: label,
			x: x(lastDatum.date) + 10,
			y: y(lastDatum[category]),
			originalY: y(lastDatum[category]),
			height: bbox.height,
			category: category
		});
	});

	// Only run collision detection if we have multiple labels
	if (labelData.length > 1) {
		// Sort labels by their y position for easier collision detection
		labelData.sort((a, b) => a.y - b.y);

		// Simple collision detection and adjustment
		const minSpacing = 18; // Minimum pixels between label centers
		
		for (let i = 1; i < labelData.length; i++) {
			const current = labelData[i];
			const previous = labelData[i - 1];
			
			// Check if current label overlaps with previous
			const overlap = (previous.y + previous.height/2 + minSpacing/2) - (current.y - current.height/2 - minSpacing/2);
			
			if (overlap > 0) {
				// Move current label down
				current.y += overlap;
				
				// Make sure it doesn't go below chart bounds
				if (current.y + current.height/2 > height) {
					// If it would go below, try moving the previous label up instead
					const pushUp = (current.y + current.height/2) - height;
					
					// Move all previous labels up by the required amount
					for (let j = i - 1; j >= 0; j--) {
						labelData[j].y -= pushUp;
						// Don't let them go above the chart
						if (labelData[j].y - labelData[j].height/2 < 0) {
							labelData[j].y = labelData[j].height/2;
						}
					}
					
					// Adjust current label to fit
					current.y = height - current.height/2;
				}
			}
		}
	}

	// Apply the adjusted positions and fade in labels
	labelData.forEach((label) => {
		label.node
			.attr('y', label.y)
			.transition()
			.duration(500) // All labels transition at the same time
			.ease(d3.easeBackOut)
			.attr('opacity', 1);

        // Draw leader lines if labels are offset vertically from their original positions
        if (Math.abs(label.y - label.originalY) > 1) {
            svg.append('line')
                .attr('class', 'label-leader-line')
                .attr('x1', label.x - 10) // End of the line (before label offset)
                .attr('y1', label.originalY)
                .attr('x2', label.x) // Start of the label
                .attr('y2', label.y)
                .attr('stroke', config.essential.colour_palette[categories.indexOf(label.category) % config.essential.colour_palette.length])
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '2,2'); // Optional: dashed line
        }
	});
}

// Alternative force-based approach which I can't get to work properly
function createDirectLabelsWithForce(categories, filteredData) {
	let labelData = [];
	const lastDatum = filteredData[filteredData.length - 1];

	// Create all labels first
	categories.forEach(function (category, index) {
		if (lastDatum[category] === null) return;

		const label = svg.append('text')
			.attr('class', 'directLineLabel')
			.attr('x', x(lastDatum.date) + 10)
			.attr('y', y(lastDatum[category]))
			.attr('dy', '.35em')
			.attr('text-anchor', 'start')
			.attr('fill', config.essential.text_colour_palette[index % config.essential.text_colour_palette.length])
			.text(category)
			.call(wrap, margin.right - 10);

		const bbox = label.node().getBBox();
		
		labelData.push({
			node: label,
			x: x(lastDatum.date) + 10,
			y: y(lastDatum[category]),
			originalY: y(lastDatum[category]),
			height: bbox.height,
			width: bbox.width
		});
	});

	if (labelData.length > 1) {
		// Use d3 force simulation for more sophisticated positioning
		const simulation = d3.forceSimulation(labelData)
			.force('y', d3.forceY(d => d.originalY).strength(0.8))
			.force('collide', d3.forceCollide().radius(d => d.height/2 + 2))
			.force('bounds', () => {
				labelData.forEach(d => {
					d.y = Math.max(d.height/2, Math.min(height - d.height/2, d.y));
				});
			})
			.stop();

		// Run simulation
		for (let i = 0; i < 120; i++) {
			simulation.tick();
		}

		// Apply final positions
		labelData.forEach(d => {
			d.node.attr('y', d.y);
		});
	}
}
	// Define the dimensions and margin, width and height of the chart.
	let margin = config.optional.margin[size];
	let chart_width = parseInt(graphic.style('width')) - margin.left - margin.right;
	let height = (aspectRatio[1] / aspectRatio[0]) * chart_width;
	// console.log(`Margin, chart_width, and height set: ${margin}, ${chart_width}, ${height}`);

	// Get categories from the keys used in the stack generator
	const categories = Object.keys(graphic_data[0]).filter((k) => k !== 'date' && k !== 'option');
	// console.log(`Categories retrieved: ${categories}`);

	let xDataType;

	if (Object.prototype.toString.call(graphic_data[0].date) === '[object Date]') {
		xDataType = 'date';
	} else {
		xDataType = 'numeric';
	}

	// console.log(xDataType)

	// Define the x and y scales

	let x;

	if (xDataType == 'date') {
		x = d3.scaleTime()
			.domain(d3.extent(graphic_data, (d) => d.date))
			.range([0, chart_width]);
	} else {
		x = d3.scaleLinear()
			.domain(d3.extent(graphic_data, (d) => +d.date))
			.range([0, chart_width]);
	}
	//console.log(`x defined`);

	const y = d3
		.scaleLinear()
		.range([height, 0]);

	// Set y domain for "autoAll" or array, but not for "auto"
	if (config.essential.yDomain === "autoAll") {
		let minY = d3.min(graphic_data, (d) => Math.min(...categories.map((c) => d[c])));
		let maxY = d3.max(graphic_data, (d) => Math.max(...categories.map((c) => d[c])));
		y.domain([minY, maxY]);
		// console.log("autoAll y domain:", minY, maxY);
	} else if (Array.isArray(config.essential.yDomain)) {
		y.domain(config.essential.yDomain);
	} // else "auto" will be handled in changeData

	// This function generates an array of approximately count + 1 uniformly-spaced, rounded values in the range of the given start and end dates (or numbers).
	let tickValues = x.ticks(config.optional.xAxisTicks[size]);

	if (config.optional.addFirstDate == true) {
		tickValues.push(graphic_data[0].date)
		// console.log("First date added")
	}

	if (config.optional.addFinalDate == true) {
		tickValues.push(graphic_data[graphic_data.length - 1].date)
		// console.log("Last date added")
	}

	// Create an SVG element
	const svg = addSvg({
		svgParent: graphic,
		chart_width: chart_width,
		height: height + margin.top + margin.bottom,
		margin: margin
	})

	// Hide legend on first load unless a default option is set
	if (!config.essential.defaultOption) {
		d3.select('#legend').style('display', 'none');
	} else {
		d3.select('#legend').style('display', null);
	}


	// add grid lines to y axis
	svg
		.append('g')
		.attr('class', 'grid')
		.call(
			d3
				.axisLeft(y)
				.ticks(config.optional.yAxisTicks[size])
				.tickSize(-chart_width)
				.tickFormat('')
		)
		.lower();

	d3.selectAll('g.tick line')
		.each(function (e) {
			if (e == config.essential.zeroLine) {
				d3.select(this).attr('class', 'zero-line');
			}
		})
		// console.log(x.ticks(graphic_data[0].date, graphic_data[graphic_data.length - 1].date, 5))
	// Add the x-axis
	svg
		.append('g')
		.attr('class', 'x axis')
		.attr('transform', `translate(0, ${height})`)
		.call(
			d3
				.axisBottom(x)
				// .tickValues(d3.timeMonths(graphic_data[0].date, graphic_data[graphic_data.length - 1].date, (130/config.optional.xAxisTicks[size])))
				// .ticks(d3.timeYear.every(4))
				// .ticks(d3.timeMonth.every(12))
				.tickFormat((d) => xDataType == 'date' ? d3.timeFormat(config.essential.xAxisTickFormat[size])(d)
					: d3.format(config.essential.xAxisNumberFormat)(d))
		);
	// Add the y-axis
	svg
		.append('g')
		.attr('class', 'y axis numeric')
		.call(d3.axisLeft(y).ticks(config.optional.yAxisTicks[size])
			.tickFormat(d3.format(config.essential.yAxisNumberFormat)));



	// This does the y-axis label
	addAxisLabel({
		svgContainer: svg,
		xPosition: 5 - margin.left,
		yPosition: -15,
		text: config.essential.yAxisLabel,
		textAnchor: "start",
		wrapWidth: chart_width
	});

	// This does the x-axis label
	addAxisLabel({
		svgContainer: svg,
		xPosition: chart_width,
		yPosition: height + margin.bottom - 25,
		text: config.essential.xAxisLabel,
		textAnchor: "end",
		wrapWidth: chart_width
	});

	//create link to source
	d3.select('#source').text('Source: ' + config.essential.sourceText);
	// console.log(`Link to source created`);

	//if there is a default option, set it
	if (config.essential.defaultOption) {
		// console.log(`Default option set to: ${config.essential.defaultOption}`);
		$('#optionsSelect').val(config.essential.defaultOption).trigger('chosen:updated');
		changeData(config.essential.defaultOption);
	} else {
		// If no default option, clear the chart and add some text
		clearChart();
		d3.selectAll('.y.axis .tick').attr('opacity', 0); // Hide y-axis ticks

		svg.append('text')
			.attr('class', 'placeholder-text')
			.attr('x', chart_width / 2)
			.attr('y', height / 2 - 10)
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'middle')
			.attr('fill', '#888')
			.attr('opacity', 0.6)
			.attr('font-weight', 'bold')
			.attr('font-size', '1.4em')
			.text('Select an area above');
	}

	//use pym to calculate chart dimensions
	if (pymChild) {
		pymChild.sendHeight();
	}
	// console.log(`PymChild height sent`);
}


// Load the data
d3.csv(config.essential.graphic_data_url).then((rawData) => {
	graphic_data = rawData.map((d) => {
		if (d3.timeParse(config.essential.dateFormat)(d.date) !== null) {
			return {
				date: d3.timeParse(config.essential.dateFormat)(d.date),
				option: d.option,
				...Object.entries(d)
					.filter(([key]) => key !== 'date' && key !== 'option') // Exclude 'date' and 'option' keys from the data
					.map(([key, value]) => [key, value == "" ? null : +value]) // Checking for missing values so that they can be separated from zeroes
					.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
			}
		} else {
			return {
				date: (+d.date),
				option: d.option,
				...Object.entries(d)
					.filter(([key]) => key !== 'date' && key !== 'option')
					.map(([key, value]) => [key, value == "" ? null : +value]) // Checking for missing values so that they can be separated from zeroes
					.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
			}
		}
	});

	// console.log(graphic_data);

	// Use pym to create an iframed chart dependent on specified variables
	pymChild = new pym.Child({
		renderCallback: drawGraphic
	});
	// console.log(`PymChild created with renderCallback to drawGraphic`);
});
