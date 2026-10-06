config = {
	"essential": {
		"graphic_data_url": "data.csv",
		"colour_palette_type": "categorical",
		// type can be mono, divergent, categorical
		"colour_palette_colours": ["#871A5B","#F66068"],
		// colours is an array for the colours of the bars
		// e.g. if mono use ["206095"]
		// e.g if divergent you can use ["#206095","#F66068"]
		// e.g if categorical ["#206095", "#27A0CC","#871A5B", "#A8BD3A","#F66068"]
		"numberFormat": ".0%",
		"rowWidth": "160",
		// rowWidth set the width of y category column in pixel
		"accessibleSummary":"Split bar chart showing the percentage of total greenhouse gas emissions (residence basis) excluding household emissions and total employees by industry in the UK during 2021. The chart suggests that five industries contribute more than 80% of UK emissions.",
    	"sourceText": "Office for National Statistics, Ricardo Energy and Environment, Business Register and Employment Survey, Northern Ireland Statistics and Research Agency",
		"threshold_sm": 500
	},
	//Don't adjust this part - it only affects the chart build tool
	"chart_build": {
		"graphic_data_url": "text",
		"colour_palette_type": "radio",
		"colour_palette_type_options": ["mono", "divergent", "categorical"],
		"colour_palette_colours": "colour",
		"colour_palette_colours_options": [
			"#206095",
			"#27A0CC",
			"#871A5B",
			"#A8BD3A",
			"#F66068"
		],
		"numberFormat": "dThreeFormat",
		"numberFormat_options": [".0f"],
		"rowWidth": "number",
		"accessibleSummary": "textarea",
		"sourceText": "text",
		"threshold_sm": "number"
	},
	"elements": { "select": 0, "nav": 0, "legend": 0, "titles": 0 }
};
