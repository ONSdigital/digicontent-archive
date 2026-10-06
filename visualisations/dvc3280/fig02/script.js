import { initialise, wrap, addSvg, addDataLabels, addAxisLabel } from "../lib/helpers.js";
// import topojson from "../lib/topojson.js";

let graphic = d3.select('#graphic');
let select = d3.select('#select');
let pymChild = null;
let x, y, graphic_data, size, svg, mapSvg, geoData, geoFeatures, colorScale;


// Helper: Jenks breaks using simple-statistics
function getJenksBreaks(values, nBreaks) {
    if (typeof ss !== 'undefined' && ss.ckmeans) {
        const clusters = ss.ckmeans(values, nBreaks);
        let breaks = clusters.map(cluster => cluster[0]);
        // Add last max value
        breaks.push(clusters[clusters.length - 1][clusters[clusters.length - 1].length - 1]);
        return breaks;
    } else {
        // fallback: equal interval
        const min = d3.min(values), max = d3.max(values);
        return d3.range(nBreaks + 1).map(i => min + (i * (max - min) / nBreaks));
    }
}

// --- Update hover logic for legend line ---
// In both bar and map hover, use the same break-to-pixel mapping as the legend rects
// Helper function to get legend line y position
function getLegendLineY(value, breaks, yPos, legendHeight) {
    // Find which break interval value falls into
    for (let i = 0; i < breaks.length - 1; i++) {
        if (value >= breaks[i] && value <= breaks[i + 1]) {
            // Linear interpolate within this band
            const bandStart = breaks[i];
            const bandEnd = breaks[i + 1];
            const bandYStart = legendHeight - yPos[i];
            const bandYEnd = legendHeight - yPos[i + 1];
            const t = (value - bandStart) / (bandEnd - bandStart);
            return bandYStart + t * (bandYEnd - bandYStart);
        }
    }
    // If value is below min or above max, clamp
    if (value < breaks[0]) return legendHeight - yPos[0];
    if (value > breaks[breaks.length - 1]) return legendHeight - yPos[yPos.length - 1];
    return 0;
}

