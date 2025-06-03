    require([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/MapImageLayer",
      "esri/widgets/LayerList",
      "esri/widgets/Legend",
      "esri/widgets/Expand",
       "esri/widgets/Home"
    ], function(Map, MapView, MapImageLayer,LayerList,Legend,Expand,Home) {

      const waterNetworkLayer = new MapImageLayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Water_Network/MapServer",
        sublayers: [
          {
            id: 16,
            visible: true
          }
        ]
      });

      const map = new Map({
        basemap: "topo-vector",
        layers: [waterNetworkLayer]
      });

      const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-117.1825, 34.055], // center near the dataset
        zoom: 15
      });

      // Add LayerList widget
      const layerList = new LayerList({
        view: view
      });
      view.ui.add(layerList, "top-right");

      // Add Legend widget
      const legend = new Legend({
        view: view
      });
      view.ui.add(legend, "bottom-right");
      const homeWidget = new Home({
    view: view
  });
  view.ui.add(homeWidget, "top-left");  // Adds near zoom controls

      document.getElementById("layerSelect").addEventListener("change", function (e) {
        const val = e.target.value;
        if (val === "Material") {
          view.goTo({
            center: [77.5946, 12.9716], // Bangalore [lon, lat]
            zoom: 13
          });
        } else if (val === "Diameter") {
          view.goTo({
            center: [-98.5795, 39.8283], // Geographic center of  USA
            zoom: 4
          });
        }
          });


  // Display chart panel
  const expandChart = new Expand({
    view: view,
    content: document.getElementById("chartContainer"),
    expanded: true
  });
  view.ui.add(expandChart, "top-left");

  // Show chart container
  document.getElementById("chartContainer").style.display = "block";

  // Dummy pie chart with hardcoded data
  const ctx = document.getElementById("pieChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Pipe A", "Pipe B", "Pipe C"],
      datasets: [{
        data: [45, 25, 30],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"]
      }]
    },
    options: {
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });

});