let graphic = d3.select('#graphic');
let pymChild = null;

function drawGraphic() {

  //population accessible summmary
  d3.select('#accessibleSummary').html(config.essential.accessibleSummary)

  let threshold_md = config.optional.mediumBreakpoint;
  let threshold_sm = config.optional.mobileBreakpoint;
  let colour = d3.scaleOrdinal(config.essential.colour_palette); //

  var formatValue = d3.format(",d");


  //set variables for chart dimensions dependent on width of #graphic
  if (parseInt(graphic.style("width")) < threshold_sm) {
    size = "sm"
  } else if (parseInt(graphic.style("width")) < threshold_md) {
    size = "md"
  } else {
    size = "lg"
  }



 var stripHeight = config.essential.stripHeight[size]
console.log(stripHeight)


    //get unique groups
    var datagroups = graphic_data.map(function (obj) { return obj.group; });
    datagroups = datagroups.filter(function (v, i) { return datagroups.indexOf(v) == i; });

console.log(datagroups)


//get height 



  var margin = config.optional.margin[size]
  var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
  var svgHeight = (stripHeight * datagroups.length) + margin.top + margin.bottom;

  console.log(svgHeight)

  
  var height = svgHeight - margin.top - margin.bottom;
  console.log(height)


  // clear out existing graphics
  graphic.selectAll("*").remove();


  clicked = false;

//does the same as //get unique groups (line 25)
  //
  let groupz = Array.from(new Set(graphic_data.map((d) => d.group)));
console.log(groupz)

  //set up scales
  const x = d3.scaleLinear()
    .range([0, chart_width]);

  // const y = d3.scaleLinear()
  //    .range([height, 0])
     


  const y = d3.scaleBand()
  .domain(datagroups)
    .range([0, height]);




  //create svg for chart
  svg = d3.select('#graphic').append('svg')
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "chart")
    .style("background-color", "#fff")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")


   // lets move on to setting up the legend for this chart. 
let legendCategories = [...new Set(graphic_data.map(item => item.colour))]; // this will extract the unique groups from the data.csv


let legenditem = d3
.select('#legend')
.selectAll('div.legend-item')
.data(legendCategories)
.enter()
.append('div')
.attr('class', 'legend--item');

legenditem 
 .append('div')
 .attr('class', 'legend--icon--circle')
 .style('background-color', (d) => colour(d) );

legenditem
 .append('div')
 .append('p')
 .attr('class', 'legend--text')
 .html((d) => d);

 //lets also try a new smallmultiple version here which will group data on the basis of series
 grouped_data = d3.group(graphic_data, d => d.group)  

console.log(grouped_data)
    // setting axis domains
    // both of these  need to be looked at.

  if(config.essential.xDomain=="auto"){
    x.domain([-10,20]);
  }else{
    x.domain(config.essential.xDomain)
  }



  // if(config.essential.yDomain=="auto"){
  //   y.domain([0, d3.max(graphic_data,function(d){return d.yvalue})]);
  // }else{
  //   y.domain(config.essential.xDomain)


  //add x axis
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
    .attr('class', 'x axis')
    // .attr('transform', `translate(0,${height})`)
    .call(
      d3.axisTop(x)
      .ticks(config.optional.xAxisTicks[size])
      .tickSize(0)
      .tickPadding(10)
      .tickFormat(d3.format(config.essential.xAxisFormat))
    )
      .selectAll('line')
      .each(function (d) {
        if (d == 0) {
          d3.select(this).attr('class', 'zero-line');
        }
      });
    // svg
    // .append('g')
    // .attr('class', 'x axis')

    // .call(
    //   d3.axisTop(x)
    //   .ticks(config.optional.xAxisTicks[size])
    //   .tickSize(0)
    //   .tickPadding(10)
    //   .tickFormat(d3.format(config.essential.xAxisFormat))
    // )



  //add y axis
  svg
.append('g')
.attr('class','axis numeric')
.call(
  d3.axisLeft(y)
  .ticks(config.optional.yAxisTicks[size])
  .tickSize(// -10
    0
    // function() {if (config.essential.showGuidelines =="True") { return -10}else{return 0}}
  )
   .tickPadding(10)
   .tickFormat("")
)	.attr('stroke-dasharray', '2 2')
// .selectAll('text')
// .call(wrap, margin.left - 5);

  //add y axis
  svg
