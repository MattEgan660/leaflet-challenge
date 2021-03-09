var earthQuakeMap = L.map("mapid", {
    center: [39.8283, -98.5795],
    zoom: 4
});

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 20,
  minZoom: 4,
  id: "light-v10",
  accessToken: API_KEY
}).addTo(earthQuakeMap);


var dataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(dataURL, function(data) {
  
  function dataStyle(feature){
    return{
      opacity: .80,
      fillOpacity: .80,
      fillColor: dynamicColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: dynamicSizing(feature.properties.mag),
      stroke: true,
      weight: 0.5
    }
  };

  function dynamicColor(depth) {
    switch(True) {
      case depth <= 10:
        return '#aae9f0'
      case depth <= 30:
        return '#aac1f0'
      case depth <= 50:
        return '#5c72ed'
      case depth <= 70:
        return '#1536eb'
      case depth <= 90:
        return '#430680'
      default:
        return '#1b0136'
    }
  };

  function dynamicSizing(mag) {
    return mag * 2
  };
 

  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng);
      },

      style: dataStyle,

      onEachFeature: function(feature, layer) { 
      layer.bindPopup("<h3> Location: " + feature.properties.place 
      + "</h3><h3> Magnitude: " + feature.properties.mag 
      + "</h3><h3> Depth: " + feature.geometry.coordinates[2]) + "</h3>";
      }
  }).addTo(earthQuakeMap);



  var mapLegend = L.control(({position: "bottomright"}));
   
  mapLegend.onAdd(function(map) {
    var div = L.DomUtil.create("div", "mapLegend");
    var grades = [-1000, 10, 30, 50, 70, 90];
    var labels = [];

  })

  function legendColor(d) {
    return d > 90 ? '#1b0136' :
           d > 70 ? '#430680' :
           d > 50 ? '#1536eb' :
           d > 30 ? '#5c72ed' :
           d > 10 ? '#aac1f0' :
           '#aae9f0' ;
                      
    }
  
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + legendColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<hr>' : '+');
  }

    return div;
  
  mapLegend.addTo(earthQuakeMap)

});




