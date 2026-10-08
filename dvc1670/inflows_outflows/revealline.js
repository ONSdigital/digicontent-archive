function revealline(selection) {
  t=d3.transition().duration(500)

  d3.selectAll(".frontlines")
    .transition(t)
    .style("opacity", 0)
  d3.selectAll(".frontlines" + selection.replace(/ /g,""))
    .raise()
    .transition(t)
    .style("opacity", 1)


  current_value1 = d3.select(".frontlines" + selection.replace(/ /g,"")).node().getAttribute("data-last")
  current_year1 = d3.select(".frontlines" + selection.replace(/ /g,"")).node().getAttribute("data-date")
  current_area1 = selection

  d3.select("#infohidden").text("On " + current_year1 + " in " + selection + " the most recent index value was " + current_value1 + ". The index is based on "+dvc.essential.yAxisLabel+".")
}
