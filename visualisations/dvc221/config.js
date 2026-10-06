var config = {
    // Data sources
    dataFiles: {
        maleLE:    "./lib/table1_male.csv",
        femaleLE:  "./lib/table1_female.csv",
        maleQX:    "./lib/table2_male_QX.csv",
        femaleQX:  "./lib/table2_female_QX.csv"
    },

    // Chart colours
    colours: {
        // From D:\Charts\lib\colours.js: oceanBlue, springGreen, beetrootPurple
        oneInFour:  "#206095",  // oceanBlue
        oneInTen:   "#F66068",  // coral
        oneInTenText: "#F66068", // coral text accent
        leLine:     "#871A5B",  // beetrootPurple
        spa:        "#003C57",  // State Pension Age marker
        curve:      "#121212",  // Probability curve and area fill
        axisText:   "#323132"
    },

    // Chart margins (pixels)
    margin: {
        sm: { top: 35, right: 25,  bottom: 65, left: 40 },
        lg: { top: 35, right: 25,  bottom: 65, left: 40 }
    },

    // Aspect ratio [width, height] per breakpoint
    aspectRatio: {
        sm: [15, 16],
        md: [16, 11],
        lg: [16, 9]
    },

    // Viewport width at which sm/lg breakpoints apply
    mobileThreshold: 450,

    // Helper-style breakpoints and target design width for chart sizing
    breakpoints: {
        mobile: 450,
        medium: 575
    },
    chartDesignWidth: 700,

    // Maximum age used in calculations
    maxAge: 125,

    // Initial year in the life/QX tables (first year of data)
    initialYear: 1951,

    // Display mode: "percentiles" (original 1-in-4, 1-in-10) or "targetAges" (90, 100, SPA)
    // Switch to "targetAges" to display probabilities for specific ages instead of percentiles
    probabilityMode: "targetAges",

    // Target ages for probability display (used when probabilityMode is "targetAges")
    probabilityTargets: [
        { age: null, label: "at State Pension age", divId: "actualDiv", isSPA: true, color: "#206095" },
        { age: 90,  label: "at age 90",         divId: "natDiv", color: "#F66068" },
        { age: 100, label: "at age 100",        divId: "guessDiv",    color: "#871A5B" }
    ],

    // Source text shown below chart
    sourceText: "Office for National Statistics"
};
