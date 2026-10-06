var graphic = d3.select('#graphic');
var pymChild = null;

function drawGraphic() {
	//population accessible summmary
	d3.select('#accessibleSummary').html(config.essential.accessibleSummary);

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
	var height =
		config.optional.seriesHeight[size] * graphic_data.length +
		10 * (graphic_data.length - 1) +
		12;

	// clear out existing graphics
	graphic.selectAll('*').remove();

	//set up scales
	const x = d3.scaleLinear().range([0, chart_width]);

	const y = d3
		.scaleBand()
		.paddingOuter(0.2)
		.paddingInner(((graphic_data.length - 1) * 10) / (graphic_data.length * 30))
		.range([0, height])
		.round(true);

	//use the data to find unique entries in the name column
	y.domain([...new Set(graphic_data.map((d) => d.name))]);

	//set up yAxis generator
	var yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10);

	//set up xAxis generator
	var xAxis = d3
		.axisBottom(x)
		.tickSize(-height)
		.tickFormat(d3.format('.0%'))
		.ticks(config.optional.xAxisTicks[size]);

	//create svg for chart
	svg = d3
		.select('#graphic')
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
			d3.max(graphic_data.map(({ value }) => Number(value)))]); //modified so it converts string to number
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

	svg
		.append('g')
		.attr('class', 'y axis')
		.call(yAxis)
		.selectAll('text')
		.call(wrap, margin.left - 10);

	svg
		.selectAll('rect')
		.data(graphic_data)
		.join('rect')
		.attr('x', x(0))
		.attr('y', (d) => y(d.name))
		.attr('width', (d) => x(d.value) - x(0))
		.attr('height', y.bandwidth())
		.attr('fill', config.essential.colour_palette);

	if (config.essential.dataLabels.show == true) {
		svg
			.selectAll('text.dataLabels')
			.data(graphic_data)
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

	// This does the x-axis label
	svg
		.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.append('text')
		.attr('x', chart_width)
		.attr('y', 35)
		.attr('class', 'axis--label')
		.text(config.essential.xAxisLabel)
		.attr('text-anchor', 'end');

	d3.select("#answer").style("display","none")

	var correctOption = "option3"

	d3.selectAll(".option-button").on("click", function(){
		var selectedButton = d3.select(this)
		var selectedOption = selectedButton.attr("id")
		if(selectedOption == correctOption){
			d3.selectAll(".option-button").attr("class", "option-button deselected")
			selectedButton.attr("class", "option-button correct")
			d3.select("#answer").style("display","block")
			d3.select("#response_correct").style("display","block")
		} else{
			d3.selectAll(".option-button").attr("class", "option-button deselected")
			selectedButton.attr("class", "option-button incorrect")
			d3.select("#"+correctOption).attr("class", "option-button correct deselected")
			d3.select("#answer").style("display","block")
			d3.select("#response_incorrect").style("display","block")
		}
		if (pymChild) {
			pymChild.sendHeight();
		}
	})

	if (pymChild) {
		pymChild.sendHeight();
	}

	// let showButton = document.getElementById('startButton')

		// showButton.addEventListener("click", function(){
		// 	d3.select("#question").style("display","none")
		// 	d3.select("#buttonContainer").style("display","none")
		// 	d3.select("#answer").style("display","block")
		// 	let response = slider.value
		// 	// let response = d3.select("#slider").value
		// 	let correctvalue = 33
		// 	let difference = response - correctvalue
		// 	if(difference <= -3){
		// 		d3.select("#response_incorrect").style("display","block")
		// 		d3.select("#difference").text(difference*-1)
		// 		d3.select("#lowhigh").text("low")
		// 	}
		// 	else if(difference >= 3){
		// 		d3.select("#response_incorrect").style("display","block")
		// 		d3.select("#difference").text(difference)
		// 		d3.select("#lowhigh").text("high")
		// 	}
		// 	else if(difference < 3 & difference > - 3 & difference != 0){
		// 		d3.select("#response_correct").style("display","block")
		// 	}
		// 	else if(difference == 0){
		// 		d3.select("#response_perfect").style("display","block")
		// 	}
		// });

	//create link to source
	d3.select('#source').text('Source: ' + config.essential.sourceText);

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
		var breaks = text.selectAll('tspan').size();
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
