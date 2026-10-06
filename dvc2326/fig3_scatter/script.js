var graphic = d3.select('#graphic');
var pymChild = null;

function drawGraphic() {

  //population accessible summmary
  d3.select('#accessibleSummary').html(config.essential.accessibleSummary)

  var threshold_md = config.optional.mediumBreakpoint;
  var threshold_sm = config.optional.mobileBreakpoint;

  //set variables for chart dimensions dependent on width of #graphic
  if (parseInt(graphic.style("width")) < threshold_sm) {
    size = "sm"
  } else if (parseInt(graphic.style("width")) < threshold_md) {
    size = "md"
  } else {
    size = "lg"
  }

  var margin = config.optional.margin[size]
  var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
  //height is set by unique options in column name * a fixed height + some magic because scale band is all about proportion
  // var height = (config.optional.seriesHeight[size] * graphic_data.length) + (10*(graphic_data.length-1)) + 12

  var height = Math.ceil((chart_width * config.optional.aspectRatio[size][1]) / config.optional.aspectRatio[size][0]);


  // clear out existing graphics
  graphic.selectAll("*").remove();

  //set up scales
  const x = d3.scaleLinear()
              .range([0, chart_width]);

  const y = d3.scaleLinear()
              .range([height,0]);

  const r = d3.scaleSqrt()



   //set up yAxis generator
  var yAxis = d3.axisLeft(y)
    .tickSize((-chart_width-10))
    // .tickPadding(10)

  //set up xAxis generator
  var xAxis = d3.axisBottom(x)
    .tickSize(-height-10)
    // .tickFormat(d3.format(".0%"))
    .ticks(config.optional.xAxisTicks[size]);

      // Set up the legend
//   var legenditem = d3.select('#legend')
//   .selectAll('div.legend--item')
//   .data(d3.zip(config.essential.legendLabels, config.essential.colour_palette))
//   .enter()
//   .append('div')
//   .attr('class', 'legend--item')

// legenditem.append('div').attr('class', 'legend--icon')
//   .style('background-color', config.essential.colour_palette)

// legenditem.append('div')
//   .append('p').attr('class', 'legend--text').html(function(d) {
//     return d[0]
//   })

  //create svg for chart
  svg = d3.select('#graphic').append('svg')
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "chart")
    .style("background-color", "#fff")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")


// Set the scales for the chart - auto calculates the scale from the data or you can select your own in the config
//X scale
    if(config.essential.xDomain=="auto"){
      x.domain([d3.min(graphic_data,(d) => d.x), d3.max(graphic_data,(d) => d.x)]);

    }else{
      x.domain(config.essential.xDomain);
    }

//Y Scale
    if(config.essential.yDomain=="auto"){
      y.domain([d3.min(graphic_data,(d) => d.y), d3.max(graphic_data,(d) => d.y)]);
    }else{
      y.domain(config.essential.yDomain);
    }

//R scale for the size of the circle
    if(config.essential.rDomain=="auto"){
      r.domain([d3.min(graphic_data,(d) => d.size), d3.max(graphic_data,(d) => d.size)]);
    }else{
      r.domain(config.essential.rDomain);
    }

//R range for the size of the circle - changes dependent on screen size
if (parseInt(graphic.style("width")) < threshold_sm){
  r.range([0,15]);
}else{
  r.domain(config.essential.rDomain);
}

