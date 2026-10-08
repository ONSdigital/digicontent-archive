var pymChild = null;
var margin = null;
var income = null;

function drawGraphic(width) {

  initialise();
  enableStepButtons();
  enableBackButtons();
  enableSkipButtons();
  enableRedoButtons();
  // enableResetButton();
  enableUnknownButton();
  enablePropertyButton();
  enableTooltips();
  enableCalculateButtons();
  // reDrawBarCharts()

  function initialise() {
    var someContainer = d3.select(".section-container");
    if (parseInt(someContainer.style("width")) < dvc.optional.mobileBreakpoint) {
      size = "sm"
    } else if (parseInt(someContainer.style("width")) < dvc.optional.mediumBreakpoint) {
      size = "md"
    } else {
      size = "lg"
    };

    margin = dvc.optional.margin[size];

    if (size == "sm"){
      d3.select("#banner").attr("src","./images/banner-small.svg")
    }


    // populate household isotype
    d3.selectAll(".summary-decile-houses")
      .selectAll("image")
      .data(Array.apply(null, Array(10)).map(function() {}))
      .enter()
      .append("image")
      .attr("href", "./images/House-icon.svg")
      .classed("house-icon", true)
      .attr("x", function(d,i) { return i*20 })
      .style("opacity", 0.4)
      // .append('line')
      // .attr("x1", function(d,i) { return i*20 })
      // .attr("x2", function(d,i) { return i*20 })
      // .attr("y1",10)
      // .attr("y2",20)
      // .attr('stroke',"black")

    d3.selectAll(".summary-decile-houses")
      .selectAll('line')
      .data(Array.apply(null, Array(10)).map(function() {}))
      .enter()
      .append('line')
      .attr("x1", function(d,i) { return i*20+9 })
      .attr("x2", function(d,i) { return i*20+9 })
      .attr("y1",20)
      .attr("y2",25)
      .attr('stroke',"#707071")
      .attr("opacity",function(d,i){
        if (i == 0 | i == 9){
          return 1;
        }
        else{
          return 0;
        }
      })

    d3.selectAll(".summary-decile-houses")
      .selectAll('text')
      .data(Array.apply(null, Array(10)).map(function() {}))
      .enter()
      .append('text')
      .attr("x", function(d,i) {
        if (i==0){
          return i*20
        }
        else if (i==9){
          return i*20-5
        }
      })
      .attr("y",40)
      .attr('class','decile-houses-text')
      .text(function(d,i){
        if (i==0){
          return "Bottom"
        }
        else if (i==9){
          return "Top"
        }
      })
      .attr("opacity",function(d,i){
        if (i == 0 | i == 9){
          return 1;
        }
        else{
          return 0;
        }
      })
      .append('tspan')
      .attr('dy','1.1em')
      .attr("x", function(d,i) {
        if (i==0){
          return i*20
        }
        else if (i==9){
          return i*20-5
        }
      })
      .attr('class','decile-houses-text')
      .text(function(d,i){
        if (i==0 | i ==9){
          return "10%"
        }
      })
      .attr("opacity",function(d,i){
        if (i == 0 | i == 9){
          return 1;
        }
        else{
          return 0;
        }
      })



  };

  function enableStepButtons() {
    // update number inputs when their buttons are clicked
    d3.selectAll(".button-step").on("click", function(d,i) {
      var buttonStep = d3.select(this);
      var numberInputId = buttonStep.attr("for");
      var numberInput = document.getElementById(numberInputId);
      if (buttonStep.classed("disabled")){}
      else{
        if (buttonStep.classed("button-minus")) numberInput.stepDown()
        else if (buttonStep.classed("button-plus")) numberInput.stepUp()
      else console.log("button-step is missing a plus or minus class");
    }
    })
  } // end enableStepButtons

  function enableUnknownButton(){
    d3.selectAll("#household_yes").on("click",function(d,i){
        d3.selectAll(".button-step").classed("disabled",false).property("disabled",false)
        d3.selectAll("#adults").property("disabled",false).classed("disabled",false)
        d3.selectAll("#teens").property("disabled",false).classed("disabled",false)
        d3.selectAll("#children").property("disabled",false).classed("disabled",false)
        d3.selectAll("#householdinput").classed("disabled",false)
      })
      d3.selectAll("#household_no").on("click",function(d,i){
        d3.selectAll(".button-step").classed("disabled",true).property("disabled",true)
        d3.selectAll("#adults").property("disabled",true).classed("disabled",true)
        d3.selectAll("#teens").property("disabled",true).classed("disabled",true)
        d3.selectAll("#children").property("disabled",true).classed("disabled",true)
        d3.selectAll("#householdinput").property("disabled",true)
      })
    }

  function enablePropertyButton(){
    d3.select("#total-property").property('disabled',true).classed("disabled",true)
    d3.select("#mortgage-remaining").property("disabled",true).classed("disabled",true)
    d3.select("#propertyinput_yes").on("click",function(d,i){
      toggleProperty("enable")
    })
    d3.select("#propertyinput_no").on("click",function(d,i){
      toggleProperty("disable")
    })
  }

  function toggleProperty(input){
    if (input == "enable"){
      d3.select("#total-property").classed("disabled",false).property("disabled",false)
      d3.select("#mortgage-remaining").classed("disabled",false).property("disabled",false)

    }
    else if (input == "disable"){
      d3.select("#total-property").classed("disabled",true).property("disabled",true)
      d3.select("#mortgage-remaining").classed("disabled",true).property("disabled",true)

    }
  }

  function enableBackButtons(){
    d3.selectAll(".button-back").on("click", function(d,i) {
      var button = d3.select(this);
      var calculatorName = button.attr("id")
      // watch out - reorganising the inputs and outputs will need this to change
      var inputSection = d3.select("#"+calculatorName+"-input");
      var outputSection = d3.select("#"+calculatorName+"-output");;
      if (button.classed("button-output")) {
        // replace inputs with outputs
        outputSection.style("display", "none");
        if (calculatorName == "household"){
          d3.select("#intro-output").style("display", "block");
        }
        else if (calculatorName == "results"){
          d3.select("#"+dvc.essential.orderingBackward[calculatorName]+"-output").style("display", "block");
        }
        else{
          d3.select("#"+calculatorName+"-input").style("display", "block");
        }
      } else if (button.classed("button-input")) {
          inputSection.style("display", "none");
          if (calculatorName == "income"){
            d3.select("#household-output").style("display", "block");
          }
          else {
            if (dvc.essential.completed[dvc.essential.orderingBackward[calculatorName]] == true){
              d3.select("#"+dvc.essential.orderingBackward[calculatorName]+"-output").style("display", "block");
            }
            else{
              d3.select("#"+dvc.essential.orderingBackward[calculatorName]+"-input").style("display", "block");
            }
          }
        }
        pymChild.sendHeight();
      })
    }

  function enableSkipButtons(){
    d3.selectAll(".button-skip").on("click", function(d,i) {
      var button = d3.select(this);
      var calculatorName = button.attr("id")
      // watch out - reorganising the inputs and outputs will need this to change
      var inputSection = d3.select("#"+calculatorName+"-input");
      var outputSection = d3.select("#"+calculatorName+"-output");;
      inputSection.style("display", "none");
      d3.select("#"+dvc.essential.orderingForward[calculatorName]+"-input").style("display", "block");
      pymChild.sendHeight();
    })
  }

  function enableRedoButtons(){
    d3.selectAll(".button-redo").on("click", function(d,i) {
      var button = d3.select(this);
      var calculatorName = button.attr("id")
      var inputSection = d3.select("#"+calculatorName+"-input");
      d3.select("#results-input").style("display","none")
      inputSection.style("display", "block");
      pymChild.sendHeight();
    })
  }

  function enableResetButton(){
    d3.selectAll("#button-reset").on("click", function(d,i){
      pymChild = new pym.Child({
        renderCallback: drawGraphic
      });
    })
  }

  function createTooltips(){
  //   svg_height = d3.select("#spending-input").attr("height")
  //   svg_width = d3.select("#spending-input").attr("height")
  //
  //
  //   d3.select("#tooltips")
  //     .attr('height',svg_height)
  //     .attr('width', svg_width)
  }

  function enableTooltips() {
    d3.selectAll(".popup").on("mouseover",function(d,i){
      var button = d3.select(this);
      var categoryName = button.attr("id")
      var popup = document.getElementById(categoryName+"-popup");
      popup.classList.toggle("show");
    })

    d3.selectAll(".popup").on("mouseout",function(d,i){
      var button = d3.select(this);
      var categoryName = button.attr("id")
      var popup = document.getElementById(categoryName+"-popup");
      popup.classList.toggle("show");
    })
  }

  function enableCalculateButtons() {
    d3.selectAll(".button-calculate").on("click", function(d,i) {
      var button = d3.select(this);
      var calculatorName = button.attr("id")
      // watch out - reorganising the inputs and outputs will need this to change
      var inputSection = d3.select("#"+calculatorName+"-input");
      var outputSection = d3.select("#"+calculatorName+"-output");;

      // did the button clicked say back or calculate?
      if (button.classed("button-output")) {
        // replace inputs with outputs
        outputSection.style("display", "none");;
        if (calculatorName == "intro"){
          // if (document.querySelector('input[name="known"]:checked').value == "no"){
          //   d3.select("#income-input").style("display", "block");
          // } else{
            d3.select("#household-output").style("display", "block");
          // }
        } else{
          d3.select("#"+dvc.essential.orderingForward[calculatorName]+"-input").style("display", "block");
        }

      } else if (button.classed("button-input")) {
        // replace inputs with outputs
        inputSection.style("display", "none");
        outputSection.style("display", "block")
        var graphic = outputSection.select(".graphic");


        // need to know which calculator this is...
        switch (calculatorName) {
          case "income": runIncomeCalculator(); break;
          case "liquid-wealth": runLiquidWealthCalculator(); break;
          case "property-wealth": runPropertyWealthCalculator(); break;
          case "spending": runExpenditureCalculator(); break;
          case "intro": break;
          case "household": break;
        }

        index = dvc.essential.indexes[calculatorName]
        graphic_data = dataset[index].values

        var decile = getDecile();
        updateSummary();
        drawBarChart();

        function getDecile() {
          var decile = 0;
          // keep adding 1 to decile if income is still above current decile band. Also stop when we've exhausted deciles.
          while (decile < graphic_data.length && amount > graphic_data[decile]["upper_boundary"]) {
            decile++;
          }
          // decile is an index in the array, which starts at 0, but in practice deciles start from 1 so need to add 1 to adjust
          decile++;
          if (calculatorName == "property-wealth" & amount == 0){
            decile = 4;
          }
          return decile;
        }

        function updateSummary() {
          // get text to update summary with
          if (decile <= 5) {
            var summaryText = "bottom " + decile*10;
          } else {
            var summaryText = "top " + (11-decile)*10;
          }

          // update text
          var summaryTextElement = d3.select("#" + calculatorName + "-summary");
          if (calculatorName != "liquid-wealth"){
            summaryTextElement.select("#" + calculatorName + "-decile-text")
              .text(" is in the " + summaryText + "%");
            }
          else{
            summaryTextElement.select("#" + calculatorName + "-decile-text")
              .text(" are in the " + summaryText + "%");
          }

          // update isotype
          var isotypeData = [];
          for (var i = 1; i < 11; i++) {
            if (i < decile) {
              isotypeData.push("")
            } else if (i == decile) {
              isotypeData.push("-highlight")
            } else {
              isotypeData.push("")
            }
          }


          if (calculatorName == "property-wealth" & amount == 0){
            for (var i = 0; i < 4; i++){
              isotypeData[i]= "-highlight"
            }
          }

          d3.select("#" + calculatorName + "-summary-decile-houses")
            .selectAll(".house-icon")
            .data(isotypeData)
            .attr("href", function(d) { return "./images/House-icon" + d + ".svg"})
            .style("opacity",1);

          d3.select("#"+calculatorName+"-above-below")
            .text(amount > dvc.essential.median[calculatorName] ? "top "+(10-(decile-1))+"0%" : "bottom "+decile+"0%") // hardcoded income median!

          dvc.essential.completed[calculatorName] = true;
        }

        function runIncomeCalculator() {
          // income-adults, income-teens, income-children
          var adults = +d3.select("#adults").property("value");
          var teens = +d3.select("#teens").property("value");
          var children = +d3.select("#children").property("value");

          // var adults = +inputSection.select("#adults").property("value");
          // var teens = +inputSection.select("#teens").property("value");
          // var children = +inputSection.select("#children").property("value");
          var netIncome = +inputSection.select("#net-income").property("value");
          var netIncomeTimePeriod = inputSection.select("#net-income-time-period").node().value;
          var councilTax = +inputSection.select("#council-tax").property("value");
          var councilTaxTimePeriod = inputSection.select("#council-tax-time-period").node().value;

          var equivalisationVar = getEquivalisationVar(adults, teens, children);

          // convert net income and council tax to yearly
          netIncome = netIncome*netIncomeTimePeriod;
          councilTax = councilTax*councilTaxTimePeriod;

          // carry out income calculation
          income = (netIncome - councilTax) / equivalisationVar
          var incomeFormatted = d3.format(",.0f")(income);

          // update info box with income and text saying whether it is above or below median
          d3.select("#your-income")
            .text(incomeFormatted)
          // d3.select("#income-above-below")
          //   .text(income > 29900 ? "top "+decile+"0%" : "bottom "+decile+"0%") // hardcoded income median!

          amount = income
        }

        function runLiquidWealthCalculator() {
          // income-adults, income-teens, income-children
          var adults = +d3.select("#adults").property("value");
          var teens = +d3.select("#teens").property("value");
          var children = +d3.select("#children").property("value");

          // var adults = +inputSection.select("#adults").property("value");
          // var teens = +inputSection.select("#teens").property("value");
          // var children = +inputSection.select("#children").property("value");
          var inputLiquidWealth = +inputSection.select("#liquid-wealth").property("value");

          var equivalisationVar = getEquivalisationVar(adults, teens, children);

          var liquidWealth = inputLiquidWealth/equivalisationVar

          var liquidWealthFormatted = d3.format(",.0f")(liquidWealth);

          // update info box with income and text saying whether it is above or below median
          d3.select("#your-liquid-wealth")
            .text(liquidWealthFormatted)
          // d3.select("#income-above-below")
          //   .text(income > 29900 ? "top "+decile+"0%" : "bottom "+decile+"0%") // hardcoded income median!

          amount = liquidWealth
        }

        function runPropertyWealthCalculator() {
          // income-adults, income-teens, income-children
          var adults = +d3.select("#adults").property("value");
          var teens = +d3.select("#teens").property("value");
          var children = +d3.select("#children").property("value");

          // var adults = +inputSection.select("#adults").property("value");
          // var teens = +inputSection.select("#teens").property("value");
          // var children = +inputSection.select("#children").property("value");
          var totalProperty = +inputSection.select("#total-property").property("value");
          var mortgageRemaining = +inputSection.select("#mortgage-remaining").property("value");

          var equivalisationVar = getEquivalisationVar(adults, teens, children);

          var propertyWealth = (totalProperty -mortgageRemaining)/equivalisationVar

          ownedProperty = document.querySelector('input[name="property"]:checked').value;

          if (ownedProperty=="no"){
            propertyWealth = 0
          }

          var propertyWealthFormatted = d3.format(",.0f")(propertyWealth);

          // update info box with income and text saying whether it is above or below median
          d3.select("#your-property-wealth")
            .text(propertyWealthFormatted)
          // d3.select("#income-above-below")
          //   .text(income > 29900 ? "top "+decile+"0%" : "bottom "+decile+"0%") // hardcoded income median!

          amount = propertyWealth
        }

        function runExpenditureCalculator() {
          // income-adults, income-teens, income-children
          var adults = +d3.select("#adults").property("value");
          var teens = +d3.select("#teens").property("value");
          var children = +d3.select("#children").property("value");

          var groceries = +d3.select("#groceries").property("value");
          var groceriesTimePeriod = d3.select("#groceries-time-period").node().value;
          var clothing = +d3.select("#clothing").property("value");
          var clothingTimePeriod = d3.select("#clothing-time-period").node().value;
          var housing = +d3.select("#housing").property("value");
          var housingTimePeriod = d3.select("#housing-time-period").node().value;
          var furniture = +d3.select("#furniture").property("value");
          var furnitureTimePeriod = d3.select("#furniture-time-period").node().value;
          var health = +d3.select("#health").property("value");
          var healthTimePeriod = d3.select("#health-time-period").node().value;
          var care = +d3.select("#care").property("value");
          var careTimePeriod = d3.select("#care-time-period").node().value;
          var transport = +d3.select("#transport").property("value");
          var transportTimePeriod = d3.select("#transport-time-period").node().value;
          var hotel = +d3.select("#hotel").property("value");
          var hotelTimePeriod = d3.select("#hotel-time-period").node().value;
          var culture = +d3.select("#culture").property("value");
          var cultureTimePeriod = d3.select("#culture-time-period").node().value;
          var pubs = +d3.select("#pubs").property("value");
          var pubsTimePeriod = d3.select("#pubs-time-period").node().value;
          var pets = +d3.select("#pets").property("value");
          var petsTimePeriod = d3.select("#pets-time-period").node().value;
          var other = +d3.select("#other").property("value");
          var otherTimePeriod = d3.select("#other-time-period").node().value;

          var totalWeeklySpend =
            (groceries/groceriesTimePeriod)+
            (clothing/clothingTimePeriod)+
            (housing/housingTimePeriod)+
            (furniture/furnitureTimePeriod)+
            (health/healthTimePeriod)+
            (care/careTimePeriod)+
            (transport/transportTimePeriod)+
            (hotel/hotelTimePeriod)+
            (culture/cultureTimePeriod)+
            (pubs/pubsTimePeriod)+
            (pets/petsTimePeriod)+
            (other/otherTimePeriod)

          var equivalisationVar = getEquivalisationVar(adults, teens, children);

          // convert net income and council tax to yearly

          // carry out income calculation
          spending = totalWeeklySpend / equivalisationVar
          var spendingFormatted = d3.format(",.0f")(spending);

          // update info box with income and text saying whether it is above or below median
          d3.select("#your-spending")
            .text(spendingFormatted)
          // d3.select("#income-above-below")
          //   .text(income > 29900 ? "top "+decile+"0%" : "bottom "+decile+"0%") // hardcoded income median!

          amount = spending

        }

        function getEquivalisationVar(adults, teens, children) {
          if (document.querySelector('input[name="known"]:checked').value == "no"){
            adults = 1
            teens = 0
            children = 0
          }

          if (calculatorName == "income"){
            var equivalisationVar = 0.67 + (0.33*(adults+teens-1)) + 0.2*children
            return equivalisationVar
          }
          else{
            var equivalisationVar = 1 + (0.5*(adults+teens-1)) + 0.3*children
            return equivalisationVar
          }
        }

        function drawBarChart() {
          // update graphic
          graphic.selectAll("*").remove();

          // var height = Math.min(
          //   parseInt(inputSection.style("height")) - outputSection.select(".info-box").node().offsetHeight,
          //   400 // this is the maximum height of the bar chart
          // );
          var height = 300
          var width = parseInt(graphic.style("width"));
          var xDomain = graphic_data.map(function(d) { return d.decile });
          if (size == "lg"){
            var chart_width = width-margin.right-margin.left
          }
          else{
            var chart_width = width-margin.right-15
          }
          var x = d3.scaleBand()
              .domain(xDomain)
              .range([margin.left, chart_width])
              .padding(0.05)
              // .paddingOuter(0);

          var y = d3.scaleLinear()
            .domain(dvc.essential.yAxisScale[calculatorName])
            .range([height - margin.top - margin.bottom, margin.top]);

          if (size != "lg"){
            var legend = graphic.append("svg")
              .style("height", 75)
              .style("width", width)
            }
          else{
            var legend = graphic.append("svg")
              .style("height", 35)
              .style("width", width)
          }

          legend.append('rect')
            .attr('width',15)
            .attr('height',15)
            .attr('y',15)
            .attr('x',10)
            .attr('fill',"#C6C6C6")

          legend.append("text")
            .attr("class","legend")
            .attr('y',27.5)
            .attr('x', 10+25)
            .text("Median for the decile")

        if (size != "lg"){
          legend.append('rect')
            .attr('width',15)
            .attr('height',15)
            .attr('y',35)
            .attr('x',10)
            .attr('fill',"#206095")

          legend.append("text")
            .attr("class","legend")
            .attr('y',47.5)
            .attr('x', 10+25)
            .text("Your decile")

          legend.append("line")
            .attr("x1", 10)
            .attr("x2", 27.5)
            .attr("y1", 65)
            .attr("y2", 65)
            .style("stroke", "#F56927")
            .style("stroke-width", "3px")
            .style("stroke-dasharray", "6 2");

            legend.append("text")
              .attr("class","legend")
              .attr('y',67.5)
              .attr('x', 10+25)
              .text("Median")
          }

          var svg = graphic.append("svg")
            .style("height", height+15)
            .style("width", width)

          var axes = svg.append("g")
            .classed("axes", true);

          axes.append("g")
            .attr("class", "x axis")
            .call(
              d3.axisBottom(x)
                .tickValues([1,10])
                .tickFormat(function(d) { return d == 1 ? "Bottom 10%" : "Top 10%" })
                .tickPadding([10])
                .tickSize([0])
            )
            .attr("transform", "translate(0," + (height - margin.bottom+1.5) + ")");

          // axes.append("g")
          // .attr("class", "x axis")
          // .append('line')
          // .attr("transform", "translate(0," + (height - margin.bottom) + ")")
          // .attr("x1",margin.left)
          // .attr("x2",width-margin.right-margin.left+5)
          // .attr("y1",2)
          // .attr("y2",2)
          // .style("stroke-width", "2px")
          // .style("stroke","#707071")


          axes.append("g")
            .attr("class", "y axis")
            .call(
              d3.axisLeft(y)
                .ticks(4)
                .tickFormat(function(d) { return "£" + d3.format(",.0f")(d) })
                .tickSize([-chart_width+margin.left])
              )
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

          var bars = svg.append("g")
            .classed("bars", true)
            .attr("transform", "translate(0," + margin.top + ")");

          bars.selectAll("rect")
            .data(graphic_data)
            .enter()
            .append("rect")
            .attr('id',function(d){
              return calculatorName+"-"+d.decile
            })
            .attr("x", function(d) { return x(d.decile) })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d["midpoint"]) })
            .attr("height", function(d) { return y.range()[0] - y(d["midpoint"]) })
            .attr("fill", "#C6C6C6");


          d3.select("#"+calculatorName+"-"+decile)
          .attr("fill", "#206095");

          // Add your income line
          // bars.append("line")
          //   .attr("x1", margin.left - 7)
          //   .attr("x2", width - margin.left - margin.right + (size=="sm" ? 0 : 30))
          //   .attr("y1", y(income))
          //   .attr("y2", y(income))
          //   .style("stroke", "#F39431")
          //   .style("stroke-width", "3px")
          //   .style("stroke-dasharray", "6 2");

          // bars.append("text")
          //   .attr("x", width - margin.left - margin.right + (size=="sm" ? 2 : 32))
          //   .attr("y", y(income) + 5)
          //   .style("fill", "#F56927")
          //   .text("Your income")

          // Add median line
            bars.append("line")
              .attr("x1", margin.left - 7)
              .attr("x2", chart_width + (size=="sm" ? 0 : 25))
              .attr("y1", y(dvc.essential.median[calculatorName]))
              .attr("y2", y(dvc.essential.median[calculatorName]))
              .style("stroke", "#F56927")
              .style("stroke-width", "3px")
              .style("stroke-dasharray", "6 2");

          // bars.append("text")
          //   .attr("x", width - margin.left - margin.right + (size=="sm" ? 2 : 32))
          //   .attr("y", y(29900) + 5)
          //   .style("fill", "#F56927")
          //   .text("Median")
          //   .append("tspan")
          //   .text("income")
          //   .attr("dy", "1.1em")
          //   .attr("x", width - margin.left - margin.right + (size=="sm" ? 2 : 32))


          if (size == "lg"){
            bars.append("text")
              .attr("x", width - margin.left - margin.right + (size=="sm" ? 2 : 32))
              .attr("y", y(dvc.essential.median[calculatorName]) + 5)
              .style("fill", "#F56927")
              .text("Median")
              .append("tspan")
              .text("£"+d3.format(",.0f")(dvc.essential.median[calculatorName]))
              .attr("font-weight",700)
              .attr("dy", "1.1em")
              .attr("x", width - margin.left - margin.right + (size=="sm" ? 2 : 32))
            }

          //define arrowhead
          // defs=svg.append('defs')
          // marker=defs.append('marker').attr('id','pointer').attr('markerWidth',10).attr('markerHeight',8).attr('refX',9.5).attr('refY',5.1).attr('orient',"auto").attr('markerUnits','userSpaceOnUse')
          //   marker.append('polyline').attr('points',"1 1, 9 5, 1 7").style("fill","none").style("stroke","black")

          const curve = d3.line().curve(d3.curveNatural);

          if (amount > dvc.essential.median[calculatorName]){
            above_below = "top"
            percentile = (10-(decile-1))+"0%"
          }
          else{
            above_below = "bottom"
            percentile = decile+"0%"
          }

          if (calculatorName == "liquid-wealth"){
            var decilelabel_isare = "are"
          }
          else{
            var decilelabel_isare = "is"
          }

          if (decile < 10 & size == "lg"){
            bars
            .append('g')
            .attr("id",calculatorName+"-label")
            .attr('class','label-container')
            .attr('transform',function(d){
              return 'translate('+(x(graphic_data[decile-1]["decile"])+(x.bandwidth()/2))+','+y(graphic_data[decile-1]["midpoint"])+')'
            })
            .append('text')
            .attr("class","decile-label")
            .attr('id',calculatorName+"-decile-label")
            .attr('x',0)
            .attr('y',-110)
            .text("Your "+dvc.essential.simpleName[calculatorName])
            .append("tspan")
            .attr('dy',"1.2em")
            .attr('x',0)
            .text(decilelabel_isare+" in the "+above_below)
            .append("tspan")
            .attr('dy',"1.4em")
            .attr('x',0)
            .text(percentile+" of households")

            d3.select("#"+calculatorName+"-decile-label")
              .each(createBackRect)
              .each(bringtofront)


            const points = [[BBox.x+5, BBox.y+BBox.height+5],[BBox.x,(BBox.y+BBox.height+5)/2],[0,0]]

            d3.select("#"+calculatorName+"-label")
            .append('path')
            .attr('d', curve(points))
            .attr('stroke', 'black')
            .attr('fill', 'none')
            // .attr('marker-end',"url(#pointer")
          }

        else if (decile < 10 & size != "lg") {
            bars
            .append('g')
            .attr("id",calculatorName+"-label")
            .attr('class','label-container')
            .attr('transform',function(d){
              return 'translate('+(x(graphic_data[decile-1]["decile"])+(x.bandwidth()/2))+','+y(graphic_data[decile-1]["midpoint"])+')'
            })
            .append('text')
            .attr("class","decile-label")
            .attr('id',calculatorName+"-decile-label")
            .attr('x',0)
            .attr('y',-60)
            .text("Your")
            .append("tspan")
            .attr('dy',"1.2em")
            .attr('x',0)
            .text("household")

            d3.select("#"+calculatorName+"-decile-label")
              .each(createBackRect)
              .each(bringtofront)


            const points = [[BBox.x+5, BBox.y+BBox.height+5],[BBox.x,(BBox.y+BBox.height+5)/2],[0,0]]

            d3.select("#"+calculatorName+"-label")
            .append('path')
            .attr('d', curve(points))
            .attr('stroke', 'black')
            .attr('fill', 'none')
            // .attr('marker-end',"url(#pointer")

        }

        else if (decile == 10 & size == "lg"){
          bars
          .append('g')
          .attr("id",calculatorName+"-label")
          .attr('class','label-container')
          .attr('transform',function(d){
            return 'translate('+(x(graphic_data[decile-1]["decile"]))+','+(y(graphic_data[decile-1]["midpoint"])+15)+')'
          })
          .append('text')
          .attr("class","decile-label")
          .attr('id',calculatorName+"-decile-label")
          .attr('x',-125)
          .attr('y',-30)
          .text("Your "+calculatorName)
          .append("tspan")
          .attr('dy',"1.2em")
          .attr('x',-125)
          .text("is in the "+above_below+" "+percentile)
          .append("tspan")
          .attr('dy',"1.4em")
          .attr('x',-125)
          .text("of households")

        d3.select("#"+calculatorName+"-decile-label")
          .each(createBackRect)
          .each(bringtofront)

          const points = [[BBox.x+BBox.width+5, BBox.y/1.5],[(BBox.x+BBox.width+5)/2,BBox.y/2],[0,0]]

          d3.select("#"+calculatorName+"-label")
          .append('path')
          .attr('d', curve(points))
          .attr('stroke', 'black')
          .attr('fill', 'none')
          // .attr('marker-end',"url(#pointer")
        }

        else if (decile == 10 & size != "lg"){
          bars
          .append('g')
          .attr("id",calculatorName+"-label")
          .attr('class','label-container')
          .attr('transform',function(d){
            return 'translate('+(x(graphic_data[decile-1]["decile"]))+','+(y(graphic_data[decile-1]["midpoint"])+15)+')'
          })
          .append('text')
          .attr("class","decile-label")
          .attr('id',calculatorName+"-decile-label")
          .attr('x',-95)
          .attr('y',-30)
          .text("Your")
          .append("tspan")
          .attr('dy',"1.2em")
          .attr('x',-95)
          .text("household")

        d3.select("#"+calculatorName+"-decile-label")
          .each(createBackRect)
          .each(bringtofront)

          const points = [[BBox.x+BBox.width+5, BBox.y/1.5],[(BBox.x+BBox.width+5)/2,BBox.y/2],[0,0]]

          d3.select("#"+calculatorName+"-label")
          .append('path')
          .attr('d', curve(points))
          .attr('stroke', 'black')
          .attr('fill', 'none')
          // .attr('marker-end',"url(#pointer")
        }



        function bringtofront(){
          this.parentNode.appendChild(this)
        }

        function createBackRect() {

          BBox = this.getBBox()

          d3.select("#"+calculatorName+"-label").insert("rect", ".annotext")
            .attr("width", BBox.width+10)
            .attr("height", BBox.height+10)
            .attr("x", BBox.x-5)
            .attr("y", BBox.y-5)
            .attr("fill", "white")
            .attr("opacity", 0.8)

            return BBox;

          }; // end function createBackRect()



          //add label for top decile
          // bars
          // .append('g')
          // .attr("id",calculatorName+"-upper-label")
          // .attr('transform',function(d){
          //   return 'translate('+(x(graphic_data[9]["decile"]))+','+(y(graphic_data[9]["midpoint"])+15)+')'
          // })
          // .append('path')
          // .attr('d', curve(points2))
          // .attr('stroke', 'black')
          // // with multiple points defined, if you leave out fill:none,
          // // the overlapping space defined by the points is filled with
          // // the default value of 'black'
          // .attr('fill', 'none')

          // d3.select("#"+calculatorName+"-upper-label")
          // .append('text')
          // .attr("class","decile-label")
          // .attr('x',-155)
          // .attr('y',-20)
          // .text("The top 10%")
          // .append("tspan")
          // .attr('dy',"1.2em")
          // .attr('x',-155)
          // .text("have on average")
          // .append("tspan")
          // .attr('dy',"1.4em")
          // .attr('x',-155)
          // .text("£"+d3.format(",.0f")(graphic_data[9]["midpoint"])+" in "+calculatorName)

          // bars.append("text")
          //   .attr("x", margin.left - 7)
          //   .attr("y", y(29900) - 23)
          //   .style("fill", "#871A5B")
          //   .text("Median")
          //   .append("tspan")
          //   .text("income")
          //   .attr("dy", "1.1em")
          //   .attr("x", margin.left - 7)

        } // end drawBarChart

      } // end else
      pymChild.sendHeight();
    }) // end on click
  } // end enableCalculateButtons


  if (pymChild) {
    pymChild.sendHeight();
  }
}

if (Modernizr.svg) {
  d3.json("config.json", function(error, config) {
    dvc = config
    dataset = dvc.essential.dataset

    d3.csv("income-data.csv", function(error, data) {
      data = {name: "income", values: data}
      dataset.push(data);
      d3.csv("liquid-wealth-data.csv", function(error, data) {
        data = {name: "liquid-wealth", values: data}
        dataset.push(data);
        d3.csv("property-wealth-data.csv", function(error, data) {
          data = {name: "property-wealth", values: data}
          dataset.push(data);
          d3.csv("spending-data.csv", function(error, data) {
            data = {name: "spending-wealth", values: data}
            dataset.push(data);

            pymChild = new pym.Child({
              renderCallback: drawGraphic
            });
          });
        });
      });
    });
  });

} else {
  pymChild = new pym.Child();
  if (pymChild) {
    pymChild.sendHeight();
  }
}
