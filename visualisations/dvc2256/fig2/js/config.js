config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": "#27A0CC",
		"sourceText": "Census 2021 from Office for National Statistics",
		"accessibleSummary": "This bar chart has been hidden from screen readers. The main message is summarised in the chart title and data is available to download below.",
		"dataLabels": {
			"show": false,
			"numberFormat": ""
		},
		"xDomain": "auto",
		//"yDomain": "auto",
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisLabel": "Qualification index score"
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 50,
				"right": 20,
				"bottom": 20,
				"left": 150
			},
			"md": {
				"top": 50,
				"right": 20,
				"bottom": 20,
				"left": 270
			},
			"lg": {
				"top": 50,
				"right": 20,
				"bottom": 20,
				"left": 270
			}
		},
		"seriesHeight": {
			"sm": 40,
			"md": 30,
			"lg": 30
		},
		"xAxisTicks": {
			"sm": 8,
			"md": 8,
			"lg": 8
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},

	"elements": { "select": 0, "nav": 0, "legend": 0, "titles": 0 },
	"chart_build": {}
};