if (parseInt(graphic.style("width")) < threshold_sm){
  r.range([0,15]);
} else if (parseInt(graphic.style("width")) < threshold_md) {
  r.range([0,20]);
} else {
  r.range([0,25])
}

    // console.log(r.domain())
     svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'x axis')
    .call(xAxis).selectAll('line').each(function(d)
      {
        if (d == 0) {
          d3.select(this)
          .attr('class','zero-line')
        };
      })




  svg
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis).selectAll('line').each(function(d)
    {
      if (d == 0) {
        d3.select(this)
        .attr('class','zero-line')
      };
    })
    .selectAll('text').call(wrap,margin.left-10)

    //Vacancy UK average
    svg.append('line')
        .attr('class', 'average')
        .attr('x1',0)
        .attr('x2',(chart_width+15))
        .attr('y1',y(1.19))
        .attr('y2',y(1.19))
        .attr('stroke',"#206095")
        .attr('stroke-width',"2px")
        .attr('stroke-dasharray', 4,4)

            //Wage UK average
    svg.append('line')
    .attr('class', 'average')
    .attr('x1',x(4.36))
    .attr('x2',x(4.36))
    .attr('y1',height)
    .attr('y2',-17)
    .attr('stroke',"#206095")
    .attr('stroke-width',"2px")
    .attr('stroke-dasharray', 4,4)

   // create a tooltip
  var tooltip = d3.selectAll("#legend").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

  var data_format = d3.format(".1f")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "orange")
      .style("opacity", 1)
  }
  var mousemove = function(event, d) {
    if(parseInt(graphic.style("width")) > threshold_md){
      tooltip
      .html('<span style ="color: #206095;font-size: 15px;">'+ d.group +'</span>'+"<br><br>"+'<span style="font-weight:500; opacity:1">'+"Vacancy rate: "+ data_format(d.y)+" p.p."+'</span>'+"<br>"+'<span style="font-weight:500; opacity:1">'+"Wage growth: "+ data_format(d.x)+"%"+'</span>')
      .style("left", (d3.pointer(event)[0]-5) + "px")		
      .style("top", (d3.pointer(event)[1]) + "px")
    }
    else {
      tooltip
      .html('<span style ="color: #206095; font-size: 15px;">'+ d.group +'</span>'+"<br><br>"+'<span style="font-weight:500; opacity:1">'+"Vacancy rate: "+ data_format(d.y)+" p.p."+'</span>'+"<br>"+'<span style="font-weight:500; opacity:1">'+"Wage growth: "+ data_format(d.x)+"%"+'</span>')
      .style("left", 5 + "px")		
      .style("top", 85 + "px")
    }
  
  }
  var mouseleave = function(d) {
    if(parseInt(graphic.style("width")) > threshold_md) {
      tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("opacity", 0.75)
      .style('stroke', (d) => d.highlight == 0 ? config.essential.colour_palette : "#222222")
  
    }
   else {
    tooltip
    .style("opacity", 0)
  d3.select(this)
    .style("opacity", 0.75)
    .style('stroke', config.essential.colour_palette)

   }
  }

  svg.selectAll('circle')
      .data(graphic_data)
      .join('circle')
      .attr('class','dots')
      .attr('cx',(d) => x(d.x))
      .attr('cy',(d) => y(d.y))
      .attr('r',(d) => r(d.size))
      .attr('fill', config.essential.colour_palette)
      .attr('opacity', 0.75)
      .attr('stroke-width', (d) => d.highlight == 0 ? "1px" : "1.5px")
      .attr('stroke', (d) => d.highlight == 0 ? config.essential.colour_palette : "#222222")
      
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("click", function(event, d) {
       d3.pointer(event)[0];
      })

      //remove the highlight stroke on mobile
      if(parseInt(graphic.style("width")) < threshold_md) {
        d3.selectAll('.dots').attr('stroke', config.essential.colour_palette )
      }
