function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var samplesXArray = samples.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var samplesX = samplesXArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = samplesX.otu_ids;
    var otuLabels = samplesX.otu_labels;
    var sampleValues = samplesX.sample_values;

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var newArray = otuIds.map((value, index) => {
      return {
        otu_ids: value, 
        otu_labels: otuLabels[index], 
        sample_values: sampleValues[index]
      }
    });

    newArray.sort(function(a, b) {
      return parseFloat(b.sampleValues) - parseFloat(a.sampleValues);
    });
    newArray2 = newArray.slice(0, 10);
    newArray2 = newArray2.reverse();

    // Create the trace for the bar chart. 
    var barData = {
      x: newArray2.map(row => row.sample_values),
      y: newArray2.map(row => "OTU " + row.otu_ids.toString()),
      text: newArray2.map(row => "OTU " + row.otu_ids.toString()),
      name: "Bacteria",
      type: "bar",
      orientation: "h",
      opacity: 0.75,
      marker: {
        color: newArray2.map(row => row.otu_ids),
        opacity: 0.75,
      }
    };

    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 0,
        t: 50,
        b: 50
      },
      paper_bgcolor: 'gray',
      plot_bgcolor: 'gray',
      font: { color: "ghostwhite", family: "Arial" }
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: newArray.map(row => row.otu_ids),
      y: newArray.map(row => row.sample_values),
      text: newArray.map(row => row.otu_labels),
      mode: 'markers',
      marker: {
        color: newArray.map(row => row.otu_ids),
        size: newArray.map(row => row.sample_values)
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title:"OTU ID"},
      showlegend: false,
      paper_bgcolor: 'gray',
      plot_bgcolor: 'gray',
      font: { color: "ghostwhite", family: "Arial" }
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metaData = data.metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(metaData)
    // Create a variable that holds the washing frequency.
    var washNumber = metaData[0].wfreq;  

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },      
      value: washNumber,
      number: { suffix: " / week" },
      title: { text: "Belly Button Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      // bordercolor: "gray",
      gauge: {
        bar: { color: "ghostwhite", thickness: .6},
        axis: { range: [null, 10] },
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: '#ff778b', line: { color: "whitesmoke", width: 3 } },
          { range: [1, 2], color: '#f9877e', line: { color: "whitesmoke", width: 3 } },
          { range: [2, 3], color: '#fda275', line: { color: "whitesmoke", width: 3 } },
          { range: [3, 4], color: '#ffca89', line: { color: "whitesmoke", width: 3 } },
          { range: [4, 5], color: '#ffd376', line: { color: "whitesmoke", width: 3 } },
          { range: [5, 6], color: '#fee37a', line: { color: "whitesmoke", width: 3 } },
          { range: [6, 7], color: '#eae687', line: { color: "whitesmoke", width: 3 } },
          { range: [7, 8], color: '#cbdf9b', line: { color: "whitesmoke", width: 3 } },
          { range: [8, 9], color: '#a4d7a6', line: { color: "whitesmoke", width: 3 } },
          { range: [9, 10], color: '#9ec6b6', line: { color: "whitesmoke", width: 3 } }
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 360,
      margin: { t: 50, b: 0, l: 50},
      paper_bgcolor: "gray",
      font: { color: "whitesmoke", family: "Arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
