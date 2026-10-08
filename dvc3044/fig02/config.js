config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": ["Women", "Men"],
		"colour_palette": ["#9A86E9",  "#3FB0B3"],
		"sourceText": "Crime Survey for England and Wales (CSEW) from the Office for National Statistics",
		"accessibleSummary": "This chart has been hidden from screen readers. The main message is summarised in the chart title and data is available to download below.",
		"dataLabels": {
			"show": true,
			"numberFormat": ".1%"
		},
		"xDomain": "auto",
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisLabel": "",
		"XnumberFormat": ".0%"
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 15,
				"right": 20,
				"bottom": 30,
				"left": 15
			},
			"md": {
				"top": 15,
				"right": 20,
				"bottom": 30,
				"left": 15
			},
			"lg": {
				"top": 15,
				"right": 20,
				"bottom": 30,
				"left": 15
			}
		},
		"seriesHeight": {
			"sm": 80,
			"md": 80,
			"lg": 80
		},
		"xAxisTicks": {
			"sm": 4,
			"md": 8,
			"lg": 10
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
