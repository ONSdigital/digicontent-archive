let graphic = d3.select('#graphic');
let pymChild = null;
let originalData = []; // Initialize as an empty array
let newData = [];
function drawGraphic(data) {

console.log(data)
		// Handle back button visibility
		// if (data === newData) {
		// 	d3.select('#backButton').style('display', 'block');
		// } else {
		// 	d3.select('#backButton').style('display', 'none');
		// }

	// Check if data is valid
	if (!data || data.length === 0) {
		console.error("No data provided to drawGraphic.");
		return;
	}

	// Calculate height based on the data length
	let threshold_md = config.optional.mediumBreakpoint;
	let threshold_sm = config.optional.mobileBreakpoint;
	let size = 'lg';

	if (parseInt(graphic.style('width')) < threshold_sm) {
		size = 'sm';
	} else if (parseInt(graphic.style('width')) < threshold_md) {
		size = 'md';
	}

	let margin = config.optional.margin[size];
	let chart_width = parseInt(graphic.style('width')) - margin.left - margin.right;
	let height = config.optional.seriesHeight[size] * data.length + 10 * (data.length - 1) + 12;

	// Ensure height is valid
	if (isNaN(height) || height <= 0) {
		console.error("Calculated height is invalid.");
		return;
	}

	// Clear out existing graphics
	graphic.selectAll('*').remove();

	// Set up scales and SVG
	const x = d3.scaleLinear().range([0, chart_width]);
	const y = d3.scaleBand().paddingOuter(0.2).paddingInner(((data.length - 1) * 10) / (data.length * 30)).range([0, height]).round(true);

	let svg = graphic.append('svg')
		.attr('width', chart_width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.attr('class', 'chart')
		.style('background-color', '#fff')
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// Process data for treemap
	let root;
	try {
		root = d3.stratify()
			.id(d => d.name)
			.parentId(d => d.parent)(data);

		root.sum(d => +d.value);

		// Create treemap
		d3.treemap().size([chart_width, height]).padding(5)(root);
	} catch (error) {
		console.error("Error processing data for treemap:", error);
		return;
	}

	// Use the processed data to draw rectangles and labels
	svg.selectAll("rect")
		.data(root.leaves())
		.enter()
		.append("rect")
		.attr('x', d => d.x0)
		.attr('y', d => d.y0)
		.attr('width', d => d.x1 - d.x0)
		.attr('height', d => d.y1 - d.y0)
		.attr('stroke', (d, i) => d.data.colour1)
		.style("stroke-width", "1px")
		.attr('fill', (d, i) => d.data.colour)
		// .on("click", function(event, d) {
		// 	if (d.data.name === 'Other') {
		// 		updateChart('Other');
		// 	}
		// });

	svg.selectAll("text")
		.data(root.leaves())
		.enter()
		.append("text")
		.attr("x", d => d.x0 + 10)
		.attr("y", d => d.y0 + 20)
		.text(d => d.data.name)
		.attr("font-size", "14px")
		.attr("font-weight", 600)
		.attr('fill', (d, i) => d.data.colour2)
		.attr('class', "data-label");

	svg.selectAll("text2")
		.data(root.leaves())
		.enter()
		.append("text")
		.attr("x", d => d.x0 + 10)
		.attr("y", d => d.y0 + 40)
		.text(d => d3.format(config.essential.dataLabels.numberFormat)(d.value))
		.attr("font-size", "14px")
		.attr("font-weight", 700)
		.attr('fill', (d, i) => d.data.colour2)
		.attr('class', "data-label");




	// Create link to source
	d3.select('#source').text('Source: ' + config.essential.sourceText);

 

	// Use pym to calculate chart dimensions
	if (pymChild) {
		pymChild.sendHeight();
	}
}
function updateChart(category) {

	if (category === 'Other') {
		newData = [
			{name: 'Other', parent: '', value: 0}, // Root node for "Other"
			{name: 'Green', parent: 'Other', value: 0.01, colour: '#FFD700'},
			{name: 'Purple', parent: 'Other', value: 0.02, colour: '#800080'},
			{name: 'Pink', parent: 'Other', value: 0.015, colour: '#FFC0CB'},
		];

			d3.select('#backButton').style('display', 'block');
	


	} else {
		newData = originalData;
	}

// Event listener for the back button
d3.select('#backButton').on('click', function() {
	updateChart(null); // Pass null or any value that will trigger the original data view
});

	drawGraphic(newData);
}
d3.csv(config.essential.graphic_data_url).then((data) => {
	originalData = data;
	drawGraphic(data);
	// Use pym to create iframed chart dependent on specified variables
	pymChild = new pym.Child({
		renderCallback: drawGraphic
	});
});