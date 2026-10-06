
import { drawArrow } from "./drawArrows.js";




function keyup(e, that) {

  if (e == "Enter" || e == "Space") {
    d3.event.preventDefault();
    d3.select(that).select('input').property('checked', true)
    filterChange()
  }
}

d3.selectAll("label")
  .on("keyup", function () { keyup(d3.event.code, this) })

var pymChild = null;
pymChild = new pym.Child();
pym.Child({ renderCallback: drawgraphic })



//Friendly titles for headings and putting the domains in the right order
var domains1 = ["all", "wellbeing", "relationships", "health", "do", "live", "finance", "skills", "economy", "governance", "environment"]
var domains = [["all", "All"], ["wellbeing", "Personal well-being"], ["relationships", "Our relationships"], ["health", "Health"], ["do", "What we do"], ["live", "Where we live"], ["finance", "Personal finance"], ["skills", "Education and skills"], ["economy", "Economy"], ["governance", "Governance"], ["environment", "Environment"]]

//Putting the tiles in the right order - N.B. needs to be updated manually each time a new tile is added or one taken away
var order = [
  'lifeSat',
  'worthwhile',
  'happiness',
  'anxious',
  'hopeFuture',
  'fairTreatment',
  'satisRship',
  'satisSocial',
  'relyOn',
  'loneliness',
  'commInt',
  'trustOthers',
  'lifeExpect',
  'satisHealth',
  'physicalHealth',
  'depressionAnxiety',
  'satisHealthcare',
  'satisTime',
  'satisJob',
  'unpaidWork',
  'volunteering',
  'artsCulture',
  'sportsPart',
  'nature',
  'satisAccomm',
  'satisLocal',
  'belongNeigh',
  'digitalEx',
  'crime',
  'feelingSafe',
  'hholdIncome',
  'hholdWealth',
  'lowIncome',
  'incomeInequal',
  'genderPaygap',
  'diffFinance',
  'neet',
  'noQuals',
  'alevelQuals',
  'humanCapital',
  'satisEducation',
  'unemployment',
  'inflation',
  'publicsecDebt',
  'voterTurnout',
  'trustGov',
  'voice',
  'satisPolice',
  'satisCourts',
  'greenhouseGas',
  'renewableEnergy',
  'hholdRecycling',
  'protectedArea',
  'biodiversity',
  'airPoll',
  'waterPoll',
  'envLifestyle']

//The text bit that goes at the top of each topic area
var domainText = ["Personal well-being is the most direct representation of how people are doing. Measures in this domain cover people’s opinions on aspects of their current well-being.",
  "People's relationships can affect their well-being outcomes, including quality of life and happiness. Measures in this domain cover the presence and quality of relationships people may have with family, friends, and the community around them.",
  "Physical and mental health are important parts of people’s personal well-being. Measures in this domain cover both objective and subjective measures of health. They also cover satisfaction with the healthcare system to capture how the nation’s health is supported.",
  "Participation in, satisfaction with, and balance between work and leisure activities represent people’s lifestyle choices. Measures in this domain cover subjective and objective measures related to work, leisure and volunteering.",
  "Where people live, the quality of their local area and their community, and how they feel about it can affect personal well-being. Measures in this domain cover housing, the local environment, access to facilities, and being part of a cohesive community.",
  "How households and individuals are managing financially influences many aspects of their lives. Measures in this domain cover household income and wealth, poverty and financial inequalities, and people’s opinions about their own financial situations.",
  "Education and skills can determine individuals’ socioeconomic outcomes. Measures in this domain cover human capital, as well as qualifications and skills. They also cover satisfaction with the education system to capture how people’s education is supported.",
  "The economy affects the financial welfare of individuals, communities and the UK as a whole. Measures in this domain cover economic activity in the UK. They also cover consumer confidence to capture people’s perceptions of the country’s economic situation.",
  "Good governance contributes to better social and economic outcomes. Measures in this domain cover public trust and civic participation. They also cover satisfaction with the police and justice system to capture how public administration is supported.",
  "The natural environment is relevant to people’s quality of life because it makes human life and activity possible. Measures in this domain cover aspects of climate change, the UK’s natural environment and natural capital, and the effects of human activity on the environment."]


