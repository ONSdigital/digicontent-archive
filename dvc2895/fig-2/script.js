let graphic = d3.select('#graphic');
let pymChild = null;

function drawGraphic() {
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

	// clear out existing graphics
	graphic.selectAll('*').remove();

	// Nest the graphic_data by the 'series' column
	let nested_data = d3.groups(graphic_data, (d) => d.series);

	// Create a container div for each small multiple
	let chartContainers = graphic
		.selectAll('.chart-container')
		.data(Array.from(nested_data))
		.join('div')
		.attr('class', 'chart-container');

	let xDataType;

	if (Object.prototype.toString.call(graphic_data[0].date) === '[object Date]') {
		xDataType = 'date';
	} else {
		xDataType = 'numeric';
	}

	// console.log(xDataType)

	function drawChart(container, data, chartIndex) {

		function calculateChartWidth(size) {

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

		const chartEvery = config.optional.chart_every[size];
		const chartsPerRow = config.optional.chart_every[size];
		let chartPosition = chartIndex % chartsPerRow;

		let margin = { ...config.optional.margin[size] };

		// If the chart is not in the first position in the row, reduce the left margin
		if (config.optional.dropYAxis) {
			if (chartPosition !== 0) {
				margin.left = 10;
			}
		}

		const aspectRatio = config.optional.aspectRatio[size];
		let chart_width = calculateChartWidth(size)

		//height is set by the aspect ratio
		let height =
			aspectRatio[1] / aspectRatio[0] * chart_width;

		//set up scales
		const y = d3.scaleLinear().range([height, 0]);

		const x = d3
			.scaleBand()
			.paddingOuter(0.0)
			.paddingInner(0.1)
			.range([0, chart_width])
			.round(false);

		//use the data to find unique entries in the date column
		x.domain([...new Set(graphic_data.map((d) => d.date))]);

		//set up yAxis generator
		let yAxis = d3.axisLeft(y)
			.tickSize(-chart_width)
			.tickPadding(10)
			.ticks(config.optional.yAxisTicks[size])
			.tickFormat((d) => config.optional.dropYAxis !== true ? d3.format(config.essential.yAxisTickFormat)(d) :
				chartPosition == 0 ? d3.format(config.essential.yAxisTickFormat)(d) : "");

		let xTime = d3.timeFormat(config.essential.xAxisTickFormat[size])

		//set up xAxis generator
		let xAxis = d3
			.axisBottom(x)
			.tickSize(10)
			.tickPadding(10)
			.tickValues(xDataType == 'date' ? graphic_data
				.map(function (d) {
					return d.date.getTime()
				}) //just get dates as seconds past unix epoch
				.filter(function (d, i, arr) {
					return arr.indexOf(d) == i
				}) //find unique
				.map(function (d) {
					return new Date(d)
				}) //map back to dates
				.sort(function (a, b) {
					return a - b
				})
				.filter(function (d, i) {
					return i % config.optional.xAxisTicksEvery[size] === 0 && i <= graphic_data.length - config.optional.xAxisTicksEvery[size] //|| i == data.length - 1 //Rob's fussy comment about labelling the last date
				}) : x.domain().filter((d, i) => { return i % config.optional.xAxisTicksEvery[size] === 0 && i <= graphic_data.length - config.optional.xAxisTicksEvery[size] || i == data.length - 1 })
			)
			.tickFormat((d) => xDataType == 'date' ? xTime(d)
				: d3.format(config.essential.xAxisNumberFormat)(d));

		//create svg for chart
		svg = d3
			.select('#graphic')
			.append('svg')
			.attr('width', chart_width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.attr('class', 'chart')
			.attr("id", function (d, i) { return "chart-panel chart-panel" + i })
			.style('background-color', '#fff')
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			if (config.essential.yDomain == 'auto') {
				if (d3.min(graphic_data.map(({ value }) => Number(value))) >= 0) {
				y.domain([
					0,
					d3.max(graphic_data.map(({ value }) => Number(value)))]); //modified so it converts string to number
				} else {
					y.domain(d3.extent(graphic_data.map(({ value }) => Number(value))))
				}
			} else {
				y.domain(config.essential.yDomain);
			}

		svg
			.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.attr('class', 'x axis')
			.call(xAxis);

		svg
			.append('g')
			.attr('class', 'y axis numeric') //Can be numeric or categorical
			.call(yAxis)
			.selectAll('line')
			.each(function (d) {
				if (d == 0) {
					d3.select(this).attr('class', 'zero-line');
				}
			})
			.selectAll('text')
			.call(wrap, margin.left - 10);

		svg
			.selectAll('rect')
			.data(data)
			.join('rect')
			.attr('y', (d) => y(Math.max(d.value, 0)))
			.attr('x', (d) => x(d.date))
			.attr('height', (d) => Math.abs(y(d.value) - y(0)))
			.attr('width', x.bandwidth())
			.attr('fill', (d) => d.value >= 0 ? config.essential.colour_palette: config.essential.colour_palette_negative);

		// This does the chart title label
		svg
			.append('g')
			.attr('transform', 'translate(0, 0)')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.attr('dy', -40)
			.attr('class', 'title')
			.text(data[0].series)
			.attr('text-anchor', 'start')
			.call(wrap, chart_width);

		// This does the chart title label
		svg
			.append('g')
			.attr('transform', 'translate(0, 0)')
			.append('text')
			.attr('x', 0)
			.attr('y', -25)
			.attr('dy', 0)
			.attr('class', 'sub-title')
			.text(data[0].series2)
			.attr('text-anchor', 'start')
			.call(wrap2, chart_width, 0.55, 1.3, 1, false, false);

		// This does the y-axis label
		svg
			.append('g')
			.attr('transform', 'translate(0,0)')
			.append('text')
			.attr('x', 5 - margin.left)
			.attr('y', -10)
			.attr('class', 'axis--label')
			.text(() => chartIndex % chartEvery == 0 ? config.essential.yAxisLabel : "")
			.attr('text-anchor', 'start');
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

  //   ;

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
  }

d3.csv(config.essential.graphic_data_url).then((data) => {
	//load chart data
	graphic_data = data;

	let parseTime = d3.timeParse(config.essential.dateFormat);

	data.forEach((d, i) => {

		//If the date column is has date data store it as dates
		if (parseTime(data[i].date) !== null) {
			d.date = parseTime(d.date)
		}

	});

	//use pym to create iframed chart dependent on specified variables
	pymChild = new pym.Child({
		renderCallback: drawGraphic
	});
});
