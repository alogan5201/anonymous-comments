/*jshint esversion: 8 */
import HaversineGeolocation from "haversine-geolocation";
const geojson = {
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

const map = L.mapbox.map("map").setView([37.9, -77], 6);
L.mapbox.accessToken =
  "pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA";

const layer = L.mapbox
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
    remainActive: false
  })
  .addTo(map);
const LocationState = function _LocationState() {
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

const findLocation = () => {
  map.on("locationfound", function(e) {
    map.fitBounds(e.bounds);

    let lat = e.latlng.lat;

    let lon = e.latlng.lng;

    geojson.features[0].geometry.coordinates = [lon, lat];

    featureLayer.setGeoJSON(geojson);

    var inputs = document.getElementById("latlonForm").elements;

    if (inputs[0].nodeName === "INPUT" && inputs[0].type === "number") {
      // Update text input
      inputs[0].value = lat;
      inputs[1].value = lon;
    }

    setTimeout(() => {
      locationControl.stop();
    }, 500);
  });
};
const title = $("title").html();

const pageTitle = title.slice(11);
console.log(pageTitle);

let bookmarkControl = new L.Control.Bookmarks({
  name: pageTitle
}).addTo(map);
function inputFocus(x) {
  if ($("#secondOutput").hasClass("second")) {
    $("#secondOutput")
      .removeClass("second")
      .addClass("fadeOut");
    $("#firstOutput")
      .removeClass("first")
      .addClass("fadeOut");
    setTimeout(() => {
      $("#secondOutput").addClass("d-none");
      $("#firstOutput").addClass("d-none");
    }, 2000);
  }

  //
}

window.addEventListener("DOMContentLoaded", () => {
  findLocation();
  const north = document.getElementById("north");
  const south = document.getElementById("south");
  const degreesLat = document.getElementById("degrees-lat");
  const minutesLat = document.getElementById("minutes-lat");
  const secondsLat = document.getElementById("seconds-lat");

  const degreesLon = document.getElementById("degrees-lon");
  const minutesLon = document.getElementById("minutes-lon");
  const secondsLon = document.getElementById("seconds-lon");
  const east = document.getElementById("east");
  const west = document.getElementById("west");
  const outputInputField = document.getElementById("output-field-input");
  const dmsBtn = document.getElementById("dmsBtn");
  const dmsForm = document.getElementById("dms");

  const latlonForm = document.getElementById("latlonForm");

  function DDtoDMS(lat, lon) {
    //

    let latitude = Math.abs(lat);
    let longitude = Math.abs(lon);
    let dLat = Math.floor(latitude);
    let mLat = Math.floor((latitude - dLat) * 60);

    sLat = Math.round((latitude - dLat - mLat / 60) * 1e3 * 3600) / 1e3;
    dLon = Math.floor(longitude);
    mLon = Math.floor((longitude - dLon) * 60);
    sLon = Math.floor((longitude - dLon - mLon / 60) * 1e3 * 3600) / 1e3;
    let degreesLatitude = dLat;
    let minutesLatitude = mLat;
    let secondsLatitude = sLat;
    let degreesLongitude = dLon;
    let minutesLongitude = mLon;
    let secondsLongitude = sLon;

    let latResult = `${degreesLatitude}° ${minutesLatitude}' ${secondsLatitude}''`;

    let lonResult = `${degreesLongitude}° ${minutesLongitude}' ${secondsLongitude}''`;
    let result = {
      lat: {
        degrees: degreesLatitude,
        minutes: minutesLatitude,
        seconds: secondsLatitude
      },
      lon: {
        degrees: degreesLongitude,
        minutes: minutesLongitude,
        seconds: secondsLongitude
      },
      popupMessage: { lat: latResult, lon: lonResult }
    };
    return result;
  }
  function check(elm) {
    document.getElementById(elm).checked = true;
  }

  const convertLocationData = document.getElementById("convertLocationData");
  const latInputField = document.getElementById("latInputField");
  const lonInputField = document.getElementById("lonInputField");
  const latlonGeocoderBtn = document.getElementById("latlonGeocoderBtn");

  const App = function _App() {
    return `
   <h1>Global State = [${App.state.count}] </h1>
  `;
  };

  const handler = {
    set: function(obj, prop, value) {
      obj[prop] = value;
    }
  };

  App.state = new Proxy({ count: 0 }, handler);

  // Initial Loading of the App

  const CoordsApp = function _CoordsApp() {
    return `
   <h1>Origin State = [${CoordsApp.state.origin}] </h1> </br>
   <h1>Destination State = [${CoordsApp.state.destination}] </h1>
   <h1>User Location = [${CoordsApp.state.userLocation}] </h1>
   <h1>trackingUser =  ${CoordsApp.state.trackingUser}</h1>
  `;
  };

  const myhandler = {
    set: function(obj, prop, value) {
      obj[prop] = value;
    }
  };

  CoordsApp.state = new Proxy(
    { origin: [], destination: [], userLocation: [] },
    myhandler
  );

  $("#originTest").click(function(e) {
    e.preventDefault();
  });
  $("#destinationTest").click(function(e) {
    e.preventDefault();
  });
  $("#switchTest").click(function(e) {
    e.preventDefault();
  });
  function addRoute() {
    App.state.count++;

    const origin = CoordsApp.state.origin;

    const destination = CoordsApp.state.destination;

    //map.flyTo([centerLat, centerLon])
    /* map.panInsideBounds([
         [origin[1] , origin[0] ], // southwestern corner of the bounds
         [destination[1] , destination[0], {padding: [50,50]} ] // northeastern corner of the bounds
       ]);
       //

      geojson.features[0].geometry.coordinates = [origin[0], origin[1]];
      geojson.features[1].geometry.coordinates = [destination[0], destination[1]]

  */
    //
    let latD = destination[1];
    let lonD = destination[0];
    let latO = origin[1];
    let lonO = origin[0];
    geojson.features[0].geometry.coordinates = [lonO, latO];
    geojson.features[1].geometry.coordinates = [lonD, latD];
    //
    featureLayer.setGeoJSON(geojson);

    //featureLayer.setGeoJSON(geojson).addTo(map);

    /*
      map.fitBounds(featureLayer.getBounds(), {
  padding: [50,50]

      });
      map.zoomOut()
  */

    let latOrigin = origin[1];
    let lonOrigin = origin[0];
    let latDest = destination[1];
    let lonDest = destination[0];
    //
    map.fitBounds(
      [
        [latOrigin, lonOrigin],
        [latDest, lonDest]
      ],
      { padding: [50, 50] }
    );
  }

  function addNewRoute() {
    const origin = CoordsApp.state.origin;

    const destination = CoordsApp.state.destination;
    let latD = destination[1];
    let lonD = destination[0];
    let latO = origin[1];
    let lonO = origin[0];
    geojson.features[0].geometry.coordinates = [lonO, latO];
    geojson.features[1].geometry.coordinates = [lonD, latD];

    featureLayer.setGeoJSON(geojson);
    // A simple line from origin to destination.

    // A single point that animates along the route.
    // Coordinates are initially set to origin.

    // Calculate the distance in kilometers between route start/end point.

    // animate(counter);
    featureLayer.setGeoJSON(geojson);

    let latOrigin = origin[1];
    let lonOrigin = origin[0];
    let latDest = destination[1];
    let lonDest = destination[0];
    //
    map.fitBounds(
      [
        [latOrigin, lonOrigin],
        [latDest, lonDest]
      ],
      {
        padding: [50, 50]
      }
    );
  }

  function format(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);

    let result = {
      hours: hrs,
      minutes: mins
    };
    // Output like "1:01" or "4:03:59" or "123:03:59"
    return result;
  }

  function callMatrix(first, second) {
    fetch(
      `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${first};${second}?&access_token=pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQycnlhMDBlb2kydXBwZHoyOGNsY3EifQ.E8N4lPy6tiI0xY3nor3MTg`
    )
      .then(response => response.json())
      .then(json => {
        const durations = json.durations[0];
        const travelTime = durations[1];
        const result = format(travelTime);
        // //

        var alertPlaceholder = document.getElementById("liveAlertPlaceholder");
        var alertTrigger = document.getElementById("liveAlertBtn");

        function postLog(message) {
          var wrapper = document.createElement("div");
          wrapper.innerHTML = `
    <div class="alert alert-secondary d-flex align-items-center justify-content-between" role="alert">
     <div class="alertMessage">
       ${message}
     </div>


   </div>`;

          alertPlaceholder.append(wrapper);
        }
        if (alertPlaceholder.childElementCount == 0) {
          postLog(`${result.hours} hour(s) and ${result.minutes} minutes`);
        } else if (alertPlaceholder.childElementCount == 1) {
          postLog(`${result.hours} hour(s) and ${result.minutes} minutes`);
        } else if (alertPlaceholder.childElementCount == 2) {
          $("#liveAlertPlaceholder").empty();
          setTimeout(() => {
            postLog(`${result.hours} hour(s) and ${result.minutes}`);
          }, 200);
        }
      });
  }

  $("#latlonForm").on("submit", function(e) {
    e.preventDefault();
    let inputs = document.getElementById("latlonForm").elements;

    let latO = inputs[0].value;
    let lonO = inputs[1].value;
    let latD = inputs[2].value;
    let lonD = inputs[3].value;
    geojson.features[0].geometry.coordinates = [lonO, latO];
    geojson.features[1].geometry.coordinates = [lonD, latD];
    featureLayer.setGeoJSON(geojson);

    let origin = [latO, lonD];
    let destination = [latD, lonD];
    const points = [
      {
        latitude: latO,
        longitude: lonO
      },
      {
        latitude: latD,
        longitude: lonD
      }
    ];

    const distance = HaversineGeolocation.getDistanceBetween(
      points[0],
      points[1],
      "mi"
    );

    $("#distanceInput").val(`${distance} miles`);
    map.fitBounds(
      [
        [latO, lonO],
        [latD, lonD]
      ],
      { padding: [50, 50] }
    );
  });
});
