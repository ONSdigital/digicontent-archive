config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": { "min": "A", "max": "B" },
		//the keys match the column names
		"colour_palette": ["#206095", "#F66068", "#707071"],
		"sourceText": "Population estimates from the Office for National Statistics",
		"accessibleSummary":
			"Here is the screenreader text describing the chart.",
		"numberFormat": ",.0f",
		"xAxisNumberFormat": ",.0f",
		"xAxisLabel": "",
		"xDomain": [60200000, 62300000],
		// either auto or a custom domain as an array e.g [0,100]
		"dotsize": 6,
		"minimum_arrow_size":10.2,
		"legendItems": ["Inc","Dec","No"],
		//Choose which items to include in the legend, and the order that they appear
		"legendLineLength": 60,
		"legendItemWidth": 150,
		"flag_size": 20,
		"showDataLabels": true
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 45,
				"right": 75,
				"bottom": 50,
				"left": 160
			},
			"md": {
				"top": 45,
				"right": 65,
				"bottom": 50,
				"left": 160
			},
			"lg": {
				"top": 45,
				"right": 65,
				"bottom": 50,
				"left": 160
			}
		},
		"seriesHeight": {
			"sm": 40,
			"md": 40,
			"lg": 40
		},
		"xAxisTicks": {
			"sm": 2,
			"md": 4,
			"lg": 4
		},
		"legendHeight": {
			"sm": 50,
			"md": 50,
			"lg": 50
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