function createDropdown() {

  //Filter dropdown
  // d3.select("#domain_dropdown").append("label").attr("for", "dropdown").attr("class", "visuallyhidden").text("Choose a domain")

  $("#domain_dropdown").empty();

  d3.select("#domain_dropdown").insert("label")
    .attr("class", "visuallyhidden")
    .attr("for", "dropdown_child")
    .html("Inactive dropdown element, replaced by custom dropdown")

  var opts = d3.select("#domain_dropdown").append("select")
    .attr('class', "chosen-select")
    .attr('id', "dropdown_child")
    .attr("style", "width:370px")
  // .on("change", function () {
  // })

  // opts.append("option")
  // 	.attr("value", "first")
  // 	.text("");

  opts.selectAll("p")
    .data(domains)
    .enter()
    .append('option')
    .attr('domain_filter', function (d, i) { return domains[i][0] })
    .text(function (d, i) { return (domains[i][1]) })
  $('#dropdown_child').chosen({
    "disable_search": true,
    placeholder_text_single: "All"

  })

  d3.select('input.chosen-search-input').attr('id', 'chosensearchinput')
  d3.select('div.chosen-search').insert('label', 'input.chosen-search-input')
    .attr('class', 'visuallyhidden')
    .attr('for', 'chosensearchinput')
  // .html("Select a variable")

  $('#dropdown_child').on('change', function (evt, params) {

    d3.select("#selected_var").text($("#dropdown_child option:selected").val())

    setDomain()

  });
}

function setDomain() {


  var domain_select = document.querySelector("#dropdown_child")


  var domain_filter_code = domain_select.options[domain_select.selectedIndex].getAttribute("domain_filter")


  d3.selectAll(".topic").style("display", "none")

  d3.selectAll("." + domain_filter_code + "-head").style("display", "block")

  //This works because of the order of the classes - I think
  d3.selectAll("." + domain_filter_code + "domain" + "." + displayRadioValue()).style("display", "block")


}