.append('g')
.attr('class','axis numeric')
.call(
  d3.axisRight(y)
  .ticks(config.optional.yAxisTicks[size])
  .tickSize(// -10
    0
    // function() {if (config.essential.showGuidelines =="True") { return -10}else{return 0}}
  )
   .tickPadding(0)
)	.attr('strokestroke-dasharray', '2 2')
.selectAll('text')
.attr('transform','translate (0,-'+(stripHeight*0.3)+')')
.attr('font-weight','600')
.call(wrap, 100);


//gets group position 
groupeddata = {}

runningtotal = 0;

for (var j = 0; j < datagroups.length; j++) {

  groupeddata[j] = graphic_data.filter(function (v, i) { return v.group == datagroups[j]; });

  if (j > 0) {
    runningtotal = runningtotal + groupeddata[j - 1].length;
  }

}
//adds group at position

var g = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + (margin.top + (stripHeight * j)) + ")");

// adds a bit to the radius for the beeswarm to accomodate stroke
radiusPlus = (config.essential.radius+0.5)
console.log(config.essential.radius)
console.log(radiusPlus)



// adapting stack example


console.log(graphic_data)
var simulation = d3.forceSimulation(graphic_data)
.force("x", d3.forceX((d) => { return x(d.value); })
    .strength(2))
.force("y",    d3.forceY(function (d) { return y(d.group); }))
.force("collide", d3.forceCollide(radiusPlus))
.stop();

for (var i = 0; i < config.essential.iterations; ++i) simulation.tick();

console.log(graphic_data)

// svg.selectAll("path")
//     .data(voronoi.cellPolygons())
//     .enter()
//     .append("path")
//     .attr("d", d => d ? "M" + d.join("L") + "Z" : null)
//     .attr("stroke", "black")
//     .attr("fill", "none");

 
//   //creates the voroni shapes 
//   var cell = svg.append("g")
//   .attr("class", "cells")
// .selectAll("g").data(d3.voronoi()
//   .extent([[-margin.left, 0], [width + margin.right, heightper]])
//   .x(function(d) { return d.x; })
//   .y(function(d) { return d.y; })
// //creates cell class
//   .polygons(groupeddata[0])).enter().append("g").attr("class", function(d,i){ /*console.log(d, i);*/ return i})


// var node = svg.append("g")
//   .attr("class", "nodes")
// .selectAll("circle")
// .data(graphic_data)
// .enter()
// .append("circle")
// .attr("cx", function(d) { return d.x; })
//   .attr("cy", function(d) { return d.y; })
//   	   .attr('r',config.essential.radius)
// .attr("fill", (d) => colour(d.colour)) 
// .attr('fill-opacity',config.essential.fillOpacity)
// .attr('stroke',(d)=> colour(d.colour))
// .attr('stroke-opacity',config.essential.strokeOpacity)
// .attr('transform','translate(0,'+stripHeight/2+')');

console.log(graphic_data)

const maxRadius = 30; // You can adjust this value to your desired maximum radius


const delaunay = d3.Delaunay.from(graphic_data, d => d.x, d => d.y+stripHeight/2);
const voronoi = delaunay.voronoi([0, 0, chart_width, height]); // Replace 'width' and 'height' with the dimensions of your SVG container

console.log(Array.from(voronoi.cellPolygons()))

var cell = svg.append("g")
.attr("class","cells")
.selectAll("g")
.data(Array.from(voronoi.cellPolygons()))
.enter()
.append("g")
.attr("class", function(d,i){ /*console.log(d, i);*/ return  i})



console.log(cell)
cell.append("circle")
.data(graphic_data)
.attr("cx", (d) => d.x)
.attr("cy", (d) => d.y+stripHeight/2)
.attr("r", 2.5)
.attr("fill","#27A0CC")
.attr("class", function(d,i) { return "cell cell" + ( i)})
  		  
        cell.append("path")
        .attr("fill", "none")
