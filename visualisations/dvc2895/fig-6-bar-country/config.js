config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": "#206095",
		"sourceText": "Auto Trader",
		"accessibleSummary": "A bar chart showing the proportion of second-hand cars by country of manufacturer. The chart title describes the chart and the data is in the data download",
		"dataLabels": {
			"show": false,
			"numberFormat": ",.0f"
		},
		"xDomain": "auto",
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisLabel": "Number of cars (thousands)"
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 15,
				"right": 27,
				"bottom": 40,
				"left": 80
			},
			"md": {
				"top": 15,
				"right": 27,
				"bottom": 40,
				"left": 80
			},
			"lg": {
				"top": 15,
				"right": 27,
				"bottom": 40,
				"left": 80
			}
		},
		"seriesHeight": {
			"sm": 30,
			"md": 30,
			"lg": 30
		},
		"xAxisTicks": {
			"sm": 4,
			"md": 8,
			"lg": 10
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 0, "titles": 0 },
	"chart_build": {}
};
