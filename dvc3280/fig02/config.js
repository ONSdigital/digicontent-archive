config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": ['#ccebc5','#a8ddb5','#7bccc4','#43a2ca','#0868ac'],
		"sourceText": "Subnational population projections for England from the Office for National Statistics",
		"accessibleSummary": "This chart has been hidden from screen readers. The main message is summarised in the chart title and data is available to download below.",
		"dataLabels": {
			"show": true,
			"numberFormat": ".2f"
		},
		"xDomain": "auto",
		// either "auto", "autoAll" or an array for the x domain e.g. [0,100]
		// "xAxisLabel": "x axis label",
		"defaultOption": "Percentage population change",
		"formats": [
				{name: "Mid-2022 population (millions)",
				 numberFormat: ".2f",
				 xAxisLabel: "millions of people"},
				{name: "Mid-2032 population (millions)",
				 numberFormat: ".2f",
				 xAxisLabel: "millions of people"},
				{name: "Population change over 10 years (thousands)",
				 numberFormat: ".0f",
				 xAxisLabel: "thousands of people"},
				{name: "Percentage population change",
				 numberFormat: ".2%",
				 xAxisLabel: "percentage change",
			     averageValue: 0.0639,
			     averageBarsLabel: "England Average",
				 averageMapLabel: "England Average"}
				],
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 30,
				"right": 20,
				"bottom": 50,
				"left": 120
			},
			"md": {
				"top": 30,
				"right": 20,
				"bottom": 50,
				"left": 120
			},
			"lg": {
				"top": 30,
				"right": 20,
				"bottom": 50,
				"left": 120
			}
		},
		"seriesHeight": {
			"sm": 30,
			"md": 30,
			"lg": 30
		},
		"xAxisTicks": {
			"sm": 4,
			"md": 6,
			"lg": 8
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 0, "titles": 0 },
	"chart_build": {}
};
