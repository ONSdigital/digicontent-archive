// Life Expectancy Calculator — script.js
// D3 v6 | Vanilla JS | No jQuery | No Modernizr
// Reads config from config.js (global `config` object)

// ============================================================
// Namespace
// ============================================================
var dvc = {};

dvc.initialYear      = config.initialYear;
dvc.finalYear        = 2197;
dvc.maxAgetoConsider = config.maxAge;
dvc.boolHasError     = false;
dvc.selectedGender   = "";

var margin = config.margin.lg;

// ============================================================
// State Pension Age lookup (birth year → SPA)
// ============================================================
var yourSPAArray = {
    "features": [
        { "properties": { "birthYear": "1890", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1891", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1892", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1893", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1894", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1895", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1896", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1897", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1898", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1899", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1900", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1901", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1902", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1903", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1904", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1905", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1906", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1907", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1908", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1909", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1910", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1911", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1912", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1913", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1914", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1915", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1916", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1917", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1918", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1919", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1920", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1921", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1922", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1923", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1924", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1925", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1926", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1927", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1928", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1929", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1930", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1931", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1932", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1933", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1934", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1935", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1936", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1937", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1938", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1939", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1940", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1941", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1942", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1943", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1944", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1945", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1946", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1947", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1948", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1949", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1950", "male": "65", "female": "60" } },
        { "properties": { "birthYear": "1951", "male": "65", "female": "61" } },
        { "properties": { "birthYear": "1952", "male": "65", "female": "62" } },
        { "properties": { "birthYear": "1953", "male": "65", "female": "64" } },
        { "properties": { "birthYear": "1954", "male": "66", "female": "66" } },
        { "properties": { "birthYear": "1955", "male": "66", "female": "66" } },
        { "properties": { "birthYear": "1956", "male": "66", "female": "66" } },
        { "properties": { "birthYear": "1957", "male": "66", "female": "66" } },
        { "properties": { "birthYear": "1958", "male": "66", "female": "66" } },
        { "properties": { "birthYear": "1959", "male": "66", "female": "66" } },
        { "properties": { "birthYear": "1960", "male": "66", "female": "66" } },
        { "properties": { "birthYear": "1961", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1962", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1963", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1964", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1965", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1966", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1967", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1968", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1969", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1970", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1971", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1972", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1973", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1974", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1975", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1976", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1977", "male": "67", "female": "67" } },
        { "properties": { "birthYear": "1978", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1979", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1980", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1981", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1982", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1983", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1984", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1985", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1986", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1987", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1988", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1989", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1990", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1991", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1992", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1993", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1994", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1995", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1996", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1997", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1998", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "1999", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2000", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2001", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2002", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2003", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2004", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2005", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2006", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2007", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2008", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2009", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2010", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2011", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2012", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2013", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2014", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2015", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2016", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2017", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2018", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2019", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2020", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2021", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2022", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2023", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2024", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2025", "male": "68", "female": "68" } },
        { "properties": { "birthYear": "2026", "male": "68", "female": "68" } }
    ]
};

// ============================================================
// Helper: append tspan elements to a D3 text selection
// Replaces d3-jetpack's .tspans()
// ============================================================
function addTspans(textSel, lines, dy) {
    lines.forEach(function (line, i) {
        textSel.append("tspan")
            .attr("dy", i === 0 ? 0 : dy)
            .text(line);
    });
}

// ============================================================
// Helpers
// ============================================================
function show(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = "";
}
function hide(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = "none";
}
function setText(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

function showAgeError() {
    var panel = document.getElementById("age-error-panel");
    if (panel) panel.style.display = "";
    var inlineErr = document.getElementById("currentAge-error");
    if (inlineErr) inlineErr.style.display = "";
    var input = document.getElementById("currentAge");
    if (input) input.classList.add("ons-input--error");
    var inputGroup = document.getElementById("inputErrorGroup");
    if (inputGroup) inputGroup.classList.add("form-controls-stack--error");
}

function clearAgeError() {
    var panel = document.getElementById("age-error-panel");
    if (panel) panel.style.display = "none";
    var inlineErr = document.getElementById("currentAge-error");
    if (inlineErr) inlineErr.style.display = "none";
    var input = document.getElementById("currentAge");
    if (input) input.classList.remove("ons-input--error");
    var inputGroup = document.getElementById("inputErrorGroup");
    if (inputGroup) inputGroup.classList.remove("form-controls-stack--error");
}

function updateCompareButtonState() {
    var compareBtn = document.getElementById("compareBtn");
    var ageVal = document.getElementById("currentAge").value.trim();
    var ageValid = /^[0-9]{1,3}$/.test(ageVal) && +ageVal >= 0 && +ageVal <= 100;
    var selectedGender = document.querySelector('input[name="gender"]:checked');

    if (selectedGender) {
        dvc.selectedGender = selectedGender.value;
    }

    if (ageValid && selectedGender) {
        compareBtn.className = "ons-btn ons-btn--cta";
        compareBtn.disabled = false;
    } else {
        compareBtn.className = "ons-btn ons-btn--cta ons-btn--disabled";
        compareBtn.disabled = true;
    }
}

// ============================================================
// Gender radio interaction
// ============================================================
document.querySelectorAll('input[name="gender"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
        updateCompareButtonState();
    });
});

