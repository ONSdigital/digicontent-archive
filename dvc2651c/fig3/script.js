let graphic = d3.select('#graphic');
let pymChild = null;

function drawGraphic() {

  //population accessible summmary
  d3.select('#accessibleSummary').html(config.essential.accessibleSummary)

  let threshold_md = config.optional.mediumBreakpoint;
  let threshold_sm = config.optional.mobileBreakpoint;
  let colour = d3.scaleOrdinal(config.essential.colour_palette); //



  //set variables for chart dimensions dependent on width of #graphic
  if (parseInt(graphic.style("width")) < threshold_sm) {
    size = "sm"
  } else if (parseInt(graphic.style("width")) < threshold_md) {
    size = "md"
  } else {
    size = "lg"
  }

  var radius = config.essential.radius[size]
  console.log(radius)
  var margin = config.optional.margin[size]
  var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
  // var height = chart_width - margin.top - margin.bottom;
var height = chart_width*0.75;
  // clear out existing graphics
  graphic.selectAll("*").remove();

  //set up scales
  const x = d3.scaleLinear()
    .range([0, chart_width]);

  const y = d3.scaleLinear()
     .range([height, 0])
     

  //create svg for chart
  svg = d3.select('#graphic').append('svg')
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "chart")
    .style("background-color", "#fff")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")


   // lets move on to setting up the legend for this chart. 
let groups = [...new Set(graphic_data.map(item => item.group))]; // this will extract the unique groups from the data.csv


// This code is meant to create a legend in the style of the scatterplot circle.

let legenditem = d3
.select('#legend')
.selectAll('div.legend-item')
.data(groups)
.enter()
.append('div')
.attr('class', 'legend--item');

legenditem 
 .append('div')
 .attr('class', 'legend--icon--circle2')
 .style('background-color', (d) => {
  let color = d3.color(colour(d));
  color.opacity = 0.5;
  return color;
 } )
 .style('border-color', (d) => colour(d));

legenditem
 .append('div')
 .append('p')
 .attr('class', 'legend--text')
 .html((d) => d);



    // both of these are need to be looked at.

  if(config.essential.xDomain=="auto"){
    x.domain([-12,14]);
  }else{
    x.domain(config.essential.xDomain)
  }


  if(config.essential.yDomain=="auto"){
    y.domain([0.65,1]);
  }else{
    y.domain(config.essential.xDomain)
  }

  svg
  .append('g')
  .attr('class', 'x axis')
  .attr('transform', `translate(0,${height})`)
  .call(
    d3.axisBottom(x)
    .ticks(config.optional.xAxisTicks[size])
    .tickSize(-height)
    .tickPadding(10)
    .tickFormat(d3.format(config.essential.xAxisFormat))
  )
  .selectAll('line')
  .each(function (d) {
    if (d == 0) {
      d3.select(this).attr('class', 'zero-line');
    }
  });

  svg
.append('g')
.attr('class','axis numeric')
.call(
  d3.axisLeft(y)
  .ticks(config.optional.yAxisTicks[size])
  .tickSize(-chart_width)
  .tickPadding(10)
  .tickFormat(d3.format(config.essential.yAxisFormat))
);

const maxRadius = 30; // You can adjust this value to your desired maximum radius


const delaunay = d3.Delaunay.from(graphic_data, d => d.x, d => d.y);
const voronoi = delaunay.voronoi([0, 0, chart_width, height]); // Replace 'width' and 'height' with the dimensions of your SVG container

console.log(Array.from(voronoi.cellPolygons()))

var cell = svg.append("g")
.attr("class","cells")
.selectAll("g")
.data(Array.from(voronoi.cellPolygons()))
.enter()
.append("g")
.attr("class", function(d,i){ /*console.log(d, i);*/ return  i})



cell.append("circle")
      .data(graphic_data)
      .join('circle')
      .attr('cx',(d) => x(d.xvalue))
      .attr('cy',(d) => y(d.yvalue))
      .attr('r',radius)
      .attr("fill", (d) => colour(d.group)) // This adds the colour to the circles based on the group
      // .attr('fill-opacity',config.essential.fillOpacity)
      .attr('stroke',(d)=> colour(d.group))
      .attr('stroke-opacity',config.essential.strokeOpacity)
      .attr("class", function(d,i) { return "cell cell" + ( i)})
  		    		  
      cell.append("path")
      .attr("fill", "none")