function drawGraphic() {

	select.selectAll('*').remove(); // Remove the select element if it exists


	//Set up some of the basics and return the size value ('sm', 'md' or 'lg')
	size = initialise(size);

	let uniqueOptions = [...new Set(graphic_data.map((d) => d.option))];

	// console.log(`dropdownData contains: ${JSON.stringify(uniqueOptions)}`);

	const optns = select
		.append('div')
		.attr('id', 'sel')
		.append('select')
		.attr('id', 'optionsSelect')
		.attr('style', 'width:calc(100% - 6px)')
		.attr('class', 'chosen-select')
		.attr('data-placeholder', 'Select an option');

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
		// .html('Type to select an area');


	$('#optionsSelect').trigger('chosen:updated');  // Initialize Chosen

	let labelPositions = new Map();  // Create a map to store label positions

	$('#optionsSelect').chosen({ disable_search: true }).change(function () {
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
		// Clear the chart graphics
		svg.selectAll('rect').transition().duration(1000).attr('width', 0).remove();

		svg
			.selectAll('text.dataLabels')
			.transition()
			.duration(1000)
			.attr('x', -100)
			.remove();
	};

	function changeData(selectedOption) {
		// Find matching numberFormat for selectedOption
		let matchedFormat = (config.essential.numberFormats || config.essential.formats || []).find(f => f.name === selectedOption);
		let numberFormat = matchedFormat ? matchedFormat.numberFormat : config.essential.dataLabels.numberFormat;

		let filteredData = graphic_data.filter(
			(d) => d.option === selectedOption
		)

			// Sort the data 
			.sort((a, b) => y.domain().indexOf(a.name) - y.domain().indexOf(b.name));

		// console.log('Filtered data:', filteredData);

		// Dynamically update x domain based on filtered data
		if (config.essential.xDomain == 'auto') {
			if (d3.min(filteredData.map(({ value }) => Number(value))) >= 0) {
				x.domain([
					0,
					d3.max(filteredData.map(({ value }) => Number(value)))]);
			} else {
				x.domain(d3.extent(filteredData.map(({ value }) => Number(value))))
			}
		} else {
			x.domain(config.essential.xDomain);
		}

		// Update the xAxis generator with the correct number format
		xAxis.tickFormat(d3.format(numberFormat));

		// Update the x axis with a transition
		svg.select('.x.axis')
			.transition()
			.duration(1000)
			.call(xAxis);

		// Update the x-axis label dynamically
		svg.selectAll('.x-axis-label').remove();
		let xAxisLabelFormat = (config.essential.formats || []).find(f => f.name === selectedOption);
		let xAxisLabel = xAxisLabelFormat ? xAxisLabelFormat.xAxisLabel : '';
		svg.append('text')
			.attr('class', 'x-axis-label')
			.attr('x', chart_width)
			.attr('y', height + 35)
			.attr('text-anchor', 'end')
			.attr('font-size', 14)
			.attr('fill', '#707071')
			.text(xAxisLabel);

		// Update the y scale domain based on the filtered data
		y.domain(filteredData.map((d) => d.name));

		// Update the y axis with the new domain
		svg
			.select('y axis')
			.transition()
			.duration(2000)
			.call(yAxis)
			.selectAll('text')
			.call(wrap, margin.left - 10);

		// Store the current positions of the labels in the map
		svg.selectAll('text.dataLabels').each(function (d) {
			labelPositions.set(d.name, x(d.value));
		});

		// Enter and update
		let bars = svg.selectAll('rect').data(filteredData, (d) => d.name);

		// Exit
		bars.exit().transition().duration(400).ease(d3.easeCubic).attr('width', 0).remove();

		// Enter and update
		bars
			.enter()
			.append('rect')
			.attr('x', d => Math.min(x(0), x(d.value)))
			.attr('y', (d) => y(d.name))
			.attr('width', d => Math.abs(x(d.value) - x(0)))
			.attr('height', y.bandwidth())
			.attr('fill', config.essential.colour_palette)
			.attr('data-areacd', d => d.AREACD)
			.attr('stroke', 'none')
			.on('mouseover', function(e, d) {
				d3.select(this).attr('stroke', '#FFA500').attr('stroke-width', 2);
				// Highlight corresponding region
				d3.select(`#map-container .region.${d.AREACD}`).attr('stroke', '#FFA500').attr('stroke-width', 3).raise();
				// Show legend hover line at correct value
				const value = d.value;
				const legend = d3.select('#map-container svg .map-legend-vertical');
				if (!legend.empty()) {
					// Get legendHeight and breaks from rects (robust to band scaling)
					const rects = legend.selectAll('rect').nodes();
					if (rects.length > 0) {
						// Get all rect y and height, and corresponding value range
						let rectData = [];
						legend.selectAll('rect').each(function(_, i) {
							const rect = d3.select(this);
							rectData.push({
								y: +rect.attr('y'),
								height: +rect.attr('height'),
								val0: +rect.datum().val0,
								val1: +rect.datum().val1
							});
						});
						// Find which band value falls into
						let yLine = null;
						for (let i = 0; i < rectData.length; i++) {
							const {y, height, val0, val1} = rectData[i];
							if (value >= Math.min(val0, val1) && value <= Math.max(val0, val1)) {
								// Linear interpolate within this band
								const frac = (value - val0) / (val1 - val0);
								yLine = y + (1 - frac) * height; // legend is inverted (largest at top)
								break;
							}
						}
						if (yLine !== null) {
							legend.select('.legend-hover-line')
								.attr('y1', yLine)
								.attr('y2', yLine)
								.attr('opacity', 1);
						}
					}
				}
			})
			.on('mouseout', function(e, d) {
				// Restore color
				d3.select(this).attr('stroke', 'none').attr('stroke-width', null);
				// Unhighlight region
				d3.select(`#map-container .region.${d.AREACD}`).attr('stroke', '#fff').attr('stroke-width', 1);
				// Hide legend hover line
				d3.select('#map-container svg .map-legend-vertical').select('.legend-hover-line').attr('opacity', 0);
			})
			.merge(bars)
			.transition()
			.duration(800)
			.ease(d3.easeCubic)
			.attr('width', d => Math.abs(x(d.value) - x(0)))
			.attr('x', d => Math.min(x(0), x(d.value)));


		// Update the data labels
		if (config.essential.dataLabels.show === true) {
			// Fade out existing data labels
			svg.selectAll('text.dataLabels')
				.transition()
				.duration(200)
				.style('opacity', 0)
				.remove();

			// After the bars have finished transitioning, add new data labels and fade them in
			setTimeout(function() {
				addDataLabels({
					svgContainer: svg,
					data: filteredData,
					chart_width: chart_width,
					labelPositionFactor: 7,
					xScaleFunction: x,
					yScaleFunction: y
				});
				// Use the correct numberFormat for the new data labels
				svg.selectAll('text.dataLabels')
					.text(function(d) { return d3.format(numberFormat)(d.value); })
					.attr('fill', function(d) {
						// Get the bar color for this value
						var barColor = (d && !isNaN(+d.value)) ? colorScale(+d.value) : "#ccc";
						if (!barColor) return '#414042';
						// Use chroma.js to check contrast
						try {
							var luminance = chroma(barColor).luminance();
							return luminance > 0.5 ? '#414042' : '#ffffff';
						} catch (e) {
							return '#414042';
						}
					})
					.style('opacity', 0)
					.transition()
					.duration(100)
					.style('opacity', 1);
			}, 850); // 1250ms for bar transition + small buffer
		}

		// Remove any previous average line
		svg.selectAll('.average-line-group').remove();

		// Draw average line if the selected option has averageValue
		if (matchedFormat && matchedFormat.averageValue !== undefined && matchedFormat.averageBarsLabel) {
			const avgValue = matchedFormat.averageValue;
			const avgLabel = matchedFormat.averageBarsLabel;
			if (typeof avgValue === 'number' && !isNaN(avgValue)) {
				let avgX = x(avgValue);
				// Clamp label position to stay within chart area
				const padding = 4;
				const labelWidth = 80; // Estimate, or use getBBox if needed
				const minX = labelWidth / 2 + padding;
				const maxX = chart_width - labelWidth / 2 - padding;
				let labelX = Math.max(minX, Math.min(avgX, maxX));
				const avgGroup = svg.append('g')
					.attr('class', 'average-line-group')
					.attr('aria-label', avgLabel + ' vertical reference line')
					.attr('role', 'presentation')
					.style('pointer-events', 'none')
					.style('opacity', 0);
				avgGroup.append('line')
					.attr('class', 'average-line')
					.attr('x1', avgX)
					.attr('x2', avgX)
					.attr('y1', 0)
					.attr('y2', y.range()[1])
					.attr('stroke', '#888')
					.attr('stroke-width', 3)
					.attr('stroke-dasharray', '6,3')
					.attr('tabindex', -1);
				avgGroup.append('text')
					.attr('class', 'average-label')
					.attr('x', labelX)
					// .attr('y', + 50)
					.attr('text-anchor', 'middle')
					.attr('fill', '#888')
					.attr('font-size', 14)
					.attr('font-weight', 'bold')
					.attr('aria-hidden', 'true')
					.text(avgLabel);
				avgGroup.transition().duration(350).style('opacity', 1);
			}
		}

		// Render the map
		drawMap(selectedOption, filteredData, numberFormat);
	}

	let margin = config.optional.margin[size];
	let chart_width =
		parseInt(graphic.style('width')) - margin.left - margin.right;
	//height is set by unique options in column name * a fixed height + some magic because scale band is all about proportion

	let uniqueNames = [...new Set(graphic_data.map((d) => d.name))];
	let height =
		config.optional.seriesHeight[size] * uniqueNames.length +
		10 * (uniqueNames.length - 1) +
		12;

	//set up scales
	x = d3.scaleLinear().range([0, chart_width]);

	y = d3
		.scaleBand()
		.paddingOuter(0.2)
		.paddingInner(((graphic_data.length - 1) * 10) / (graphic_data.length * 30))
		.range([0, height])
		.round(true);

	//use the data to find unique entries in the name column
	y.domain([...new Set(graphic_data.map((d) => d.name))]);

	//set up yAxis generator
	let yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10);

	//set up xAxis generator
	let defaultNumberFormat = config.essential.dataLabels.numberFormat;
	let xAxis = d3
		.axisBottom(x)
		.tickSize(-height)
		.tickFormat(d3.format(defaultNumberFormat))
		.ticks(config.optional.xAxisTicks[size]);

	//create svg for chart
	svg = addSvg({
		svgParent: graphic,
		chart_width: chart_width,
		height: height + margin.top + margin.bottom,
		margin: margin
	})

	// Append y-axis to SVG
	svg
		.append('g')
		.attr('class', 'y axis')
		.call(yAxis)
		.selectAll('text')
		.call(wrap, margin.left - 10);

	if (config.essential.xDomain == 'auto') {
		if (d3.min(graphic_data.map(({ value }) => Number(value))) >= 0) {
			x.domain([
				0,
				d3.max(graphic_data.map(({ value }) => Number(value)))]); //modified so it converts string to number
		} else {
			x.domain(d3.extent(graphic_data.map(({ value }) => Number(value))))
		}
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

	// console.log(`Length of graphic_data: ${graphic_data.length}`);


	// This does the x-axis label
	// Remove any previous x-axis label
	svg.selectAll('.x-axis-label').remove();
	// Get the default xAxisLabel from the default option's format
	let defaultFormat = (config.essential.formats || []).find(f => f.name === config.essential.defaultOption);
	let defaultXAxisLabel = defaultFormat ? defaultFormat.xAxisLabel : '';
	svg.append('text')
		.attr('class', 'x-axis-label')
		.attr('x', chart_width)
		.attr('y', height + 35)
		.attr('text-anchor', 'end')
		.attr('font-size', 14)
		.attr('fill', '#222')
		.text(defaultXAxisLabel);
	

	//create link to source
	d3.select('#source').text('Source: ' + config.essential.sourceText);

	$('#optionsSelect').val(config.essential.defaultOption).trigger('chosen:updated');
	changeData(config.essential.defaultOption)
	// updateLegend("Agriculture, forestry and fishing", 0)

	//use pym to calculate chart dimensions
	if (pymChild) {
		pymChild.sendHeight();
	}
}

function drawMap(selectedOption, filteredData, numberFormat) {
    d3.select("#map-container").selectAll("svg").remove();
    d3.select("#map-container").selectAll("#map-legend").remove();

    const width = document.getElementById("map-container").clientWidth || 350;
    const height = document.getElementById("map-container").clientHeight || 400;

    const projection = d3.geoMercator().fitSize([width, height], geoFeatures);
    const path = d3.geoPath().projection(projection);

    // Jenks breaks
    const values = filteredData.map(d => +d.value).filter(d => !isNaN(d));
    const nBreaks = config.essential.colour_palette.length;
    const breaks = getJenksBreaks(values, nBreaks);

    // Color scale (fix: use breaks.slice(1, nBreaks) for domain, and assign color by value not AREACD)
    colorScale = d3.scaleThreshold()
        .domain(breaks.slice(1, nBreaks))
        .range(config.essential.colour_palette);

    // Create SVG with extra top margin
    const topGap = 20;
    mapSvg = d3.select("#map-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height + topGap);

    // Draw regions with a group translated down by topGap
    const mapGroup = mapSvg.append("g").attr("transform", `translate(0,${topGap})`);
    mapGroup.selectAll(".region")
        .data(geoFeatures.features)
        .enter()
        .append("path")
        .attr("class", d => `region ${d.properties.AREACD}`)
        .attr("d", path)
        .attr("fill", d => {
            const datum = filteredData.find(f => f.AREACD && d.properties.AREACD && String(f.AREACD).trim() === String(d.properties.AREACD).trim());
            return (datum && !isNaN(+datum.value)) ? colorScale(+datum.value) : "#ccc";
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .on("mouseover", function(e, d) {
            d3.select(this).raise().attr("stroke", "#FFA500").attr("stroke-width", 2);
            // Highlight corresponding bar (with stroke, not fill)
            const areacd = d.properties.AREACD;
            d3.select(`#graphic rect[data-areacd='${areacd}']`).attr("stroke", "#FFA500").attr("stroke-width", 2);
            // Show legend hover line at correct value
            const datum = filteredData.find(f => f.AREACD && String(f.AREACD).trim() === String(areacd).trim());
            if (datum && typeof datum.value !== 'undefined') {
                const value = +datum.value;
                const legend = mapSvg.select('.map-legend-vertical');
                if (!legend.empty()) {
                    const legendNode = legend.node();
                    const breaks = legendNode._breaks;
                    const yPos = legendNode._yPos;
                    const legendHeight = legendNode._legendHeight;
                    const y = getLegendLineY(value, breaks, yPos, legendHeight);
                    legend.select('.legend-hover-line')
                        .attr('y1', y)
                        .attr('y2', y)
                        .attr('opacity', 1);
                }
            }
        })
        .on("mouseout", function(e, d) {
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1);
            // Unhighlight corresponding bar
            const areacd = d.properties.AREACD;
            d3.select(`#graphic rect[data-areacd='${areacd}']`).attr("stroke", "none").attr("stroke-width", null);
            // Hide legend hover line
            mapSvg.select('.map-legend-vertical').select('.legend-hover-line').attr('opacity', 0);
        });

    // Draw animated vertical legend inside map SVG, top left
    drawAnimatedLegend(mapSvg, breaks, colorScale, height + topGap, numberFormat);

    // Update bars to use the same color scale by value
    if (svg) {
        svg.selectAll('rect')
            .attr('fill', d => (d && !isNaN(+d.value)) ? colorScale(+d.value) : "#ccc");
    }
}

function drawAnimatedLegend(mapSvg, breaks, colorScale, svgHeight, numberFormat) {
    // Remove previous legend group if exists
    mapSvg.selectAll("g.map-legend-vertical").remove();
    const legendHeight = svgHeight * 0.72; // 72% of svg height
    const legendWidth = 18;
    const legendX = 12;
    const legendY = (svgHeight - legendHeight) / 2;
    // Calculate band heights based on breaks
    let bandHeights = [];
    for (let i = 0; i < breaks.length - 1; i++) {
        bandHeights.push(breaks[i + 1] - breaks[i]);
    }
    const total = d3.sum(bandHeights);
    // Scale band heights to fit legendHeight
    const scaledHeights = bandHeights.map(h => h / total * legendHeight);
    // Y positions for each break (from bottom to top)
    let yPos = [0];
    for (let i = 0; i < scaledHeights.length; i++) {
        yPos.push(yPos[i] + scaledHeights[i]);
    }
    // Reverse for top-to-bottom (largest at top)
    // rectData: each rect starts at y = legendHeight - yPos[i+1], height = scaledHeights[i]
    const rectData = colorScale.range().map((color, i) => ({
        y: legendHeight - yPos[i + 1], // top of rect
        height: scaledHeights[i],
        color: color,
        val0: breaks[i],
        val1: breaks[i + 1],
        breakIdx: i
    })).reverse();
    // Legend group
    const legend = mapSvg.append("g")
        .attr("class", "map-legend-vertical")
        .attr("transform", `translate(${legendX},${legendY})`);
    // Use the same number format as the chart axis labels
    const legendNumberFormat = d3.format(numberFormat);
    // Rects (animated)
    let rects = legend.selectAll("rect").data(rectData, d => d.color);
    rects.enter()
        .append("rect")
        .attr("x", 0)
        .attr("width", legendWidth)
        .attr("y", d => d.y)
        .attr("height", d => d.height)
        .attr("fill", d => d.color)
        // .attr("opacity", 0)
        // .transition()
        // .duration(400)
        .attr("opacity", 1);
    rects
		// .transition()
        // .duration(400)
        .attr("y", d => d.y)
        .attr("height", d => d.height)
        .attr("fill", d => d.color);
    rects.exit()
        // .transition()
        // .duration(200)
        .attr("opacity", 0)
        .remove();
    // Labels: one for each break, positioned at the top of each rect (y = rect.y)
    // We need breaks.length labels, not just rectData.length
    let labelData = breaks.map((val, i) => {
        // y = legendHeight - yPos[i] (top of each break)
        return {
            y: legendHeight - yPos[i],
            value: val,
            idx: i
        };
    });
    // Remove old labels
    legend.selectAll("text.legend-label").remove();
    // Add all break labels
    legend.selectAll("text.legend-label")
        .data(labelData)
        .enter()
        .append("text")
        .attr("class", "legend-label")
        .attr("x", legendWidth + 6)
        .attr("y", d => d.y + 2) // +2 for slight padding
        .attr("font-size", 13)
        .attr("fill", "#222")
        .attr("font-family", "inherit")
        .attr("font-weight", d => d.idx === labelData.length - 1 ? "bold" : null)
        .text(d => legendNumberFormat(d.value));
    // Add highlight line (hidden by default)
    legend.append("line")
        .attr("class", "legend-hover-line")
        .attr("x1", 0)
        .attr("x2", legendWidth)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", "#FFA500")
        .attr("stroke-width", 3)
        .attr("opacity", 0);

    // Add average line and label if needed
    let selectedOption = d3.select('#optionsSelect').property('value');
    let matchedFormat = (config.essential.numberFormats || config.essential.formats || []).find(f => f.name === selectedOption);
    legend.selectAll('.legend-average-label').remove();
    legend.selectAll('.legend-average-line').remove();
    if (matchedFormat && typeof matchedFormat.averageValue === 'number' && matchedFormat.averageMapLabel) {
        const avgValue = matchedFormat.averageValue;
        const avgLabel = matchedFormat.averageMapLabel;
        // Calculate y position for average line
        const avgY = getLegendLineY(avgValue, breaks, yPos, legendHeight);
        // Draw the line and label as the last elements (on top)
        legend.append('line')
            .attr('class', 'legend-average-line')
            .attr('x1', 0)
            .attr('x2', legendWidth + 4)
            .attr('y1', avgY)
            .attr('y2', avgY)
            .attr('stroke', '#888')
            .attr('stroke-width', 3)
            .attr('pointer-events', 'none');
        // Wrap the label on two lines
        const labelLines = avgLabel.split(/\s+(?=Average$)/); // split before 'Average' if present
        legend.append('text')
            .attr('class', 'legend-average-label')
            .attr('x', legendWidth + 8)
            .attr('y', avgY + 15)
            .attr('fill', '#888')
            .attr('font-size', 13)
            .attr('font-family', 'inherit')
            .attr('font-weight', 'bold')
            .attr('aria-hidden', 'true')
            .attr('alignment-baseline', 'middle')
            .selectAll('tspan')
            .data(labelLines)
            .enter()
            .append('tspan')
            .attr('x', legendWidth + 8)
            .attr('dy', (d, i) => i === 0 ? 0 : 14)
            .text(d => d);
    } else {
        legend.select('.legend-average-line').attr('opacity', 0);
    }

    // In drawAnimatedLegend, after scaledHeights and yPos are defined, attach to legend for later use
    legend.node()._breaks = breaks;
    legend.node()._yPos = yPos;
    legend.node()._legendHeight = legendHeight;
}

d3.json("geogEregion.json").then(function(topo) {
    geoData = topo;
    geoFeatures = topojson.feature(geoData, geoData.objects.Eregion);
    // Call drawGraphic after geo loaded
    d3.csv(config.essential.graphic_data_url).then((data) => {
        graphic_data = data;
        pymChild = new pym.Child({
            renderCallback: function() {
                drawGraphic();
                // Draw map for default option
                const defaultOption = config.essential.defaultOption;
                const filteredData = graphic_data.filter(d => d.option === defaultOption);
                let matchedFormat = (config.essential.numberFormats || config.essential.formats || []).find(f => f.name === defaultOption);
                let numberFormat = matchedFormat ? matchedFormat.numberFormat : config.essential.dataLabels.numberFormat;
                drawMap(defaultOption, filteredData, numberFormat);
            }
        });
    });
});