// .attr("stroke", "#ddd")
.attr("d", (d) => `M${d.join("L")}Z`)
.attr("class", function(d,i) { return "path" + (i)})
.on("mouseover", function(d,i) {
          pathidstr = d3.select(this).attr("class");
          pathid = +pathidstr.substr(4);

  			  changetext(d.value, d.name);
  			  $("#dropselect").val("id" + pathid).trigger("chosen:updated");
  			  d3.select(".cell" + pathid).classed("cellsselected",true)
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
  				 changetext(d.value, d.name)

            $("#dropselect").val("id" + pathid).trigger("chosen:updated");
  				  d3.select(".cell" + pathid).classed("cellsselected",true)

  			  }
  		  })
        
  //   .attr('transform','translate(0,'+stripHeight/2+')')
  //   .attr("d", (d, i) => {
  //     // Get the Voronoi cell as a polygon
  //     const cell = voronoi.cellPolygon(i);

  //     // Clip the cell to have a maximum radius
  //     const clippedCell = clipPolygonToCircle(cell, d.x, d.y, maxRadius);

  //     // Convert the clipped cell to a path string
  //     return clippedCell ? "M" + clippedCell.join("L") + "Z" : null;
  // }) .attr("fill", "none")
  //   .attr("stroke","black")
  //   .attr("stroke-width","3px")
  //   .attr('class','cells')
// console.log(voroniGroup)
//     voroniGroup.append("circle")
//     .attr("r", "6")
//     .attr("cx", function(d) {console.log(d); return d.x; })
//     .attr("cy", function(d) { return d.y +100; })
//     .attr("class", function(d,i) { return "cell cell" + (runningtotal + i)})
//     .attr("fill","green");


    // .on("mouseover", function(d,i) {
    //   pathidstr = d3.select(this).attr("class");
    //   pathid = +pathidstr.substr(4);

    //   changetext(d.value, d.unique);
    //   $("#dropselect").val("id" + pathid).trigger("chosen:updated");
    //   d3.select(".cell" + pathid).classed("cellsselected",true)
    // })
    // .on("click", function(d) {
    //
    // 	d3.selectAll(".cells path").style("pointer-events","none");
    // 	clicked = true;
    //
    //
    // })
//     .on("mouseout", function(d,i) {

//       pathidstr = d3.select(this).attr("class");
//       pathid = +pathidstr.substr(4);

//       d3.select("#info").html("");
//       $("#dropselect").val("").trigger("chosen:updated");
//       d3.select(".cell" + pathid).classed("cellsselected",false)

//       if(clicked == true) {
//        changetext(d.data.value, d.data.name)

//         $("#dropselect").val("id" + pathid).trigger("chosen:updated");
//         d3.select(".cell" + pathid).classed("cellsselected",true)

//       }
//     })
// ;


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
          .html("Type to select an occupation")


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



// // Function to clip a polygon to a circle with a given center and maximum radius
function clipPolygonToCircle(polygon, cx, cy, radius) {
  const clippedPolygon = [];
  for (const point of polygon) {
      const dx = point[0] - cx;
      const dy = point[1] - cy;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared <= radius * radius) {
          clippedPolygon.push(point);
      } else {
          // Calculate the intersection point with the circle's boundary
          const angle = Math.atan2(dy, dx);
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          clippedPolygon.push([x, y]);
      }
  }
  return clippedPolygon.length > 0 ? clippedPolygon : null;
}


var aveSmall = 0.297
var aveMed = -0.253
var aveLarge = -0.811
var aveCity = -2.484
var aveInner = 0.5
var aveOuter = 0.5

// svg.append("text")
// .attr('class','annotationText')
// // .attr('class','averageLine')
// .text("Average")
// .attr('y',y("Small towns")+10)
// .attr('x',x(aveSmall))
// .attr("text-anchor","middle")
// // .attr('stroke','#016e5d')


svg.append("line")
.attr('class','averageLine')
.attr('y1',y("Small towns")+stripHeight*0.15)
.attr('y2',y("Small towns")+stripHeight*0.85)
.attr('x1',x(aveSmall))
.attr('x2',x(aveSmall))
.attr('stroke',config.essential.colour_palette_average[1])


svg.append("line")
.attr('class','averageLine')
.attr('y1',y("Medium towns")+stripHeight*0.15)
.attr('y2',y("Medium towns")+stripHeight*0.85)

