const graphic = d3.select('#graphic');
const titles = d3.select('#titles');
const legend = d3.select('#legend');
let pymChild = null;

function drawGraphic() {
	// clear out existing graphics
	graphic.selectAll('*').remove();
	titles.selectAll('*').remove();
	legend.selectAll('*').remove();
	d3.select('#nav').selectAll('*').remove();
	d3.select('#select').selectAll('*').remove();

	//population accessible summmary
	d3.select('#accessibleSummary').html(config.essential.accessibleSummary);

	// console.log([...new Set(graphic_data.map(d => d.toggle))])
	let buttonLabels = [...new Set(graphic_data.map(d => d.toggle))]

	//Default button selection is the first item
	let selectedToggle = buttonLabels[0];
	let selectedArea = null;
	// let currentData = graphic_data.filter(d => d.toggle == selectedToggle)
	// let comparisonData = comparison_data.filter(d => d.toggle == selectedToggle)
	const allAges = graphic_data.columns.slice(5);


	// calculate percentage if we have numbers
	// percentages are based of total populations as is common practice amongst pop pyramids
	if (config.essential.dataType == 'numbers') {
		// turn into tidy data
		tidydata = pivot(
			graphic_data,
			allAges,
			'age',
			'value'
		);

		//rollup to work out totals
		rolledUp = d3.rollup(
			tidydata,
			(v) => d3.sum(v, (d) => d.value),
			(d) => d.AREACD
		);

		// then use total to work out percentages
		tidydataPercentage = tidydata.map(function (d) {
			return {
				...d,
				percentage: d.value / rolledUp.get(d.AREACD)
			};
		});

		// turn into tidy data for comparisons
		tidydatacomparison = pivot(
			comparison_data,
			comparison_data.columns.slice(5),
			'age',
			'value'
		);

		//rollup to work out totals
		rolledUpComparison = d3.rollup(
			tidydatacomparison,
			(v) => d3.sum(v, (d) => d.value),
			(d) => d.AREACD
		);

		// then use total to work out percentages
		tidydataComparisonPercentage = tidydatacomparison.map(function (d) {
			return {
				...d,
				percentage: d.value / rolledUpComparison.get(d.AREACD)
			};
		});
	} else {
		// turn into tidy data
		tidydataPercentage = pivot(
			graphic_data,
			allAges,
			'age',
			'value'
		);

		tidydataComparisonPercentage = pivot(
			comparison_data,
			comparison_data.columns.slice(5),
			'age',
			'value'
		);
	}

	maxPercentage = d3.max([
		d3.max(tidydataPercentage, (d) => d.percentage),
		d3.max(tidydataComparisonPercentage, (d) => d.percentage)
	]);


	// build buttons
	fieldset = d3.select('#nav').append('fieldset');

	fieldset
		.append('legend')
		.attr('class', 'visuallyhidden')
		.html('Choose a variable');

	fieldset
		.append('div')
		.attr('class', 'visuallyhidden')
		.attr('aria-live', 'polite')
		.append('span')
		.attr('id', 'selected');

	grid = fieldset.append('div').attr('class', 'grid');

	cell = grid
		.selectAll('div.grid-cell')
		.data(buttonLabels)
		.join('div')
		.attr('class', 'grid-cell');

	cell
		.append('input')
		.attr('type', 'radio')
		.attr('class', 'visuallyhidden')
		.attr('id', function (d, i) {
			return 'button' + i;
		})
		.attr('value', function (d, i) {
			return i;
		})
		.attr('name', 'button');

	cell
		.append('label')
		.attr('for', function (d, i) {
			return 'button' + i;
		})
		.append('div')
		.html(function (d) {
			return d;
		});

	// set first button to selected
	d3.select('#button' + config.essential.initialSelection).property('checked', true);
	d3.select('#selected').text(
		buttonLabels[
		document.querySelector('input[name="button"]:checked').value
		] + ' is selected'
	);

	// button interactivity
	d3.selectAll('input[type="radio"]').on('change', function (d) {
		onchange(document.querySelector('input[name="button"]:checked').value);
		d3.select('#selected').text(
			buttonLabels[
			document.querySelector('input[name="button"]:checked').value
			] + ' is selected'
		);
	});

// console.log(graphic_data);

	// build dropdown, first unique areas
	// https://stackoverflow.com/questions/38613654/javascript-find-unique-objects-in-array-based-on-multiple-properties
	dropdownData = graphic_data
		.map(function (d) {
			return { nm: d.AREANM, cd: d.AREACD, type:d.AREATYPE };
		})
		.filter(function (a) {
			let key = a.nm + '|' + a.cd+ '|' + a.type;
			if (!this[key]) {
				this[key] = true;
				return true;
			}
		}, Object.create(null))
		.sort((a, b) => d3.ascending(a.type, b.type) || d3.ascending(a.nm, b.nm)); //sorted alphabetically

	// // Build option menu
	const optns = d3
		.select('#select')
		.append('div')
		.attr('id', 'sel')
		.append('select')
		.attr('id', 'areaselect')
		.attr('style', 'width:calc(100% - 6px)')
		.attr('class', 'chosen-select');

	optns.append('option');

	//join unique names and codes to build select
	optns
		.selectAll('p')
		.data(dropdownData)
		.join('option')
		.attr('value', function (d) {
			return d.cd;
		})
		.text(function (d) {
			return d.nm;
		});

	// start the chosen dropdown
	$('#areaselect').chosen({
		placeholder_text_single: 'Select an area',
		allow_single_deselect: true
	});

	//add some more accessibility stuff
	d3.select('input.chosen-search-input').attr('id', 'chosensearchinput');
	d3.select('div.chosen-search')
		.insert('label', 'input.chosen-search-input')
		.attr('class', 'visuallyhidden')
		.attr('for', 'chosensearchinput')
		.html('Type to select an area');

	// draw the bars on change
	$('#areaselect').on('change', function () {
		if ($('#areaselect').val() != '') {
			// tidydataPercentage = tidydataPercentage.filter(d => d.toggle == selectedToggle)
			// tidydataComparisonPercentage = tidydataComparisonPercentage.filter(d => d.toggle == selectedToggle)

			makeAxis(tidydataPercentage.filter((d) => d.AREACD == $('#areaselect').val()), tidydataComparisonPercentage.filter((d) => d.AREACD == $('#areaselect').val()))

			// console.log(tidydataPercentage.filter((d) => d.AREACD == $('#areaselect').val()), tidydataComparisonPercentage.filter((d) => d.AREACD == $('#areaselect').val()))

			d3.select('#bars')
				.selectAll('rect')
				.data(
					tidydataPercentage.filter((d) => d.AREACD == $('#areaselect').val())
				)
				.join('rect')
				.attr('fill', (d) =>
					d.sex === 'female'
						? config.essential.colour_palette[0]
						: config.essential.colour_palette[1]
				)
				.attr('y', (d) => y(d.age))
				.attr('height', y.bandwidth())
				.transition()
				.attr('x', (d) =>
					d.sex === 'female' ? xLeft(d.value) : xRight(0)
				)
				.attr('width', (d) =>
					d.sex === 'female'
						? xLeft(0) - xLeft(d.value)
						: xRight(d.value) - xRight(0)
				);

			d3.select('#comparisonLineLeft')
				.attr('opacity', 1)
				.transition()
				.attr(
					'd',
					lineLeft(
						tidydataComparisonPercentage
							.filter((d) => d.AREACD == $('#areaselect').val())
							.filter((d) => d.sex == 'female')
					) +
					'l 0 ' +
					-y.bandwidth()
				)
				.attr('stroke', config.essential.comparison_colour_palette[0])
				.attr('stroke-width', '2px');

			d3.select('#comparisonLineRight')
				.attr('opacity', 1)
				.transition()
				.attr(
					'd',
					lineRight(
						tidydataComparisonPercentage
							.filter((d) => d.AREACD == $('#areaselect').val())
							.filter((d) => d.sex == 'male')
					) +
					'l 0 ' +
					-y.bandwidth()
				)
				.attr('stroke', config.essential.comparison_colour_palette[1]) // set alternative colour here
				.attr('stroke-width', '2px');

			// clear the chart via keyboard
			d3.select('button.abbr').on('keypress', function (evt) {
				if (evt.keyCode == 13 || evt.keyCode == 32) {
					evt.preventDefault();
					clear();
				}
			});
		} else {
			//on clear
			clear();
		}
	});

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
	margin.centre = config.optional.margin.centre;




	// set up widths
	fullwidth = parseInt(graphic.style('width'));
	chart_width =
		(parseInt(graphic.style('width')) - margin.centre) / 2 -
		margin.left -
		margin.right;
	height = allAges.length * config.optional.seriesHeight[size];

	// // set up some scales, first the left scale
	// xLeft = d3
	// 	.scaleLinear()
	// 	.domain([0, maxPercentage])
	// 	.rangeRound([chart_width, 0]);

	// // right scale
	// xRight = d3
	// 	.scaleLinear()
	// 	.domain(xLeft.domain())
	// 	.rangeRound([chart_width + margin.centre, chart_width * 2 + margin.centre]);

	// y scale
	y = d3.scaleBand().domain(allAges).rangeRound([height, 0]).paddingInner(0.2);

	// create the svg
	svg = graphic
		.append('svg')
		.attr('class', 'chart')
		.attr('height', height + margin.top + margin.bottom)
		.attr('width', fullwidth)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


	function makeAxis(thisdata, thiscomparisondata) {


		d3.selectAll('g.x.axis').remove()

		// set max values
		maxValue = d3.max([
			d3.max(thisdata, d => d.value),
			d3.max(thiscomparisondata, d => d.value)
		]);

		// set up some scales, first the left scale
		xLeft = d3
			.scaleLinear()
			.domain([0, maxValue])
			.rangeRound([chart_width, 0]);

		// right scale
		xRight = d3
			.scaleLinear()
			.domain(xLeft.domain())
			.rangeRound([chart_width + margin.centre, chart_width * 2 + margin.centre]);

		//add x-axis left
		svg
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(
				d3
					.axisBottom(xLeft)
					.tickFormat(d3.format(',.0f'))
					.ticks(config.optional.xAxisTicks[size])
					.tickSize(-height)
			)
			.selectAll('line')
			.each(function (d) {
				if (d == 0) {
					d3.select(this).attr('class', 'zero-line');
				}
			});

		//add x-axis right
		svg
			.append('g')
			.attr('class', 'x axis right')
			.attr('transform', 'translate(0,' + height + ')')
			.call(
				d3
					.axisBottom(xRight)
					.tickFormat(d3.format(',.0f'))
					.ticks(config.optional.xAxisTicks[size])
					.tickSize(-height)
			)
			.selectAll('line')
			.each(function (d) {
				if (d == 0) {
					d3.select(this).attr('class', 'zero-line');
				}
			});

	}

	makeAxis(tidydataPercentage.filter((d) => d.AREACD == 'K04000001'), tidydataComparisonPercentage.filter((d) => d.AREACD == 'K04000001'))


	// create line generators
	lineLeft = d3
		.line()
		.curve(d3.curveStepBefore)
		.x((d) => xLeft(d.value))
		.y((d) => y(d.age) + y.bandwidth());

	lineRight = d3
		.line()
		.curve(d3.curveStepBefore)
		.x((d) => xRight(d.value))
		.y((d) => y(d.age) + y.bandwidth());

	// //add x-axis left
	// svg
	// 	.append('g')
	// 	.attr('class', 'x axis')
	// 	.attr('transform', 'translate(0,' + height + ')')
	// 	.call(
	// 		d3
	// 			.axisBottom(xLeft)
	// 			.tickFormat(d3.format('.1%'))
	// 			.ticks(config.optional.xAxisTicks[size])
	// 			.tickSize(-height)
	// 	)
	// 	.selectAll('line')
	// 	.each(function (d) {
	// 		if (d == 0) {
	// 			d3.select(this).attr('class', 'zero-line');
	// 		}
	// 	});

	// //add x-axis right
	// svg
	// 	.append('g')
	// 	.attr('class', 'x axis right')
	// 	.attr('transform', 'translate(0,' + height + ')')
	// 	.call(
	// 		d3
	// 			.axisBottom(xRight)
	// 			.tickFormat(d3.format('.1%'))
	// 			.ticks(config.optional.xAxisTicks[size])
	// 			.tickSize(-height)
	// 	)
	// 	.selectAll('line')
	// 	.each(function (d) {
	// 		if (d == 0) {
	// 			d3.select(this).attr('class', 'zero-line');
	// 		}
	// 	});

	//add y-axis
	svg
		.append('g')
		.attr('class', 'y axis')
		.attr(
			'transform',
			'translate(' + (chart_width + margin.centre / 2 - 3) + ',0)'
		)
		.call(
			d3
				.axisRight(y)
				.tickSize(0)
				.tickValues(y.domain().filter((d, i) => !(i % 10)))
		)
		.selectAll('text')
		.each(function () {
			d3.select(this).attr('text-anchor', 'middle');
		});

	function update() {



		// console.log(tidydata)

		// calculate percentage if we have numbers
		// percentages are based of total populations as is common practice amongst pop pyramids
		if (config.essential.dataType == 'numbers') {
			// turn into tidy data
			tidydata = pivot(
				graphic_data,
				allAges,
				'age',
				'value'
			);

			//rollup to work out totals
			rolledUp = d3.rollup(
				tidydata,
				(v) => d3.sum(v, (d) => d.value),
				(d) => d.AREACD
			);

			// then use total to work out percentages
			tidydataPercentage = tidydata.map(function (d) {
				return {
					...d,
					percentage: d.value / rolledUp.get(d.AREACD)
				};
			});

			// turn into tidy data for comparisons
			tidydatacomparison = pivot(
				comparison_data,
				comparison_data.columns.slice(5),
				'age',
				'value'
			);

			//rollup to work out totals
			rolledUpComparison = d3.rollup(
				tidydatacomparison,
				(v) => d3.sum(v, (d) => d.value),
				(d) => d.AREACD
			);

			// then use total to work out percentages
			tidydataComparisonPercentage = tidydatacomparison.map(function (d) {
				return {
					...d,
					percentage: d.value / rolledUpComparison.get(d.AREACD)
				};
			});
		} else {
			// turn into tidy data
			tidydataPercentage = pivot(
				graphic_data,
				allAges,
				'age',
				'value'
			);

			tidydataComparisonPercentage = pivot(
				comparison_data,
				comparison_data.columns.slice(5),
				'age',
				'value'
			);
		}

		maxPercentage = d3.max([
			d3.max(tidydataPercentage, (d) => d.percentage),
			d3.max(tidydataComparisonPercentage, (d) => d.percentage)
		]);


		$('#areaselect').val(selectedArea).trigger('change').trigger('chosen:updated');

		// add bars
		svg
			.append('g')
			.attr('id', 'bars')
			.selectAll('rect')
			.data(tidydataPercentage.filter((d) => d.AREACD == graphic_data[0].AREACD))
			.join('rect')
			.attr('fill', (d) =>
				d.sex === 'female'
					? config.essential.colour_palette[0]
					: config.essential.colour_palette[1]
			)
			.attr('y', (d) => y(d.age))
			.attr('height', y.bandwidth())
			.attr('x', (d) => (d.sex === 'female' ? xLeft(0) : xRight(0)))
			.attr('width', 0);



		//draw comparison lines
		comparisons = svg.append('g');

		comparisons
			.append('path')
			.attr('class', 'line')
			.attr('id', 'comparisonLineLeft')
			//.attr('d', lineLeft(tidydataComparisonPercentage.filter(d=>d.AREACD==graphic_data[0].AREACD).filter(d=>d.sex=='female')) + 'l 0 ' + -y.bandwidth())
			.attr('stroke', config.essential.colour_palette[2]) // set alternative colour here
			.attr('stroke-width', '2px');

		comparisons
			.append('path')
			.attr('class', 'line')
			.attr('id', 'comparisonLineRight')
			//.attr('d', lineRight(tidydataComparisonPercentage.filter(d=>d.AREACD==graphic_data[0].AREACD).filter(d=>d.sex=='male')) + 'l 0 ' + -y.bandwidth())
			.attr('stroke', config.essential.colour_palette[3]) // set alternative colour here
			.attr('stroke-width', '2px');

	} //End update function

	//add x-axis titles
	svg
		.append('text')
		.attr(
			'transform',
			'translate(' +
			(fullwidth - margin.left - margin.right) +
			',' +
			(height + 30) +
			')'
		)
		.attr('class', 'axis--label')
		.attr('text-anchor', 'end')
		.text(config.essential.xAxislabel);

	//add y-axis title
	svg
		.append('text')
		.attr(
			'transform',
			'translate(' + (chart_width + margin.centre / 2) + ',-15)'
		)
		.attr('class', 'axis--label')
		.attr('text-anchor', 'middle')
		.text('Age');

	// Add titles and legend
	widths = [chart_width + margin.left, chart_width + margin.right];

	legend
		.append('div')
		.attr('class', 'flex-row')
		.style('gap', margin.centre + 'px')
		.selectAll('div')
		.data(['Females', 'Males'])
		.join('div')
		.style('width', (d, i) => widths[i] + 'px')
		.append('div')
		.attr('class', 'chartLabel')
		.append('p')
		.text((d) => d);

	dataForLegend = [
		['x', 'x'],
		['y', 'y']
	]; //dummy data

	titleDivs = titles
		.selectAll('div')
		.data(dataForLegend)
		.join('div')
		.attr('class', 'flex-row')
		.style('gap', margin.centre + 'px')
		.selectAll('div')
		.data((d) => d)
		.join('div')
		.style('width', (d, i) => widths[i] + 'px')
		.append('div')
		.attr('class', 'legend--item');

	titleDivs
		.append('div')
		.style('background-color', (d, i) =>
			d == 'x'
				? config.essential.colour_palette[i]
				: config.essential.comparison_colour_palette[i]
		)
		.attr('class', (d) =>
			d == 'x' ? 'legend--icon--circle' : 'legend--icon--refline'
		);

	titleDivs
		.append('div')
		.append('p')
		.attr('class', d => 'legend--text ' + d)
		.html((d) =>
			d == 'x' ? "ABPE for " + selectedToggle : "Mid-year estimate for " + selectedToggle
		);

	function onchange(value) {

		selectedToggle = buttonLabels[value];
		selectedArea = $('#areaselect').val();
		// currentData = graphic_data.filter(d => d.toggle == selectedToggle);
		// comparisonData = comparison_data.filter(d => d.toggle == selectedToggle);
		// console.log(selectedToggle, selectedArea);
		update();

		//Updating the legend based on which button is selected
		d3.selectAll("p.legend--text.x").text("ABPE for " + selectedToggle)
		d3.selectAll("p.legend--text.y").text(
			// selectedToggle == "2023" ? "No comparable Mid-year estimate" :
			"Mid-year estimate for " + selectedToggle)
	}

	onchange(config.essential.initialSelection)

	update()

	// bostock pivot longer function from https://observablehq.com/d/3ea8d446f5ba96fe
	function pivot(data, columns, name, value) {

		const keep = data.columns.filter((c) => !columns.includes(c));

		// console.log(data.filter(d => d.toggle == selectedToggle))
		return data.filter(d => d.toggle == selectedToggle).flatMap((d) => {
			const base = keep.map((k) => [k, d[k]]);
			// console.log(base)
			return columns.map((c) => {
				return Object.fromEntries([...base, [name, c], [value, d[c]]]);
			});
		});
	}


	//create link to source
	d3.select('#source').text('Source: ' + config.essential.sourceText);

	//select the default area
	$('#areaselect').val(config.essential.defaultArea).trigger('chosen:updated').trigger('change');



	//use pym to calculate chart dimensions
	if (pymChild) {
		pymChild.sendHeight();
	}
} //end draw graphic

Promise.all([
	d3.csv(config.essential.graphic_data_url, d3.autoType),
	d3.csv(config.essential.comparison_data, d3.autoType)
]).then(([data, datab]) => {
	//load chart data
	graphic_data = data;
	comparison_data = datab;

	//use pym to create iframed chart dependent on specified variables
	pymChild = new pym.Child({
		renderCallback: drawGraphic
	});
});

function clear() {
	d3.select('#bars')
		.selectAll('rect')
		.transition()
		.attr('x', (d) => (d.sex === 'female' ? xLeft(0) : xRight(0)))
		.attr('width', 0);

	d3.select('#comparisonLineLeft').transition().attr('opacity', 0);

	d3.select('#comparisonLineRight').transition().attr('opacity', 0);

	$('#areaselect').val(null).trigger('chosen:updated');
}