// ============================================================
// initialise — helper-style size classification from container
// ============================================================
function initialise(size, overrides) {
    var thresholdSmall = overrides.mobileBreakpoint;
    var thresholdMedium = overrides.mediumBreakpoint;
    var graphicWidth = parseInt(d3.select("#picto").style("width"), 10);

    if (graphicWidth < thresholdSmall) {
        size = "sm";
    } else if (graphicWidth < thresholdMedium) {
        size = "md";
    } else {
        size = "lg";
    }

    return size;
}

// ============================================================
// Window resize
// ============================================================
window.addEventListener("resize", function () {
    if (dvc.data1 && dvc.selectedGender !== "") {
        makeChart();
    }
});

// ============================================================
// Age input interaction
// ============================================================
document.getElementById("currentAge").addEventListener("input", function () {
    onblurYourAge();
});

// ============================================================
// Initialisation (async)
// ============================================================
document.addEventListener("DOMContentLoaded", async function () {

    dvc.firstYear   = 1951;
    dvc.lastYear    = 2205;
    dvc.currentYear = new Date().getFullYear();

    pymChild = new pym.Child();
    requestAnimationFrame(function () { pymChild.sendHeight(); });

    window.addEventListener("load", function () {
        requestAnimationFrame(function () { pymChild.sendHeight(); });
    });

    try {
        [dvc.data1, dvc.data2, dvc.data3, dvc.data4] = await Promise.all([
            d3.csv(config.dataFiles.maleLE),
            d3.csv(config.dataFiles.femaleLE),
            d3.csv(config.dataFiles.maleQX),
            d3.csv(config.dataFiles.femaleQX)
        ]);
    } catch (err) {
        console.error("Failed to load life table data:", err);
        return;
    }

    updateCompareButtonState();

    document.getElementById("longevityCalculator")
        .addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopPropagation();
            onblurYourAge();
            dvc.myCurrentAge = parseInt(document.getElementById("currentAge").value, 10);
            getValues();

            if (typeof dataLayer !== "undefined") {
                dataLayer.push({
                    event:   "calculateLE",
                    age:     dvc.myCurrentAge,
                    sex:     dvc.selectedGender,
                    sex_age: dvc.selectedGender.charAt(0) + "_" + dvc.myCurrentAge
                });
            }
        });
});

// ============================================================
// getValues
// ============================================================
function getValues() {

    if (isNaN(dvc.myCurrentAge) || dvc.myCurrentAge < 0 || dvc.myCurrentAge > 100) {
        showAgeError();
        hide("quizContent");
        requestAnimationFrame(function () { pymChild.sendHeight(); });
        return;
    }
    clearAgeError();

    document.getElementById("quizContent").style.display = "block";
    ["LE","picto","pictoText","introLine1","introLine2","introLine4",
     "introLine5","introLine3a","yearsFromNow","yearsFromNow2"].forEach(show);
    document.querySelectorAll(".breakReturn").forEach(function (el) { el.style.display = ""; });
    requestAnimationFrame(function () { pymChild.sendHeight(); });

    dvc.YearOfBirth = dvc.currentYear - dvc.myCurrentAge;

    if (dvc.selectedGender === "male") {
        dvc.yearData   = dvc.data1.filter(function (d) { return d.year == dvc.YearOfBirth; });
        dvc.QXData     = dvc.data3;
        dvc.SPAtoUse   = yourSPAArray.features[dvc.YearOfBirth - 1890].properties.male;
        dvc.plineColor = config.colours.curve;
    } else {
        dvc.yearData   = dvc.data2.filter(function (d) { return d.year == dvc.YearOfBirth; });
        dvc.QXData     = dvc.data4;
        dvc.SPAtoUse   = yourSPAArray.features[dvc.YearOfBirth - 1890].properties.female;
        dvc.plineColor = config.colours.curve;
    }

    calculateEXProbs();
}