.attr('x1',x(aveMed))
.attr('x2',x(aveMed))
.attr('stroke',config.essential.colour_palette_average[1])


svg.append("line")
.attr('class','averageLine')
.attr('y1',y("Large towns")+stripHeight*0.15)
.attr('y2',y("Large towns")+stripHeight*0.85)
.attr('x1',x(aveLarge))
.attr('x2',x(aveLarge))
.attr('stroke',config.essential.colour_palette_average[1])


svg.append("line")
.attr('class','averageLine')
.attr('y1',y("City (excluding London)")+stripHeight*0.15)
.attr('y2',y("City (excluding London)")+stripHeight*0.85)
.attr('x1',x(aveCity))
.attr('x2',x(aveCity))
.attr('stroke',config.essential.colour_palette_average[1])


svg.append("svg:defs").append("svg:marker")
.attr("id", "annotation_arrowhead")
.attr("class","annotation_arrow")
.attr("refX", 9)
.attr("refY", 10)
.attr("markerWidth", 20)
.attr("markerHeight", 20)
.attr("orient", "auto")
.append("path")
.attr("d", "M2,5 L10,10 L2,15")  




svg.append("path")
.attr("class","annotation_arrow")
.attr("id","annotation-arrow-south-west")
.data(graphic_data)
.attr("d", function(d) {
return draw_curve(
  x(aveMed)+33,
  y("Medium towns")+stripHeight*0.15-24,
  x(aveMed),
  y("Medium towns")+stripHeight*0.15-5,
  false);
})
.attr("marker-end", "url(#annotation_arrowhead2)");



// svg.append("text")
// .data(graphic_data)
// .text("Average for size group")
// .attr("class","annotation-text")
// .attr("id","annotation-london")
// .attr("x",   x(0.297)+45)
// .attr("y",y("Small towns")+stripHeight*0.85)
// .attr("dy",y("Small towns")+stripHeight*0.85)
// .style("text-anchor","start")
// .call(wrap,chart_width*0.4);


svg.append("text")
.data(graphic_data)
.text("Average for size group")
.attr("class","annotation-text")
.attr("id","annotation-london")
.attr("x",   x(aveMed)+45)
.attr("y",y("Medium towns")+stripHeight*0.15-20)
.attr("dy",y("Medium towns")+stripHeight*0.15-20)
.style("text-anchor","start")
.call(wrap,chart_width*0.4);

// svg.append("text")
// .data(graphic_data)
// .text("Average for size group")
// .attr("class","annotation-text")
// .attr("id","annotation-london")
// .attr("x",   x(0.297)+45)
// .attr("y",y("Small towns")+stripHeight*0.85)
// .attr("dy",y("Small towns")+stripHeight*0.85)
// .style("text-anchor","start")
// .call(wrap,chart_width*0.4);

// svg.append("text")
// .data(graphic_data)
// .text("Outer London")
// .attr("class","annotation-text")
// .attr("id","annotation-london")
// .attr("x", x(1.262)+57)
// .attr("y",y("Small towns")+stripHeight-17)
// // .attr("dy",y("London"))
// .style("text-anchor","start")
// .call(wrap,chart_width-x(3)-9);

// svg.append("line")
// .attr('y1',y("Small towns"))
// .attr('y2',y("Small towns")+stripHeight)
// .attr('x1',x(1))
// .attr('x2',x(1.1))
// .attr('stroke','black')
// // .attr('stroke-width',1)
// svg.append("path")
// .attr("class","annotation_arrow")
// .attr("id","annotation-arrow-south-west")
// .data(graphic_data)
// .attr("d", function(d) {
// return draw_curve(
//   x(0.068)+50,
//   y("London")+stripHeight/2-17,
//   x(0.068)+10,
//   y("London")+stripHeight/2-5,
//   false);
// })
// .attr("marker-end", "url(#annotation_arrowhead2)");

// svg.append("path")
// .attr("class","annotation_arrow")
// .attr("id","annotation-arrow-south-west")
// .data(graphic_data)
// .attr("d", function(d) {
// return draw_curve(
//   x(1.262)+50,
//   y("London")+stripHeight/2-17,
//   x(1.262)+10,
//   y("London")+stripHeight/2-5,
//   false);
// })
// .attr("marker-end", "url(#annotation_arrowhead2)");

