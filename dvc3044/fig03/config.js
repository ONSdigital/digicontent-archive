config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": ["#9A86E9",  "#3FB0B3", "#27A0CC"],
		"sourceText": "Crime Survey for England and Wales (CSEW) from the Office for National Statistics",
		"accessibleSummary": "This chart has been hidden from screen readers. The main message is summarised in the chart title and data is available to download below.",
		"dataLabels": {
			"show": false,
			"numberFormat": ".0%"
		},
		"xDomain": [0, 0.12],
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisLabel": ""
	},
	"optional": {
		"chart_every": {
			"sm": 1,
			"md": 1,
			"lg": 1
		},
		"aspectRatio": {
			"sm": [1, 2],
			"md": [1, 2],
			"lg": [1, 2]
		},
		"margin": {
			"sm": {
				"top": 30,
				"right": 20,
				"bottom": 50,
				"left": 140
			},
			"md": {
				"top": 30,
				"right": 20,
				"bottom": 50,
				"left": 150
			},
			"lg": {
				"top": 30,
				"right": 20,
				"bottom": 50,
				"left": 150
			}
		},
		"seriesHeight": {
			"sm": 20,
			"md": 20,
			"lg": 20
		},
		"xAxisTicks": {
			"sm": 4,
			"md": 4,
			"lg": 4
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600,
		"dropYAxis": true
	},
	"elements": { "select": 0, "nav": 0, "legend": 0, "titles": 0 },
	"chart_build": {}
};