// ============================================================
// calculateEXProbs
// ============================================================
function calculateEXProbs() {

    var genderSpecificQX;

    dvc.timeArray        = [];
    dvc.ageArray         = [];
    dvc.QX_LEprobArray   = [];
    dvc.LX_LEprobArray   = [];
    dvc.LXL0_LEprobArray = [];
    dvc.DX_LEprobArray   = [];
    dvc.EX_LEprobArray   = [];

    dvc.birthYearIndex = dvc.YearOfBirth - dvc.initialYear;

    for (var i = dvc.myCurrentAge; i <= dvc.maxAgetoConsider; i++) {
        var j         = i - dvc.myCurrentAge;
        var yearIndex = parseInt(i) + parseInt(dvc.YearOfBirth) - dvc.initialYear;

        // Safe bracket-notation lookup — replaces eval()
        genderSpecificQX = dvc.QXData[yearIndex]["Y" + i];

        dvc.QX_LEprobArray[j] = parseFloat(genderSpecificQX) / 100000;

        if (i === dvc.myCurrentAge) {
            dvc.LX_LEprobArray[j]   = 100000;
            dvc.LXL0_LEprobArray[j] = 100.00;
            dvc.DX_LEprobArray[j]   = dvc.QX_LEprobArray[j] * dvc.LX_LEprobArray[j];
        } else {
            dvc.LX_LEprobArray[j]   = (1 - dvc.QX_LEprobArray[j - 1]) * dvc.LX_LEprobArray[j - 1];
            dvc.LXL0_LEprobArray[j] = (dvc.LX_LEprobArray[j] / dvc.LX_LEprobArray[0]) * 100;
            dvc.DX_LEprobArray[j]   = (dvc.QX_LEprobArray[j] * dvc.LX_LEprobArray[j]).toFixed(0);
        }

        dvc.timeArray[j] = parseInt(dvc.initialYear + yearIndex);
        dvc.ageArray[j]  = parseInt(j) + parseInt(dvc.myCurrentAge);
    }

    for (var i = dvc.myCurrentAge; i <= dvc.maxAgetoConsider; i++) {
        var j          = i - dvc.myCurrentAge;
        var tempArray  = dvc.LX_LEprobArray.slice(j);
        var sumOfArray = d3.sum(tempArray);
        dvc.EX_LEprobArray[j] = (sumOfArray / dvc.LX_LEprobArray[j]) - 0.5;
    }

    dvc.ageArrayINVERTED        = dvc.ageArray.slice().reverse();
    dvc.LX_LEprobArrayINVERTED  = dvc.LX_LEprobArray.slice().reverse();

    var Age_LXL0_DataArray = dvc.LXL0_LEprobArray.map(function (v, i) { return [v, dvc.ageArray[i]]; });
    dvc.hundredYearProb    = Age_LXL0_DataArray[100 - dvc.myCurrentAge];

    var myAge    = parseInt(dvc.myCurrentAge);
    var mySPAAge = parseInt(dvc.SPAtoUse);

    if (myAge <= mySPAAge) {
        dvc.SPAProb = Age_LXL0_DataArray[dvc.SPAtoUse - dvc.myCurrentAge];
    }

    var Age_LX_DataArray    = dvc.LX_LEprobArrayINVERTED.map(function (v, i) { return [v, dvc.ageArrayINVERTED[i]]; });
    var Age_QX_LX_DataArray = dvc.ageArray.map(function (v, i) { return [v, dvc.QX_LEprobArray[i], dvc.LX_LEprobArray[i]]; });

    dvc.probArray           = [50000, 25000, 10000];
    dvc.mySpecificProbArray = [];

    for (var p = 0; p < dvc.probArray.length; p++) {
        dvc.mySpecificProbArray[p] = [[], []];

        var val1, val8, val2, val7;

        for (var i = 0; i < Age_LX_DataArray.length; i++) {
            if (parseInt(Age_LX_DataArray[i][0]) < dvc.probArray[p]) {
                val1 = parseInt(Age_LX_DataArray[i][1]);
                val8 = Age_LX_DataArray[i][1] - 1;
            }
        }

        for (var i = 0; i < Age_QX_LX_DataArray.length; i++) {
            if      (parseInt(Age_QX_LX_DataArray[i][0]) <  val1) { val2 = Age_QX_LX_DataArray[i][2]; }
            else if (parseInt(Age_QX_LX_DataArray[i][0]) === val1) { val7 = Age_QX_LX_DataArray[i][2]; }
        }

        var val3 = val2 - dvc.probArray[p];
        var val9 = (val3 / (val2 - val7)) + val8;

        dvc.mySpecificProbArray[p][0] = val9;
        dvc.mySpecificProbArray[p][1] = parseFloat(dvc.myCurrentAge) + parseFloat(val9);
    }

    dvc.LEfull       = parseFloat(dvc.EX_LEprobArray[0])+parseFloat(dvc.myCurrentAge);

    // console.log("Calculated life expectancy for " + dvc.myCurrentAge + " year old " + dvc.selectedGender + " (full precision):", dvc.LEfull);

    dvc.LE           = Math.floor(dvc.LEfull);
    dvc.yearsFromNow = Math.round(dvc.LE - dvc.myCurrentAge);
    dvc.pc25         = parseFloat(dvc.mySpecificProbArray[1][0]).toFixed(2);
    dvc.pc10         = parseFloat(dvc.mySpecificProbArray[2][0]).toFixed(2);
    dvc.var1         = parseFloat(dvc.mySpecificProbArray[1][0]).toFixed(0);
    dvc.var2         = parseFloat(dvc.mySpecificProbArray[2][0]).toFixed(0);

    // ============================================================
    // Calculate target slots with conditional fallbacks
    // ============================================================
    // mySpecificProbArray[*][0] stores the interpolated target age.
    var oneInFourAgeRaw = parseFloat(dvc.mySpecificProbArray[1][0]);
    var oneInTenAgeRaw = parseFloat(dvc.mySpecificProbArray[2][0]);
    var oneInFourAge = Math.floor(oneInFourAgeRaw);
    var oneInTenAge = Math.floor(oneInTenAgeRaw);

    function buildProbabilitySlot(targetAge, divId) {
        var prob = calculateProbabilityForAge(targetAge);
        if (prob === null) return null;
        return {
            divId: divId,
            age: targetAge,
            markerAge: targetAge,
            caption: prob + "% chance",
            accText: "There is a " + prob + " percent chance you will live to " + targetAge + " years.",
            markerProb: parseFloat(prob)
        };
    }

    dvc.targetAgeResults = [];

    // Slot 1 (actualDiv): SPA probability — only show when strictly below SPA.
    // Age 66 (where SPA === currentAge) returns 100% which is uninformative, so hide.
    // Ages 67+ previously showed 1-in-4 which is also removed per requirements.
    if (myAge >= mySPAAge) {
        dvc.targetAgeResults[0] = null;
    } else {
        dvc.targetAgeResults[0] = buildProbabilitySlot(mySPAAge, "actualDiv");
    }

    // Slot 2 (natDiv): age-90 probability — hide from age 90 onwards.
    if (myAge >= 90) {
        dvc.targetAgeResults[1] = null;
    } else {
        dvc.targetAgeResults[1] = buildProbabilitySlot(90, "natDiv");
    }

    // Slot 3 (guessDiv): age-100 probability — hide from age 100 onwards.
    if (myAge >= 100) {
        dvc.targetAgeResults[2] = null;
    } else {
        dvc.targetAgeResults[2] = buildProbabilitySlot(100, "guessDiv");
    }

    // First two slots drive chart markers in target mode.
    dvc.chartMarkers = [dvc.targetAgeResults[0], dvc.targetAgeResults[1]];

    // Order visible probability blocks by decreasing chance while keeping each block's own colour mapping.
    (function orderProbabilityBlocks() {
        var pictoTextEl = document.getElementById("pictoText");
        if (!pictoTextEl) return;

        var chancesByDiv = {
            actualDiv: Number.NEGATIVE_INFINITY,
            natDiv: Number.NEGATIVE_INFINITY,
            guessDiv: Number.NEGATIVE_INFINITY
        };

        if (config.probabilityMode === "targetAges" && dvc.targetAgeResults) {
            dvc.targetAgeResults.forEach(function (result) {
                if (!result || !result.divId) return;
                chancesByDiv[result.divId] = parseFloat(result.markerProb);
            });
        } else {
            chancesByDiv.actualDiv = 25;
            chancesByDiv.natDiv = 10;
            chancesByDiv.guessDiv = parseFloat(dvc.hundredYearProb && dvc.hundredYearProb[0]);
        }

        var defaultOrder = { actualDiv: 0, natDiv: 1, guessDiv: 2 };
        var orderedIds = ["actualDiv", "natDiv", "guessDiv"].sort(function (a, b) {
            var chanceA = isNaN(chancesByDiv[a]) ? Number.NEGATIVE_INFINITY : chancesByDiv[a];
            var chanceB = isNaN(chancesByDiv[b]) ? Number.NEGATIVE_INFINITY : chancesByDiv[b];
            if (chanceB !== chanceA) return chanceB - chanceA;
            return defaultOrder[a] - defaultOrder[b];
        });

        orderedIds.forEach(function (id) {
            var el = document.getElementById(id);
            if (el && el.parentNode === pictoTextEl) {
                pictoTextEl.appendChild(el);
            }
        });
    })();

    setText("LE",      dvc.LE + " years");
    setText("acc_LE",  "Your average life expectancy is " + dvc.LE + " years.");
    setText("acc_25pc","However there's a chance you might live longer. There is a 1 in 4 chance you will live to " + dvc.var1 + " years.");
    setText("acc_10pc","There is a 1 in 10 chance you will live to " + dvc.var2 + " years.");
    setText("introLine4","Chance of " + dvc.selectedGender + " aged " + dvc.myCurrentAge + " years living to\u2026");

    // If current age is at/below SPA, style actualDiv text and dot to match SPA marker.
    var isUnderOrAtSPA = parseInt(dvc.myCurrentAge, 10) <= parseInt(dvc.SPAtoUse, 10);
    var spaColour = config.colours.spa || "#000000";
    var actualTextColour = isUnderOrAtSPA ? spaColour : config.colours.oneInFour;

    var pictoActualLabelEl = document.getElementById("pictoActualLabel");
    var pictoActualValueEl = document.getElementById("pictoActualValue");
    var actualCaptionEl = document.querySelector("#actualDiv .valuet");
    var actualDotEl = document.querySelector("#actualDiv .oneinfour");

    if (pictoActualLabelEl) pictoActualLabelEl.style.color = actualTextColour;
    if (pictoActualValueEl) pictoActualValueEl.style.color = actualTextColour;
    if (actualCaptionEl) actualCaptionEl.style.color = actualTextColour;

    if (actualDotEl) {
        actualDotEl.style.backgroundColor = isUnderOrAtSPA ? "#ffffff" : config.colours.oneInFour;
        actualDotEl.style.border = isUnderOrAtSPA ? ("4px solid " + spaColour) : "none";
        actualDotEl.style.boxSizing = "border-box";
    }

    var showActual = (dvc.targetAgeResults[0] != null);
    var showNat    = (dvc.targetAgeResults[1] != null);
    var showGuess  = (dvc.targetAgeResults[2] != null);

    dvc.visibleProbabilitySlots = {
        actual: showActual,
        nat: showNat,
        guess: showGuess
    };

    d3.select("#actualDiv").attr("class", "labels col-sm-4 col-xs-6 " + (showActual ? "show" : "hide"));
    d3.select("#natDiv").attr("class",    "labels col-sm-4 col-xs-6 " + (showNat    ? "show" : "hide"));
    d3.select("#guessDiv").attr("class",  "labels col-sm-4 col-xs-6 " + (showGuess  ? "hidden-xs" : "hide"));

    if (config.probabilityMode !== "targetAges" && showGuess) {
        setText("pictoGuessValue", dvc.hundredYearProb[0] + "% chance");
        setText("acc_100", "There is a " + dvc.hundredYearProb[0] + " percent chance you will live to 100.");
    }

    // Hide the "living to..." heading and probability box container when no boxes are shown
    if (!showActual && !showNat && !showGuess) {
        hide("introLine4");
        hide("pictoText");
    }

    // Clear accessibility text for hidden slots
    if (!showActual) setText("acc_25pc", "");
    if (!showNat)    setText("acc_10pc", "");
    if (!showGuess)  setText("acc_100", "");

    setText("pictoActualValue", dvc.var1 + "<span class='spanClass'> years</span>");
    setText("pictoNatValue",    dvc.var2 + "<span class='spanClass'> years</span>");

    // ============================================================
    // Display either percentile results or target age results
    // ============================================================
    if (config.probabilityMode === "targetAges" && dvc.targetAgeResults && dvc.targetAgeResults.length > 0) {
        // Display target age probabilities in existing three slots
        var slotMap = {
            actualDiv: { valueId: "pictoActualValue", captionSelector: "#actualDiv .valuet" },
            natDiv:    { valueId: "pictoNatValue",    captionSelector: "#natDiv .valuet" },
            guessDiv:  { valueId: "pictoStatic",      captionSelector: "#guessDiv .valuet" }
        };

        var accByDiv = {};
        dvc.targetAgeResults.forEach(function(result) {
            if (result) {
                var slot = slotMap[result.divId];
                if (!slot) return;

                setText(slot.valueId, result.age + "<span class='spanClass'> years</span>");

                var captionEl = document.querySelector(slot.captionSelector);
                if (captionEl) {
                    captionEl.textContent = result.caption;
                }

                accByDiv[result.divId] = result.accText;
            }
        });

        if (accByDiv.actualDiv) setText("acc_25pc", accByDiv.actualDiv);
        if (accByDiv.natDiv) setText("acc_10pc", accByDiv.natDiv);
        if (accByDiv.guessDiv) {
            setText("acc_100", accByDiv.guessDiv);
        } else if (myAge >= 100) {
            setText("acc_100", "");
        }
    }
    // else: keep percentile display (current behavior)

    // Populate share URL textarea
    var shareUrl = "https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/healthandlifeexpectancies/articles/lifeexpectancycalculator/2019-06-07";
    var shareUrlTextarea = document.getElementById("shareUrl");
    if (shareUrlTextarea) {
        shareUrlTextarea.value = shareUrl;
    }

    // Attach click listener to copy button
    var copyButton = document.getElementById("copyButton");
    if (copyButton) {
        copyButton.removeEventListener("click", copyLink);
        copyButton.addEventListener("click", copyLink);
    }

    makeChart();
    requestAnimationFrame(function () {
        requestAnimationFrame(function () { pymChild.sendHeight(); });
    });
}