.attr("stroke", "#ddd")
.attr("d", (d) => `M${d.join("L")}Z`)
.attr("class", function(d,i) { return "path" + (i)})
.on("mouseover", function(d,i) {
        pathidstr = d3.select(this).attr("class");
        pathid = +pathidstr.substr(4);

        changetext(d.value, d.name);
        $("#dropselect").val("id" + pathid).trigger("chosen:updated");
        d3.select(".cell" + pathid).classed("cellsselected",true)
        d3.select(".cell"+ pathid).call(bringToFront);
        function bringToFront() {
          // Append the selected element to the end of its parent
          // This will visually bring it to the front
          this.parentNode.appendChild(this);
        }
        // Function to bring the selected element to the front
 
      })
              //  function(d,i) {
      //   pathidstr = d3.select(this).attr("class");
      //   pathid = +pathidstr.substr(4);

      //   changetext(d.data.value, d.data.unique);
      //   $("#dropselect").val("id" + pathid).trigger("chosen:updated");
      //   d3.select(".cell" + pathid).classed("cellsselected",true)
      // })
      .on("click", function(d) {
      
        d3.selectAll(".cells path").style("pointer-events","none");
        clicked = true;
      
      
      })
      .on("mouseout", function(d,i) {

        pathidstr = d3.select(this).attr("class");
        pathid = +pathidstr.substr(4);

        d3.select("#info").html("");
        $("#dropselect").val("").trigger("chosen:updated");
        d3.select(".cell" + pathid).classed("cellsselected",false)

        if(clicked == true) {
         changetext(d.data.value, d.data.unique)

          $("#dropselect").val("id" + pathid).trigger("chosen:updated");
          d3.select(".cell" + pathid).classed("cellsselected",true)
          d3.select(".cell"+ pathid).call(bringToFront);
          function bringToFront() {
            // Append the selected element to the end of its parent
            // This will visually bring it to the front
            this.parentNode.appendChild(this);
          }
        }
      })
   
      
   
selectlist(graphic_data);

function selectlist(datacsv) {
      var dropcodes =  datacsv.map(function(d,i) { return "id" + (i); });
      console.log(dropcodes)
      var dropnames =  datacsv.map(function(d) { return d.name; });
      var menuarea = d3.zip(dropnames,dropcodes).sort(function(a, b){ return d3.ascending(a[0], b[0]); });
        	
      console.log(menuarea)
      //menuarea.shift();
      //menuarea.shift();

      //clear dropdown
      d3.select("#dropdown").selectAll("*").remove()

      // Build option menu for occupations
      d3.select("#dropdown").append("div").attr("id","sel").insert("label")
      .attr("class", "visuallyhidden")
      .attr("for", "dropselect")
      .html("Inactive dropdown element, replaced by custom dropdown")

      var optns = d3.select("#dropdown").select("#sel").append("select")
        .attr("id","dropselect")
        .attr("style","width:300px")
        .attr("class","chosen-select");

      optns.append("option")
        // .attr("value","first")
        // .text("");
      optns.selectAll("p").data(menuarea).enter().append("option")
        .attr("value", function(d){return d[1]})
        .attr("id",function(d){return d[1]})
        .text(function(d){ return d[0]});

      myId=null;

      $('#dropselect').chosen({width: "98%", allow_single_deselect:true})

      d3.select('input.chosen-search-input').attr('id','chosensearchinput')
      d3.select('div.chosen-search').insert('label','input.chosen-search-input')
          .attr('class','visuallyhidden')
          .attr('for','chosensearchinput')
          .html("Type to select a town")


      $('#dropselect').on('change',function(evt,params){

          if($('#dropselect').val() != "") {
          //if(typeof params != 'undefined') {
            clicked = true;
              d3.selectAll(".cell").classed("cellsselected", false);
              d3.selectAll(".cells path").style("pointer-events","none")
// console.log(dropcode)

              dropcode = $('#dropselect').val();
console.log(dropcode)
              dropcodeid = +dropcode.substr(2)
console.log(dropcodeid)

              d3.select(".cell" + dropcodeid).classed("cellsselected", true);
              d3.select(".cell"+ dropcodeid).call(bringToFront);
              function bringToFront() {
                // Append the selected element to the end of its parent
                // This will visually bring it to the front
                this.parentNode.appendChild(this);
              }
              // datafilter = datacsv.filter(function(d,i) {return "group" + i == dropcode})

              // changetext(datafilter[0].value,datafilter[0].name )

              d3.select('abbr').on('keypress',function(evt){
                if(d3.event.keyCode==13 || d3.event.keyCode==32){
                  d3.event.preventDefault()

                  clicked = false;

                  d3.select(".cell" + dropcodeid).classed("cellsselected",false)
                  d3.selectAll(".cells path").style("pointer-events","all")

                  d3.select("#info").html("");

                  $("#dropselect").val(null).trigger('chosen:updated');
                }
              })

          }
          else {
            clicked = false;

            d3.selectAll(".cell").classed("cellsselected", false);
            d3.selectAll(".cells path").style("pointer-events","all");

            d3.select("#info").html("");

          }
      });
    } //end selectlist


    function changetext(value,id) {

      d3.select("#info").html("<span id='label'> £" + formatValue(value) + "</span> gross, per annum");
      occupation = $("#dropselect option:selected").text()
      d3.select("#infohidden").html( + " earn " + formatValue(value) + " pounds gross, per annum");
  }


  svg.append("svg:defs").append("svg:marker")
  .attr("id", "annotation_arrowhead")
  .attr("class","annotation_arrow")
  .attr("refX", 9)
  .attr("refY", 10)
  .attr("markerWidth", 20)
  .attr("markerHeight", 20)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M2,7 L8,10 L2,13") 

