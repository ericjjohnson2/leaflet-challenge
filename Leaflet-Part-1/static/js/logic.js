
// Test Console
// console.log("Written by Eric Johnson");

// Store our API endpoint as queryUrl.
// let queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    }
  });

  createMap(earthquakes);
};

// Define colors for depth ranges
let depthColors = ['#B1E636', '#E2F439', '#EFDA37', '#EBB63C', '#E6A261', '#DF5F65'];

function getColor(depth) {
  if (depth <= 10) return depthColors[0];
  if (depth <= 30) return depthColors[1];
  if (depth <= 50) return depthColors[2];
  if (depth <= 70) return depthColors[3];
  if (depth <= 90) return depthColors[4];
  return depthColors[5];
};

function createMap(earthquake) {
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  let overlayMaps = {
    Earthquakes: earthquake
  };

  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquake]
  });

  // Create a legend
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let depthRanges = [-10, 10, 30, 50, 70, 90];
    let labels = [];
  
    for (let i = 0; i < depthRanges.length; i++) {
      let j = i;
      if (i === 6) {
        j = i + 6;
      };
      console.log(`The length of depthRanges ${depthRanges.length}`);
      div.innerHTML +=
        '<div style="background-color:white;padding:5px;border-radius:5px;">' +
        '<span style="background-color:' + depthColors[i] + ';width:10px;height:10px;display:inline-block;margin-right:5px;"></span>' + // Square of color
        depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + '<br>' : '+') + '</div>';
    }
  
    return div;
  };

  legend.addTo(myMap);

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};


