    require([
      "esri/Map",
      "esri/views/MapView",
      // "esri/layers/MapImageLayer",
      "esri/widgets/LayerList",
      "esri/widgets/Legend",
       "esri/widgets/Home",
       "esri/layers/FeatureLayer",
       "esri/renderers/UniqueValueRenderer",
       "esri/renderers/ClassBreaksRenderer",
       "esri/symbols/SimpleLineSymbol",
    ], function(Map, MapView, LayerList,Legend,Home,FeatureLayer,UniqueValueRenderer,ClassBreaksRenderer,SimpleLineSymbol) {

      // const waterNetworkLayer = new MapImageLayer({
      //   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Water_Network/MapServer",
      //   sublayers: [
      //     {
      //       id: 16,
      //       visible: true
      //     }
      //   ]
      // });

      const waterNetworkLayer2 = new FeatureLayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Water_Network/MapServer/16",
        outFields: ["*"],
        title: "Water Mains"
        // sublayers: [
        //   {
        //     id: 16,
        //     visible: true
        //   }
        // ]
      });

      const map = new Map({
        basemap: "topo-vector",
        layers: [waterNetworkLayer2]
      });

      const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-88.14799, 41.77088], // center near the dataset
        zoom: 18
        //41.77088 Longitude: -88.14799
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

  view.on("click", function(event) {
  // Convert the map point to geographic coordinates (WGS84)
  const latLonPoint = event.mapPoint.clone().normalize();
  const lon = latLonPoint.longitude.toFixed(5);
  const lat = latLonPoint.latitude.toFixed(5);

  console.log("Latitude:", lat, "Longitude:", lon);
});

      // document.getElementById("layerSelect").addEventListener("change", function (e) {
      //   const val = e.target.value;
      //   if (val === "Material") {
      //     view.goTo({
      //       center: [77.5946, 12.9716], // Bangalore [lon, lat]
      //       zoom: 13
      //     });
      //   } else if (val === "Diameter") {
      //     view.goTo({
      //       center: [-98.5795, 39.8283], // Geographic center of  USA
      //       zoom: 4
      //     });
      //   }
      //     });


          //symbology start
            document.getElementById("layerSelect").addEventListener("change", function () {
    const field = this.value;

    if (field === "material") {
      // Unique renderer for coded values
      const renderer = new UniqueValueRenderer({
        field: "material",
        uniqueValueInfos: [
          {
            value: "CAS",
            symbol: getLineSymbol("#1f77b4"),
            label: "CAS"
          },
          {
            value: "DIP",
            symbol: getLineSymbol("#ff7f0e"),
            label: "DIP"
          },
          {
            value: "UNK",
            symbol: getLineSymbol("#2ca02c"),
            label: "UNK"
          }
          
        ]
      });
      waterNetworkLayer2.renderer = renderer;
    } else if (field === "diameter") {
      // Class breaks for diameter
      const renderer = new ClassBreaksRenderer({
        field: "diameter",
        classBreakInfos: [
          {
            minValue: 0,
            maxValue: 4,
            symbol: getLineSymbol("#d62728", 1.5),
            label: "0\" - 4\""
          },
          {
            minValue: 4.01,
            maxValue: 10,
            symbol: getLineSymbol("#9467bd", 2),
            label: "4\" - 10\""
          },
          {
            minValue: 10.01,
            maxValue: 20,
            symbol: getLineSymbol("#8c564b", 3),
            label: "10\" - 20\""
          }
        ]
      });
      waterNetworkLayer2.renderer = renderer;
    }
    //  waterNetworkLayer2.queryExtent().then(function (response) {
    //   if (response.extent) {
    //     view.goTo(response.extent.expand(1.5));
    //   }
    // });
  });

  

  // Utility to generate line symbols
  function getLineSymbol(color, width = 2) {
    return new SimpleLineSymbol({
      color: color,
      width: width
    });
  }

          //symbology ends


  // Display chart panel
  // const expandChart = new Expand({
  //   view: view,
  //   content: document.getElementById("chartContainer"),
  //   expanded: true
  // });
  // view.ui.add(expandChart, "top-left");

  // Show chart container
  // document.getElementById("pieChart").style.display = "block";
  //document.getElementById("showChartBtn").addEventListener("click", drawMaterialPieChart);

  document.getElementById("showChartBtn").addEventListener("click", function () {
    drawMaterialPieChart();
  });

  
function drawMaterialPieChart() {
  document.getElementById("chartContainer").style.display = "block";
  waterNetworkLayer2.queryFeatures({
    where: "material IS NOT NULL",
    outFields: ["material"],
    returnGeometry: false
  }).then(function (results) {
    const materialCounts = {};

    results.features.forEach(f => {
      const mat = f.attributes.material;
      if (mat) {
        materialCounts[mat] = (materialCounts[mat] || 0) + 1;
      }
    });

    const labels = Object.keys(materialCounts);
    const data = Object.values(materialCounts);
    console.log(labels)
    const colors = labels.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));

    const ctx = document.getElementById('materialChart').getContext('2d');
    if (window.materialChartInstance) {
      window.materialChartInstance.destroy();
    }

    window.materialChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Material Count',
          data: data,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Water Mains by Material'
          }
        }
      }
    });
  }).catch(function (error) {
    console.error("Query failed:", error);
  });
}



  // // Dummy pie chart with hardcoded data
  // const ctx = document.getElementById("pieChart").getContext("2d");
  // new Chart(ctx, {
  //   type: "pie",
  //   data: {
  //     labels: ["Pipe A", "Pipe B", "Pipe C"],
  //     datasets: [{
  //       data: [45, 25, 30],
  //       backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"]
  //     }]
  //   },
  //   options: {
  //     plugins: {
  //       legend: { position: "bottom" }
  //     }
  //   }
  // });

});