// ============================================================
// makeChart — D3 v6 chart render
// ============================================================
function makeChart() {

    document.getElementById("chart").innerHTML = "";
    document.getElementById("picto").innerHTML = "";

    d3.select("#tweetSub").attr("class", "col-sm-12 col-xs-12 show");

    var size = initialise("lg", {
        mobileBreakpoint: config.breakpoints.mobile,
        mediumBreakpoint: config.breakpoints.medium
    });

    margin = size === "sm" ? config.margin.sm : config.margin.lg;

    var containerWidth = parseInt(d3.select("#picto").style("width"), 10);
    var chartBaseWidth = Math.min(containerWidth, config.chartDesignWidth);
    var width = Math.max(260, chartBaseWidth - margin.left - margin.right);
    var height;

    var ar = config.aspectRatio[size]
    height = Math.ceil((width * ar[1]) / ar[0]) - margin.top - margin.bottom + 40;
    // if (size === "sm") {
    //     height = 160;
    // } else {
    //     var ar = config.aspectRatio.lg;
    //     height = Math.ceil((width * ar[1]) / ar[0]) - margin.top - margin.bottom + 40;
    // }

    var num_ticks = size === "sm" ? 5 : 10;

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x)
        .tickFormat(d3.format(",.0f"))
        .tickPadding(10)
        .ticks(num_ticks);

    var yAxis = d3.axisLeft(y)
        .ticks(num_ticks)
        .tickPadding(10)
        .tickValues([25, 50, 75, 100])
        .tickSize(-width);

    var line = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.close); });

    var area = d3.area()
        .x(function (d) { return x(d.date); })
        .y0(height)
        .y1(function (d) { return y(d.close); });

    var svgDocP = d3.select("#picto").append("svg")
        .attr("id", "svgpicto")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom)
        .style("background-color", "#fff")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svgDocP.append("defs")
        .append("clipPath").attr("id", "clip")
        .append("rect").attr("width", width).attr("height", height);

    var arrData = dvc.LXL0_LEprobArray.map(function (v, i) { return [dvc.ageArray[i], v]; });
    arrData.forEach(function (d) { if (isNaN(d[1])) d[1] = 0; });
    var data = arrData.map(function (d) { return { date: d[0], close: d[1] }; });

    y.domain([0, 100]);
    x.domain([dvc.myCurrentAge, 125]);

    // X axis
    svgDocP.append("g")
        .attr("class", "x axis").attr("id", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "graphText").attr("id", "xAxisTitle")
        .attr("transform", "translate(" + width + ", 30)")
        .attr("y", 6).attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Age");

    // Y axis
    svgDocP.append("g")
        .attr("class", "y axis").attr("id", "yAxis")
        .call(yAxis)
        .append("text")
        .attr("class", "graphText").attr("id", "yAxisTitle")
        .attr("transform", "translate(-30, -30)")
        .attr("y", 0).attr("dy", ".71em")
        .style("text-anchor", "start")
        .text("Chance of reaching age (%)");

    // Area fill
    svgDocP.append("path")
        .datum(data).attr("class", "area")
        .style("fill", dvc.plineColor).style("opacity", 0.1)
        .attr("d", area);

    // Probability curve
    svgDocP.append("path")
        .datum(data).attr("stroke", dvc.plineColor)
        .attr("class", "line").attr("id", "probabilityLine")
        .attr("d", line);

    var marker1Age = parseFloat(dvc.pc25);
    var marker1Prob = 25;
    var marker1Label = dvc.var1 + " years";
    var marker2Age = parseFloat(dvc.pc10);
    var marker2Prob = 10;
    var marker2Label = dvc.var2 + " years";
    var marker3Age = null;
    var marker3Prob = null;
    var marker3Label = null;

    var showMarker1 = true;
    var showMarker2 = true;
    var showMarker3 = true;

    function isElementRendered(elementId) {
        var el = document.getElementById(elementId);
        if (!el) return false;
        return window.getComputedStyle(el).display !== "none";
    }

    if (dvc.visibleProbabilitySlots) {
        showMarker1 = !!dvc.visibleProbabilitySlots.actual;
        showMarker2 = !!dvc.visibleProbabilitySlots.nat;
        showMarker3 = !!dvc.visibleProbabilitySlots.guess;
    }

    // Keep chart markers in sync with box visibility at current responsive breakpoint.
    showMarker1 = showMarker1 && isElementRendered("actualDiv");
    showMarker2 = showMarker2 && isElementRendered("natDiv");
    showMarker3 = showMarker3 && isElementRendered("guessDiv");

    if (config.probabilityMode === "targetAges" && dvc.chartMarkers && dvc.chartMarkers.length > 0) {
        if (dvc.chartMarkers[0]) {
            marker1Age = parseFloat(dvc.chartMarkers[0].markerAge !== undefined ? dvc.chartMarkers[0].markerAge : dvc.chartMarkers[0].age);
            marker1Prob = parseFloat(dvc.chartMarkers[0].markerProb);
            marker1Label = dvc.chartMarkers[0].age + " years";
        }

        if (dvc.chartMarkers[1]) {
            marker2Age = parseFloat(dvc.chartMarkers[1].markerAge !== undefined ? dvc.chartMarkers[1].markerAge : dvc.chartMarkers[1].age);
            marker2Prob = parseFloat(dvc.chartMarkers[1].markerProb);
            marker2Label = dvc.chartMarkers[1].age + " years";
        }

        // Optional 100-year marker: present only when 100 target slot is active.
        if (dvc.targetAgeResults && dvc.targetAgeResults[2]) {
            marker3Age = parseFloat(dvc.targetAgeResults[2].markerAge !== undefined ? dvc.targetAgeResults[2].markerAge : dvc.targetAgeResults[2].age);
            marker3Prob = parseFloat(dvc.targetAgeResults[2].markerProb);
            marker3Label = dvc.targetAgeResults[2].age + " years";
        }
    }

    // 1-in-4 circles and label
    // svgDocP.append("circle").attr("id", "circle25pc")
    //     .attr("cx", x(dvc.pc25)).attr("cy", y(25)).attr("r", 12)
    //     .style("fill-opacity", 0).style("stroke", config.colours.oneInFour)
    //     .style("stroke-width", "2px").style("stroke-dasharray", "5,5");

    if (showMarker1) {
        svgDocP.append("circle").attr("id", "innerCircle25pc")
            .attr("cx", x(marker1Age)).attr("cy", y(marker1Prob)).attr("r", 7)
            .style("fill", config.colours.oneInFour).style("stroke", config.colours.oneInFour)
            .style("stroke-width", "4px");

        if (parseInt(dvc.myCurrentAge, 10) > parseInt(dvc.SPAtoUse, 10)) {
            svgDocP.append("text").attr("id", "OneInFourLabel")
                .attr("x", x(marker1Age) + 7).attr("y", y(marker1Prob) - 7)
                .style("fill", config.colours.oneInFour).style("stroke-width", "0px")
                .style("font-weight", "bold").text(marker1Label);
        }
    }

    // 1-in-10 circles and label
    // svgDocP.append("circle").attr("id", "circle10pc")
    //     .attr("cx", x(dvc.pc10)).attr("cy", y(10)).attr("r", 12)
    //     .style("fill-opacity", 0).style("stroke", config.colours.oneInTen)
    //     .style("stroke-width", "2px").style("stroke-dasharray", "5,5");

    if (showMarker2) {
        svgDocP.append("circle").attr("id", "innerCircle10pc")
            .attr("cx", x(marker2Age)).attr("cy", y(marker2Prob)).attr("r", 7)
            .style("fill", config.colours.oneInTen).style("stroke", config.colours.oneInTen)
            .style("stroke-width", "4px");

        svgDocP.append("text").attr("id", "OneInTenLabel")
            .attr("x", x(marker2Age) + 7).attr("y", y(marker2Prob) - 7)
            .style("fill", config.colours.oneInTenText || "#F66068").style("stroke-width", "0px")
            .style("font-weight", "bold").text(marker2Label);
    }

    if (config.probabilityMode === "targetAges" && showMarker3 && marker3Age !== null && marker3Prob !== null) {
        svgDocP.append("circle").attr("id", "innerCircle100")
            .attr("cx", x(marker3Age)).attr("cy", y(marker3Prob)).attr("r", 7)
            .style("fill", config.colours.leLine).style("stroke", config.colours.leLine)
            .style("stroke-width", "4px");

        svgDocP.append("text").attr("id", "OneHundredLabel")
            .attr("x", x(marker3Age) + 7).attr("y", y(marker3Prob) - 7)
            .style("fill", config.colours.leLine).style("stroke-width", "0px")
            .style("font-weight", "bold").text(marker3Label);
    }

    // State Pension Age marker
    var showSPAMarker = parseInt(dvc.myCurrentAge, 10) <= parseInt(dvc.SPAtoUse, 10);
    if (dvc.visibleProbabilitySlots) {
        showSPAMarker = showSPAMarker && !!dvc.visibleProbabilitySlots.actual;
    }
    showSPAMarker = showSPAMarker && isElementRendered("actualDiv");

    if (showSPAMarker) {
        var spaX = x(dvc.SPAtoUse);
        var leX = x(dvc.LE);
        var spaLabelX = spaX;
        var spaAnchor = "middle";

        // If SPA and LE lines are close, push SPA label away from the LE line.
        if (Math.abs(spaX - leX) < 80) {
            if (spaX <= leX) {
                spaAnchor = "end";
                spaLabelX = spaX - 10;
            } else {
                spaAnchor = "start";
                spaLabelX = spaX + 10;
            }
        }

        svgDocP.append("circle").attr("id", "innercircleSPA")
            .attr("cx", x(dvc.SPAtoUse)).attr("cy", y(dvc.SPAProb[0])).attr("r", 7)
            .style("fill", "#fff").style("stroke", config.colours.spa || "#000000").style("stroke-width", "4px");

        var spaText = svgDocP.append("text")
            .attr("class", "graphSubText1 legendHide").attr("id", "idYourSPA")
            .attr("x", spaLabelX).attr("y", y(dvc.SPAProb[0]) + 33)
            .style("text-anchor", spaAnchor)
            .style("fill", config.colours.spa || "#000000");
        addTspans(spaText, [dvc.SPAtoUse + " years", "State pension", "age"], 20);
        d3.select("#idYourSPA").selectAll("tspan")
            .attr("x", spaLabelX)
            .attr("font-weight", function (d, i) { return i < 1 ? 700 : 400; });
    }

    // Centreline
    svgDocP.append("line").attr("id", "centreline")
        .attr("y1", y(0)).attr("y2", y(0)).attr("x1", -5).attr("x2", width);

    // Average LE vertical line
    svgDocP.append("line")
        .attr("class", "vertLines").attr("id", "LELine")
        .attr("y1", y(0)).attr("y2", y(100))
        .attr("x1", x(dvc.LE)).attr("x2", x(dvc.LE))
        .style("pointer-events", "none");

    // Average LE label
    var leText = svgDocP.append("text")
        .attr("class", "graphSubText legendHide").attr("id", "idYourLE")
        .attr("x", x(dvc.LE) + 7).attr("y", 15)
        .style("text-anchor", "left").attr("fill", config.colours.leLine);
    addTspans(leText, [dvc.LE + " years", "Average life", "expectancy"], 20);
    d3.select("#idYourLE").selectAll("tspan")
        .attr("x", x(dvc.LE) + 7)
        .attr("font-weight", function (d, i) { return i < 1 ? 700 : 400; });

    requestAnimationFrame(function () {
        requestAnimationFrame(function () { pymChild.sendHeight(); });
    });
}