export function drawgraphic() {
  //read in l1 data and draw on load
  d3.csv("./datatext.csv", function (error, data) {
    var graphic_data_l1 = data;
    drawl1(graphic_data_l1);
  });

  function drawl1(graphic_data_l1) {
    d3.select("#tileshere")
      .selectAll("*")
      .remove();

    //draw tiles


    populate1(graphic_data_l1.filter(function (d) { return true }));
  }



  function populate1(datafortiles) {

    //  datafortiles.sort((a, b) => chart.indexOf(a.measure) - chart.indexOf(b.measure))//this makes sure that the titles etc. match up to the right chart
    datafortiles.sort((a, b) => order.indexOf(a.measure) - order.indexOf(b.measure))//this makes sure that the tiles are in the right order

    console.log("Improved:", (datafortiles.filter(d => d.outlook == "Improved").length), datafortiles.filter(d => d.outlook2 == "Improved").length)
    console.log("Declined:", (datafortiles.filter(d => d.outlook == "Declined").length), datafortiles.filter(d => d.outlook2 == "Declined").length)
    console.log("No change:", (datafortiles.filter(d => d.outlook == "No change").length), datafortiles.filter(d => d.outlook2 == "No change").length)
    console.log("Not assessed:", (datafortiles.filter(d => d.outlook == "Change not assessed").length), datafortiles.filter(d => d.outlook2 == "Change not assessed").length)
    console.log("All:", datafortiles.filter(d => d.outlook).length)


    let domainsUnique = [...new Set(datafortiles.map((d) => d.topic))];

    for (let j = 0; j < domainsUnique.length; j++) {
      //filtering the data by topic areas
      let domainData = datafortiles.filter(e => e.topic == domainsUnique[j])
      let graphic = d3.select('#tileshere')

      //This is the header/divider bit between the different topic areas
      graphic.append("div")
        .attr("id", domainsUnique[j] + "-head")
        .attr("class", "topic " + domainsUnique[j] + "domain alldomain " + domainsUnique[j] + "-head all-head")
        .attr("tabindex", -1)
        .html(`<hr class="textboxUpperLine"> <div class="topTextbox"> <img alt="" src = "./icons/${domainsUnique[j]}.svg"> <div class="innerTextbox"> <h3 class="domainHeading">${domains[domains1.indexOf(domainsUnique[j])][1]}</h3><p class="domainExplainerText">${domainText[j]}</p> </div> </div>`)


      d3.select(".textboxUpperLine")
        .attr("class", "topline head " + domainsUnique[j])

      domainData.forEach(function (d, i) {

        let this_id = `${d.topic}-${d.outlook.replace(/\s+/g, '')}-${i}`

        //add top div
        d3.select("#tileshere")
          .append("div")
          .attr("aria-hidden", "true")
          .attr("id", this_id)
          .attr("class", `all alldomain thischart topic ${d.topic}domain ${d.outlook.replace(/\s+/g, '')} ${d.topic}domain ${d.outlook2.replace(/\s+/g, '')} ${d.measure} `)

        //add topline
        d3.select(`#${this_id}`)
          .append("hr")
          .attr("class", "topline " + d.topic)

        //add div second layer
        d3.select(`#${d.topic}-${d.outlook.replace(/\s+/g, '')}-${i}`)
          .append("div")
          .attr("aria-hidden", "true")
          .attr("id", "secondLayer" + this_id)
          .attr("class", "layer layer" + this_id)

        //add div third layer
        d3.select(`#${d.topic}-${d.outlook.replace(/\s+/g, '')}-${i}`)
          .append("div")
          .attr("aria-hidden", "true")
          .attr("id", "thirdLayer" + this_id)

        //add div for text elements
        d3.select(`#secondLayer${d.topic}-${d.outlook.replace(/\s+/g, '')}-${i}`)
          .append("div")
          .attr("id", "tile" + this_id)
          .attr("class", "tile tile" + this_id)

        //add container for measures and arrows
        d3.select(".tile" + this_id)
          .append("div")
          .attr("class", "containerTop containerTop" + this_id)

        //add measures
        d3.select(".containerTop" + this_id)
          .append("div")
          .attr("class", "BgColour")
          .append("div")
          .attr("class", "measure " + d.topic)
          .insert("h4")
          .text(d.measuretitle);

        if (d.change == "na") {
          d3.select(".containerTop" + this_id)
            .append("div")
            .attr("class", "changeSingle")
            .html(`<div class="outlook ${d.outlook}">${d.outlook}</div>`)
        }
        else {

          if (d.change2 == "positive" || d.change2 == "nochange" || d.change2 == "negative") {

            //add change arrow, percent and outlook
            d3.select(".containerTop" + this_id)
              .append("div")
              .attr("class", "changeSingle " + d.measure)
              .html(`<p class="percent"> ${d.changeSingleVar}${d3.format(",.1f")(d.percent)}${d.unit} </p>
                    <p class= "arrow ${d.measure}1">${drawArrow(d.change)}</p>
                    <p class="outlook ${d.outlook}">${d.outlook}</p>`)//change arrow file names need to match the values in the csv

            d3.select(".containerTop" + this_id)
              .append("div")
              .attr("class", "changeDuo " + d.measure)
              .html(`<p class="percent"> ${d.changeDuoVar}${d3.format(",.1f")(d.percent2)}${d.unit} </p>
                    <p class= "arrow ${d.measure}2" >${drawArrow(d.change2)}</p>
                    <p class="outlook ${d.outlook2}">${d.outlook2}</p>`)

            // add since if change is assessed 
            d3.select(".tile" + this_id)
              .append("div")
              .attr("class", "since-line" + this_id)

            d3.select(".since-line" + this_id)
              .append("div")
              .attr("class", "since")
              .html(` <div class="since">Since ${d.since} </div> `)//change arrow file names need to match the values in the csv
          }
          else {
            //add change arrow, percent and outlook
            d3.select(".containerTop" + this_id)
              .append("div")
              .attr("class", "changeSingle")
              .html(`<div class="percent"> ${d.changeSingleVar}${d.percent}${d.unit} </div>
                    <div class= "arrow">${drawArrow(d.change)}</div>
                    <div class="outlook ${d.outlook}">${d.outlook}</div>`)//change arrow file names need to match the values in the csv

            // add since if change is assessed 
            d3.select(".tile" + this_id)
              .append("div")
              .attr("class", "since-line" + this_id)

            d3.select(".since-line" + this_id)
              .append("div")
              .attr("class", "since")
              .html(` <div class="since">Since ${d.since} </div> `)//change arrow file names need to match the values in the csv
          }

        }

        //add titles
        d3.select(".tile" + this_id)
          .append("div")
          .attr("class", "title")
          .insert("h5")
          .text(d.title);


        //create commentary 
        d3.select(".tile" + this_id)
          .append("div")
          .attr("class", "commentary")
          .insert("p")
          .text(d.commstext);

        //create source text
        d3.select(".tile" + this_id)
          .append("div")
          .attr("class", "source")
          .insert("p")
          .text("Source: ")
          .append("a")
          .attr("href", d.sourceURL)
          .attr("target", "_blank")
          .html(d.sourcetext);

        // .text("Source: " + d.sourcetext)


        //add second div
        d3.select("#secondLayer" + this_id)
          .append("div")
          .attr("aria-hidden", "true")
          .attr("id", "chart" + this_id)
          .attr("class", "chart chart" + this_id);


        //create divs for charts
        d3.select("#chart" + this_id)
          .append("div")
          .attr("class", "graphic")
          .attr("id", "l1chartdiv" + this_id);


        var pymParent = new pym.Parent("l1chartdiv" + this_id, "./charts/" + d.measure + "/index.html", { title: "Chart - " + d.title });


        //create source for mobile text
        d3.select("#thirdLayer" + this_id)
          .append("div")
          .attr("class", "source2")
          .insert("p")
          .text("Source: ")
          .append("a")
          .attr("href", d.sourceURL)
          .html(d.sourcetext);


      })//end domainData forEach




      for (let i = 0; i < domainData.length; i++) {

        //a div for each tile wrapper
        graphic.append("div")
          .attr("id", domainData[i].topic + "-" + domainData[i].outlook.replace(/\s+/g, '') + "-" + i)
          // .attr("data-category", domainData[i].change)
          .attr("class", "all alldomain thischart topic " + domainsUnique[j] + "domain " + domainData[i].outlook.replace(/\s+/g, '') + " " + domainsUnique[j] + "domain " + domainData[i].outlook2.replace(/\s+/g, ''))
          .attr("tabindex", -1);





        // //adding each tile wrapper to the div
        // var pymParent = new pym.Parent((domainData[i].topic + "-" + domainData[i].outlook.replace(/\s+/g, '') + "-" + i), "./tiles/wrappers/" + domainData[i].measure + ".html", { title: "Chart - " + domainData[i].title });

        document.querySelector("div#" + domainsUnique[j] + "-head")
          .classList.add(domainData[i].outlook.replace(/\s+/g, ''))

        //back to the top link for the end of each topic section
        if (i == (domainData.length - 1)) {
          d3.select("div#tileshere").append("div")
            .attr("class", "all topic " + domainsUnique[j] + "domain alldomain")
            .html(`<div class="backToTop"><a href=#top>🠕 Back to the top</a></div>`)
        }
      }
    }

    

    createDropdown()
  };


  pymChild.sendHeight();

  setTimeout(function () {
    pymChild.sendHeight();
  }, 3000);

  setInterval(function () {
    pymChild.sendHeight();
  }, 1000);
}