svg.append("path")
.attr("class","annotation_arrow")
.attr("id","annotation-arrow-south-west")
.data(graphic_data)
.attr("d", function(d) {
return draw_curve(
  x(0.068)-14,
  y("London")+stripHeight/2+30,
  x(0.068)-2,
  y("London")+stripHeight/2+7,
  false);
})
.attr("marker-end", "url(#annotation_arrowhead2)");

svg.append("path")
.attr("class","annotation_arrow")
.attr("id","annotation-arrow-south-west")
.data(graphic_data)
.attr("d", function(d) {
return draw_curve(
  x(1.262)+12,
  y("London")+stripHeight/2+30,
  x(1.262)+2,
  y("London")+stripHeight/2+7,
  true);
})
.attr("marker-end", "url(#annotation_arrowhead2)");


svg.append("text")
.data(graphic_data)
.text("Inner London")
.attr("class","annotation-text")
.attr("id","annotation-london")
.attr("x",x(0.068))
.attr("y",y("London")+stripHeight/2+45)
// .attr("dy",y("London"))
.style("text-anchor","end")
// .call(wrap,chart_width-x(3)-9);

svg.append("text")
.data(graphic_data)
.text("Outer London")
.attr("class","annotation-text")
.attr("id","annotation-london")
.attr("x",x(1.262))
.attr("y",y("London")+stripHeight/2+45)
// .attr("dy",y("London"))
.style("text-anchor","start")
//   svg.append("line")
//   .attr("x1",x(-11))
//   .attr("x2",x(-13.5))
//   .attr("y1",height-15)
//   .attr("y2",height-15)
//   .attr("class","annotation_arrow")
//   .attr("marker-end", "url(#annotation_arrowhead)");



//   svg.append("text")
//   .data(graphic_data)
//   .text("Higher attainment")
//   .attr("class","annotation-text")
//   .attr("id","annotation-london")
//   .attr("x",x(11)-5)
//   .attr("y",height-10)
//   // .attr("dy",y("London"))
//   .style("text-anchor","end")
//   // .call(wrap,chart_width-x(3)-9);
  
  
//     svg.append("line")
//     .attr("x1",x(11))
//     .attr("x2",x(13.5))
//     .attr("y1",height-15)
//     .attr("y2",height-15)
//     .attr("class","annotation_arrow")
//     .attr("marker-end", "url(#annotation_arrowhead)");
  


    svg.append("text")
    .data(graphic_data)
    .text("Lower attainment")
    .attr("class","annotation-text")
    .attr("id","annotation-london")
    .attr("x",x(-11)+5)
    .attr("y",-28)
    // .attr("dy",y("London"))
    .style("text-anchor","start")
    // .call(wrap,chart_width-x(3)-9);
    
    
      svg.append("line")
      .attr("x1",x(-11))
      .attr("x2",x(-11.9))
      .attr("y1",-33)
      .attr("y2",-33)
      .attr("class","annotation_arrow")
      .attr("marker-end", "url(#annotation_arrowhead2)");
    
    
    
      svg.append("text")
      .data(graphic_data)
      .text("Higher attainment")
      .attr("class","annotation-text")
      .attr("id","annotation-london")
      .attr("x",x(11)-5)
      .attr("y",-28)
      // .attr("dy",y("London"))
      .style("text-anchor","end")
      // .call(wrap,chart_width-x(3)-9);
      
      
        svg.append("line")
        .attr("x1",x(11))
        .attr("x2",x(11.9))
        .attr("y1",-33)
        .attr("y2",-33)
        .attr("class","annotation_arrow")
        .attr("marker-end", "url(#annotation_arrowhead2)");
      

        svg.append("svg:defs").append("svg:marker")
        .attr("id", "annotation_arrowhead2")
        .attr("class","annotation_arrow")
        .attr("refX", 9)
        .attr("refY", 10)
        .attr("markerWidth", 20)
        .attr("markerHeight", 20)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M2,7 L8,10 L2,13")  
// //adds annotation text

// function tick(){};

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
.attr('y',-10)
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
