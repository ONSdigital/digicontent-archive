const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.join(__dirname, "UN-migrants.csv");
const OUTPUT_FILE = path.join(__dirname, "download-data.csv");
const START_YEAR = 2015;
const END_YEAR = 2024;

const DISPLAY_NAME_OVERRIDES = {
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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        value += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        value += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      row.push(value);
      value = "";
      continue;
    }

    if (ch === "\n") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    if (ch === "\r") {
      continue;
    }

    value += ch;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  if (!rows.length) return [];

  const headers = rows[0];
  return rows.slice(1).map(cells => {
    const result = {};
    for (let i = 0; i < headers.length; i += 1) {
      result[headers[i]] = cells[i] || "";
    }
    return result;
  });
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function normaliseCountryName(name) {
  let value = name || "";
  value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\*/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function getCanonicalCountryName(row) {
  return [row.Name_clean, row.name_clean, row.Name, row.name]
    .find(v => typeof v === "string" && v.trim())
    ?.replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim() || "";
}

function getDisplayCountryName(countryKey, fallbackName) {
  return DISPLAY_NAME_OVERRIDES[countryKey] || fallbackName;
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function formatSignedInteger(value) {
  const rounded = Math.round(value);
  return rounded > 0 ? `+${rounded}` : String(rounded);
}

function main() {
  const source = fs.readFileSync(INPUT_FILE, "utf8");
  const rows = parseCsv(source);

  const countryRows = rows.filter(d =>
    d.Geography_level === "Country" && d.Sex === "Both"
  );

  const rowsByCountry = new Map();
  countryRows.forEach(row => {
    const key = normaliseCountryName(getCanonicalCountryName(row));
    if (!key) return;
    if (!rowsByCountry.has(key)) rowsByCountry.set(key, []);
    rowsByCountry.get(key).push(row);
  });

  const data = [];

  rowsByCountry.forEach((rowsForCountry, key) => {
    const startRow = rowsForCountry.find(d => toNumber(d.Year) === START_YEAR);
    const endRow = rowsForCountry.find(d => toNumber(d.Year) === END_YEAR);
    const startValue = toNumber(startRow && (startRow.Value || startRow.value));
    const endValue = toNumber(endRow && (endRow.Value || endRow.value));

    if (!startRow || !endRow || !Number.isFinite(startValue) || !Number.isFinite(endValue)) {
      return;
    }

    const fallbackName = getCanonicalCountryName(endRow) || getCanonicalCountryName(startRow);
    const changeValue = endValue - startValue;

    data.push({
      country_name: getDisplayCountryName(key, fallbackName),
      country_key: key,
      start_year: START_YEAR,
      end_year: END_YEAR,
      start_value: Math.round(startValue),
      end_value: Math.round(endValue),
      change_value: Math.round(changeValue),
      change_value_display: formatSignedInteger(changeValue),
      magnitude: Math.abs(Math.round(changeValue))
    });
  });

  data.sort((a, b) => b.magnitude - a.magnitude || a.country_name.localeCompare(b.country_name));

  const header = [
    "country_name",
    "country_key",
    "start_year",
    "end_year",
    "start_value",
    "end_value",
    "change_value",
    "change_value_display",
    "magnitude"
  ];

  const lines = [
    header,
    ...data.map(d => [
      d.country_name,
      d.country_key,
      d.start_year,
      d.end_year,
      d.start_value,
      d.end_value,
      d.change_value,
      d.change_value_display,
      d.magnitude
    ])
  ].map(row => row.map(csvEscape).join(","));

  fs.writeFileSync(OUTPUT_FILE, `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote ${data.length} rows to ${OUTPUT_FILE}`);
}

main();