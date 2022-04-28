var mapData, policeData, personSvg, stateData;

document.addEventListener("DOMContentLoaded", () => {
  
    //Add event listeners to selects
    d3.select("#raceSelect")
      .on("change",function(d){
        var values = Array.from(this.options)
          .filter(function(option) { return option.selected })
          .map(function(option) { return option.value; });
        raceSelection = values;
        drawline();
      });
  
    d3.select("#genderSelect")
      .on("change", function(d){
        genderSelection = d3.select(this).property('value');
        drawline();
        });
  
  
    // Load both files before doing anything else
    Promise.all([
      d3.json("data/us.geojson"),
      d3.csv("data/police_shootings.csv"),
      d3.xml("data/person.svg")
    ]).then(function (values) {
      mapData = values[0];
      policeData = values[1];
      personSvg = values[2].documentElement;
      d3.select(personSvg)
        .attr('width', '24')
        .attr('height', '24')
        .attr('opacity', '0')
        .attr('class', 'death');
        
      // stateData contains the number of occurences in each state
      stateData = {};
      policeData.forEach(e => {
        if(stateData[e["Incident.Location.State"]] != null)
          stateData[e["Incident.Location.State"]] += 1;
        else 
          stateData[e["Incident.Location.State"]] = 1;
      });
      drawMap();
    });
  });