let graphic = d3.select('#graphic');
let legend = d3.select('#legend');
let infobox = d3.select('#infobox');
//console.log(`Graphic selected: ${graphic}`);

let pymChild = null;

function drawGraphic() {
	// clear out existing graphics
	graphic.selectAll('*').remove();
	legend.selectAll('*').remove();
	infobox.selectAll('*').remove();

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
	let height = 350 - margin.top - margin.bottom;
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

		if (config.essential.drawLegend && size!== 'sm') {


			// Set up the legend
			// let legenditem = d3
			// 	.select('#legend')
			// 	.selectAll('div.legend--item')
			// 	.data(categories.map((c, i) => [c, config.essential.colour_palette[i % config.essential.colour_palette.length]]))
			// 	.enter()
			// 	.append('div')
			// 	.attr('class', 'legend--item');
			//
			// legenditem
			// 	.append('div')
			// 	.attr('class', 'legend--icon--circle')
			// 	.style('background-color', function (d) {
			// 		return d[1];
			// 	});
			//
			// legenditem
			// 	.append('div')
			// 	.append('p')
			// 	.attr('class', 'legend--text')
			// 	.html(function (d) {
			// 		return d[0];
			// 	});

		} else {

			// Add text labels to the right of the circles

if (config.essential.drawlastpoint==true){
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
}
		};

if (config.essential.drawlastpoint==true){
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
}


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
		.attr('y', -18)
		.attr('class', 'axis--label')
		.text(config.essential.yAxisLabel)
		.attr('text-anchor', 'start');

// This does the x-axis label
svg
.append('g')
.attr('transform', "translate(0, "+(height+margin.bottom)+")")
.append('text')
.attr('x',width)
.attr('y', -5)
.attr('class', 'axis--label')
.text(config.essential.xAxisLabel)
.attr('text-anchor', 'end');


// add minimum line
svg.append("line")
	.attr("x1",x(d3.timeParse(config.essential.dateFormat)("01/01/1970")))
	.attr("x2",x(d3.timeParse(config.essential.dateFormat)("01/01/1970")))
	.attr("y1",y(20))
	.attr("y2",y(23.7))
	.attr("class","annoline")
	.attr("stroke","#666")

annotext1="The lowest average age of a first-time mother was 23, in 1970"
annotext2="In 2020 average age of a first-time mother was 29"

// create html text for annotations
htmltext1970=	'<span style="color:#707071">'+
	"The lowest average age of a first-time mother was  "+
	"</span> "+
	'<span style="color:' +
	config.essential.text_colour_palette[0] +
	'; font-weight:bold">' +
	"23"+
	"</span> "+
	'<span style="color:#707071">' +
	"in "+
	"</span> "+
	'<span style="color:' +
	config.essential.text_colour_palette[0] +
	'; font-weight:bold">' +
	"1970"+
	"</span>"

	htmltext2020=	'<span style="color:#707071">'+
		"In "+
		"</span> "+
		'<span style="color:' +
		config.essential.text_colour_palette[0] +
		'; font-weight:bold">' +
		2020+
		"</span> "+
		'<span style="color:#707071">' +
		" the average age of a first-time mother was "+
		"</span> "+
		'<span style="color:' +
		config.essential.text_colour_palette[0] +
		'; font-weight:bold">' +
		29+
		"</span>"



svg.append("circle")
.attr("cx",x(d3.timeParse(config.essential.dateFormat)("01/01/1970")))
.attr("cy",y(23.7))
.attr("r",4)
.attr("fill",config.essential.colour_palette[0])

svg.append("circle")
.attr("cx",x(d3.timeParse(config.essential.dateFormat)("01/01/2020")))
.attr("cy",y(29.1))
.attr("r",4)
.attr("fill",config.essential.colour_palette[0])


if (size=="sm"){
	// d3.select("#infobox")
	// .append("p")
	// .attr("class","annobox")
	// .text(annotext1);
	//
	// d3.select("#infobox")
	// .append("p")
	// .attr("class","annobox")
	// .text(annotext2);

	d3.select("#infobox")
		.attr("min-height",200)
		.append("p")
		.html(htmltext1970+".")

		d3.select("#infobox")
			.attr("min-height",200)
			.append("p")
			.html(htmltext2020+".")



	svg.append("text")
	.attr("x",10+x(d3.timeParse(config.essential.dateFormat)("01/01/1970")))
	.attr("y",-10+y(20))
	.attr("class","annotation")
	.text("1970")


} else {
	// svg.append("text")
	// .attr("x",10+x(d3.timeParse(config.essential.dateFormat)("01/01/1970")))
	// .attr("y",10+y(23))
	// .attr("class","annotation")
	// .text(annotext1)
	// .call(wrap2, 170);

	// svg.append("text")
	// .attr("x",-10+x(d3.timeParse(config.essential.dateFormat)("01/01/2020")))
	// .attr("y",-5+y(30))
	// .attr("class","annotation")
	// .text(annotext2)
	// .attr("text-anchor","end")
	// .call(wrap2, 170);

	svg.append("foreignObject")
			.attr("width", 170)
			.attr("height", 100)
			.attr("x",10+x(d3.timeParse(config.essential.dateFormat)("01/01/1970")))
			.attr("y",10+y(23))
			//.attr('class', "percentlabel")
			.append("xhtml:p")
			.attr("class","annoleft")
			// .style("fill", "#414041")
			//.html('<span style="color:' + config.essential.text_colour_palette[i] + '">' +"In "+ d + "</span> "+", 50% of people aged "+d3.format(".1f")(config.essential.annoarray[d].value)+" were living with their parents")
			.html(htmltext1970)


	svg.append("foreignObject")
			.attr("width", 180)
			.attr("height", 100)
			.attr("x",-180+x(d3.timeParse(config.essential.dateFormat)("01/01/2020")))
			.attr("y",-20+y(30))
			//.attr('class', "percentlabel")
			.append("xhtml:p")
			.attr("class","annoright")
			// .style("fill", "#414041")
			//.html('<span style="color:' + config.essential.text_colour_palette[i] + '">' +"In "+ d + "</span> "+", 50% of people aged "+d3.format(".1f")(config.essential.annoarray[d].value)+" were living with their parents")
			.html(htmltext2020)


}



//create link to source
	d3.select('#source').text('Source: ' + config.essential.sourceText);
	// console.log(`Link to source created`);

	//use pym to calculate chart dimensions
	if (pymChild) {
		pymChild.sendHeight();
	}
	// console.log(`PymChild height sent`);
}


// alt wrap function
function wrap2(text, width) {
  text.each(function() {
   var text = d3.select(this),
     words = text.text().split(/\s+/).reverse(),
     word,
     line = [],
     lineNumber = 0,
     lineHeight = 1.1, // ems
     y = text.attr("y"),
     x = text.attr("x")
     dy = 0,
     tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
   while (word = words.pop()) {
     line.push(word);
     tspan.text(line.join(" "));
     if (tspan.node().getComputedTextLength() > width) {
       line.pop();
       tspan.text(line.join(" "));
       line = [word];
       tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
     }
   }
  });
} // end wrap function



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

	// console.log(graphic_data);

	// console.log(`Data from CSV processed`);

	// console.log('Final data structure:');
	// console.log(graphic_data);

	// Use pym to create an iframed chart dependent on specified variables
	pymChild = new pym.Child({
		renderCallback: drawGraphic
	});
	// console.log(`PymChild created with renderCallback to drawGraphic`);
});
