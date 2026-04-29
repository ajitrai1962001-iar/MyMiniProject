// 1. Initialize Map
const map = L.map("map").setView([27.5, 90.4], 8);

// 2. Define Base Maps
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri'
});

const baseMaps = {
  "OpenStreetMap": osm,
  "Satellite View": satellite,
};

// 3. Zoom Function (Restored)
function zoomToBhutan() {
  map.setView([27.5, 90.4], 8);
}

// 4. Define Overlay Groups
const dzongkhagLayer = L.layerGroup().addTo(map);
const heritageLayer = L.layerGroup().addTo(map);

const overlayMaps = {
  "Dzongkhag Boundary": dzongkhagLayer,
  "Heritage Sites": heritageLayer,
};

// 5. Add Layer Control
L.control.layers(baseMaps, overlayMaps).addTo(map);

// 6. Load GeoJSON: Dzongkhag (Popups Removed)
fetch("../Data/bhutan_dzong_web.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: "black",
        weight: 1,
        fillColor: "orange",
        fillOpacity: 0.3
      }
    }).addTo(dzongkhagLayer);
  });

// 7. Load GeoJSON: Heritage Sites (Popups Kept)
fetch("../Data/BhutanHeritageSites.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 6,
          color: "blue",
          fillColor: "green",
          fillOpacity: 0.8
        });
      },
      onEachFeature: (feature, layer) => {
        // Keeps the popup only for the heritage site markers
       layer.bindPopup(feature.properties.name);
      }
    }).addTo(heritageLayer);
  });


