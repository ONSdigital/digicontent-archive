let graphic = d3.select('#graphic');
let legend = d3.select('#legend');
//console.log(`Graphic selected: ${graphic}`);

let pymChild = null;

function drawGraphic() {
	// clear out existing graphics
	graphic.selectAll('*').remove();
	legend.selectAll('*').remove();

	//Accessible summary
	d3.select('#accessibleSummary').html(config.essential.accessibleSummary);
	//	console.log(`Accessible summary set: ${config.essential.accessibleSummary}`);

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
	// console.log(`Size set: ${size}`);



	// Define the dimensions and margin, width and height of the chart.
	let margin = config.optional.margin[size];
	let width = parseInt(graphic.style('width')) - margin.left - margin.right;
	let height = 400 - margin.top - margin.bottom;
	// console.log(`Margin, width, and height set: ${margin}, ${width}, ${height}`);

	// Get categories from the keys used in the stack generator
	const categories = Object.keys(graphic_data[0]).filter((k) => k !== 'date');
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
	  .range([0, width]);
	} else {
	  x = d3.scaleLinear()
	  .domain(d3.extent(graphic_data, (d) => +d.date))
	  .range([0, width]);
	}
	//console.log(`x defined`);

	const y = d3
		.scaleLinear()
		.range([height, 0]);

	if (config.essential.yDomain == "auto") {
		let minY = d3.min(graphic_data, (d) => Math.min(...categories.map((c) => d[c])))
		let maxY = d3.max(graphic_data, (d) => Math.max(...categories.map((c) => d[c])))
		y.domain([minY, maxY])
		console.log(minY, maxY)
	} else {
		y.domain(config.essential.yDomain)
	}

	// This function generates an array of approximately count + 1 uniformly-spaced, rounded values in the range of the given start and end dates (or numbers).
	let tickValues = x.ticks(config.optional.xAxisTicks[size]);

	if (config.optional.addFirstDate == true) {
		tickValues.push(graphic_data[0].date)
		console.log("First date added")
	}

	if (config.optional.addFinalDate == true) {
		tickValues.push(graphic_data[graphic_data.length - 1].date)
		console.log("Last date added")
	}

	// Create an SVG element
	const svg = graphic
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.attr('class', 'chart')
		.style('background-color', '#fff')
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);
	//console.log(`SVG element created`);



	// create lines and circles for each category
	categories.forEach(function (category) {
		const lineGenerator = d3
			.line()
			.x((d) => x(d.date))
			.y((d) => y(d[category]))
			.defined(d => d[category] !== null) // Only plot lines where we have values
			.curve(d3[config.essential.lineCurveType]) // I used bracket notation here to access the curve type as it's a string
			.context(null);
		// console.log(`Line generator created for category: ${category}`);

		svg
			.append('path')
			.datum(graphic_data)
			.attr('fill', 'none')
			.attr(
				'stroke',
				config.essential.colour_palette[
				categories.indexOf(category) % config.essential.colour_palette.length
				]
			)
			.attr('stroke-width', 3)
			.attr('d', lineGenerator)
			.style('stroke-linejoin', 'round')
			.style('stroke-linecap', 'round');
		//console.log(`Path appended for category: ${category}`);

		const lastDatum = graphic_data[graphic_data.length - 1];


		// console.log(`drawLegend: ${size}`);
		// size === 'sm'

		if (config.essential.drawLegend || size === 'sm') {


			// Set up the legend
			let legenditem = d3
				.select('#legend')
				.selectAll('div.legend--item')
				.data(categories.map((c, i) => [c, config.essential.colour_palette[i % config.essential.colour_palette.length]]))
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

		} else {

			// Add text labels to the right of the circles
			svg
				.append('text')
				.attr(
					'transform',
					`translate(${x(lastDatum.date)}, ${y(lastDatum[category])})`
				)
				.attr('x', 10)
				.attr('dy', '.35em')
				.attr('text-anchor', 'start')
				.attr(
					'fill',
					config.essential.text_colour_palette[
					categories.indexOf(category) % config.essential.text_colour_palette.length
					]
				)
				.text(category)
				.attr("class","directLineLabel")
				.call(wrap, margin.right - 10); //wrap function for the direct labelling.

		};


		svg
			.append('circle')
			.attr('cx', x(lastDatum.date))
			.attr('cy', y(lastDatum[category]))
			.attr('r', 4)
			.attr(
				'fill',
				config.essential.colour_palette[
				categories.indexOf(category) % config.essential.colour_palette.length
				]
			);
		// console.log(`Circle appended for category: ${category}`);



	});

	// add grid lines to y axis
	svg
		.append('g')
		.attr('class', 'grid')
		.call(
			d3
				.axisLeft(y)
				.ticks(config.optional.yAxisTicks[size])
				.tickSize(-width)
				.tickFormat('')
		)
		.lower();

	d3.selectAll('g.tick line')
		.each(function (e) {
			if (e == config.essential.zeroLine) {
				d3.select(this).attr('class', 'zero-line');
			}
		})

	// Add the x-axis
	svg
		.append('g')
		.attr('class', 'x axis')
		.attr('transform', `translate(0, ${height})`)
		.call(
			d3
				.axisBottom(x)
				.tickValues(tickValues)
				.tickFormat((d) => xDataType == 'date' ? d3.timeFormat(config.essential.xAxisTickFormat[size])(d)
					: d3.format(config.essential.xAxisNumberFormat)(d))
		);


		d3.selectAll('g.x.axis')
		.selectAll('text')
		.attr('transform', 'translate(0, 12)')
		.call(wrap2, 50, 0.35);


	// Add the y-axis
	svg
		.append('g')
		.attr('class', 'y axis')
		.call(d3.axisLeft(y).ticks(config.optional.yAxisTicks[size])
		.tickFormat(d3.format(config.essential.yAxisNumberFormat)));
	


	// This does the y-axis label
	svg
		.append('g')
		.attr('transform', `translate(0, 0)`)
		.append('text')
		.attr('x', -margin.left + 5)
		.attr('y', -15)
		.attr('class', 'axis--label')
		.text(config.essential.yAxisLabel)
		.attr('text-anchor', 'start');