//draw legend on desktop

      if(parseInt(graphic.style("width")) > threshold_md) {
        
        var dots_data1 = ["5 million employees work in this industry"]

      
      svg.selectAll('legend_dots1')
      .data(dots_data1)
      .join('circle')
      .attr('class','legend_dots1')
      .attr('cx',(d) => x(-5))
      .attr('cy',(d) => y(2.83))
      .attr('r',(d) => r(5000))
      .attr('fill', config.essential.colour_palette)
      .attr('opacity', 0.75)
      .attr('stroke-width',"1px")
      .attr('stroke',config.essential.colour_palette)
      
    
      

      svg.selectAll('legend_dots2')
      .data(dots_data1)
      .join('circle')
      .attr('class','legend_dots2')
      .attr('cx',(d) => x(0))
      .attr('cy',(d) => y(2.83))
      .attr('r',(d) => r(50))
      .attr('fill', config.essential.colour_palette)
      .attr('opacity', 0.75)
      .attr('stroke-width',"1px")
      .attr('stroke',config.essential.colour_palette)

      var circle_lg_x = (x(-5))*2
      var circle_sm_x = (x(0))

     
       svg.append('text').attr("x",(circle_lg_x)+3).attr("y",(d) => y(2.8)).text("5 million employees").style('font-size',"14px").call(wrap,150)
       svg.append('text').attr("x",(circle_sm_x)+10).attr("y",(d) => y(2.8)).text("50,000 employees").style('font-size',"14px").call(wrap,150)
      }

      else 
      //Draw legend dots for mobile
      {

        var dots_data1 = ["5 million employees work in this industry"]

      
        svg.selectAll('legend_dots1')
        .data(dots_data1)
        .join('circle')
        .attr('class','legend_dots1')
        .attr('cx',(d) => x(-6))
        .attr('cy',-200)
        .attr('r',(d) => r(5000))
        .attr('fill', config.essential.colour_palette)
        .attr('opacity', 0.75)
        .attr('stroke-width',"1px")
        .attr('stroke',config.essential.colour_palette)
        
      
        
  
        svg.selectAll('legend_dots2')
        .data(dots_data1)
        .join('circle')
        .attr('class','legend_dots2')
        .attr('cx',(d) => x(-6))
        .attr('cy',-160)
        .attr('r',(d) => r(50))
        .attr('fill', config.essential.colour_palette)
        .attr('opacity', 0.75)
        .attr('stroke-width',"1px")
        .attr('stroke',config.essential.colour_palette)
  
        var circle_lg_y = (y(3.65))
        var circle_sm_y = (y(3.45))
        var circle_lg_x = (x(-5.2))
        var circle_sm_x = (x(-6))
        
       
         svg.append('text').attr("x",(circle_lg_x)+10).attr("y",-200).text("5 million employees").style('font-size',"14px").call(wrap,150)
         svg.append('text').attr("x",circle_lg_x).attr("y",-160).text("50,000 employees").style('font-size',"14px").call(wrap,150)

      }
      

  //Annotations - draw initial label with bbox rec
  if(parseInt(graphic.style("width")) > threshold_md) {
//FIRST ANNOTATION
svg
.append('text')
.attr('class','annotations')
.attr("x",(d) => x(-4.9))
.attr("y",(d) => y(0.2))
.text("Low vacancy and wage growth")
.style('font-weight', 600)
.attr("fill", "#206095")
// .style('text-anchor',"middle")
.call(wrap, 110)
.each(function (d,i) {var bboxRect = d3.select(this).node().getBBox()
  d3.select(this.parentNode).append('rect').attr('x',function (d) {return bboxRect.x})
    .attr('y',function (d) {return bboxRect.y})
    .attr('height',function (d) {return bboxRect.height})
    .attr('width',function (d) {return bboxRect.width})
    .attr('rx',8)
      .attr('rx',8)
    .attr('fill','white')
    .attr('opacity',0.7);
});

svg
.append('text')
.attr('class','annotations')
.attr("x",(d) => x(-4.9))
.attr("y",(d) => y(0.2))
.text("Low vacancy and wage growth")
.style('font-weight', 600)
.attr("fill", "#206095")
.call(wrap, 110);


//Draw arrows

// svg.append('line')
// .attr('class','line_arrow')
// .attr('x1', x(-4.8))
// .attr('x2', x(-4.8))
// .attr('y1', y(0.1))
// .attr('y2', y(0.38))
// .attr('stroke-width', '1px')
// .attr('stroke', 'black')



//SECOND ANNOTATION

      svg
      .append('text')
      .attr('class','annotations')
      .attr("x",(d) => x(9.5))
      .attr("y",(d) => y(2))
      .text("High vacancy and wage growth")
      .style('text-anchor',"end")
      .style('font-weight', 600)
      .attr("fill", "#206095")
      .call(wrap, 120)
      .each(function (d,i) {var bboxRect = d3.select(this).node().getBBox()
        d3.select(this.parentNode).append('rect').attr('x',function (d) {return bboxRect.x})
          .attr('y',function (d) {return bboxRect.y})
          .attr('height',function (d) {return bboxRect.height})
          .attr('width',function (d) {return bboxRect.width})
          .attr('rx',8)
            .attr('rx',8)
          .attr('fill','white')
          .attr('opacity',0.7);
      });

      svg
      .append('text')
      .attr('class','annotations')
      .style('text-anchor',"end")
      .attr("x",(d) => x(9.5))
      .attr("y",(d) => y(2))
      .text("High vacancy and wage growth")
      .style('font-weight', 600)
      .attr("fill", "#206095")
      .call(wrap, 120)
      

       //legend ANNOTATION

       svg
       .append('text')
       .attr('class','annotations')
       .attr("x",(d) => x(-4.9))
       .attr("y",(d) => y(1.25))
       .text("UK vacancy growth change (p.p.)")
       .style('text-anchor',"start")
       .style('font-weight',600)
       .attr("fill", "#206095")

       svg
       .append('text')
       .attr('class','annotations')
       .attr("x",(d) => x(4.25))
       .attr("y",(d) => y(2.45))
       .text("UK wage growth (%)")
       .style('text-anchor',"end")
       .style('font-weight',600)
       .attr("fill", "#206095")
      //  .call(wrap, 120)
      //  .each(function (d,i) {var bboxRect = d3.select(this).node().getBBox()
      //    d3.select(this.parentNode).append('rect').attr('x',function (d) {return bboxRect.x})
      //      .attr('y',function (d) {return bboxRect.y})
      //      .attr('height',function (d) {return bboxRect.height})
      //      .attr('width',function (d) {return bboxRect.width})
      //      .attr('rx',8)
      //        .attr('rx',8)
      //      .attr('fill','white')
      //      .attr('opacity',0.7);
      //  });

      //  svg
      //  .append('text')
      //  .attr('class','annotations')
      //  .style("color", config.essential.colour_palette)
      //  .style('text-anchor',"start")
      //  .attr("x",(d) => x(-5))
      //  .attr("y",(d) => y(1.2))
      //  .text("Total vacancy growth")
      //  .call(wrap, 120)


//lengend ANNOTATION1
//   svg
//   .append('text')
//   .attr('class','annotations')
//   .attr("x",(d) => x(-4.8))
//   .attr("y",(d) => y(2.8))
//   .style('font-weight', '600')
//   .text("50 thousand people")
//   // .style('text-anchor',"middle")
//   .call(wrap, 100)
//   .each(function (d,i) {var bboxRect = d3.select(this).node().getBBox()
//     d3.select(this.parentNode).append('rect').attr('x',function (d) {return bboxRect.x})
//       .attr('y',function (d) {return bboxRect.y})
//       .attr('height',function (d) {return bboxRect.height})
//       .attr('width',function (d) {return bboxRect.width})
//       .attr('rx',8)
//        .attr('rx',8)
//       .attr('fill','white')
//       .attr('opacity',0.7);
// });

// svg
// .append('text')
// .attr('class','annotations')
// .style('font-weight', '600')
// .attr("x",(d) => x(-4.8))
// .attr("y",(d) => y(2.8))
// .text("50 thousand people")
// .call(wrap, 100)

 //lengend ANNOTATION2
//  svg
//  .append('text')
//  .attr('class','annotations')
//  .attr("x",(d) => x(0.4))
//  .attr("y",(d) => y(2.8))
//  .text("5 million people")
//  .style('font-weight', '600')
//  .style('text-anchor',"middle")
//  .call(wrap, 100)
//    .each(function (d,i) {var bboxRect = d3.select(this).node().getBBox()
//      d3.select(this.parentNode).append('rect').attr('x',function (d) {return bboxRect.x})
//        .attr('y',function (d) {return bboxRect.y})
//        .attr('height',function (d) {return bboxRect.height})
//        .attr('width',function (d) {return bboxRect.width})
//        .attr('rx',8)
//         .attr('rx',8)
//        .attr('fill','white')
//        .attr('opacity',0.7);
//  });

//  svg
//  .append('text')
//  .attr('class','annotations')
//  .style('font-weight', '600')
//  .attr("x",(d) => x(-0.2))
//  .attr("y",(d) => y(2.8))
//  .text("5 million people")
//  .call(wrap, 100)

//Text labels for highlighted industries
  }
  