// ============================================================
// onblurYourAge — validate age input
// ============================================================
function onblurYourAge() {
    var valueToCheck = document.getElementById("currentAge").value;
    var parsedAge = Number(valueToCheck);
    dvc.boolHasError = false;
    clearAgeError();
    requestAnimationFrame(function () { pymChild.sendHeight(); });

    if (valueToCheck === "") {
        d3.select("#submitButton").attr("cursor", "default");
    } else if (/^-?[0-9]{1,3}$/.test(valueToCheck) && parsedAge >= 0 && parsedAge <= 100) {
        d3.select("#submitButton").attr("cursor", "default");
    } else {
        dvc.boolHasError = true;
        showAgeError();
        requestAnimationFrame(function () { pymChild.sendHeight(); });
    }

    updateCompareButtonState();
}

// ============================================================
// calculateProbabilityForAge — Get probability of reaching target age
// ============================================================
function calculateProbabilityForAge(targetAge) {
    // If target age is already reached, probability is 100%.
    if (targetAge <= dvc.myCurrentAge) return "100.0";
    if (targetAge > 125) return null;
    var index = targetAge - dvc.myCurrentAge;
    if (index >= dvc.LXL0_LEprobArray.length) return null;
    return parseFloat(dvc.LXL0_LEprobArray[index]).toFixed(1);
}

// ============================================================
// Copy link functionality
// ============================================================
function copyLink() {
    var textarea = document.getElementById("shareUrl");
    if (!textarea) return;
    
    textarea.select();
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textarea.value).then(function () {
            showCopyConfirmation();
        }).catch(function () {
            // Fallback
            fallbackCopy(textarea);
        });
    } else {
        fallbackCopy(textarea);
    }
}

function fallbackCopy(textarea) {
    document.execCommand("copy");
    showCopyConfirmation();
}

function showCopyConfirmation() {
    var tooltip = document.getElementById("copyTooltip");
    if (tooltip) {
        tooltip.style.display = "block";
        setTimeout(function () { tooltip.style.display = "none"; }, 2000);
    }
}


