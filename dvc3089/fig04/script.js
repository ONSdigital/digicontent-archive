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

		console.log(graphic_data)

		
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

			const annotationDates = ["01/01/1993", "01/01/1977"];
			const annotationValues = [0.8,1.94];
			const annotationLabels = ["Before age 30", "Completed family size at age 30"]
			const annotationColours = ["#206095","#27A0CC"]

		
		};

		

	


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
		.attr('y', -20)
		.attr('class', 'axis--label')
		.text(config.essential.yAxisLabel)
		.attr('text-anchor', 'start');

// This does the x-axis label
svg
.append('g')
.attr('transform', "translate(0, "+(height+margin.bottom)+")")
.append('text')
.attr('x',width)
.attr('y', -10)
.attr('class', 'axis--label')
.text(config.essential.xAxisLabel)
.attr('text-anchor', 'end');

//PLACE TO ADD ANNOTATIONS



//only draw arrows with annotations if not on mobile
if (width > threshold_sm) {

	const annotationDates = ["01/01/1998", "01/01/1993", "01/01/1977"];
	const annotationValues = [0.29,0.8,1.94];
	const annotationLabels = ["Before age 25","Before age 30", "Completed family size"]
	const annotationColours = ["#206095","#27A0CC","#871A5B"]
	const annotationNudgeY = [0,0,8.5]

	

	annotationLabels.forEach(function (d, i) {
		// Create a group (g) element to contain the circle and text
		
		// Append a circle to the group
		svg.append("circle")
			.attr("r", "4")
			.attr("cy", y(annotationValues[i]))
			.attr("cx", x(d3.timeParse(config.essential.dateFormat)(annotationDates[i])))
			.attr('fill', annotationColours[i])
			
		svg.append("text")
			.style("font-size", "14px") // Adjust font size as needed
			.style("font-weight", 600)
			.attr("y", y(annotationValues[i])+annotationNudgeY[i]) // Adjust the y-coordinate as needed
			.attr("x", x(d3.timeParse(config.essential.dateFormat)(annotationDates[i]))+5) // Adjust the x-coordinate as needed
			.attr("text-anchor", "right") // Center the text horizontally
			.attr("dy", "0.35em") // Adjust vertical alignment as needed
			.attr('fill', annotationColours[i])
			.text(d)
			.call(wrap2, 125, 0.35, 1.1, 1, true);
	
	})};

// NEW: Mobile annotations at the bottom of the chart
function writeAnnotation() {
	
	config.essential.annotationBullet.forEach(function (d, i) {
		// Create a group (g) element to contain the circle and text
		var group = d3.select("#keypoints").append("svg")
			.attr("width", "100%") // Adjust the width as needed
			.attr("height", "20px")
			.attr("class", "circles");
		// Append a circle to the group
		group.append("circle")
			.attr("class", "annocirc" + (i))
			.attr("r", "8")
			.attr("cy", "9px")
			.attr("cx", "9px")
			.attr('fill', "white")
			.attr('stroke', "#414042")
			
		group.append("text")
			.style("font-size", "12px") // Adjust font size as needed
			.style("font-weight", 600)
			.attr("y", "9px") // Adjust the y-coordinate as needed
			.attr("x", "9px") // Adjust the x-coordinate as needed
			.attr("text-anchor", "middle") // Center the text horizontally
			.attr("dy", "0.35em") // Adjust vertical alignment as needed
			.attr('fill', "#414042")
			.text(i + 1);
		// Append a paragraph (text) to the group
		group.append("text")
			.style("font-size", "12px")
			.style("font-weight", 400)
			.attr("y", "14px") // Adjust the y-coordinate as needed
			.attr("x", "25px") // Adjust the x-coordinate as needed
			.text(config.essential.annotationBullet[i]);
	})};


//Run it for mobile only
if (parseInt(graphic.style('width')) < threshold_sm){
writeAnnotation()
} 



  
 

//create link to source
	d3.select('#source').text('Source: ' + config.essential.sourceText);
	// console.log(`Link to source created`);

	//use pym to calculate chart dimensions
	if (pymChild) {
		pymChild.sendHeight();
	}
	// console.log(`PymChild height sent`);
}//ends draw graphic

//text wrap function for the direct labelling

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


	// console.log(`Data from CSV processed`);

	// console.log('Final data structure:');
	// console.log(graphic_data);

	// Use pym to create an iframed chart dependent on specified variables
	pymChild = new pym.Child({
		renderCallback: drawGraphic
	});
	// console.log(`PymChild created with renderCallback to drawGraphic`);
});