if(parseInt(graphic.style("width")) > threshold_md){
  svg.selectAll('text.dataLabels')
  .data(graphic_data)
  .join('text')
  .attr("class",function(d,i) {return "ticky"+i})
  .style('font-size',"14px")
  .style('font-weight',500)
  .attr('x',(d) => x(d.x))
  .attr('y',(d) => y(d.y)-22)
  .style('text-anchor',"end")
  .text((d) => d.highlight == 0 ? null : d.group)      
}//end if for datalabels



d3.selectAll(".ticky0").attr('dy',17).attr('dx', 42) //Mining
d3.selectAll(".ticky2").attr('dy',30).attr('dx',50) //Water
d3.selectAll(".ticky4").attr('dy',-8).attr('dx',-5) //Retail
d3.selectAll(".ticky14").attr('dy',10).attr('dx',-25) //Health
d3.selectAll(".ticky11").attr('dy',22).attr('dx',-25) //Administration
d3.selectAll(".ticky12").attr('dy',18).attr('dx',-18) //Public admin
d3.selectAll(".ticky9").attr('dy',4)//Property
d3.selectAll(".ticky8").attr('dx',52).attr('dy',3)//Finance
d3.selectAll(".ticky10").attr('dx',50).attr('dy',-5) //Professional and sci
d3.selectAll(".ticky15").attr('dx',130).attr('dy',5) //Arts
d3.selectAll(".ticky13").attr('dx',-20).attr('dy',7) //Education