// This does the x-axis label
svg
.append('g')
.attr('transform', "translate(0, "+(height+margin.bottom)+")")
.append('text')
.attr('x',width)
.attr('y', -25)
.attr('class', 'axis--label')
.text(config.essential.xAxisLabel)
.attr('text-anchor', 'end');

//create link to source
	d3.select('#source').text('Source: ' + config.essential.sourceText);
	// console.log(`Link to source created`);

	//use pym to calculate chart dimensions
	if (pymChild) {
		pymChild.sendHeight();
	}
	// console.log(`PymChild height sent`);
}

//text wrap function for the direct labelling


//wrap function 
function wrap2(
	text,
	width,
	dyAdjust,
	lineHeightEms,
	lineHeightSquishFactor,
	splitOnHyphen,
	centreVertically
) {
	// Use default values for the last three parameters if values are not provided.
	if (!lineHeightEms) lineHeightEms = 1.05;
	if (!lineHeightSquishFactor) lineHeightSquishFactor = 1;
	if (splitOnHyphen == null) splitOnHyphen = true;
	if (centreVertically == null) centreVertically = true;

	text.each(function () {
		var text = d3.select(this),
			x = text.attr("x"),
			y = text.attr("y");

		if (x == null) x = 0;

		var words = [];
		text
			.text()
			.split(/\s+/)
			.forEach(function (w) {
				if (splitOnHyphen) {
					var subWords = w.split("-");
					for (var i = 0; i < subWords.length - 1; i++)
						words.push(subWords[i] + "-");
					words.push(subWords[subWords.length - 1] + " ");
				} else {
					words.push(w + " ");
				}
			});

		text.text(null); // Empty the text element

		// `tspan` is the tspan element that is currently being added to
		var tspan = text.append("tspan");

		var line = ""; // The current value of the line
		var prevLine = ""; // The value of the line before the last word (or sub-word) was added
		var nWordsInLine = 0; // Number of words in the line
		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			prevLine = line;
			line = line + word;
			++nWordsInLine;
			tspan.text(line.trim());
			if (tspan.node().getComputedTextLength() > width && nWordsInLine > 1) {
				// The tspan is too long, and it contains more than one word.
				// Remove the last word and add it to a new tspan.
				tspan.text(prevLine.trim());
				prevLine = "";
				line = word;
				nWordsInLine = 1;
				tspan = text.append("tspan").text(word.trim());
			}
		}

		var tspans = text.selectAll("tspan");

		var h = lineHeightEms;
		// Reduce the line height a bit if there are more than 2 lines.
		if (tspans.size() > 2)
			for (var i = 0; i < tspans.size(); i++) h *= lineHeightSquishFactor;

		tspans.each(function (d, i) {
			// Calculate the y offset (dy) for each tspan so that the vertical centre
			// of the tspans roughly aligns with the text element's y position.
			var dy = i * h + dyAdjust;
			if (centreVertically) dy -= ((tspans.size() - 1) * h) / 2;
			d3.select(this)
				.attr("y", y)
				.attr("x", x)
				.attr("dy", dy + "em");
		});
	});
} //end wrap



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

// Load the data
d3.csv(config.essential.graphic_data_url).then((rawData) => {
	graphic_data = rawData.map((d) => {
		if (d3.timeParse(config.essential.dateFormat)(d.date) !== null) {
			return {
				date: d3.timeParse(config.essential.dateFormat)(d.date),
				...Object.entries(d)
					.filter(([key]) => key !== 'date')
					.map(([key, value]) => [key, value == "" ? null : +value]) // Checking for missing values so that they can be separated from zeroes
					.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
			}
		} else {
			return {
				date: (+d.date),
				...Object.entries(d)
					.filter(([key]) => key !== 'date')
					.map(([key, value]) => [key,  value == "" ? null : +value]) // Checking for missing values so that they can be separated from zeroes
					.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
			}}
		});

	console.log(graphic_data);

	// console.log(`Data from CSV processed`);

	// console.log('Final data structure:');
	// console.log(graphic_data);

	// Use pym to create an iframed chart dependent on specified variables
	pymChild = new pym.Child({
		renderCallback: drawGraphic
	});
	// console.log(`PymChild created with renderCallback to drawGraphic`);
});
