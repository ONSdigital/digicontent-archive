config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette": ["#222", "Grey", "White", "#206095", "Silver", "#F66068","#118C7B"],
		"colour_palette_line": ["#222", "Grey", "White", "#206095", "Silver", "#F66068","#118C7B"],
		"colour_palette_text": ["White","white", "#222", "white", "#222", "#222", "#fff"],
		"sourceText": "Autotrader",
		"accessibleSummary": "A treemap chart showing the most popular second-hand cars colours by proprtion. The message of the chart is in the chart title and the data can be downloaded",
		"dataLabels": {
			"show": true,
			"numberFormat": ".0%"
		},
				// either "auto" or an array for the x domain e.g. [0,100]
		
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 0,
				"right": 0,
				"bottom": 0,
				"left": 0
			},
			"md": {
				"top": 0,
				"right": 0,
				"bottom": 0,
				"left": 0
			},
			"lg": {
				"top": 0,
				"right": 0,
				"bottom": 0,
				"left": 0
			}
		},
		"seriesHeight": {
			"sm": 50,
			"md": 50,
			"lg": 43
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