if(parseInt(graphic.style("width")) > threshold_sm){
  svg
  .append('text')
  .attr('class','annotations')
  .attr("x",(d) => x(-4.9))
  .attr("y",(d) => y(1.25))
  .text("UK vacancy growth change (p.p.)")
  .style('text-anchor',"start")
  .style('font-weight',600)
  .attr("fill", "#206095")
  
  svg
  .append('text')
  .attr('class','annotations')
  .attr("x",(d) => x(4.25))
  .attr("y",(d) => y(2.45))
  .text("UK wage growth (%)")
  .style('text-anchor',"end")
  .style('font-weight',600)
  .attr("fill", "#206095")

  svg
.append('g')
.attr('transform', 'translate(0,' + height + ')')
.append('text')
.attr('x',chart_width)
.attr('y',35)
.attr('class','axis--label')
.text(config.essential.xAxisLabel)
.attr('text-anchor','end');

//This does the y-axis label

svg
.append('g')
.attr('transform', 'translate(0,0)')
.append('text')
.attr('x',-20)
.attr('y',-30)
.attr('class','axis--label')
.attr('id','yAxisLabel')
.text(config.essential.yAxisLabel)
.attr('text-anchor','start')
// .call(wrap,240);
      
}//end if for average annotations medium

// // This does the x-axis label



if(parseInt(graphic.style("width")) < threshold_sm){
  svg
  .append('text')
  .attr('class','annotations')
  .attr("x",(d) => x(-4.9))
  .attr("y",(d) => y(1.3))
  .text("UK vacancy growth change (p.p.)")
  .style('text-anchor',"start")
  .style('font-weight',600)
  .attr("fill", "#206095")
  .call(wrap, 180)
  
  svg
  .append('text')
  .attr('class','annotations')
  .attr("x",(d) => x(4.25))
  .attr("y",(d) => y(2.45))
  .text("UK wage growth (%)")
  .style('text-anchor',"end")
  .style('font-weight',600)
  .attr("fill", "#206095")

  svg
.append('g')
.attr('transform', 'translate(0,0)')
.append('text')
.attr('x',-20)
.attr('y',-30)
.attr('class','axis--label')
.attr('id','yAxisLabel')
.text(config.essential.yAxisLabel)
.attr('text-anchor','start')
.call(wrap,240);

svg
.append('g')
.attr('transform', 'translate(0,' + height + ')')
.append('text')
.attr('x',chart_width)
.attr('y',35)
.attr('class','axis--label')
.text(config.essential.xAxisLabel)
.attr('text-anchor','end');
      
}//end if for average annotations medium






    // if (parseInt(graphic.style("width")) < threshold_sm) {d3.selectall('#yAxisLabel').call(wrap,200)}

//     drawD3Annotations = function() {

//       console.log(y.domain());
//       console.log(x.domain());
//       var annotations = [
//         {
//           type:d3.annotationLabel,
//           note: {
//             label: "My label",
//             bgPadding: 0,
//             wrap: 200,
//             // align: "right"
//           },
//           //can use x, y directly instead of data
//           x:x(0.5),
//           y:y("Manufacture of beverages"),
//           // className: "show-bg",
//           dx: -80,
//           dy: 0,
//           disable: "connector"
//           // connector:{
//           //   end:"arrow",
//           //   type:"curve",
//           //   points:[[-3, -3],[-5,-10],[-60,-10]]
//           // }
//         },
//         {
//           type:d3.annotationLabel,
//           //can use x, y directly instead of data
//           x:x(0.5),
//           y:y("Accommodation") - y("All businesses"),
//           dx: x(0.5)
//               - x(0.1),
//           dy: 0,
//           connector:{
//             end:"arrow",
//             type:"curve",
//             points:[[10, 0]]
//           }
//         }

