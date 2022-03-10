export const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [0, 0]
      },
      properties: {
        title: "Mapbox DC",
        description: "1714 14th St NW, Washington DC",
        "marker-color": "#35A2D1",
        "marker-size": "large",
        "marker-symbol": "1"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [0, 0]
      },
      properties: {
        title: "Mapbox SF",
        description: "155 9th St, San Francisco",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "2"
      }
    }
  ]
};

export const map = L.mapbox.map("map").setView([37.9, -77], 6);
L.mapbox.accessToken =
  "pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA";

export const layer = L.mapbox
  .styleLayer("mapbox://styles/mapbox/streets-v11")
  .addTo(map); // add your tiles to the map

// L.marker is a low-level marker constructor in Leaflet.

var featureLayer = L.mapbox.featureLayer().addTo(map);

var locationControl = L.control
  .locate({
    circleStyle: { opacity: 0 },
    followCircleStyle: { opacity: 0 },
    drawCircle: false,
    follow: false,
    icon: "fas fa-map-marker-alt", // follow the user's location
    setView: false,
    remainActive: false,
    iconLoading: "leaflet-control-locate-location-arrow"
  })
  .addTo(map);
export const LocationState = function _LocationState() {
  let data = {
    origin: {
      lat: LocationState.state.lat
    },
    destination: {
      lon: LocationState.state.lon
    }
  };
  return data;
};
const myhandler = {
  set: function(obj, prop, value) {
    obj[prop] = value;
  }
};

LocationState.state = new Proxy({ lat: null, lon: null }, myhandler);

export const findLocation = () => {
  map.on("locationfound", function(e) {
    map.fitBounds(e.bounds);

    let lat = e.latlng.lat;

    let lon = e.latlng.lng;

    geojson.features[0].geometry.coordinates = [lon, lat];

    featureLayer.setGeoJSON(geojson);
    LocationState.state.origin.lat = lat;
    LocationState.state.origin.lon = lon;

    setTimeout(() => {
      locationControl.stop();
    }, 500);
  });
};
let bookmarkControl = new L.Control.Bookmarks().addTo(map);