// svg.append("path")
// .attr("x",100)
// .attr("y",100)
// .attr("d", "M2,7 L8,10 L2,13") 
// .attr("class","annotation_arrow")
svg.append("text")
.data(graphic_data)
.text("Lower deprivation")
.attr("class","annotation-text")
.attr("id","annotation-london")
.attr("x",x(-11)+15)
.attr("y",y(0.96))
// .attr("dy",y("London"))
.style("text-anchor","start")
// .call(wrap,chart_width-x(3)-9);


  svg.append("line")
  .attr("x1",x(-11))
  .attr("x2",x(-11))
  .attr("y1",y(0.93))
  .attr("y2",y(0.99))
  .attr("class","annotation_arrow")
  .attr("marker-end", "url(#annotation_arrowhead)");



  // svg.append("text")
  // .data(graphic_data)
  // .text("Lower attainment")
  // .attr("class","annotation-text")
  // .attr("id","annotation-london")
  // .attr("x",x(-9)+15)
  // .attr("y",height-10)
  // // .attr("dy",y("London"))
  // .style("text-anchor","start")
  // // .call(wrap,chart_width-x(3)-9);
  
  
  //   svg.append("line")
  //   .attr("x1",x(-9))
  //   .attr("x2",x(-11.8))
  //   .attr("y1",height-15)
  //   .attr("y2",height-15)
  //   .attr("class","annotation_arrow")
  //   .attr("marker-end", "url(#annotation_arrowhead)");
  
  
  
    svg.append("text")
    .data(graphic_data)
    .text("Higher attainment")
    .attr("class","annotation-text")
    .attr("id","annotation-london")
    .attr("x",x(9)-15)
    .attr("y",height-10)
    // .attr("dy",y("London"))
    .style("text-anchor","end")
    // .call(wrap,chart_width-x(3)-9);
    
    
      svg.append("line")
      .attr("x1",x(9))
      .attr("x2",x(11.8))
      .attr("y1",height-15)
      .attr("y2",height-15)
      .attr("class","annotation_arrow")
      .attr("marker-end", "url(#annotation_arrowhead)");
    

// This does the x-axis label
    svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .append('text')
    .attr('x',chart_width)
    .attr('y',40)
    .attr('class','axis--label')
    .text(config.essential.xAxisLabel)
    .attr('text-anchor','end');

// This does the y-axis label
svg
.append('g')
.attr('transform', 'translate(0,0)')
.append('text')
.attr('x',-(margin.left-5))
.attr('y',-20)
.attr('class','axis--label')
.text(config.essential.yAxisLabel)
.attr('text-anchor','start');


  //create link to source
  d3.select("#source")
    .text("Source: " + config.essential.sourceText)



  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }
}

function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            // y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr('x',x);
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr('x',x).attr("dy", lineHeight + "em").text(word);
            }
          }
          var breaks = text.selectAll("tspan").size();
          text.attr("y", function(){return -6 * (breaks-1);});
        });

      }


d3.csv(config.essential.graphic_data_url)
  .then(data => {
    //load chart data
    graphic_data = data

    //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  });
