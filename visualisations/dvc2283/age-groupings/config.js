config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"legendLabels": {  "max": "England", "min": "Wales" },
		//the keys match the column names
		"colour_palette": [  "#118C7B","#871A5B"],
		"sourceText": "Census 2021 from the Office for National Statistics and Energy Performance Certificate data from the Department for Levelling Up, Housing and Communities",
		"accessibleSummary":
			"A dot plot chart. This chart is hidden from screen readers. The chart shows values for both England and Wales. A line at shows the England and Wales average at 58.4%. The main message of the chart are given in the chart title and the data is available in the data download file",
		"numberFormat": ".0%",
		"tickFormat": ".0%",
		"xAxisLabel": "Percentage below EPC C",
		"xDomain": [0.30,0.75]
		// either auto or a custom domain as an array e.g [0,100]
	},
	"optional": {
		"margin": {
			"sm": {
				"top": 0,
				"right": 0,
				"bottom": 40,
				"left": 150
			},
			"md": {
				"top": 0,
				"right": 20,
				"bottom": 40,
				"left": 220
			},
			"lg": {
				"top": 0,
				"right": 20,
				"bottom":40,
				"left": 220
			}
		},
		"seriesHeight": {
			"sm": 40,
			"md": 40,
			"lg": 40
		},
		"xAxisTicks": {
			"sm": 4,
			"md": 8,
			"lg": 10
		},
		"mobileBreakpoint": 510,
		"mediumBreakpoint": 600
	}
};
