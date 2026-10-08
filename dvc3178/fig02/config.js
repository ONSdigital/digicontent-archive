config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": { "min": "2013", "max": "2023" },
		//the keys match the column names
		"colour_palette": ["#206095", "#F66068", "#8D8C8E"],
		"colour_palette_text": ["#206095", "#F66068", "#707071"],
		"sourceText": "Office for National Statistics analysis using data from the Financial Conduct Authority",
		"accessibleSummary":
			"This chart has been hidden from screen readers. The main message is summarised in the chart title and data is available to download below.",
		"numberFormat": ".1f",
		"xAxisNumberFormat": ".0f",
		"xAxisLabel": "First-time buyer mortgages per 1000 dwellings",
		"xDomain": [7, 21],
		// either auto or a custom domain as an array e.g [0,100]
		"dotsize": 6,
		"legendItems": ["Inc","Dec","No"],
		//Choose which items to include in the legend, and the order that they appear
		"legendLineLength": 60,
		"legendItemWidth": 150,
		"showDataLabels": true
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 5,
				"right": 25,
				"bottom": 20,
				"left": 130
			},
			"md": {
				"top": 5,
				"right": 20,
				"bottom": 20,
				"left": 130
			},
			"lg": {
				"top": 5,
				"right": 20,
				"bottom": 20,
				"left": 190
			}
		},
		"seriesHeight": {
			"sm": 40,
			"md": 40,
			"lg": 35
		},
		"xAxisTicks": {
			"sm": 4,
			"md": 4,
			"lg": 4
		},
		"legendHeight": {
			"sm": 40,
			"md": 40,
			"lg": 40
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	},
	"elements": { "select": 0, "nav": 0, "legend": 1, "titles": 0 }
};
