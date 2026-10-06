(async function () {
  const pymChild = new pym.Child();

  const LAND_FILL = "#eef2f6";
  const NO_DATA_COLOUR = "#e2e2e3";
  const NO_DATA_STRIPE = "#d5d5d6";
  const SYMBOL_FILL = "#27A0CC";

  const COUNTRY_ALIASES = {
    bahamasthe: "bahamas",
    brunei: "bruneidarussalam",
    capeverde: "caboverde",
    czechrepublic: "czechia",
    koreanorth: "northkorea",
    moldova: "republicofmoldova",
    russia: "russianfederation",
    tanzania: "unitedrepublicoftanzania",
    turkey: "turkiye",
    venezuela: "venezuelabolivarianrepublicof"
  };

  const DISPLAY_NAME_OVERRIDES = {
    // CSV name_clean fixes (countries with data)
    bahamas: "The Bahamas",
    bruneidarussalam: "Brunei",
    caboverde: "Cape Verde",
    costarice: "Costa Rica",
    britishvirginislands: "British Virgin Islands",
    morocco: "Morocco incl. Western Sahara",
    papuanewguinea: "Papua New Guinea",
    republicofmoldova: "Moldova",
    russianfederation: "Russia",
    sainthelena: "St. Helena",
    saintlucia: "St Lucia",
    saintvincentandthegrenadines: "St Vincent",
    sierraleone: "Sierra Leone",
    turkiye: "Turkey",
    unitedrepublicoftanzania: "Tanzania",
    unitedstatesofamerica: "United States incl. Puerto Rico",
    venezuelabolivarianrepublicof: "Venezuela",
    // GeoJSON name fixes (no-data countries)
    congodemocratic: "Congo (Democratic Republic)",
    congorepublic: "Congo",
    easttimortimorleste: "East Timor",
    frenchsouthernandantarcticlands: "French Southern Territories",
    gambia: "The Gambia",
    gazastrip: "Occupied Palestinian Territory",
    guineabissauguineabissau: "Guinea Bissau",
    heardislandandmcdonaldislands: "Heard and McDonald Islands",
    hongkongsar: "Hong Kong",
    ivorycoastcotedivoire: "Ivory Coast",
    koreasouth: "South Korea",
    macausar: "Macao",
    macedoniatheformeryugoslavrepublicof: "North Macedonia",
    marianaislandsnorthern: "Northern Mariana Islands",
    micronesiafederatedstatesof: "Micronesia",
    myanmar: "Myanmar (Burma)",
    niue: "Niue Island",
    pitcairnislands: "Pitcairn",
    saintkittsandnevis: "St Kitts and Nevis",
    southgeorgiaandtheislands: "South Georgia",
    swaziland: "Eswatini",
    unitedstatesminoroutlyingislands: "US Minor Outlying Islands",
    unitedstatesvirginislands: "US Virgin Islands",
    vaticanholysea: "Vatican City",
    westbank: "Occupied Palestinian Territory",
    westernsahara: "Morocco incl. Western Sahara"
  };

  // Use mainland coordinates where geo centroid is distorted by overseas territories.
  const SYMBOL_COORD_OVERRIDES = {
    france: [2.5, 46.5]
  };

  const tooltip = createScatterStyleTooltip();
  const sizeParam = new URLSearchParams(window.location.search).get("size");
  const mobileCountryInfo = d3.select("#mobileCountryInfo");
  const mobileCountryInfoTitle = d3.select("#mobileCountryInfoTitle");
  const mobileCountryInfoValue = d3.select("#mobileCountryInfoValue");
  const mobileCountryInfoClose = d3.select("#mobileCountryInfoClose");

  let rawData, geog;
  try {
    [rawData, geog] = await Promise.all([
      d3.csv(config.dataUrl),
      d3.json(config.geoUrl)
    ]);
  } catch (error) {
    d3.select("#accessibility p").text("Unable to load map data.");
    throw error;
  }

  initialiseVisuals(rawData, geog);

  function initialiseVisuals(rawData, geog) {
    const countryRows = rawData.filter(d =>
      d.Geography_level === "Country" && d.Sex === "Both"
    );
    const latestYear = d3.max(countryRows, d => +d.Year);
    const latestRows = countryRows.filter(d => +d.Year === latestYear);

    const dataCountries = latestRows
      .map(d => {
        const name = getCanonicalCountryName(d);
        const value = +(d.Value || d.value);
        if (!name || !isFinite(value)) return null;
        const key = normaliseCountryName(name);
        return { key, name, displayName: getDisplayCountryName(key, name), value };
      })
      .filter(d => d && d.key);

    const positiveValues = dataCountries.map(d => d.value).filter(v => v > 0);
    const valueByCountry = {};
    const mapFeatures = topojson.feature(geog, geog.objects[config.geoLayer]).features;
    const maxValue = d3.max(positiveValues) || 1;
    let activeNoDataSelection = null;
    let mapSelection = null;
    let symbolSelection = null;

    dataCountries.forEach(d => { valueByCountry[d.key] = d; });

    mapFeatures.forEach(feature => {
      const topoKey = normaliseCountryName(feature.properties.name);
      feature.dataKey = COUNTRY_ALIASES[topoKey] || topoKey;
      feature.countryData = valueByCountry[feature.dataKey] || null;
    });

    d3.select("#subtitle").html(
      "Countries are shown with circles centred on each country. Circle area is proportional to the <code>value</code> column for <strong>" +
      latestYear +
      "</strong>, and smaller circles are drawn last so they stay visible."
    );

    d3.select("#accessibleSummary").text(
      config.accessibleSummary || `World map with proportional circles. Latest year shown: ${latestYear}.`
    );

    d3.select("#source").text(config.sourceText || "");

    renderMap();
    updateStatus();

    window.addEventListener("resize", debounce(() => {
      renderMap();
      hideTooltip();
      if (!isSmallView()) {
        hideMobileCountryInfo();
      }
      if (pymChild) pymChild.sendHeight();
    }, 150));

    function renderMap() {
      const mapDiv = d3.select("#mapDiv");
      const containerWidth = Math.max(1, Math.round(mapDiv.node().getBoundingClientRect().width));
      const width = containerWidth;
      const featureCollection = { type: "FeatureCollection", features: mapFeatures };
      const mapPadding = 8;
      let height = Math.max(220, Math.round(width * 0.58));

      const projection = d3.geoNaturalEarth1();
      projection.fitExtent(
        [[mapPadding, mapPadding], [width - mapPadding, height - mapPadding]],
        featureCollection
      );

      let path = d3.geoPath().projection(projection);
      const fittedBounds = path.bounds(featureCollection);
      height = Math.max(220, Math.round((fittedBounds[1][1] - fittedBounds[0][1]) + (mapPadding * 2)));

      projection.fitExtent(
        [[mapPadding, mapPadding], [width - mapPadding, height - mapPadding]],
        featureCollection
      );
      path = d3.geoPath().projection(projection);
      mapDiv.style("height", `${height}px`);
      const maxRadius = Math.max(10, Math.min(38, width * 0.032));
      const radiusScale = d3.scaleSqrt()
        .domain([0, maxValue])
        .range([0, maxRadius]);

      mapDiv.selectAll("*").remove();

      const symbolData = mapFeatures
        .filter(feature => feature.countryData && feature.countryData.value > 0)
        .map(feature => {
          const coordOverride = SYMBOL_COORD_OVERRIDES[feature.countryData.key];
          const centroid = projection(coordOverride || d3.geoCentroid(feature));
          if (!centroid || !isFinite(centroid[0]) || !isFinite(centroid[1])) return null;
          return {
            key: feature.countryData.key,
            name: feature.countryData.displayName,
            value: feature.countryData.value,
            x: centroid[0],
            y: centroid[1]
          };
        })
        .filter(d => d !== null)
        .sort((a, b) => d3.descending(a.value, b.value));

      const svg = mapDiv.append("svg")
        .attr("aria-hidden", "true")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      if (!mobileCountryInfoClose.empty()) {
        mobileCountryInfoClose.on("click", function () {
          clearLinkedHighlight();
          updateStatus();
          hideMobileCountryInfo();
        });
      }

      svg.on("click", function (event) {
        if (!isSmallView()) return;
        if (event.target === this) {
          clearLinkedHighlight();
          updateStatus();
          hideMobileCountryInfo();
        }
      });

      const defs = svg.append("defs");
      const pattern = defs.append("pattern")
        .attr("id", "noDataPattern")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 8)
        .attr("height", 8);

      pattern.append("rect")
        .attr("width", 8)
        .attr("height", 8)
        .attr("fill", NO_DATA_COLOUR);

      pattern.append("path")
        .attr("d", "M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4")
        .attr("stroke", NO_DATA_STRIPE)
        .attr("stroke-width", 2);

      const landLayer = svg.append("g").attr("class", "allcountry");

      mapSelection = landLayer.selectAll("path")
        .data(mapFeatures)
        .enter()
        .append("path")
        .attr("class", "countries")
        .attr("data-country-key", d => d.countryData ? d.countryData.key : "")
        .attr("d", path)
        .attr("fill", d => d.countryData ? LAND_FILL : "url(#noDataPattern)")
        .on("mouseover", function (event, d) {
          if (isSmallView()) return;
          if (d.countryData) {
            setActiveCountry(d.countryData.key);
            showTooltip({
              name: d.countryData.displayName,
              valueText: `British residents: ${formatValue(d.countryData.value)}`
            }, event);
          } else {
            clearLinkedHighlight();
            activeNoDataSelection = d3.select(this).classed("is-hovered", true);
            updateStatus({ name: d.properties.name, value: null });
            showTooltip({
              name: getDisplayCountryName(normaliseCountryName(d.properties.name), d.properties.name),
              valueText: "No data"
            }, event);
          }
        })
        .on("mousemove", function (event) {
          if (isSmallView()) return;
          positionTooltip(event);
        })
        .on("mouseout", function () {
          if (isSmallView()) return;
          clearLinkedHighlight();
          updateStatus();
          hideTooltip();
        })
        .on("click", function (event, d) {
          if (!isSmallView()) return;
          event.stopPropagation();

          if (d.countryData) {
            setActiveCountry(d.countryData.key);
            showMobileCountryInfo({
              name: d.countryData.displayName,
              valueText: `British residents: ${formatValue(d.countryData.value)}`
            });
          } else {
            clearLinkedHighlight();
            activeNoDataSelection = d3.select(this).classed("is-hovered", true);
            updateStatus({ name: d.properties.name, value: null });
            showMobileCountryInfo({
              name: getDisplayCountryName(normaliseCountryName(d.properties.name), d.properties.name),
              valueText: "No data"
            });
          }
        });

      mapSelection.append("title")
        .text(d => {
          const label = d.countryData ? d.countryData.displayName : d.properties.name;
          return d.countryData
            ? `${label}: ${formatValue(d.countryData.value)}`
            : `${label}: No data`;
        });

      const symbolLayer = svg.append("g").attr("class", "symbol-layer");

      symbolSelection = symbolLayer.selectAll("circle")
        .data(symbolData)
        .enter()
        .append("circle")
        .attr("class", "country-symbol")
        .attr("data-country-key", d => d.key)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => radiusScale(d.value))
        .attr("fill", SYMBOL_FILL)
        .attr("fill-opacity", 0.75)
        .attr("stroke", SYMBOL_FILL)
        .attr("stroke-width", 1)
        .on("mouseover", function (event, d) {
          if (isSmallView()) return;
          setActiveCountry(d.key);
          showTooltip({
            name: d.name,
            valueText: `British residents: ${formatValue(d.value)}`
          }, event);
        })
        .on("mousemove", function (event) {
          if (isSmallView()) return;
          positionTooltip(event);
        })
        .on("mouseout", function () {
          if (isSmallView()) return;
          clearLinkedHighlight();
          updateStatus();
          hideTooltip();
        })
        .on("click", function (event, d) {
          if (!isSmallView()) return;
          event.stopPropagation();
          setActiveCountry(d.key);
          showMobileCountryInfo({
            name: d.name,
            valueText: `British residents: ${formatValue(d.value)}`
          });
        });

      symbolSelection.append("title")
        .text(d => `${d.name}: ${formatValue(d.value)}`);

      renderLegend(radiusScale, maxValue);

      if (pymChild) pymChild.sendHeight();
    }

    function setActiveCountry(countryKey) {
      const countryData = valueByCountry[countryKey];
      clearLinkedHighlight();
      if (!countryData) { updateStatus(); return; }

      if (mapSelection) {
        mapSelection
          .filter(d => d.countryData && d.countryData.key === countryKey)
          .classed("is-hovered", true);
      }

      if (symbolSelection) {
        symbolSelection
          .filter(d => d.key === countryKey)
          .classed("is-hovered", true)
          .raise();
      }

      updateStatus({ ...countryData, name: countryData.displayName });
    }

    function clearLinkedHighlight() {
      if (mapSelection) mapSelection.classed("is-hovered", false);
      if (symbolSelection) symbolSelection.classed("is-hovered", false);
      if (activeNoDataSelection) {
        activeNoDataSelection.classed("is-hovered", false);
        activeNoDataSelection = null;
      }
    }

    function updateStatus(countryData) {
      let accessibilityMessage;
      if (!countryData) {
        accessibilityMessage = `Hover over a country or circle to see its value for ${latestYear}. Circle area is proportional to the data.`;
      } else if (countryData.value === null) {
        accessibilityMessage = `${countryData.name} has no data in ${latestYear}.`;
      } else {
        accessibilityMessage = `${countryData.name} has a value of ${formatValue(countryData.value)} in ${latestYear}.`;
      }
      d3.select("#accessibility p").text(accessibilityMessage);
    }
  }

  function renderLegend(radiusScale, maxValue) {
    const legend = d3.select("#legendNoData");
    const legendValues = buildLegendValues(maxValue);

    legend.selectAll("*").remove();

    legendValues.forEach(value => {
      const diameter = Math.max(12, Math.round(radiusScale(value) * 2));
      const item = legend.append("div").attr("class", "legend-item");
      item.append("span")
        .attr("class", "legend-circle-swatch")
        .style("width", `${diameter}px`)
        .style("height", `${diameter}px`);
      item.append("span")
        .attr("class", "legend-item-label")
        .text(formatValue(value));
    });

    const noDataLegend = legend.append("div").attr("class", "legend-item");
    noDataLegend.append("span").attr("class", "legend-swatch legend-swatch-no-data");
    noDataLegend.append("span").attr("class", "legend-item-label").text("No data");

    if (pymChild) pymChild.sendHeight();
  }

  function buildLegendValues(maxValue) {
    const ticks = d3.scaleLinear()
      .domain([0, maxValue])
      .nice()
      .ticks(4)
      .filter(v => v > 0);

    const legendValues = ticks.length >= 2
      ? [ticks[0], ticks[ticks.length - 1]]
      : [maxValue / 2, maxValue];

    return legendValues
      .map(v => Math.round(v))
      .filter((v, i, arr) => v > 0 && arr.indexOf(v) === i)
      .sort((a, b) => a - b);
  }

  function normaliseCountryName(name) {
    let value = name || "";
    if (value.normalize) {
      value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return value
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\*/g, "")
      .replace(/[^a-z0-9]+/g, "");
  }

  function getCanonicalCountryName(row) {
    return [row.Name_clean, row.name_clean, row.Name, row.name]
      .find(value => typeof value === "string" && value.trim())
      ?.replace(/\*/g, "")
      .replace(/\s+/g, " ")
      .trim() || "";
  }

  function getDisplayCountryName(countryKey, fallbackName) {
    return DISPLAY_NAME_OVERRIDES[countryKey] || fallbackName;
  }

  function formatValue(value) {
    return d3.format(config.valueFormat || ",.0f")(value);
  }

  function createScatterStyleTooltip() {
    return d3
      .select("body")
      .append("div")
      .attr("class", "scatter-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "#F5F5F6")
      .style("color", "#222222")
      .style("border-radius", "4px")
      .style("padding", "8px 12px 10px 12px")
      .style("font-size", "14px")
      .style("width", "200px")
      .style("word-wrap", "break-word")
      .style("white-space", "normal")
      .style("pointer-events", "none")
      .style("z-index", "10")
      .style("box-shadow", "0 0 4px 1px rgba(136, 136, 136, 0.25)");
  }

  function showTooltip(data, event) {
    const content = `<div style="font-weight: bold; margin-bottom: 8px;">${data.name}</div><div>${data.valueText}</div>`;
    tooltip.html(content);
    positionTooltip(event);
  }

  function positionTooltip(event) {
    if (!event) return;

    const tooltipNode = tooltip.node();
    const tooltipWidth = (tooltipNode && tooltipNode.offsetWidth) ? tooltipNode.offsetWidth : 200;
    const offsetX = 10;
    const offsetY = -10;
    const viewportRight = window.scrollX + window.innerWidth;

    let left = event.pageX + offsetX;
    if (left + tooltipWidth + 12 > viewportRight) {
      left = event.pageX - tooltipWidth - offsetX;
    }

    tooltip
      .style("left", `${left}px`)
      .style("top", `${event.pageY + offsetY}px`)
      .style("visibility", "visible");
  }

  function hideTooltip() {
    tooltip.style("visibility", "hidden");
  }

  function isSmallView() {
    if (sizeParam === "sm") return true;

    const mapDivNode = d3.select("#mapDiv").node();
    const mapWidth = mapDivNode
      ? mapDivNode.getBoundingClientRect().width
      : window.innerWidth;

    return mapWidth < 600 || window.matchMedia("(max-width: 599px)").matches;
  }

  function showMobileCountryInfo(data) {
    if (mobileCountryInfo.empty()) return;

    mobileCountryInfoTitle.text(data.name || "");
    mobileCountryInfoValue.text(data.valueText || "");

    const wasVisible = mobileCountryInfo.classed("is-visible");
    mobileCountryInfo
      .classed("is-visible", true)
      .attr("aria-hidden", "false");

    if (!wasVisible && pymChild) {
      pymChild.sendHeight();
    }
  }

  function hideMobileCountryInfo() {
    if (mobileCountryInfo.empty()) return;

    const wasVisible = mobileCountryInfo.classed("is-visible");
    mobileCountryInfo
      .classed("is-visible", false)
      .attr("aria-hidden", "true");

    if (wasVisible && pymChild) {
      pymChild.sendHeight();
    }
  }

  function debounce(fn, wait) {
    let timeoutId;
    return function (...args) {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn.apply(this, args), wait);
    };
  }
})();
