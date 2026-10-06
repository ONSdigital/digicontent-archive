config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": "#206095",
		"sourceText": "2021 Census from the Office for National Statistics ",
		"accessibleSummary": "Bar chart showing the percentage of workers in high-emissions industries in Wales and region of England during 2021. The chart suggests that 1 in 5 workers in the Midlands were in high-emissions industries, compared with 1 in 12 workers in London.",
		"dataLabels": {
			"show": true,
			"numberFormat": ".1%"
		},
		"xDomain": [0,0.2],
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisLabel": ""
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 120
			},
			"md": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 150
			},
			"lg": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 150
			}
		},
		"seriesHeight": {
			"sm": 30,
			"md": 30,
			"lg": 30
		},
		"xAxisTicks": {
			"sm": 2,
			"md": 2,
			"lg": 5
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 0, "titles": 0 },
	"chart_build": {}
};
