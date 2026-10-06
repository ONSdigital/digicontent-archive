config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": "#206095",
		"sourceText": "2021 Census from the Office for National Statistics ",
		"accessibleSummary": "Bar chart showing the number of workers in most common occupations within high-emissions industries in England and Wales during 2021. The chart suggests that three occupation groups accounted for a quarter of workers in high-emissions industries.",
		"dataLabels": {
			"show": true,
			"numberFormat": ".0f"
		},
		"xDomain": "auto",
		// either "auto" or an array for the x domain e.g. [0,100]
		"xAxisLabel": "Thousands"
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 250
			},
			"md": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 250
			},
			"lg": {
				"top": 15,
				"right": 20,
				"bottom": 50,
				"left": 250
			}
		},
		"seriesHeight": {
			"sm": 30,
			"md": 30,
			"lg": 30
		},
		"xAxisTicks": {
			"sm": 3,
			"md": 3,
			"lg": 5
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 0, "titles": 0 },
	"chart_build": {}
};
