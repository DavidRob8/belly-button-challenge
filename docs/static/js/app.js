// Get the endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Creating empty list that will hold arrays as a list
globalData = []

// Fetch the JSON data and console log it
d3.json(url).then(data => init(data));

// contains functions for intitial/default views once webpage is opened
function init(element){
  //console.log(element);
  globalData.push(element);
  console.log(globalData);
  createMenu(element.names);
  createPlot(element.names[0]);
  createBubble(element.names[0]);
  infoPanel(element.names[0]);

};

// Creating menu option for user to select subject ID
function createMenu(names){
  //console.log(names);
  d3.select("select")
      .selectAll("option")
      .data(names)
      .enter()
      .append("option")
      .text(function (d) {return d;})
      .attr("value", function (d,i) { return d;})
}

// Creates function for when a user changes subject ID in the webpage
function changeSample(subjectID){
  // console.log(subjectID);
  createPlot(subjectID);
  createBubble(subjectID)
  infoPanel(subjectID)
}

// Creates horizontal bar graph for top ten OTUs per subject ID
function createPlot(subjectID){
  //console.log(subjectID);
  data = globalData[0].samples;
  //console.log(data);
  // this formula is helpful for all the functions
  sampledata = data.filter(x => x.id == subjectID)[0];
  // console.log(sampledata)
  
  xdata = sampledata.sample_values.slice(0,10);
  ydata = sampledata.otu_ids.slice(0,10);
  ydata = ydata.map(x => 'OTU ' + x);
  hovertext = sampledata.otu_labels.slice(0,10);


  var trace = {
    x: xdata,
    y: ydata,
    text: hovertext,
    type: "bar",
    orientation: "h"
  }; 

  var data = [trace];
  var layout = {
    title: {text: "Top 10 OTUs Subject " + subjectID},
    xaxis: {title: "Sample Values"},
    yaxis: {autorange: "reversed"}
  }
  Plotly.newPlot("bar", data, layout);
}

// Creates bubble chart
function createBubble(subjectID){
  bubbleData = globalData[0].samples;
  //console.log(bubbleData);

  sampledata = bubbleData.filter(x => x.id == subjectID)[0];
  //console.log(sampledata)

  xdata = sampledata.otu_ids;
  ydata = sampledata.sample_values;
  hovertext = sampledata.otu_labels;
  //console.log(xdata)
  // console.log(ydata)
  // console.log(hovertext)

  var trace1 = {
    x: xdata,
    y: ydata,
    text: hovertext,
    mode: 'markers',
    marker: {
      color: bubbleColors(xdata),
      size: ydata
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: 'Bubble Chart',
    showlegend: false,
    height: 600,
    width: 1000
  };
  
  Plotly.newPlot('bubble', data, layout);
}

// Function to create different color bubbles based off otu IDs
function bubbleColors(otuIds){
  var rgblist = [];
  var color = "#000000"
  for (i=0; i<otuIds.length; i++){
    if (otuIds[i] < 200) { color = "#6600CC";}
    else if (otuIds[i] < 400) { color = "#0066CC";}
    else if (otuIds[i] < 500) { color = "#00CCCC";}
    else if (otuIds[i] < 1000) { color = "#99FF99";}
    else if (otuIds[i] < 1500) { color = "#CCFF99";}
    else if (otuIds[i] < 2000) { color = "#CD853F";}
    else if (otuIds[i] < 2500) { color = "#BC8F8F";}
    else if (otuIds[i] < 4000) { color = "#FAF0E6";}
    else { color = "#00CCCC";}
    rgblist.push(color);
  }
  // rgbColors = ['#6600CC', '#0066CC', '#00CCCC', '#99FF99', '#CCFF99', '#CD853F', '#BC8F8F', '#FAF0E6']

  return rgblist;
}

// Demographic Info table for user-selected Subject ID
function infoPanel(subjectID){
  infoData = globalData[0].metadata;
  sampledata = infoData.filter(x => x.id == subjectID)[0];

  let demTable = d3.select('#sample-metadata');
  demTable.html(
    `id: ${sampledata.id} <br> 
    ethnicity: ${sampledata.ethnicity} <br>
    gender: ${sampledata.gender} <br>
    age: ${sampledata.age} <br>
    location: ${sampledata.location} <br>
    bbtype: ${sampledata.bbtype} <br>
    wfreq: ${sampledata.wfreq}`
);

}