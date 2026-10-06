function filterChange() {
    let dropdownselection = document.querySelector("#dropdown_child").options[document.querySelector("#dropdown_child").selectedIndex].getAttribute("domain_filter");

    d3.selectAll(".topic").style("display", "none")

    d3.selectAll("." + dropdownselection + "-head").style("display", "block")

    //This works because of the order of the classes - I think
    d3.selectAll("." + dropdownselection + "domain" + "." + displayRadioValue()).style("display", "block")

  }

  function displayRadioValue() {

    var ele = document.getElementsByTagName('input');
    for (let i = 0; i < ele.length; i++) {
      if (ele[i].type = "radio") {
  
        if (ele[i].checked) {
          // console.log(ele[i].value);
          return ele[i].value;
        }
  
      }
    }
  }