//       ]


//       var makeAnnotations = d3.annotation()
//         // .notePadding(15)
//         .accessors({
//           x: function(d){return x(0.5)},
//           y: function(d){return y("Accommodation")},
//           // dx: function(d){console.log(d); return x(d3.timeParse(dvc.essential.dateFormat)("1/10/2020"))-x(d3.timeParse(dvc.essential.dateFormat)(d.dx))}
//         })
//         .annotations(annotations)

//         if (parseInt(graphic.style("width")) > threshold_sm) {
//             svg.append("g")
//               .attr("class", "annotation-group")
//               .call(makeAnnotations)
//         }
//         // else {
//         //   d3.select("#keypoints").append("p")
//         //     .text(annotations[0].note.label)
//         //     .attr("font-family", "'Open Sans', sans-serif")
//         //     .attr("font-size", "16px")
//         //     .attr("color", "#666")
//         //     .attr("font-weight", 500)
//         //
//         // }
//     }

//     // drawD3Annotations()
  
//create legend 





  //create link to source
  d3.select("#source")
    .text("Source – " + config.essential.sourceText)

  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }
}///END DRAW GRAPHIC

function wrap(
  text,
  width,
  dyAdjust,
  lineHeightEms,
  lineHeightSquishFactor,
  splitOnHyphen,
  centreVertically
) {
  // Use default values for the last three parameters if values are not provided.
  if (!lineHeightEms) lineHeightEms = 1.15;
  if (!lineHeightSquishFactor) lineHeightSquishFactor = 1;
  if (splitOnHyphen == null) splitOnHyphen = true;
  if (centreVertically == null) centreVertically = true;

  text.each(function () {
    var text = d3.select(this),
      x = text.attr("x"),
      y = text.attr("y");

    var words = [];
    text
      .text()
      .split(/\s+/)
      .forEach(function (w) {
        if (splitOnHyphen) {
          var subWords = w.split("-");
          for (var i = 0; i < subWords.length - 1; i++)
            words.push(subWords[i] + "-");
          words.push(subWords[subWords.length - 1] + " ");
        } else {
          words.push(w + " ");
        }
      });

    text.text(null); // Empty the text element

    // `tspan` is the tspan element that is currently being added to
    var tspan = text.append("tspan");

    var line = ""; // The current value of the line
    var prevLine = ""; // The value of the line before the last word (or sub-word) was added
    var nWordsInLine = 0; // Number of words in the line
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      prevLine = line;
      line = line + word;
      ++nWordsInLine;
      tspan.text(line.trim());
      if (tspan.node().getComputedTextLength() > width && nWordsInLine > 1) {
        // The tspan is too long, and it contains more than one word.
        // Remove the last word and add it to a new tspan.
        tspan.text(prevLine.trim());
        prevLine = "";
        line = word;
        nWordsInLine = 1;
        tspan = text.append("tspan").text(word.trim());
      }
    }

    var tspans = text.selectAll("tspan");

    var h = lineHeightEms;
    // Reduce the line height a bit if there are more than 2 lines.
    if (tspans.size() > 2)
      for (var i = 0; i < tspans.size(); i++) h *= lineHeightSquishFactor;

    tspans.each(function (d, i) {
      // Calculate the y offset (dy) for each tspan so that the vertical centre
      // of the tspans roughly aligns with the text element's y position.
      var dy = i * h;
      
      
      if (centreVertically) dy -= ((tspans.size() - 1) * h) / 2;
      d3.select(this)
        .attr("y", y)
        .attr("x", x)
        .attr("dy", dy + "em");
    });
  });
}//end wrap







d3.csv(config.essential.graphic_data_url)
  .then(data => {
    //load chart data
    data.forEach(function(d) {
      d.x = +d.x;
      d.y = +d.y;
      d.size = +d.size;
      d.highlight = +d.highlight;
    });

    graphic_data = data
        //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  });
