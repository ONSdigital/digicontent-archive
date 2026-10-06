config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": "#206095",
	"colour_palette_negative":"#F66068",
		"sourceText": "Rail Delivery Group",
		"accessibleSummary": "Multiple column charts showing train tickets for selected stations over time. The chart title describes the chart and the data is in the data download",
		"xAxisTickFormat": {
			"sm": "%b",
			"md": "%b",
			"lg": "%b"
		},
		"xAxisNumberFormat": ".0f",
		"yAxisTickFormat": ".0%",
		"dateFormat": "%d/%m/%Y",
		//the format your date data has in data.csv
		"yDomain": [-1,7.1],
		// either "auto" or an array for the x domain e.g. [0,100]
		"yAxisLabel": ""
	},
	"optional": {
		"chart_every": {
			"sm": 1,
			"md": 2,
			"lg": 2
		},
		"aspectRatio": {
			"sm": [1, 1],
			"md": [1, 1],
			"lg": [1, 1]
		},
		"margin": {
			"sm": {
				"top": 65,
				"right": 20,
				"bottom": 50,
				"left": 70
			},
			"md": {
				"top": 65,
				"right": 20,
				"bottom": 50,
				"left": 70
			},
			"lg": {
				"top": 65,
				"right": 40,
				"bottom": 50,
				"left": 70
			}
		},
		"xAxisTicksEvery": { // this is the interval of ticks on the x axis - always including the first and last date
			"sm": 12,
			"md": 12,
			"lg": 12
		},
		"yAxisTicks": {
			"sm": 10,
			"md": 10,
			"lg": 10
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600,
		"dropYAxis": true
	},
	"elements": { "select": 0, "nav": 0, "legend": 0, "titles": 0 },
	"chart_build": {}
};
