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

  function getGpsPoints() {
    const points = [
      {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              OBJECTID: 1,
              SITENAME: "CANNON MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 554093.75,
              Y_COORD: 837539.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.27503094358798, 41.13248444197727]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 2,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "GREENWICH TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 328967.65625,
              Y_COORD: 672423.125,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0882833729618, 40.67797023602428]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 3,
              SITENAME: "LARGE MINE",
              ALTNAME: "LEBANON",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CLINTON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 393761.96875,
              Y_COORD: 649580.5,
              ELEMENT: "IRON",
              QUAD_NAME: "FLEMINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.8543342019595, 40.61622101274659]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 4,
              SITENAME: "BLUE WANAQUE MINE",
              ALTNAME: "LONDON",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BLOOMINGDALE BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 542713.375,
              Y_COORD: 810813,
              ELEMENT: "IRON",
              QUAD_NAME: "WANAQUE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.31655012213194, 41.059197055320894]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 5,
              SITENAME: "SUSSEX LEAD MINE",
              ALTNAME: "INDIAN MINE",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 443210.125,
              Y_COORD: 809851.5,
              ELEMENT: "LEAD",
              QUAD_NAME: "NEWTON EAST NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.67737736243629, 41.056567369032365]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 6,
              SITENAME: "ERB MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1891,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 466825.53125,
              Y_COORD: 751592.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59152174859952, 40.8967533632813]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 7,
              SITENAME: "CORWIN MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 465021.84375,
              Y_COORD: 748933.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59803575408051, 40.8894485213016]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 8,
              SITENAME: "JOHNSON HILL MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1869,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 468861,
              Y_COORD: 754811.25,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58416970187123, 40.90559304210421]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 9,
              SITENAME: "NEW STIRLING MINE",
              ALTNAME: " ",
              BEGDATE: 1890,
              ENDDATE: 1900,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 468158.78125,
              Y_COORD: 751906.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58669987666237, 40.89761660347879]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 10,
              SITENAME: "MT. HOPE NEW LEONARD MINE",
              ALTNAME: " ",
              BEGDATE: 1710,
              ENDDATE: 1985,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 482375.6875,
              Y_COORD: 764913.25,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.5352889430601, 40.933347655666935]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 11,
              SITENAME: "SIGLER MINE",
              ALTNAME: "LINDSLEYI",
              BEGDATE: 1868,
              ENDDATE: 1869,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 479602.4375,
              Y_COORD: 752018.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.54530246420049, 40.897950127482964]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 12,
              SITENAME: "LOWER WELDON MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1896,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 469312.21875,
              Y_COORD: 784855.75,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.5826399599448, 40.98806385630444]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 13,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 349554.968327999,
              Y_COORD: 721002.755581,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0150843709367, 40.81167102612713]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 14,
              SITENAME: "RAUB MINE",
              ALTNAME: " ",
              BEGDATE: 1872,
              ENDDATE: 1891,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 349570.185983999,
              Y_COORD: 725570.303634,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.01512637546615, 40.82420858813834]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 15,
              SITENAME: "WEAN MINE",
              ALTNAME: "WENE MINE",
              BEGDATE: 1874,
              ENDDATE: 1881,
              MJRMINERAL: "LIMONITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 345190.96875,
              Y_COORD: 661961.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02956376279282, 40.649537133638574]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 16,
              SITENAME: "PETTY MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALEXANDRIA TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 326977.8125,
              Y_COORD: 658109.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.09510834078189, 40.63864301582166]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 17,
              SITENAME: "SLACK MINE",
              ALTNAME: " ",
              BEGDATE: 1899,
              ENDDATE: 1899,
              MJRMINERAL: "LIMONITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 338734.875,
              Y_COORD: 674318.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.05311120077457, 40.68334608742083]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 18,
              SITENAME: "DANIEL HORTON MINE",
              ALTNAME: " ",
              BEGDATE: 1867,
              ENDDATE: 1870,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 450216.96875,
              Y_COORD: 721139.625,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6514121508385, 40.81309712412413]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 19,
              SITENAME: "QUIMBY MINE",
              ALTNAME: " ",
              BEGDATE: 1910,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 439554.65625,
              Y_COORD: 705512.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.68981190280036, 40.77014453823462]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 20,
              SITENAME: "PARDEE MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1899,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 473162.3125,
              Y_COORD: 813204.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56877409205099, 41.06588808712311]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 21,
              SITENAME: "CARWHEEL MINE",
              ALTNAME: " ",
              BEGDATE: 1700,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 354886.75,
              Y_COORD: 715321.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.9957061491642, 40.7961605061745]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 22,
              SITENAME: "SIGLER MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WEST MILFORD TWP",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 511032.3125,
              Y_COORD: 833783.125,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.43137124824385, 41.12237217413069]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 23,
              SITENAME: "TRACY AND CRANE FARM",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "WEST MILFORD TWP",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 495233.46875,
              Y_COORD: 824633.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.48872270072071, 41.097276595193755]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 24,
              SITENAME: "FISHER MINE",
              ALTNAME: "BEATYESTOWN",
              BEGDATE: 1864,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 396577,
              Y_COORD: 716313.25,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.84513824750636, 40.79943195520789]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 25,
              SITENAME: "SHARP MINE",
              ALTNAME: " ",
              BEGDATE: 1871,
              ENDDATE: 1874,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 393926.3125,
              Y_COORD: 708719.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.85460193463382, 40.77855972561124]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 26,
              SITENAME: "WILLIAM SHARP MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 422557.21875,
              Y_COORD: 721614.25,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.75134891750227, 40.814225525517436]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 27,
              SITENAME: "CAREY MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WEST MILFORD TWP",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 519198.59375,
              Y_COORD: 845907.625,
              ELEMENT: "IRON",
              QUAD_NAME: "WAWAYANDA NJ-NY",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.40167935653197, 41.1556303144733]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 28,
              SITENAME: "SLOAT FARM MINE",
              ALTNAME: "SLOAT FARM",
              BEGDATE: 1883,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 557707.9375,
              Y_COORD: 818972.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "WANAQUE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.26209416352842, 41.08149330985091]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 29,
              SITENAME: "JACKSON MINE",
              ALTNAME: "AXTELL",
              BEGDATE: 1862,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RIVERDALE BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 545141.8125,
              Y_COORD: 786854.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "POMPTON PLAINS NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.30793495826279, 40.993418641341584]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 30,
              SITENAME: "BANGHART MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 376682,
              Y_COORD: 680786,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Banghart Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.91639213645684, 40.70167446540509]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 31,
              SITENAME: "MARBLE MT.  MINE",
              ALTNAME: "FULLMER",
              BEGDATE: 1860,
              ENDDATE: 1887,
              MJRMINERAL: "HEMATITE",
              MUN: "LOPATCONG TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 301866,
              Y_COORD: 686518,
              ELEMENT: "IRON",
              QUAD_NAME: "EASTON PA-NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Marble Mt."
            },
            geometry: {
              type: "Point",
              coordinates: [-75.18639216669007, 40.71611920651615]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 32,
              SITENAME: "MARBLE MT.  MINE",
              ALTNAME: "FULLMER",
              BEGDATE: 1860,
              ENDDATE: 1887,
              MJRMINERAL: "HEMATITE",
              MUN: "LOPATCONG TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 301633,
              Y_COORD: 686216,
              ELEMENT: "IRON",
              QUAD_NAME: "EASTON PA-NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Marble Mt."
            },
            geometry: {
              type: "Point",
              coordinates: [-75.18722416603232, 40.71528527178689]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 33,
              SITENAME: "UNNAMED MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 469434,
              Y_COORD: 791737,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58222227980404, 41.00695244995516]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 34,
              SITENAME: "CONDON CUT",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 473207,
              Y_COORD: 813492,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56861283894283, 41.066676124221274]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 35,
              SITENAME: "CONDON CUT",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 473514,
              Y_COORD: 813593,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56749970047022, 41.06695401442489]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 36,
              SITENAME: "NESHANIC MINE",
              ALTNAME: " ",
              BEGDATE: 1770,
              ENDDATE: 1861,
              MJRMINERAL: "COPPER",
              MUN: "RARITAN TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 51,
              X_COORD: 389512.706846999,
              Y_COORD: 604446.157383,
              ELEMENT: "COPPER",
              QUAD_NAME: "HOPEWELL NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.86896027802806, 40.492277056633775]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 37,
              SITENAME: "RYERSON DE BOW MINE",
              ALTNAME: " ",
              BEGDATE: 1872,
              ENDDATE: 1907,
              MJRMINERAL: "MAGNETITE",
              MUN: "RIVERDALE BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 544448.75,
              Y_COORD: 787875.75,
              ELEMENT: "IRON",
              QUAD_NAME: "POMPTON PLAINS NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.31043769900695, 40.99622720452913]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 38,
              SITENAME: "DUCKWORTH FARM MINE",
              ALTNAME: "DUCKWORTH",
              BEGDATE: 1776,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOLLAND TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 329911.5,
              Y_COORD: 648332.125,
              ELEMENT: "IRON",
              QUAD_NAME: "FRENCHTOWN NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.08430340942664, 40.6118596689753]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 39,
              SITENAME: "AMERICAN MINE",
              ALTNAME: "BRIDGEWATER",
              BEGDATE: 1754,
              ENDDATE: 1905,
              MJRMINERAL: "COPPER",
              MUN: "BRIDGEWATER TWP",
              COUNTY: "SOMERSET",
              REFERENCES: 51,
              X_COORD: 460156.09375,
              Y_COORD: 648893.25,
              ELEMENT: "COPPER",
              QUAD_NAME: "BOUND BROOK NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61516071146431, 40.61482058253676]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 40,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "COPPER",
              MUN: "FRANKLIN TWP",
              COUNTY: "SOMERSET",
              REFERENCES: "NJGS FILES",
              X_COORD: 469505.84375,
              Y_COORD: 585335.25,
              ELEMENT: "COPPER",
              QUAD_NAME: "MONMOUTH JCT NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.581269835894, 40.440375164089644]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 41,
              SITENAME: "CLINTON",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MANGANESE",
              MUN: "CLINTON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "41, 43",
              X_COORD: 382789.6875,
              Y_COORD: 655647.875,
              ELEMENT: "MANGANESE",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89395660276608, 40.63274798296466]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 42,
              SITENAME: "APGARS MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "GLEN GARDNER BORO",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 372392.25,
              Y_COORD: 681012.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.93186840448071, 40.70223815524876]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 43,
              SITENAME: "LANGDON MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 427253.40625,
              Y_COORD: 700585.125,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73417895229986, 40.75653686275359]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 44,
              SITENAME: "BOLMER MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1868,
              MJRMINERAL: "COPPER",
              MUN: "BRIDGEWATER TWP",
              COUNTY: "SOMERSET",
              REFERENCES: 51,
              X_COORD: 469754.96875,
              Y_COORD: 643869.5,
              ELEMENT: "COPPER",
              QUAD_NAME: "BOUND BROOK NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58056690575631, 40.60105929837433]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 45,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WEST MILFORD TWP",
              COUNTY: "PASSAIC",
              REFERENCES: "NJGS FILES",
              X_COORD: 544707.9375,
              Y_COORD: 839659.25,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.30908803799645, 41.13836339778985]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 46,
              SITENAME: "ST. GEORGE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 555076.1875,
              Y_COORD: 839644.25,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.27144430321727, 41.138253691680475]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 47,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "GREENWICH TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 328753.6875,
              Y_COORD: 672824.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.08906451682549, 40.67906855902346]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 48,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 350771.90625,
              Y_COORD: 665301.125,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.00952011139334, 40.65879455658779]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 49,
              SITENAME: "FLEMINGTON MINE",
              ALTNAME: " ",
              BEGDATE: 1770,
              ENDDATE: 1861,
              MJRMINERAL: "COPPER",
              MUN: "RARITAN TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 51,
              X_COORD: 389428.625,
              Y_COORD: 609524.25,
              ELEMENT: "COPPER",
              QUAD_NAME: "HOPEWELL NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.86933905145821, 40.506215832065294]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 50,
              SITENAME: "BROWN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WANAQUE BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 551689.5,
              Y_COORD: 803128.625,
              ELEMENT: "IRON",
              QUAD_NAME: "WANAQUE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.28406865692652, 41.03804818522556]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 51,
              SITENAME: "BUTLER MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "MAHWAH TWP",
              COUNTY: "BERGEN",
              REFERENCES: 2,
              X_COORD: 568027.707669,
              Y_COORD: 826079.459616999,
              ELEMENT: "IRON",
              QUAD_NAME: "RAMSEY NJ-NY",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.2245772816742, 41.100918104779424]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 52,
              SITENAME: "BAKER MINE LOWER HILL",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 462419.90625,
              Y_COORD: 744373.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.60742689273643, 40.876923532882714]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 53,
              SITENAME: "MEADOW MINE",
              ALTNAME: " ",
              BEGDATE: 1884,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 471706.125,
              Y_COORD: 755380.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57387791990392, 40.907162817769006]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 54,
              SITENAME: "TEABO MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1907,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 476761.9375,
              Y_COORD: 760607.625,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.55559781537923, 40.92152102558369]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 55,
              SITENAME: "DAVENPORT MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 461483.4375,
              Y_COORD: 762298.75,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61089568101829, 40.926123125059455]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 56,
              SITENAME: "MOUNT HOPE MINE",
              ALTNAME: " ",
              BEGDATE: 1710,
              ENDDATE: 1985,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 481930.25,
              Y_COORD: 764256.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.53690018226062, 40.93154459603805]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 57,
              SITENAME: "AHLES MINE",
              ALTNAME: " ",
              BEGDATE: 1901,
              ENDDATE: 1916,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 351237.149483999,
              Y_COORD: 722617.884415999,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0090410310207, 40.816131319151374]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 58,
              SITENAME: "BARTON MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1916,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 340647.25,
              Y_COORD: 720276.375,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0472488009194, 40.80952905905538]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 59,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "HARMONY TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 331232.25,
              Y_COORD: 705938.875,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.08091788988138, 40.770008401862306]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 60,
              SITENAME: "TICHENOR MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1872,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 499453.78125,
              Y_COORD: 767416,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.47347258509434, 40.940219870391616]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 61,
              SITENAME: "BEEMER MINE",
              ALTNAME: " ",
              BEGDATE: 1886,
              ENDDATE: 1887,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 447414.96875,
              Y_COORD: 720235.375,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.66152951243131, 40.81060124831704]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 62,
              SITENAME: "BOSS MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 460771.03125,
              Y_COORD: 792736.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6136171417059, 41.00966947127669]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 63,
              SITENAME: "HOAGLAND MINE",
              ALTNAME: "HENDERSHOT",
              BEGDATE: 1873,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "LIBERTY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 365137.21875,
              Y_COORD: 743362,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.9592134259809, 40.873282054001464]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 64,
              SITENAME: "HOIT MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1875,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 363044.21875,
              Y_COORD: 730357.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.96653138913885, 40.83755514418138]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 65,
              SITENAME: "BALD PATE MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "MANSFIELD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 379598,
              Y_COORD: 722539.25,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.90657239285252, 40.81632205885785]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 66,
              SITENAME: "WINTER MINE",
              ALTNAME: " ",
              BEGDATE: 1882,
              ENDDATE: 1885,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 496407.375,
              Y_COORD: 789474.875,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.48448592693391, 41.00077145066758]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 67,
              SITENAME: "DAVENPORT MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1884,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 497582.96875,
              Y_COORD: 791161.5,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.48022518643273, 41.0054003994041]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 68,
              SITENAME: "GREEN POND MINE",
              ALTNAME: " ",
              BEGDATE: 1872,
              ENDDATE: 1900,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 498968.125,
              Y_COORD: 792210.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.47520511853186, 41.00827761931737]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 69,
              SITENAME: "HOWELL TRACT MINE",
              ALTNAME: " ",
              BEGDATE: 1874,
              ENDDATE: 1885,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 503641.65625,
              Y_COORD: 795415.5,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.45826473072513, 41.01707129273416]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 70,
              SITENAME: "DUFFORD MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 407739.53125,
              Y_COORD: 720253.375,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.80486723122537, 40.81036096011262]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 71,
              SITENAME: "SILVER MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BYRAM TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 426376.8125,
              Y_COORD: 768114.25,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73800563874039, 40.941893918264874]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 72,
              SITENAME: "BEDELL MINE",
              ALTNAME: " ",
              BEGDATE: 1890,
              ENDDATE: 1900,
              MJRMINERAL: "MAGNETITE",
              MUN: "BYRAM TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 444246.6875,
              Y_COORD: 786709.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.67345183556779, 40.9930525367488]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 73,
              SITENAME: "BURT MINE",
              ALTNAME: " ",
              BEGDATE: 1882,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT ARLINGTON",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 452929.84375,
              Y_COORD: 751927.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.64179084301188, 40.89761967611427]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 74,
              SITENAME: "SICKLES MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 450240.15625,
              Y_COORD: 789016.25,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6517537133476, 40.99941372560139]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 75,
              SITENAME: "CASCADE MINE",
              ALTNAME: "SMITH MINE",
              BEGDATE: 1850,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "BYRAM TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 426500.1875,
              Y_COORD: 764896.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73752738967796, 40.93306261100909]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 76,
              SITENAME: "BYERLY MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 0,
              MJRMINERAL: "HEMATITE",
              MUN: "BYRAM TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 435814.59375,
              Y_COORD: 774386.125,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.70389467943444, 40.95917504819219]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 77,
              SITENAME: "ROSEVILLE MINE",
              ALTNAME: " ",
              BEGDATE: 1850,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "BYRAM TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 437631.6875,
              Y_COORD: 777930.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.69734422817092, 40.9689162908837]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 78,
              SITENAME: "HUDE MINE",
              ALTNAME: "STANHOPE",
              BEGDATE: 1790,
              ENDDATE: 1910,
              MJRMINERAL: "MAGNETITE",
              MUN: "STANHOPE BORO",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 432707.75,
              Y_COORD: 759082.875,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.71500785552257, 40.91714865447735]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 79,
              SITENAME: "BUDD MINE",
              ALTNAME: "WRIGHT MINE",
              BEGDATE: 1875,
              ENDDATE: 1906,
              MJRMINERAL: "MAGNETITE",
              MUN: "STANHOPE BORO",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 435650.1875,
              Y_COORD: 760595.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.70437325632727, 40.92132021114104]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 80,
              SITENAME: "DEHART MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 464089.09375,
              Y_COORD: 731864,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6013381206257, 40.84259010844753]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 81,
              SITENAME: "BEERS EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 1878,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "MORRIS TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 489229.4375,
              Y_COORD: 727049.375,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.51046562921098, 40.82941813183713]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 82,
              SITENAME: "FRENCH'S MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "BYRAM TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 415680.84375,
              Y_COORD: 760940.5,
              ELEMENT: "IRON",
              QUAD_NAME: "TRANQUILITY NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.77664177517939, 40.92211631525824]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 83,
              SITENAME: "CARPENTER MINE",
              ALTNAME: " ",
              BEGDATE: 1865,
              ENDDATE: 1885,
              MJRMINERAL: "LIMONITE",
              MUN: "POHATCONG TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 302007.25,
              Y_COORD: 651573.5,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.1849005658795, 40.62020465201048]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 84,
              SITENAME: "CRESTMORE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 406253.53125,
              Y_COORD: 697454.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.80994471351958, 40.74776347318964]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 85,
              SITENAME: "RODENBAUGH MINE",
              ALTNAME: "RODENBURG",
              BEGDATE: 1876,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 354017.375,
              Y_COORD: 671630.625,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.99795121038821, 40.67621972872852]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 86,
              SITENAME: "PIERSONS EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "MAHWAH TWP",
              COUNTY: "BERGEN",
              REFERENCES: 2,
              X_COORD: 572622.906721999,
              Y_COORD: 828572.590113,
              ELEMENT: "IRON",
              QUAD_NAME: "RAMSEY NJ-NY",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.20787278694435, 41.107720203113665]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 87,
              SITENAME: "BLOOMINGDALE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "RIVERDALE BORO",
              COUNTY: "MORRIS",
              REFERENCES: 37,
              X_COORD: 540676.248689,
              Y_COORD: 788683.600317999,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "POMPTON PLAINS NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.32409915759412, 40.99846632438714]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 88,
              SITENAME: "CUMMINS MINE",
              ALTNAME: "CUMMINGS",
              BEGDATE: 1868,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 387068,
              Y_COORD: 749249,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.88000182469642, 40.889729690372356]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 89,
              SITENAME: "POTTER FARM EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 1872,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 376498,
              Y_COORD: 755066,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.9183340754713, 40.905564296084854]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 90,
              SITENAME: "HOWELL FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1943,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 384507,
              Y_COORD: 760494,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Howell Farm"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.88944601555518, 40.920564921261565]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 91,
              SITENAME: "HOWELL FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1943,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 384506,
              Y_COORD: 760190,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Howell Farm"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.8894447388067, 40.91973047092623]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 92,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "SULFIDE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 382572,
              Y_COORD: 756960,
              ELEMENT: "SULFIDE",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89639022252587, 40.91084069962262]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 93,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 330336,
              Y_COORD: 671841,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.08333597703165, 40.676397396578615]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 94,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 344914,
              Y_COORD: 661730,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.03055690484962, 40.648896928066996]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 95,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 346645,
              Y_COORD: 667690,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02444665898909, 40.66528527641887]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 96,
              SITENAME: "WILD CAT MINE",
              ALTNAME: " ",
              BEGDATE: 1876,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 351026,
              Y_COORD: 665641,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Wild Cat Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.00861133950121, 40.659731534326774]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 97,
              SITENAME: "UNKNOWN",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "POHATCONG",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 301100,
              Y_COORD: 647664,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.18805861302175, 40.60945411641291]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 98,
              SITENAME: "UNKNOWN",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOLLAND TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 318137,
              Y_COORD: 646625,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.12666969437944, 40.606951409855945]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 99,
              SITENAME: "HAGAR MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOLLAND TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 316962,
              Y_COORD: 644003,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.13083388337753, 40.59973119761144]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 100,
              SITENAME: "OAK RIDGE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 37,
              X_COORD: 486532,
              Y_COORD: 806806,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.52028051528347, 41.04834259972489]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 101,
              SITENAME: "UNNAMED MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 466609,
              Y_COORD: 802568,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59250022009739, 41.036674485559296]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 102,
              SITENAME: "SCHOFIELD MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1890,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 471276,
              Y_COORD: 794569,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57555670057602, 41.014730538327214]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 103,
              SITENAME: "FORD MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1890,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 470892,
              Y_COORD: 794266,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57694731384179, 41.01389792141451]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 104,
              SITENAME: "DODGE MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1884,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 469358,
              Y_COORD: 793255,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58250286464109, 41.0111189960753]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 105,
              SITENAME: "DUFFEE MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 466979,
              Y_COORD: 789918,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59111106551617, 41.00195281197448]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 106,
              SITENAME: "DUFFEE MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 466825,
              Y_COORD: 789716,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59166826979843, 41.00139790738263]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 107,
              SITENAME: "DUFFEE MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 476187,
              Y_COORD: 802155,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.55777784320573, 41.0355634929199]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 108,
              SITENAME: "DUFFEE MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 476186,
              Y_COORD: 801953,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.55778098580028, 41.035009022696016]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 109,
              SITENAME: "DUFFEE MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 467364,
              Y_COORD: 791739,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.5897229073761, 41.006952348993025]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 110,
              SITENAME: "CONDON CUT",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 473743,
              Y_COORD: 813592,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56666916711526, 41.0669517602691]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 111,
              SITENAME: "VICTOR MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 473820,
              Y_COORD: 814098,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.5663912972189, 41.06834081312849]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 112,
              SITENAME: "DAVENPORT",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 471137,
              Y_COORD: 810963,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57611223993914, 41.059729658224]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 113,
              SITENAME: "BIG CUT",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 470983,
              Y_COORD: 810559,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57666941294379, 41.05862036525829]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 114,
              SITENAME: "VULCAN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 469602,
              Y_COORD: 808334,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58166981291603, 41.052509601829115]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 115,
              SITENAME: "VULCAN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 474739,
              Y_COORD: 814300,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56305874689835, 41.068897150401504]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 116,
              SITENAME: "VULCAN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 475429,
              Y_COORD: 814603,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56055695679709, 41.06973018133079]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 117,
              SITENAME: "UNNAMED MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 481628,
              Y_COORD: 803974,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.538056767473, 41.040564618624]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 118,
              SITENAME: "OGDEN MINE",
              ALTNAME: " ",
              BEGDATE: 1772,
              ENDDATE: 1899,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 472287,
              Y_COORD: 812177,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57194552948319, 41.06306460686349]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 119,
              SITENAME: "TEN EYCK'S EXPLORATION",
              ALTNAME: "WELLING",
              BEGDATE: 1855,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "VERNON TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 525447.5625,
              Y_COORD: 863822.75,
              ELEMENT: "IRON",
              QUAD_NAME: "WAWAYANDA NJ-NY",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.37889467772138, 41.20478216562326]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 120,
              SITENAME: "TELLINGTON MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WEST MILFORD TWP",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 528400.4375,
              Y_COORD: 804742.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "WANAQUE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.36848696646015, 41.04260513729316]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 121,
              SITENAME: "LANAGAN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RIVERDALE BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 544337.5625,
              Y_COORD: 784597.125,
              ELEMENT: "IRON",
              QUAD_NAME: "POMPTON PLAINS NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.31086623841081, 40.987228433985656]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 122,
              SITENAME: "GRIGGSTOWN MINE",
              ALTNAME: "ROCKY HILL,",
              BEGDATE: 1753,
              ENDDATE: 1916,
              MJRMINERAL: "COPPER",
              MUN: "FRANKLIN TWP",
              COUNTY: "SOMERSET",
              REFERENCES: 51,
              X_COORD: 460916.75,
              Y_COORD: 580184.8125,
              ELEMENT: "COPPER",
              QUAD_NAME: "MONMOUTH JCT NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61210601757848, 40.426210586027324]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 123,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 440529.125,
              Y_COORD: 709240.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.68632209191563, 40.78038220790875]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 124,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: "NJGS FILES",
              X_COORD: 557938.375,
              Y_COORD: 840770.5,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.2610414001321, 41.14132394030149]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 125,
              SITENAME: "MULE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 554232,
              Y_COORD: 837412.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.27453025247154, 41.13213315545181]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 126,
              SITENAME: "WORTMAN MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 431201.21875,
              Y_COORD: 694152,
              ELEMENT: "IRON",
              QUAD_NAME: "GLADSTONE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.71986984040937, 40.738906006872185]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 127,
              SITENAME: "HOFFMAN MINE",
              ALTNAME: " ",
              BEGDATE: 1812,
              ENDDATE: 1868,
              MJRMINERAL: "COPPER",
              MUN: "BRIDGEWATER TWP",
              COUNTY: "SOMERSET",
              REFERENCES: 51,
              X_COORD: 456412.4375,
              Y_COORD: 658880.5625,
              ELEMENT: "COPPER",
              QUAD_NAME: "GLADSTONE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.62869877970095, 40.642222161382996]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 128,
              SITENAME: "HURDTOWN APATITE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 462964.15625,
              Y_COORD: 777885.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.60560500217301, 40.96891226642104]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 129,
              SITENAME: "RICHARD MINE",
              ALTNAME: " ",
              BEGDATE: 1803,
              ENDDATE: 1958,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 475458.375,
              Y_COORD: 758290.5,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56030939462676, 40.9151583036919]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 130,
              SITENAME: "AUBLE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 1892,
              MJRMINERAL: "MAGNETITE",
              MUN: "PEAPACK GLADSTONE",
              COUNTY: "SOMERSET",
              REFERENCES: 2,
              X_COORD: 452128.84375,
              Y_COORD: 691510.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "GLADSTONE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.64432861882213, 40.73177542866281]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 131,
              SITENAME: "DOD MINE",
              ALTNAME: " ",
              BEGDATE: 1720,
              ENDDATE: 1760,
              MJRMINERAL: "COPPER",
              MUN: "EAST ORANGE CITY",
              COUNTY: "ESSEX",
              REFERENCES: 51,
              X_COORD: 570697.5,
              Y_COORD: 709512.6875,
              ELEMENT: "COPPER",
              QUAD_NAME: "ORANGE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.2162622218206, 40.78093182575554]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 132,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 374755.25,
              Y_COORD: 678570.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.92330302822793, 40.69556652336904]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 133,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 354409,
              Y_COORD: 669929.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.99650459450348, 40.67155545713957]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 134,
              SITENAME: "STEPHENS MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROXBURY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 438362.15625,
              Y_COORD: 741542,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.69440604614758, 40.86903654212151]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 135,
              SITENAME: "SALMON MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 433264.59375,
              Y_COORD: 737835,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.71280595136497, 40.85882850872655]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 136,
              SITENAME: "CREAMER MINE",
              ALTNAME: "CRAMER MINE",
              BEGDATE: 1873,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 437213.8125,
              Y_COORD: 712665.375,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.69832208287379, 40.78976432555834]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 137,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 429093.1875,
              Y_COORD: 704833.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.72757742925641, 40.76821239020704]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 138,
              SITENAME: "RARICK FARM EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 428129.875,
              Y_COORD: 701330.5,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73102213884674, 40.75858928106768]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 139,
              SITENAME: "LITTLE MINE",
              ALTNAME: "FELLOWS",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 348783.9375,
              Y_COORD: 724486.75,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0179442456185, 40.82122166020658]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 140,
              SITENAME: "DAVIS PROSPECT",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1881,
              MJRMINERAL: "COPPER",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 51,
              X_COORD: 375331.5625,
              Y_COORD: 756320.5,
              ELEMENT: "COPPER",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.9225759951138, 40.908992336360136]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 141,
              SITENAME: "FRENCH MINE",
              ALTNAME: "NEW BRUNSW",
              BEGDATE: 1750,
              ENDDATE: 0,
              MJRMINERAL: "COPPER",
              MUN: "NEW BRUNSWICK CITY",
              COUNTY: "MIDDLESEX",
              REFERENCES: 51,
              X_COORD: 506233.8125,
              Y_COORD: 607505.6875,
              ELEMENT: "COPPER",
              QUAD_NAME: "PLAINFIELD NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.44926431101163, 40.50125368069046]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 142,
              SITENAME: "BOLMER MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1868,
              MJRMINERAL: "COPPER",
              MUN: "BRIDGEWATER TWP",
              COUNTY: "SOMERSET",
              REFERENCES: 51,
              X_COORD: 470826.90625,
              Y_COORD: 642950.3125,
              ELEMENT: "COPPER",
              QUAD_NAME: "BOUND BROOK NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57670345406738, 40.59853868473988]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 143,
              SITENAME: "HOPE MOUNTAIN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 557438.125,
              Y_COORD: 844048.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.26282531123466, 41.15032532536775]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 144,
              SITENAME: "HOPE MOUNTAIN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 557166.75,
              Y_COORD: 843971.625,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.26381152375565, 41.150116168136485]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 145,
              SITENAME: "MONKS MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 548482.9375,
              Y_COORD: 835331.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.29541907780043, 41.126461520978594]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 146,
              SITENAME: "PETER MINE",
              ALTNAME: "PETERS MINE",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 555698.3125,
              Y_COORD: 842613.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.26915698273052, 41.14640039819195]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 147,
              SITENAME: "KEELER MINE",
              ALTNAME: "CALER MINE",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 555350.875,
              Y_COORD: 840023.375,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.27044336979998, 41.139292339281326]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 148,
              SITENAME: "LITTLE BLUE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 554380.6875,
              Y_COORD: 837774.875,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.27398704874476, 41.13312760422025]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 149,
              SITENAME: "BLUE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 554345.375,
              Y_COORD: 837622.75,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.27411667642511, 41.13271029893685]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 150,
              SITENAME: "BOARD MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 548372.9375,
              Y_COORD: 835983.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.29581283400425, 41.12825185245979]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 151,
              SITENAME: "FLEMINGTON MINE",
              ALTNAME: " ",
              BEGDATE: 1770,
              ENDDATE: 1861,
              MJRMINERAL: "COPPER",
              MUN: "RARITAN TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 51,
              X_COORD: 389260.34375,
              Y_COORD: 606185.8125,
              ELEMENT: "COPPER",
              QUAD_NAME: "FLEMINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.86989390369249, 40.49704964510772]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 152,
              SITENAME: "BARTLE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 424842.125,
              Y_COORD: 690772.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "GLADSTONE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.74278530227743, 40.72958210378467]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 153,
              SITENAME: "PAHAQUARRY MINE",
              ALTNAME: "PAHAQUARRIY",
              BEGDATE: 1650,
              ENDDATE: 1911,
              MJRMINERAL: "COPPER",
              MUN: "HARDWICK TWP",
              COUNTY: "WARREN",
              REFERENCES: 51,
              X_COORD: 346441,
              Y_COORD: 801780.625,
              ELEMENT: "COPPER",
              QUAD_NAME: "BUSHKILL PA-NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02809614952275, 41.03334048318431]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 154,
              SITENAME: "BAKER MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 463660.28125,
              Y_COORD: 745551,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.60294622669902, 40.880158943189436]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 155,
              SITENAME: "SULLIVAN MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 465700.6875,
              Y_COORD: 750721.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59558738594059, 40.89435750715443]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 156,
              SITENAME: "HUFF MINE",
              ALTNAME: "HOFF MINE",
              BEGDATE: 1855,
              ENDDATE: 1910,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 469898,
              Y_COORD: 755640.25,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.5804206393364, 40.90787126896149]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 157,
              SITENAME: "BAKER NO 1 MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1891,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 463486.46875,
              Y_COORD: 745235,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.60357347783798, 40.879290975529884]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 158,
              SITENAME: "RANDALL HILL MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 466193.75,
              Y_COORD: 747065.25,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59378963444802, 40.88432328821901]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 159,
              SITENAME: "JACKSON HILL MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1876,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 467405.53125,
              Y_COORD: 748591.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.5894125121848, 40.88851572702052]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 160,
              SITENAME: "HUBBARD & N. RIVER MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 467692.875,
              Y_COORD: 751287.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.5883830363197, 40.895916892779006]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 161,
              SITENAME: "HURD MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1920,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 468845.65625,
              Y_COORD: 752664.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58421773091405, 40.89970082489315]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 162,
              SITENAME: "ORCHARD MINE",
              ALTNAME: " ",
              BEGDATE: 1850,
              ENDDATE: 1893,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 469839.8125,
              Y_COORD: 753826.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58062512387119, 40.902891980971184]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 163,
              SITENAME: "MOUNT PLEASANT MINE",
              ALTNAME: " ",
              BEGDATE: 1786,
              ENDDATE: 1896,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 471983.59375,
              Y_COORD: 755775.5,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57287521173215, 40.9082475348817]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 164,
              SITENAME: "COGILL MINE",
              ALTNAME: "COGSWELL",
              BEGDATE: 1868,
              ENDDATE: 1910,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 491422.46875,
              Y_COORD: 776594.625,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.50254564219506, 40.96541744912413]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 165,
              SITENAME: "DENMARK MINE",
              ALTNAME: "PICATINNY",
              BEGDATE: 1868,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 485077.625,
              Y_COORD: 775909.5,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.52552098312572, 40.963534037245246]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 166,
              SITENAME: "MT. HOPE BROWN SHAFT MINE",
              ALTNAME: " ",
              BEGDATE: 1710,
              ENDDATE: 1969,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 480651.53125,
              Y_COORD: 765681,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.54153079136617, 40.93545299959268]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 167,
              SITENAME: "MOUNT HOPE MINE",
              ALTNAME: " ",
              BEGDATE: 1710,
              ENDDATE: 1969,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 479297.78125,
              Y_COORD: 762334.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.54642436960918, 40.92626540079857]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 168,
              SITENAME: "ALLEN MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 475607.375,
              Y_COORD: 759222.25,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.55977254820253, 40.917716180138186]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 169,
              SITENAME: "BAKER MINE",
              ALTNAME: " ",
              BEGDATE: 1866,
              ENDDATE: 1905,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 473169.15625,
              Y_COORD: 757032.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56858930374993, 40.91170072318144]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 170,
              SITENAME: "WEST MT PLEASENT MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1896,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 470850.78125,
              Y_COORD: 754639,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57697021530959, 40.905125254504256]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 171,
              SITENAME: "J.D. KING MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 466192.15625,
              Y_COORD: 752688.375,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59381720219659, 40.89975843664895]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 172,
              SITENAME: "WHITE MEADOW MINE",
              ALTNAME: " ",
              BEGDATE: 1840,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 489854.8125,
              Y_COORD: 763414.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.50821798610824, 40.929239669342884]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 173,
              SITENAME: "TITMAN SHAFT",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1874,
              MJRMINERAL: "HEMATITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 347900.9375,
              Y_COORD: 728547.875,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02122199629426, 40.83235452336559]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 174,
              SITENAME: "QUEEN MINE",
              ALTNAME: "BELVIDERE",
              BEGDATE: 1882,
              ENDDATE: 1900,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 348440.6875,
              Y_COORD: 721825.125,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.01912752938452, 40.81391027987389]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 175,
              SITENAME: "OXFORD MINE",
              ALTNAME: " ",
              BEGDATE: 1854,
              ENDDATE: 1964,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 353497.75,
              Y_COORD: 713286.625,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.00068107486658, 40.79055385464196]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 176,
              SITENAME: "SPLIT ROCK POND MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 509541.46875,
              Y_COORD: 780917.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.43692149010039, 40.97726525481575]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 177,
              SITENAME: "RIGHTER MINE",
              ALTNAME: " ",
              BEGDATE: 1872,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 502165.03125,
              Y_COORD: 772788.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.46365020215791, 40.95496478040864]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 178,
              SITENAME: "GREENVILLE MINE",
              ALTNAME: " ",
              BEGDATE: 1872,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 499428.1875,
              Y_COORD: 783430.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.47354768747273, 40.98417775475996]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 179,
              SITENAME: "STONY BROOK MINE",
              ALTNAME: "PIKE'S PEAK",
              BEGDATE: 1770,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "KINNELON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 514911.96875,
              Y_COORD: 785309,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.41745523374588, 40.98930804798574]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 180,
              SITENAME: "BOTTS FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1872,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "BOONTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 515477.28125,
              Y_COORD: 766285.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.41547402513493, 40.93708965786296]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 181,
              SITENAME: "ROCKAWAY VALLEY MINES",
              ALTNAME: "DECAMP MINE",
              BEGDATE: 1820,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "BOONTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 518642.8125,
              Y_COORD: 770373.125,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.403999610673, 40.94830002470148]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 182,
              SITENAME: "PROSPECT #2 SIMS",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 492308.90625,
              Y_COORD: 778436.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.49933560881662, 40.97047239431033]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 183,
              SITENAME: "THATCHER MINE",
              ALTNAME: "STEWARTSVIL",
              BEGDATE: 1873,
              ENDDATE: 1900,
              MJRMINERAL: "LIMONITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 332162.09375,
              Y_COORD: 678854.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0769182553048, 40.69568237159509]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 184,
              SITENAME: "BROADWAY MINE",
              ALTNAME: " ",
              BEGDATE: 1856,
              ENDDATE: 1868,
              MJRMINERAL: "LIMONITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 347787.75,
              Y_COORD: 693242.75,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02087336064328, 40.73544424285175]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 185,
              SITENAME: "HAMLEN MINE",
              ALTNAME: " ",
              BEGDATE: 1860,
              ENDDATE: 1880,
              MJRMINERAL: "LIMONITE",
              MUN: "LOPATCONG TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 311698.53125,
              Y_COORD: 677766.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "EASTON PA-NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.15068809876524, 40.6923032279628]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 186,
              SITENAME: "HACKLEBARNEY MINE",
              ALTNAME: " ",
              BEGDATE: 1760,
              ENDDATE: 1896,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 430346.8125,
              Y_COORD: 705668.875,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.7230589248656, 40.770513800962185]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 187,
              SITENAME: "CRANE MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 427090,
              Y_COORD: 731833.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73507121950294, 40.84231087727465]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 188,
              SITENAME: "MOUNT OLIVE MINE",
              ALTNAME: " ",
              BEGDATE: 1848,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 427626.71875,
              Y_COORD: 732753.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73314012331258, 40.84484119943294]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 189,
              SITENAME: "DRAKE MINE",
              ALTNAME: " ",
              BEGDATE: 1854,
              ENDDATE: 1870,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 429687.78125,
              Y_COORD: 735626.5,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.72571692176349, 40.85274172328616]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 190,
              SITENAME: "DRAKE MINE",
              ALTNAME: " ",
              BEGDATE: 1854,
              ENDDATE: 1870,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 429604.625,
              Y_COORD: 735281.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.7260143143708, 40.85179327391944]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 191,
              SITENAME: "OSBORNE MINE",
              ALTNAME: " ",
              BEGDATE: 1848,
              ENDDATE: 1855,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 435769.6875,
              Y_COORD: 740947.875,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.7037752676878, 40.86738951862554]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 192,
              SITENAME: "HEDGES MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 434847.21875,
              Y_COORD: 709878.5,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.70684562608606, 40.78209941348116]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 193,
              SITENAME: "DICKERSON FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1890,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 435331.1875,
              Y_COORD: 710947.25,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.70510694069856, 40.78503622952902]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 194,
              SITENAME: "TOPPING MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 435696.3125,
              Y_COORD: 711550.125,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.70379338336913, 40.78669344187465]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 195,
              SITENAME: "SAMPSON MINE",
              ALTNAME: "SAMSON",
              BEGDATE: 1867,
              ENDDATE: 1885,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 437130.46875,
              Y_COORD: 710496.5,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.69860536268025, 40.78381029280727]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 196,
              SITENAME: "COLLIS FARM EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 438272.875,
              Y_COORD: 712064.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.69449232259628, 40.78812162448368]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 197,
              SITENAME: "SWEAYZE MINE",
              ALTNAME: "SWAYZE MINE",
              BEGDATE: 1870,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 440688.5,
              Y_COORD: 713939.125,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.68578251619438, 40.79328162783061]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 198,
              SITENAME: "COOPER MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1885,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 442129.21875,
              Y_COORD: 715682.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.68059185062766, 40.79807558735205]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 199,
              SITENAME: "GULICK FARM MINE",
              ALTNAME: "GULICK FARM",
              BEGDATE: 1870,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 432162.90625,
              Y_COORD: 707381.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.71651701516315, 40.77522655763591]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 200,
              SITENAME: "LANGDON MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 428158.8125,
              Y_COORD: 699914.375,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73090421582128, 40.75470224399619]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 201,
              SITENAME: "PITNEY MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 427328.75,
              Y_COORD: 701569.625,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.7339164559186, 40.75923985679327]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 202,
              SITENAME: "CHILD MINE",
              ALTNAME: " ",
              BEGDATE: 1874,
              ENDDATE: 1874,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 433830.84375,
              Y_COORD: 703571.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.71046133975855, 40.76477965050477]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 203,
              SITENAME: "PIKES PEAK MINE",
              ALTNAME: "FURNACE OR",
              BEGDATE: 1855,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN BORO",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 467940.21875,
              Y_COORD: 830040,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58777464665768, 41.112084911070326]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 204,
              SITENAME: "SCHOFIELD MINE",
              ALTNAME: "SCOFIELD",
              BEGDATE: 1855,
              ENDDATE: 1890,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 471325.09375,
              Y_COORD: 794610.25,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57537891537964, 41.014843881283426]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 205,
              SITENAME: "SHERMAN FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1854,
              ENDDATE: 1875,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 458088.0625,
              Y_COORD: 798582.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.62336917335004, 41.025706041028094]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 206,
              SITENAME: "DEATS MINE",
              ALTNAME: "DEATS FARM",
              BEGDATE: 1873,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "LIBERTY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 364549.3125,
              Y_COORD: 743924.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.96135005721386, 40.8748170435177]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 207,
              SITENAME: "MCKINLEY MINE",
              ALTNAME: "SLOPE NO. 3",
              BEGDATE: 1883,
              ENDDATE: 1905,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 355022.78125,
              Y_COORD: 715077.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.99520985640886, 40.79549389155949]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 208,
              SITENAME: "BARKER MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 384390.75,
              Y_COORD: 739189.375,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.88952357351619, 40.86208481970094]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 209,
              SITENAME: "EGBERT CHURCH MINE",
              ALTNAME: "SMITH MINE",
              BEGDATE: 1871,
              ENDDATE: 1876,
              MJRMINERAL: "MAGNETITE",
              MUN: "MANSFIELD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 382115.46875,
              Y_COORD: 727872.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89756415674779, 40.8309918574329]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 210,
              SITENAME: "POHATCONG PIT # 1",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1870,
              MJRMINERAL: "MAGNETITE",
              MUN: "MANSFIELD TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 380115.53125,
              Y_COORD: 719262.5,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.90464789412361, 40.80733423697893]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 211,
              SITENAME: "POHATCONG PIT # 2",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1870,
              MJRMINERAL: "MAGNETITE",
              MUN: "MANSFIELD TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 383472.3125,
              Y_COORD: 722942.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89258098276831, 40.81747759893534]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 212,
              SITENAME: "WOOD MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 510924.25,
              Y_COORD: 789922.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.43188780932105, 41.001980541464114]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 213,
              SITENAME: "CLINTON TRACT MINE",
              ALTNAME: " ",
              BEGDATE: 1872,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "WEST MILFORD TWP",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 501554.40625,
              Y_COORD: 818503.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.46579621168146, 41.080447169919935]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 214,
              SITENAME: "WILD CAT MINE",
              ALTNAME: "KITCHELL",
              BEGDATE: 1877,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 504136.0625,
              Y_COORD: 795912.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.45647208256288, 41.01843432785099]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 215,
              SITENAME: "BROWN MINE",
              ALTNAME: " ",
              BEGDATE: 1874,
              ENDDATE: 1880,
              MJRMINERAL: "LIMONITE",
              MUN: "MANSFIELD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 394424.0625,
              Y_COORD: 721957.75,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.85299699521745, 40.81490221230074]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 216,
              SITENAME: "SEARLE MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 391173.96875,
              Y_COORD: 731992.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.86489039525857, 40.84241147031279]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 217,
              SITENAME: "MARSH MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 404635.75,
              Y_COORD: 720668.375,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.81608574298058, 40.81146993803371]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 218,
              SITENAME: "HANN MINE",
              ALTNAME: " ",
              BEGDATE: 1871,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 397363.8125,
              Y_COORD: 709762.75,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.84220385635696, 40.78145966585507]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 219,
              SITENAME: "DERRENBERGER FARM",
              ALTNAME: "DERRENBERGE",
              BEGDATE: 1883,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 405429,
              Y_COORD: 715662.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.81315530436565, 40.79773706668668]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 220,
              SITENAME: "MCKEAN MINE",
              ALTNAME: "BIRD MINE",
              BEGDATE: 1873,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "BYRAM TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 430189.90625,
              Y_COORD: 774888.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.72426550814414, 40.9605156855071]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 221,
              SITENAME: "LAKE VIEW MINE",
              ALTNAME: " ",
              BEGDATE: 1863,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT ARLINGTON BO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 455956.40625,
              Y_COORD: 766830.5,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.63092291787689, 40.938541435486385]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 222,
              SITENAME: "LURK MINE",
              ALTNAME: " ",
              BEGDATE: 1904,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT ARLINGTON",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 456309.25,
              Y_COORD: 763470.5,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.62962768308402, 40.929319953971635]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 223,
              SITENAME: "PASSAIC MINE",
              ALTNAME: " ",
              BEGDATE: 1882,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOPATCONG BORO",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 443698.25,
              Y_COORD: 765396,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.67528380650685, 40.934544948518145]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 224,
              SITENAME: "EDWARD'S PROSPECT",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOPATCONG BORO",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 453584.09375,
              Y_COORD: 772373.625,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.63954210165035, 40.95374675544837]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 225,
              SITENAME: "DICKERSON MINE",
              ALTNAME: " ",
              BEGDATE: 1713,
              ENDDATE: 1908,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 462026.5,
              Y_COORD: 741649.375,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6088373513846, 40.86944375263111]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 226,
              SITENAME: "BRYANT MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1890,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 459589.1875,
              Y_COORD: 735577.875,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61762113617179, 40.85276911316699]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 227,
              SITENAME: "FOULON MINE",
              ALTNAME: "CONNOR-FOUL",
              BEGDATE: 1868,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 459899.28125,
              Y_COORD: 736171.75,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61650298751599, 40.85440041163259]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 228,
              SITENAME: "CHARLES KING MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1870,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 460104.78125,
              Y_COORD: 736976.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61576390816211, 40.856608967673836]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 229,
              SITENAME: "BROTHERTON MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1901,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 463074.625,
              Y_COORD: 741872.625,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6050483272501, 40.87006008044585]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 230,
              SITENAME: "LAWRENCE MINE",
              ALTNAME: "GORDON MINE",
              BEGDATE: 1878,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 465713.1875,
              Y_COORD: 733562.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.5954744895017, 40.84725829414436]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 231,
              SITENAME: "GEORGE MINE",
              ALTNAME: "LOGAN MINE",
              BEGDATE: 1855,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 460383.3125,
              Y_COORD: 730388.75,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61472575389621, 40.83852805785073]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 232,
              SITENAME: "HENDERSON MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 457670.875,
              Y_COORD: 727697.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.62451548731761, 40.83113067356307]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 233,
              SITENAME: "COPPER MINE",
              ALTNAME: "COOPER MINE",
              BEGDATE: 1870,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 474945.28125,
              Y_COORD: 740947.75,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56212146858682, 40.86755244552048]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 234,
              SITENAME: "SKELLINGER MINE",
              ALTNAME: " ",
              BEGDATE: 1878,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 460427.5625,
              Y_COORD: 720755.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61452031927531, 40.81208642373135]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 235,
              SITENAME: "CONNET MINE",
              ALTNAME: "WATER ST.",
              BEGDATE: 1869,
              ENDDATE: 1875,
              MJRMINERAL: "MAGNETITE",
              MUN: "MENDHAM TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 475662.59375,
              Y_COORD: 713810.25,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.55946116591892, 40.793062106334844]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 236,
              SITENAME: "HAGGERTY'S FARM",
              ALTNAME: " ",
              BEGDATE: 1874,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALLAMUCHY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 408902.6875,
              Y_COORD: 751527.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "TRANQUILITY NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.80105339830905, 40.89621593465493]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 237,
              SITENAME: "SIMPSON MINE",
              ALTNAME: " ",
              BEGDATE: 1850,
              ENDDATE: 1854,
              MJRMINERAL: "HEMATITE",
              MUN: "VERNON TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 478983.59375,
              Y_COORD: 850362.5,
              ELEMENT: "IRON",
              QUAD_NAME: "HAMBURG NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.54773574245687, 41.16789019420267]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 238,
              SITENAME: "POCHUK MINE",
              ALTNAME: " ",
              BEGDATE: 1835,
              ENDDATE: 1876,
              MJRMINERAL: "LIMONITE",
              MUN: "VERNON TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 478512.6875,
              Y_COORD: 854974.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "HAMBURG NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.54945575205915, 41.18054732963274]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 239,
              SITENAME: "RAPP MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1930,
              MJRMINERAL: "LIMONITE",
              MUN: "POHATCONG TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 303688,
              Y_COORD: 652286.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.17886588259807, 40.62219766677702]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 240,
              SITENAME: "RIEGEL MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1888,
              MJRMINERAL: "LIMONITE",
              MUN: "POHATCONG TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 303093.53125,
              Y_COORD: 651626,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.18098896040905, 40.620371898048205]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 241,
              SITENAME: "RIEGEL MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1888,
              MJRMINERAL: "LIMONITE",
              MUN: "POHATCONG TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 303383.5,
              Y_COORD: 651872.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.17995129088987, 40.62105551934314]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 242,
              SITENAME: "ALBERTSON MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1875,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 379188.65625,
              Y_COORD: 760112.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.90868494946642, 40.91945098615011]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 243,
              SITENAME: "COOK FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1881,
              ENDDATE: 1900,
              MJRMINERAL: "MAGNETITE",
              MUN: "LIBERTY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 369457.90625,
              Y_COORD: 747547.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.94366617419088, 40.88483270843597]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 244,
              SITENAME: "SHUSTER MINE",
              ALTNAME: " ",
              BEGDATE: 1877,
              ENDDATE: 1890,
              MJRMINERAL: "LIMONITE",
              MUN: "FRELINGHUYSEN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 371505.875,
              Y_COORD: 770685.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.93667698921467, 40.94837173141849]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 245,
              SITENAME: "JENNY JUMP MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1900,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOPE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 371727.5,
              Y_COORD: 754663.25,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.93558577084335, 40.90439489969041]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 246,
              SITENAME: "EMERY FARM EXPLORATION",
              ALTNAME: "EMORY FARM",
              BEGDATE: 1878,
              ENDDATE: 1878,
              MJRMINERAL: "MAGNETITE",
              MUN: "CLINTON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 390178.875,
              Y_COORD: 668112.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.86752022072386, 40.667051356898774]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 247,
              SITENAME: "SUTTON FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "TEWKSBURY TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 414413.125,
              Y_COORD: 685849.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.7803602239816, 40.71598423801243]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 248,
              SITENAME: "RAMSEY'S MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1872,
              MJRMINERAL: "LIMONITE",
              MUN: "HARMONY TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 316048.0625,
              Y_COORD: 698991.25,
              ELEMENT: "IRON",
              QUAD_NAME: "BANGOR NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.13555687731485, 40.75064931019449]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 249,
              SITENAME: "MABERRY MINE",
              ALTNAME: "MAYBERRY",
              BEGDATE: 1880,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 370061.15625,
              Y_COORD: 675188.125,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.94017101779993, 40.6862199224561]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 250,
              SITENAME: "SCHULER MINE",
              ALTNAME: " ",
              BEGDATE: 1773,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 329008.781248999,
              Y_COORD: 711716.124991,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0890855698475, 40.785825423382256]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 251,
              SITENAME: "ROSEBERRY MINE",
              ALTNAME: " ",
              BEGDATE: 1872,
              ENDDATE: 1890,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 338938.75,
              Y_COORD: 720798.487445999,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.05343276369517, 40.81093274409778]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 252,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 352751.139077999,
              Y_COORD: 706903.151378,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.00324523935926, 40.77302018713421]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 253,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "MENDHAM BORO",
              COUNTY: "MORRIS",
              REFERENCES: 37,
              X_COORD: 460677.448083,
              Y_COORD: 698818.237213999,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61351494906049, 40.75186849995474]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 254,
              SITENAME: "SUTTON FARM GRAPHITE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "TEWKSBURY TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 37,
              X_COORD: 415880.368158,
              Y_COORD: 685120.092132,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.77505871389866, 40.71399492517584]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 255,
              SITENAME: "FISHER MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "TEWKSBURY TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 37,
              X_COORD: 424914.588716999,
              Y_COORD: 687679.026499,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "GLADSTONE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.742493006704, 40.72109226394718]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 256,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRELINGHUYSEN TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 379675,
              Y_COORD: 761325,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.90694546605522, 40.92278552584755]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 257,
              SITENAME: "CUMMINS MINE",
              ALTNAME: "CUMMINGS",
              BEGDATE: 1868,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 386529,
              Y_COORD: 748948,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.88194663951501, 40.88889703824043]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 258,
              SITENAME: "DAVIS MINE",
              ALTNAME: "DAVIS'S",
              BEGDATE: 1873,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 380285,
              Y_COORD: 760412,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.90472272191626, 40.920287230023774]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 259,
              SITENAME: "INSHOW EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 1872,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOPE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 374253,
              Y_COORD: 751332,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.92639033044323, 40.895285215062906]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 260,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 376809,
              Y_COORD: 755975,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.91722460180843, 40.90806345258899]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 261,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 377346,
              Y_COORD: 755770,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.91527822621933, 40.907507767796]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 262,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 379586,
              Y_COORD: 758694,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.90722322438239, 40.91556265336918]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 263,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 380051,
              Y_COORD: 759704,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.90555760859647, 40.918340895558565]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 264,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 382497,
              Y_COORD: 757264,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.8966665710273, 40.91167420524497]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 265,
              SITENAME: "TERRY MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1885,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 337467,
              Y_COORD: 678575,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0577802446189, 40.695008674108855]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 266,
              SITENAME: "SMITH'S OPENINGS",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 333048,
              Y_COORD: 674151,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0736126079871, 40.68278712243778]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 267,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 330256,
              Y_COORD: 671335,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.08361229284266, 40.67500701492253]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 268,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 330801,
              Y_COORD: 672243,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.08166908069916, 40.67750930149573]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 269,
              SITENAME: "TURKEY HILL MINE",
              ALTNAME: "WEST END",
              BEGDATE: 1872,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 338677,
              Y_COORD: 662780,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Turkey Hill"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.05305816828745, 40.651673644491325]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 270,
              SITENAME: "TURKEY HILL MINE",
              ALTNAME: "WEST END",
              BEGDATE: 1872,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 341000,
              Y_COORD: 664486,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Turkey Hill"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.04472406235914, 40.65639629960842]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 271,
              SITENAME: "TURKEY HILL MINE",
              ALTNAME: "WEST END",
              BEGDATE: 1872,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 341462,
              Y_COORD: 664483,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Turkey Hill"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0430588181176, 40.65639590281848]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 272,
              SITENAME: "TURKEY HILL MINE",
              ALTNAME: "WEST END",
              BEGDATE: 1872,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 341925,
              Y_COORD: 664481,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Turkey Hill"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.04138998924667, 40.656398254664474]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 273,
              SITENAME: "TURKEY HILL MINE",
              ALTNAME: "WEST END",
              BEGDATE: 1872,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 341924,
              Y_COORD: 664278,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Turkey Hill"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.04138907956151, 40.65584101063003]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 274,
              SITENAME: "TURKEY HILL MINE",
              ALTNAME: "WEST END",
              BEGDATE: 1872,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 340071,
              Y_COORD: 663784,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Turkey Hill"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.048056691645, 40.65445350912516]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 275,
              SITENAME: "HENRY MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 340983,
              Y_COORD: 661653,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.04472209471412, 40.64861960411481]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 276,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALEXANDRIA TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 331992,
              Y_COORD: 654121,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.07694640079542, 40.62778742484939]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 277,
              SITENAME: "SWAYZE MINE",
              ALTNAME: "BETHLEHEM",
              BEGDATE: 1868,
              ENDDATE: 1889,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 348265,
              Y_COORD: 667883,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Swayze Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.01861099498645, 40.66584142322992]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 278,
              SITENAME: "SWAYZE MINE",
              ALTNAME: "BETHLEHEM",
              BEGDATE: 1868,
              ENDDATE: 1889,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 348106,
              Y_COORD: 667074,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Swayze Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.01916695059693, 40.663618192206336]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 279,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 347734,
              Y_COORD: 669404,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0205576196328, 40.67000786312233]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 280,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 345639,
              Y_COORD: 666887,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02805567735157, 40.66306455831438]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 281,
              SITENAME: "WILD CAT MINE",
              ALTNAME: " ",
              BEGDATE: 1876,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 351336,
              Y_COORD: 665942,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Wild Cat Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.00750020766753, 40.660562681895684]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 282,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 345331,
              Y_COORD: 666990,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02916815519795, 40.66334220944804]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 283,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 345022,
              Y_COORD: 666890,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.03027982418295, 40.66306260578763]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 284,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 345937,
              Y_COORD: 665165,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02694429413852, 40.65834268607439]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 285,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "POHATCONG TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 319070,
              Y_COORD: 658560,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.1236140323397, 40.63973009909304]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 286,
              SITENAME: "SILVER SPRING MINE",
              ALTNAME: " ",
              BEGDATE: 1882,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT ARLINGTON",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 452744.990631,
              Y_COORD: 757728.725178,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6424937271758, 40.91354400359557]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 287,
              SITENAME: "KEAN MINE",
              ALTNAME: "SILVERTHORN",
              BEGDATE: 1875,
              ENDDATE: 1885,
              MJRMINERAL: "MAGNETITE",
              MUN: "HIGH BRIDGE BORO",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 383807,
              Y_COORD: 672253,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Kean Mines"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89055683232353, 40.678341397748866]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 288,
              SITENAME: "BEAVERS FARM MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "HIGH BRIDGE BORO",
              COUNTY: "HUNTERDON",
              REFERENCES: 37,
              X_COORD: 380866,
              Y_COORD: 669231,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.90111104794136, 40.67000971196333]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 289,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 375595,
              Y_COORD: 678767,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Added 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.9202778893451, 40.69611817871842]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 290,
              SITENAME: "VAN SYCKLE'S MINE",
              ALTNAME: "CHURCH MINE",
              BEGDATE: 1770,
              ENDDATE: 1875,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 358728,
              Y_COORD: 664990,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.98083659775335, 40.65806351161842]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 291,
              SITENAME: "EVELAND MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "GLEN GARDNER",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 370286,
              Y_COORD: 680008,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Added 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.93944716147519, 40.69945337214453]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 292,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 353560,
              Y_COORD: 664108,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Added 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.99944614607865, 40.65556338806566]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 293,
              SITENAME: "READINGSBURGH MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "CLINTON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 37,
              X_COORD: 387359,
              Y_COORD: 674059,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.87777786673665, 40.68334145590369]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 294,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 374822,
              Y_COORD: 678265,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Added 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.92305700413635, 40.694730020626736]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 295,
              SITENAME: "RIKER MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 465840,
              Y_COORD: 800140,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59527832321196, 41.030007664495145]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 296,
              SITENAME: "SHERMAN FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1854,
              ENDDATE: 1905,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 458099,
              Y_COORD: 799340,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.62333340646195, 41.027785154687805]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 297,
              SITENAME: "ROBERTS",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1889,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 472747,
              Y_COORD: 812784,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57027908219735, 41.06473176148184]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 298,
              SITENAME: "VICTOR MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 471673,
              Y_COORD: 811368,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57416974457742, 41.06084259490235]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 299,
              SITENAME: "UNNAMED MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 477725,
              Y_COORD: 812477,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.55222489441293, 41.06389868157275]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 300,
              SITENAME: "KANOUSE MINE",
              ALTNAME: "BROWN MINE",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WANAQUE BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 552232.125,
              Y_COORD: 803879.375,
              ELEMENT: "IRON",
              QUAD_NAME: "WANAQUE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.28209475389306, 41.04010517750582]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 301,
              SITENAME: "WIGWAM BROOK MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "COPPER",
              MUN: "ORANGE CITY",
              COUNTY: "ESSEX",
              REFERENCES: 51,
              X_COORD: 566928,
              Y_COORD: 709601.8125,
              ELEMENT: "COPPER",
              QUAD_NAME: "ORANGE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.22987342801417, 40.78120913425718]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 302,
              SITENAME: "KEAN MINE",
              ALTNAME: "SILVERTHORN",
              BEGDATE: 1875,
              ENDDATE: 1885,
              MJRMINERAL: "MAGNETITE",
              MUN: "HIGH BRIDGE BORO",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 383928.5625,
              Y_COORD: 672714.75,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Kean Mines"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89012592413793, 40.67961038084062]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 303,
              SITENAME: "RARICK FARM EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 426977.46875,
              Y_COORD: 723154.875,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.7353937062122, 40.81848816625415]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 304,
              SITENAME: "MILLER MINE",
              ALTNAME: "NEW MILLER",
              BEGDATE: 1867,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 555215.3125,
              Y_COORD: 839854.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.27093716587105, 41.13883064643942]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 305,
              SITENAME: "RED MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: "NJGS FILES",
              X_COORD: 554219.5625,
              Y_COORD: 837574.25,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.27457388281671, 41.13257806856451]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 306,
              SITENAME: "HARD MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 554132.0625,
              Y_COORD: 837431.875,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.27489287578724, 41.13218789661885]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 307,
              SITENAME: "WANAQUE- LAUREL MINE",
              ALTNAME: "RED, LAUREL",
              BEGDATE: 0,
              ENDDATE: 1890,
              MJRMINERAL: "MAGNETITE",
              MUN: "BLOOMINGDALE BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 543237.0625,
              Y_COORD: 811549.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "WANAQUE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.31464538126458, 41.061214399431066]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 308,
              SITENAME: "BEAM MINE",
              ALTNAME: "BEAM LOT",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WANAQUE BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 546165.875,
              Y_COORD: 797336.75,
              ELEMENT: "IRON",
              QUAD_NAME: "WANAQUE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.30413987891731, 41.02218605286828]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 309,
              SITENAME: "RHEINSMITH FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1874,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 543128.375,
              Y_COORD: 822153.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "WANAQUE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.31495792543956, 41.09032306584505]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 310,
              SITENAME: "SPRING MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 465439.34375,
              Y_COORD: 748807.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59652511412533, 40.88910461493399]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 311,
              SITENAME: "STIRLING MINE",
              ALTNAME: "STERLING",
              BEGDATE: 1640,
              ENDDATE: 1885,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 467160.21875,
              Y_COORD: 750258.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59030604477599, 40.89309256916406]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 312,
              SITENAME: "TEABO MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1907,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 477323.0625,
              Y_COORD: 761098.5,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.55356829127949, 40.92286940671558]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 313,
              SITENAME: "HICKORY HILL MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 484552.21875,
              Y_COORD: 768297.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.52741489643341, 40.94263811033366]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 314,
              SITENAME: "MINE TUNNEL",
              ALTNAME: "DOLAN MINE",
              BEGDATE: 1869,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 470528.40625,
              Y_COORD: 758254.125,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57814822806169, 40.91504774848056]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 315,
              SITENAME: "BREWER MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 348442.28125,
              Y_COORD: 725307.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.01919630041219, 40.823469819039175]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 316,
              SITENAME: "BEACH GLEN MINE",
              ALTNAME: " ",
              BEGDATE: 1808,
              ENDDATE: 1930,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 496810.03125,
              Y_COORD: 765491.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.48304389470292, 40.93493923745085]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 317,
              SITENAME: "COBB MINE",
              ALTNAME: "SPLIT ROCK",
              BEGDATE: 1868,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 508502.625,
              Y_COORD: 776742.625,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.44069429638385, 40.965808468645875]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 318,
              SITENAME: "BIRCH MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 13,
              X_COORD: 496868.46875,
              Y_COORD: 777037.375,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.48282416438029, 40.96663150527114]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 319,
              SITENAME: "MEIRDEN MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 499710,
              Y_COORD: 771366.875,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.47254061597764, 40.95106447954626]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 320,
              SITENAME: "PROSPECT #70 SIMS",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 494546.21875,
              Y_COORD: 775111.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.4912343966406, 40.96134660693392]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 321,
              SITENAME: "CLINE MINE",
              ALTNAME: "NEW VILLAGE",
              BEGDATE: 1873,
              ENDDATE: 1880,
              MJRMINERAL: "LIMONITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 329511.59375,
              Y_COORD: 687642.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.08668865976381, 40.7197569722843]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 322,
              SITENAME: "STEPHENS MINE",
              ALTNAME: " ",
              BEGDATE: 1848,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 427841.96875,
              Y_COORD: 733163.625,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73236599754381, 40.84596802546454]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 323,
              SITENAME: "BAPTIST CHURCH MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROXBURY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 439338.34375,
              Y_COORD: 742339.75,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.69088249540333, 40.87123221162434]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 324,
              SITENAME: "PEACH ORCHARD MINE",
              ALTNAME: "CREAGER",
              BEGDATE: 1870,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 435071.84375,
              Y_COORD: 709301.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.70602956705399, 40.780516151901125]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 325,
              SITENAME: "GOBLE MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 460078.96875,
              Y_COORD: 790982.25,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61611647333255, 41.00485159114275]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 326,
              SITENAME: "WELCH MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 354756.90625,
              Y_COORD: 715926.875,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.99618749993172, 40.79782068726611]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 327,
              SITENAME: "PEQUEST MINE",
              ALTNAME: " ",
              BEGDATE: 1869,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 362522.71875,
              Y_COORD: 728216.875,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.96837480781294, 40.831672597802445]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 328,
              SITENAME: "MITCHELL MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1874,
              MJRMINERAL: "MAGNETITE",
              MUN: "MANSFIELD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 378255.28125,
              Y_COORD: 720793,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.91139403929513, 40.81151155998225]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 329,
              SITENAME: "STALEY 2",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 355458.15625,
              Y_COORD: 715953.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.99365515193165, 40.7979044692972]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 330,
              SITENAME: "COPPERAS MINE",
              ALTNAME: " ",
              BEGDATE: 1812,
              ENDDATE: 1815,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 501916,
              Y_COORD: 794358.5,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.46452014446609, 41.01417204872692]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 331,
              SITENAME: "THOMAS MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1880,
              MJRMINERAL: "LIMONITE",
              MUN: "MANSFIELD TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 395438.78125,
              Y_COORD: 723041,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.84934646327119, 40.817886819646006]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 332,
              SITENAME: "SEARLE MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 393524.625,
              Y_COORD: 730287.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.85636899788072, 40.837755552962605]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 333,
              SITENAME: "PIDCOCK MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 388829.21875,
              Y_COORD: 706924.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.87297987295538, 40.77357280934975]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 334,
              SITENAME: "DICKINSON'S MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1860,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 406102.96875,
              Y_COORD: 720158.625,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.81077847488979, 40.81008510106447]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 335,
              SITENAME: "ALLIS EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "BYRAM TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 426143.3125,
              Y_COORD: 766259.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73883254764893, 40.93680055467704]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 336,
              SITENAME: "LAWRENCE MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BYRAM TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 444921.118395,
              Y_COORD: 785714.909043999,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6710015140961, 40.99032494525668]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 337,
              SITENAME: "EVERS MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 462146.46875,
              Y_COORD: 740578.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.60839875970822, 40.866505180664056]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 338,
              SITENAME: "TROWBRIDGE MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1869,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 467092.34375,
              Y_COORD: 735010.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59049455261056, 40.85123496065417]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 339,
              SITENAME: "JANES MINE",
              ALTNAME: " ",
              BEGDATE: 1865,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BERNARDSVILLE BORO",
              COUNTY: "SOMERSET",
              REFERENCES: 2,
              X_COORD: 469393.59375,
              Y_COORD: 698889.875,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58205335828887, 40.752091800544434]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 340,
              SITENAME: "WATERLOO MINE",
              ALTNAME: "BROOKFIELD",
              BEGDATE: 1855,
              ENDDATE: 1885,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALLAMUCHY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 410802.03125,
              Y_COORD: 756529.25,
              ELEMENT: "IRON",
              QUAD_NAME: "TRANQUILITY NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.79424356964178, 40.90996418018411]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 341,
              SITENAME: "WINTERMUTH'S MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALLAMUCHY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 404318.25,
              Y_COORD: 750374.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "TRANQUILITY NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.81762196244499, 40.89300691858831]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 342,
              SITENAME: "COPPERAS MINE",
              ALTNAME: "GREENS MINE",
              BEGDATE: 1816,
              ENDDATE: 1816,
              MJRMINERAL: "MAGNETITE",
              MUN: "VERNON TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 483335.21875,
              Y_COORD: 860835.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "HAMBURG NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.53194311538493, 41.196640812352065]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 343,
              SITENAME: "SHILOH MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1873,
              MJRMINERAL: "LIMONITE",
              MUN: "HOPE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 369213.40625,
              Y_COORD: 756259.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.94471056445663, 40.908741491675855]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 344,
              SITENAME: "CUMMINS MINE",
              ALTNAME: "CUMMINGS",
              BEGDATE: 1868,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 387130.28125,
              Y_COORD: 749191.25,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.87977565029885, 40.88957191700717]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 345,
              SITENAME: "WELCH FARM EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 1883,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "TEWKSBURY TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 418155.28125,
              Y_COORD: 689899,
              ELEMENT: "IRON",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.7669043125987, 40.72713227535845]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 346,
              SITENAME: "TAR HILL MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "ANDOVER TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 430639.21875,
              Y_COORD: 794414.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWTON EAST NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.7228189356155, 41.01411671261064]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 347,
              SITENAME: "GLEN RIDGE MINE",
              ALTNAME: " ",
              BEGDATE: 1746,
              ENDDATE: 0,
              MJRMINERAL: "COPPER",
              MUN: "GLEN RIDGE BORO",
              COUNTY: "ESSEX",
              REFERENCES: 51,
              X_COORD: 574597.0625,
              Y_COORD: 716303.75,
              ELEMENT: "COPPER",
              QUAD_NAME: "ORANGE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.20209708811399, 40.799537515692684]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 348,
              SITENAME: "RARITAN MINE",
              ALTNAME: " ",
              BEGDATE: 1840,
              ENDDATE: 0,
              MJRMINERAL: "COPPER",
              MUN: "PISCATAWAY TWP",
              COUNTY: "MIDDLESEX",
              REFERENCES: 51,
              X_COORD: 496148.467271999,
              Y_COORD: 591736.112071,
              ELEMENT: "COPPER",
              QUAD_NAME: "NEW BRUNSWICK NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.48554192833947, 40.45797419677878]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 349,
              SITENAME: "AHLES MINE",
              ALTNAME: " ",
              BEGDATE: 1901,
              ENDDATE: 1916,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 352812.397737,
              Y_COORD: 722245.77853,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.00334202765785, 40.81513490348063]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 350,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "MAHWAH TWP",
              COUNTY: "BERGEN",
              REFERENCES: "NJGS FILES",
              X_COORD: 573940.263045,
              Y_COORD: 822851.402974999,
              ELEMENT: "IRON",
              QUAD_NAME: "RAMSEY NJ-NY",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.20316284210448, 41.09200441607801]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 351,
              SITENAME: "BETTS EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "MORRIS TWP",
              COUNTY: "MORRIS",
              REFERENCES: 37,
              X_COORD: 493041.820352,
              Y_COORD: 725041.964740999,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "MORRISTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.49668867706582, 40.82390827153763]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 352,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN TWP TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 338262,
              Y_COORD: 694660,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0552799233064, 40.739174198825665]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 353,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 331194,
              Y_COORD: 673454,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.08028097217365, 40.68084051377461]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 354,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 346737,
              Y_COORD: 670118,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02416719660206, 40.671951484754665]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 355,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 346501,
              Y_COORD: 669412,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02500281320903, 40.67000970211472]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 356,
              SITENAME: "SWAYZE MINE",
              ALTNAME: "BETHLEHEM",
              BEGDATE: 1868,
              ENDDATE: 1889,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 346563,
              Y_COORD: 666780,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Swayze Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0247226676307, 40.66278603941575]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 357,
              SITENAME: "BANGHART MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 376683,
              Y_COORD: 680887,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Banghart Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.91639025377671, 40.701951721510426]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 358,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CLINTON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 387897,
              Y_COORD: 673956,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Added 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.87583634614495, 40.68306505730837]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 359,
              SITENAME: "MARBLE MT.  MINE",
              ALTNAME: "FULLMER",
              BEGDATE: 1860,
              ENDDATE: 1887,
              MJRMINERAL: "HEMATITE",
              MUN: "LOPATCONG TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 301789,
              Y_COORD: 686417,
              ELEMENT: "IRON",
              QUAD_NAME: "EASTON PA-NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Marble Mt."
            },
            geometry: {
              type: "Point",
              coordinates: [-75.18666708220847, 40.71584032472717]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 360,
              SITENAME: "RICHARD MINE",
              ALTNAME: " ",
              BEGDATE: 1856,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 475544,
              Y_COORD: 758641,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: "YES",
              COMMENTS: "Added 2006, Sweetwater Shaft"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56000042680232, 40.91612056949426]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 361,
              SITENAME: "BUNKER MINE",
              ALTNAME: " ",
              BEGDATE: 1854,
              ENDDATE: 1905,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 458176,
              Y_COORD: 799543,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.62305535478853, 41.02834265876721]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 362,
              SITENAME: "UNNAMED MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 458257,
              Y_COORD: 803186,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.62278033224679, 41.03834254331562]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 363,
              SITENAME: "UNNAMED MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 477572,
              Y_COORD: 812477,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.55277977358729, 41.06389842876296]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 364,
              SITENAME: "GREEN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "VERNON TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 520921.5625,
              Y_COORD: 866153,
              ELEMENT: "IRON",
              QUAD_NAME: "WAWAYANDA NJ-NY",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.39533367730473, 41.21119433212716]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 365,
              SITENAME: "KEAN MINE",
              ALTNAME: "SILVERTHORN",
              BEGDATE: 1875,
              ENDDATE: 1885,
              MJRMINERAL: "MAGNETITE",
              MUN: "HIGH BRIDGE BORO",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 383887,
              Y_COORD: 672860,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Kean Mines"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89027810530428, 40.68000858130013]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 366,
              SITENAME: "HACKETT MINE",
              ALTNAME: "HACKETT",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "HIGH BRIDGE BORO",
              COUNTY: "HUNTERDON",
              REFERENCES: 37,
              X_COORD: 383541,
              Y_COORD: 664462,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89139086047562, 40.6569519554341]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 367,
              SITENAME: "BANGHART MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 376760,
              Y_COORD: 680988,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Banghart Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.91611424942181, 40.70222995698998]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 368,
              SITENAME: "BANGHART MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 376683,
              Y_COORD: 680989,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Banghart Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.9163919973388, 40.70223170234291]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 369,
              SITENAME: "COOPER MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 555774,
              Y_COORD: 841905,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.26888897841513, 41.14445395565725]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 370,
              SITENAME: "UNKNOWN",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "POHATCONG",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 308155,
              Y_COORD: 652467,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.16277896824455, 40.62278641461315]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 371,
              SITENAME: "HAGAR MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOLLAND TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 317117,
              Y_COORD: 644204,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.13028088036289, 40.600285975177904]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 372,
              SITENAME: "HAGAR MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOLLAND TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 317272,
              Y_COORD: 644203,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.12972266480529, 40.60028627307321]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 373,
              SITENAME: "UNNAMED MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 467070,
              Y_COORD: 803883,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006, North Shaft"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59083401277813, 41.04028532096803]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 374,
              SITENAME: "DUFFEE MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 466595,
              Y_COORD: 789615,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59250121433536, 41.00112000604739]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 375,
              SITENAME: "DAVENPORT",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 471597,
              Y_COORD: 811165,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57444472848678, 41.06028521374593]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 376,
              SITENAME: "LAYTON MINE",
              ALTNAME: " ",
              BEGDATE: 1878,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "VERNON TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 517388,
              Y_COORD: 870201.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "WAWAYANDA NJ-NY",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.40816169353172, 41.22231841361381]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 377,
              SITENAME: "MARTIN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALEXANDRIA TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 339428.59375,
              Y_COORD: 652677.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "FRENCHTOWN NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.05012171058485, 40.62395600589244]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 378,
              SITENAME: "SCHUYLER MINE",
              ALTNAME: "ARLINGTON",
              BEGDATE: 1710,
              ENDDATE: 1903,
              MJRMINERAL: "COPPER",
              MUN: "NORTH ARLINGTON",
              COUNTY: "BERGEN",
              REFERENCES: "44, 46, 51",
              X_COORD: 594932.125,
              Y_COORD: 708795.875,
              ELEMENT: "COPPER",
              QUAD_NAME: "ORANGE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.12875915286929, 40.77871586357721]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 379,
              SITENAME: "BLAUVELT",
              ALTNAME: " ",
              BEGDATE: 1890,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 434780.4375,
              Y_COORD: 710261.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.70709005262941, 40.783149791109636]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 380,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 437600.90625,
              Y_COORD: 707491.625,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.69688210105362, 40.77556487411915]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 381,
              SITENAME: "HARDEN MINE",
              ALTNAME: " ",
              BEGDATE: 1869,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 438281.90625,
              Y_COORD: 703023.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6943873489057, 40.76330323457069]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 382,
              SITENAME: "BOLMER MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1868,
              MJRMINERAL: "COPPER",
              MUN: "BRIDGEWATER TWP",
              COUNTY: "SOMERSET",
              REFERENCES: 51,
              X_COORD: 470128.8125,
              Y_COORD: 644661,
              ELEMENT: "COPPER",
              QUAD_NAME: "BOUND BROOK NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57922307497252, 40.60323296832365]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 383,
              SITENAME: "CENTENNIAL MINE",
              ALTNAME: "SQUIERS",
              BEGDATE: 1875,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "WEST MILFORD TWP",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 528783.5625,
              Y_COORD: 859566.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.36679410486074, 41.19308540585783]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 384,
              SITENAME: "HOPE MOUNTAIN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 558066.125,
              Y_COORD: 845223.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.2605330999835, 41.15354505943965]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 385,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: "NJGS FILES",
              X_COORD: 554506.0625,
              Y_COORD: 837971.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.27353003580241, 41.133666234494605]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 386,
              SITENAME: "MILLER MINE",
              ALTNAME: "MILLER FARM",
              BEGDATE: 1871,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 366791,
              Y_COORD: 674359,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Miller Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.95194767946953, 40.683898451499]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 387,
              SITENAME: "MILLER MINE",
              ALTNAME: "MILLER FARM",
              BEGDATE: 1871,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 366482,
              Y_COORD: 674158,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Miller Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.95305814139641, 40.683342346096914]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 388,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 374512,
              Y_COORD: 677963,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Added 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.92416973818106, 40.693896935596946]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 389,
              SITENAME: "BANGHART MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 376605,
              Y_COORD: 680787,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005, working of Banghart Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.9166698820117, 40.701676201095104]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 390,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "HARMONY TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 304369,
              Y_COORD: 691457,
              ELEMENT: "IRON",
              QUAD_NAME: "EASTON PA-NJ",
              GPS: "YES",
              COMMENTS: "Added 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.17750023608957, 40.729729275611355]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 391,
              SITENAME: "ENGLEMANN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 37,
              X_COORD: 442605.045571,
              Y_COORD: 700289.139078999,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.67875981787039, 40.755823527139235]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 392,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALEXANDRIA TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 330071,
              Y_COORD: 655145,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.08389173568594, 40.63056344646305]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 393,
              SITENAME: "UNNAMED MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 467375,
              Y_COORD: 802972,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58972489577792, 41.03778560740243]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 394,
              SITENAME: "DUFFEE MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 472439,
              Y_COORD: 810254,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57138857869711, 41.05778657368737]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 395,
              SITENAME: "VULCAN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 488527,
              Y_COORD: 824718,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.51305684627715, 41.09750954763406]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 396,
              SITENAME: "GULICK MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 431844.0625,
              Y_COORD: 704937.625,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.7176464157836, 40.7685168539263]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 397,
              SITENAME: "FITTZ MINE",
              ALTNAME: " ",
              BEGDATE: 1889,
              ENDDATE: 1908,
              MJRMINERAL: "LIMONITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 333803.40625,
              Y_COORD: 716306.625,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.07187901775457, 40.79851277346735]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 398,
              SITENAME: "AMOS SHARP MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 473714,
              Y_COORD: 814116.125,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56677579685798, 41.068390346059985]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 399,
              SITENAME: "NAUGHRIGHT MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 421870.6875,
              Y_COORD: 721049.875,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.75382342023711, 40.812670915530994]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 400,
              SITENAME: "EDSALL MINE",
              ALTNAME: " ",
              BEGDATE: 1840,
              ENDDATE: 1873,
              MJRMINERAL: "LIMONITE",
              MUN: "HARDYSTON TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 479062.40625,
              Y_COORD: 842381.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "HAMBURG NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.54743367320359, 41.14598375056228]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 401,
              SITENAME: "KISPAUGH MINE NORTH",
              ALTNAME: " ",
              BEGDATE: 1871,
              ENDDATE: 1900,
              MJRMINERAL: "MAGNETITE",
              MUN: "LIBERTY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 369938,
              Y_COORD: 748419,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.94194571534129, 40.88723066815436]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 402,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MICA",
              MUN: "HARMONY TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 324087,
              Y_COORD: 695916,
              ELEMENT: "MICA",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.10646497638963, 40.742364314756664]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 403,
              SITENAME: "BEACH MINE",
              ALTNAME: " ",
              BEGDATE: 1785,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 492794.75,
              Y_COORD: 767967.75,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.49757717954888, 40.941737402758875]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 404,
              SITENAME: "BUDD MINE",
              ALTNAME: " ",
              BEGDATE: 1867,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 440811.96875,
              Y_COORD: 709966.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.68530624418538, 40.78237773903635]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 405,
              SITENAME: "HENDERSON FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1872,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "HARDYSTON TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 493040.875,
              Y_COORD: 825818.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.49667826171796, 41.10053042624121]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 406,
              SITENAME: "WINTERMUTH'S MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALLAMUCHY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 404021.25,
              Y_COORD: 750228.375,
              ELEMENT: "IRON",
              QUAD_NAME: "TRANQUILITY NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.81869434684289, 40.89260371980422]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 407,
              SITENAME: "SUSSEX MILLS MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "HEMATITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 442597.5,
              Y_COORD: 807994.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWTON EAST NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.67958499582635, 41.05146621720285]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 408,
              SITENAME: "CARTER MINE",
              ALTNAME: "WILLEVER",
              BEGDATE: 1880,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "HARMONY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 320594,
              Y_COORD: 688808,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Carter Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.11888999800898, 40.72278691345366]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 409,
              SITENAME: "BIRD MINE",
              ALTNAME: "OXFORD MINE",
              BEGDATE: 1868,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "VERNON TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 483059.40625,
              Y_COORD: 876909.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "HAMBURG NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.5329675404462, 41.24076128548768]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 410,
              SITENAME: "FELTVILLE MINE",
              ALTNAME: " ",
              BEGDATE: 1733,
              ENDDATE: 1865,
              MJRMINERAL: "COPPER",
              MUN: "WATCHUNG BORO",
              COUNTY: "SOMERSET",
              REFERENCES: 51,
              X_COORD: 513221.773938,
              Y_COORD: 668032.307709999,
              ELEMENT: "COPPER",
              QUAD_NAME: "CHATHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.42394668653506, 40.66739090786642]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 411,
              SITENAME: "WRIGHT MINE",
              ALTNAME: "WRIGHT FARM",
              BEGDATE: 1880,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALEXANDRIA TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 333795,
              Y_COORD: 658663,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.07055677635451, 40.64028716846818]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 412,
              SITENAME: "SHERMAN FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1854,
              ENDDATE: 1905,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 458022,
              Y_COORD: 799037,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.62361095201688, 41.02695315345433]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 413,
              SITENAME: "HOPE MOUNTAIN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 557597.6875,
              Y_COORD: 844211.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.26224426832123, 41.15077050277286]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 414,
              SITENAME: "SCRUB OAKS MINE",
              ALTNAME: "REPLOGLE",
              BEGDATE: 1856,
              ENDDATE: 1959,
              MJRMINERAL: "MAGNETITE & HE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 464404.3125,
              Y_COORD: 749543.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.60027192882909, 40.891121015484345]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 415,
              SITENAME: "GLENDON MINE",
              ALTNAME: "CHAPIN MINE",
              BEGDATE: 1850,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "GREEN TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 419648.71875,
              Y_COORD: 775095.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "TRANQUILITY NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.76243652609122, 40.96100502950209]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 416,
              SITENAME: "BRYANT MINE",
              ALTNAME: " ",
              BEGDATE: 1866,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALLAMUCHY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 407571.03125,
              Y_COORD: 750619,
              ELEMENT: "IRON",
              QUAD_NAME: "TRANQUILITY NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.80585904295424, 40.89371070994902]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 417,
              SITENAME: "CARPENTER MINE",
              ALTNAME: " ",
              BEGDATE: 1865,
              ENDDATE: 1885,
              MJRMINERAL: "LIMONITE",
              MUN: "POHATCONG TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 302459.6875,
              Y_COORD: 651556.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.18327029979115, 40.62016815263638]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 418,
              SITENAME: "SCRANTON'S LEASE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 384877.0625,
              Y_COORD: 748353.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.88791210963878, 40.88724509728568]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 419,
              SITENAME: "ANNANDALE MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "CLINTON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 389618.28125,
              Y_COORD: 662609.5,
              ELEMENT: "IRON",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.86945778613776, 40.65193901047863]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 420,
              SITENAME: "NEIGHBOR MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1880,
              MJRMINERAL: "LIMONITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 398754.15625,
              Y_COORD: 694366.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.83696964447556, 40.73921354735859]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 421,
              SITENAME: "LONGCORE MINE",
              ALTNAME: "LONGCOVEI",
              BEGDATE: 1855,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ANDOVER TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 431525.6875,
              Y_COORD: 794817.25,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWTON EAST NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.71961016342766, 41.01522751537163]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 422,
              SITENAME: "AHLES MINE",
              ALTNAME: " ",
              BEGDATE: 1901,
              ENDDATE: 1916,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 351807.711843,
              Y_COORD: 722493.849121,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0069770321488, 40.815799934132336]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 423,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "COPPER",
              MUN: "DELAWARE TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 380516.041848999,
              Y_COORD: 590405.739163,
              ELEMENT: "COPPER",
              QUAD_NAME: "STOCKTON NJ-PA",
              GPS: " ",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.90107910279019, 40.453627216922705]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 424,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "MORRIS TWP",
              COUNTY: "MORRIS",
              REFERENCES: 37,
              X_COORD: 482841.997509,
              Y_COORD: 711164.507833,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.53352667464324, 40.78581001195442]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 425,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 378349,
              Y_COORD: 756777,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.91166654329527, 40.910284852659586]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 426,
              SITENAME: "STIFF FARM EXPLORATIONS",
              ALTNAME: " ",
              BEGDATE: 1871,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOPE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 372561,
              Y_COORD: 750835,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.93250190531444, 40.89389823195957]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 427,
              SITENAME: "HOWELL FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1943,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 383890,
              Y_COORD: 759889,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Howell Farm"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.8916689347267, 40.91889671445774]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 428,
              SITENAME: "SHAW MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1871,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 383195,
              Y_COORD: 758982,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89416906843284, 40.91639855562898]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 429,
              SITENAME: "CARTER MINE",
              ALTNAME: "WILLEVER",
              BEGDATE: 1880,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "HARMONY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 320515,
              Y_COORD: 688505,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Carter Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.11916730662637, 40.72195369432087]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 430,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 330258,
              Y_COORD: 671639,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.08361235412303, 40.675841500940706]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 431,
              SITENAME: "TURKEY HILL MINE",
              ALTNAME: "WEST END",
              BEGDATE: 1872,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 340380,
              Y_COORD: 663883,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Turkey Hill"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.04694520703536, 40.654730536279544]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 432,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOLLAND TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 326668,
              Y_COORD: 653549,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.09611335925305, 40.62611990862655]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 433,
              SITENAME: "HIGH BRIDGE MINES",
              ALTNAME: "TAYLOR MINE",
              BEGDATE: 1720,
              ENDDATE: 1889,
              MJRMINERAL: "MAGNETITE",
              MUN: "HIGH BRIDGE BORO",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 383412,
              Y_COORD: 670130,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Added 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89194689700145, 40.67250897374618]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 434,
              SITENAME: "ALVAH GRAY",
              ALTNAME: "ALVAN GRAY",
              BEGDATE: 1873,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 381712,
              Y_COORD: 685924,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Added 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89833392370218, 40.715842108922345]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 435,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "HARMONY TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 306844,
              Y_COORD: 692957,
              ELEMENT: "IRON",
              QUAD_NAME: "EASTON PA-NJ",
              GPS: "YES",
              COMMENTS: "Added 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.1686112443552, 40.73389860784148]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 436,
              SITENAME: "WHITE MEADOW MINE",
              ALTNAME: " ",
              BEGDATE: 1840,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 488978,
              Y_COORD: 762278,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: "YES",
              COMMENTS: "Added 2006, Southwest end of workings"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.51139084273312, 40.926118926022376]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 437,
              SITENAME: "HAGAR MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOLLAND TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 316884,
              Y_COORD: 643902,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.13111216449741, 40.5994524336745]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 438,
              SITENAME: "UNNAMED MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 467070,
              Y_COORD: 803782,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006, South Shaft"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59083363163775, 41.04000809621337]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 439,
              SITENAME: "UNNAMED MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 466610,
              Y_COORD: 803783,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59250126147919, 41.0400095074847]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 440,
              SITENAME: "BIG CUT",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 464689,
              Y_COORD: 799028,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Added 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59944582096375, 41.0269518345835]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 441,
              SITENAME: "OGDEN MINE",
              ALTNAME: " ",
              BEGDATE: 1772,
              ENDDATE: 1899,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 471904,
              Y_COORD: 812076,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57333419205858, 41.06278649853632]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 442,
              SITENAME: "DE BOW MINE",
              ALTNAME: "DEBOW PLACE",
              BEGDATE: 1872,
              ENDDATE: 1906,
              MJRMINERAL: "MAGNETITE",
              MUN: "RIVERDALE BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 542987.75,
              Y_COORD: 785060.125,
              ELEMENT: "IRON",
              QUAD_NAME: "POMPTON PLAINS NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.31575225446008, 40.988507230280426]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 443,
              SITENAME: "KAHART MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "KINNELON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 529425.875,
              Y_COORD: 774731.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "POMPTON PLAINS NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.3649375805099, 40.96022339942583]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 444,
              SITENAME: "CHIMNEY ROCK MINES",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "COPPER",
              MUN: "BRIDGEWATER TWP",
              COUNTY: "SOMERSET",
              REFERENCES: 51,
              X_COORD: 476033.5,
              Y_COORD: 636429.1875,
              ELEMENT: "COPPER",
              QUAD_NAME: "BOUND BROOK NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.5579372629567, 40.580648551812814]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 445,
              SITENAME: "CANFIELDS PHOSPHATE MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 462501.625,
              Y_COORD: 742195.5,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.60712172634197, 40.870944448044796]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 446,
              SITENAME: "COW-BELLY VEIN",
              ALTNAME: "DICKERSON",
              BEGDATE: 1713,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 461400.875,
              Y_COORD: 741356.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61109825907974, 40.86863681550345]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 447,
              SITENAME: "AARON HOWELL PROSPECT",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "COPPER",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 51,
              X_COORD: 385235.875,
              Y_COORD: 759094.0625,
              ELEMENT: "COPPER",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.88678604588576, 40.91673115217144]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 448,
              SITENAME: "HOPE MOUNTAIN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 556743.5,
              Y_COORD: 843161.75,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.26535641505512, 41.14789636400896]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 449,
              SITENAME: "OAK MINE",
              ALTNAME: " ",
              BEGDATE: 1762,
              ENDDATE: 1853,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 558224.5,
              Y_COORD: 842554.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.25998467074344, 41.14621834117658]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 450,
              SITENAME: "COOPER MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 555598.125,
              Y_COORD: 842005.25,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.26952662442201, 41.144730399689344]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 451,
              SITENAME: "RINGWOOD BUSH MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 554999.6875,
              Y_COORD: 838595.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.27173202801472, 41.13537545567341]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 452,
              SITENAME: "CANNON MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 554590.9375,
              Y_COORD: 837657.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.27322486888762, 41.13280410254053]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 453,
              SITENAME: "NJ ZINC COMPANY MINE",
              ALTNAME: "FRANKLIN",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "ZINC",
              MUN: "FRANKLIN BORO",
              COUNTY: "SUSSEX",
              REFERENCES: "26, 27",
              X_COORD: 468013.46875,
              Y_COORD: 831104.5,
              ELEMENT: "ZINC",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58751267864339, 41.1150069858741]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 454,
              SITENAME: "STONY BROOK MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 0,
              MJRMINERAL: "COPPER",
              MUN: "WATCHUNG BORO",
              COUNTY: "SOMERSET",
              REFERENCES: 51,
              X_COORD: 507808.9375,
              Y_COORD: 655354.875,
              ELEMENT: "COPPER",
              QUAD_NAME: "CHATHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.44348957725977, 40.63260181173119]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 455,
              SITENAME: "MENLO PARK MINE",
              ALTNAME: " ",
              BEGDATE: 1784,
              ENDDATE: 1903,
              MJRMINERAL: "COPPER",
              MUN: "EDISON TWP",
              COUNTY: "MIDDLESEX",
              REFERENCES: 51,
              X_COORD: 538462.0625,
              Y_COORD: 630601.125,
              ELEMENT: "COPPER",
              QUAD_NAME: "PERTH AMBOY NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.33321017145437, 40.56454409264009]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 456,
              SITENAME: "DOLAN MINE",
              ALTNAME: "DOLAND MINE",
              BEGDATE: 1869,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 471960.28125,
              Y_COORD: 757978.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57296620920863, 40.91429336907416]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 457,
              SITENAME: "WASHINGTON FORGE MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 470772.96875,
              Y_COORD: 754343.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57725080073328, 40.904314454443245]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 458,
              SITENAME: "MT HOPE FOWLER SHAFT MINE",
              ALTNAME: " ",
              BEGDATE: 1710,
              ENDDATE: 1969,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 481920.5625,
              Y_COORD: 766011.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.53693793146128, 40.93636261173938]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 459,
              SITENAME: "MT. HOPE ELIZABETH MINE",
              ALTNAME: " ",
              BEGDATE: 1710,
              ENDDATE: 1969,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 479073.75,
              Y_COORD: 762834.6875,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.5472361375027, 40.927637886482024]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 460,
              SITENAME: "TEABO MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1907,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 478086.78125,
              Y_COORD: 761767.25,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.55080588510668, 40.9247063286837]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 461,
              SITENAME: "SHOEMAKER MINE",
              ALTNAME: " ",
              BEGDATE: 1889,
              ENDDATE: 1911,
              MJRMINERAL: "LIMONITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 333557.75,
              Y_COORD: 716091.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.07276125118257, 40.79791908461344]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 462,
              SITENAME: "TAYLOR MINE",
              ALTNAME: " ",
              BEGDATE: 1858,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "MONTVILLE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 521308.90625,
              Y_COORD: 767482,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.39436026017076, 40.94035569025418]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 463,
              SITENAME: "CROMWELL MINE",
              ALTNAME: "CHESTER HIG",
              BEGDATE: 1872,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 437544.28125,
              Y_COORD: 710927.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.69711444994479, 40.784994745605445]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 464,
              SITENAME: "SQUIER'S MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1884,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 444985.40625,
              Y_COORD: 718404.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.67029413146214, 40.80556412782124]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 465,
              SITENAME: "SKELLENGER MINE",
              ALTNAME: " ",
              BEGDATE: 1881,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 447966.21875,
              Y_COORD: 721047.375,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.65954330898143, 40.81283294073039]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 466,
              SITENAME: "WOODHULL MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 438282.53125,
              Y_COORD: 707927.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.69442433107918, 40.776764664241576]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 467,
              SITENAME: "STERLING HILL MINE",
              ALTNAME: "FRANKLINITE",
              BEGDATE: 1877,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "OGDENSBURG BORO",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 462933.28125,
              Y_COORD: 819111.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.60589793352014, 41.08207210830701]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 468,
              SITENAME: "HILL MINE",
              ALTNAME: "FRANKLIN",
              BEGDATE: 1868,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN BORO",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 467316.375,
              Y_COORD: 829058.75,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59003505265065, 41.10938979239934]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 469,
              SITENAME: "LANNING MINE",
              ALTNAME: " ",
              BEGDATE: 1881,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 355039.6875,
              Y_COORD: 714237.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.99513165378846, 40.79318707799905]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 470,
              SITENAME: "STALEY MINE",
              ALTNAME: "STRALEY",
              BEGDATE: 1868,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 354990.3125,
              Y_COORD: 716157.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.995349155346, 40.79845752469534]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 471,
              SITENAME: "CREAGER MINE",
              ALTNAME: "CONFUCIUS",
              BEGDATE: 1871,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "MANSFIELD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 371914.6875,
              Y_COORD: 711562.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.93413583208094, 40.78608950894524]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 472,
              SITENAME: "WALLACE MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WEST MILFORD TWP",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 511070.09375,
              Y_COORD: 834322.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.43123255915327, 41.12385344650844]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 473,
              SITENAME: "SHIELDS MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1908,
              MJRMINERAL: "LIMONITE",
              MUN: "MANSFIELD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 395013.46875,
              Y_COORD: 722728.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.85087864156078, 40.81702384376416]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 474,
              SITENAME: "CREAMER MINE",
              ALTNAME: "CRAMER MINE",
              BEGDATE: 1854,
              ENDDATE: 1875,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 410761.03125,
              Y_COORD: 738313.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.79417042649287, 40.85996334403654]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 475,
              SITENAME: "SMITH MINE",
              ALTNAME: " ",
              BEGDATE: 1850,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 408814.09375,
              Y_COORD: 743172.5,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.80126986913714, 40.87328256792953]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 476,
              SITENAME: "LOWRANCE MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 426909.875,
              Y_COORD: 757492,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73597226435948, 40.91274081725489]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 477,
              SITENAME: "NOLANS MINE",
              ALTNAME: "NOLAND'S",
              BEGDATE: 1855,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 457165.90625,
              Y_COORD: 769638.25,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6265595464713, 40.946253363781096]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 478,
              SITENAME: "GOVE MINE",
              ALTNAME: " ",
              BEGDATE: 1874,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT ARLINGTON",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 450166.65625,
              Y_COORD: 752511.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.65179036709101, 40.8992113612835]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 479,
              SITENAME: "WOLF MINE",
              ALTNAME: "WOLFE MINE",
              BEGDATE: 1880,
              ENDDATE: 1901,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 435653.34375,
              Y_COORD: 745367.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.70423322241896, 40.879521222860156]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 480,
              SITENAME: "BRYAM MINE",
              ALTNAME: " ",
              BEGDATE: 1844,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 463895.59375,
              Y_COORD: 743605.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.60208699199221, 40.874820254088256]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 481,
              SITENAME: "DALRYMPLE MINE",
              ALTNAME: "CARBON MINE",
              BEGDATE: 1868,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 466325.84375,
              Y_COORD: 734329.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59326281968588, 40.84936343316456]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 482,
              SITENAME: "DAVID HORTON MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 463410.1875,
              Y_COORD: 731491.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6037904386563, 40.84156559858406]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 483,
              SITENAME: "EXCELSIOR MINE",
              ALTNAME: " ",
              BEGDATE: 1871,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALLAMUCHY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 407106.9375,
              Y_COORD: 747782.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "TRANQUILITY NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.80750173789835, 40.885919122430025]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 484,
              SITENAME: "HARTS MINE EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "POHATCONG TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 300575.3125,
              Y_COORD: 643469.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "RIEGELSVILLE PA-NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.18982996178761, 40.597928228842974]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 485,
              SITENAME: "BURRILL MINE",
              ALTNAME: " ",
              BEGDATE: 1878,
              ENDDATE: 1878,
              MJRMINERAL: "MAGNETITE",
              MUN: "TEWKSBURY TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 410534.59375,
              Y_COORD: 682398.5,
              ELEMENT: "IRON",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.79431078828893, 40.70647660708495]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 486,
              SITENAME: "BIRD MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1873,
              MJRMINERAL: "LIMONITE",
              MUN: "CLINTON TOWN",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 374284.15625,
              Y_COORD: 656345.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.92461493493109, 40.63455383421963]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 487,
              SITENAME: "DICKINSON MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "MENDHAM TWP",
              COUNTY: "MORRIS",
              REFERENCES: 37,
              X_COORD: 474151.001498,
              Y_COORD: 709725.763188999,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56490986781544, 40.78184727122859]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 488,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "BLOOMINGDALE BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 37,
              X_COORD: 540967.961148999,
              Y_COORD: 803680.491124,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "POMPTON PLAINS NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.3229320772152, 41.039629248072465]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 489,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MICA",
              MUN: "MENDHAM TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 478651.815057,
              Y_COORD: 709614.453014999,
              ELEMENT: "MICA",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.54865617387198, 40.78154972624744]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 490,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "SULFIDE",
              MUN: "FRELINGHUYSEN TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 383608,
              Y_COORD: 765355,
              ELEMENT: "SULFIDE",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89277820988084, 40.93389667279535]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 491,
              SITENAME: "HOWELL FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1943,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 383736,
              Y_COORD: 759688,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Howell Farm"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.8922229464793, 40.91834310011789]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 492,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MICA",
              MUN: "HARMONY TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 340359,
              Y_COORD: 697683,
              ELEMENT: "MICA",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.04778043304071, 40.74750815779907]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 493,
              SITENAME: "HENRY MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 341137,
              Y_COORD: 661652,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.044167077845, 40.648619483102514]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 494,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALEXANDRIA TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 332607,
              Y_COORD: 653813,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.07472346941752, 40.62695302792899]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 495,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 345529,
              Y_COORD: 661524,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02833604632052, 40.64834162991719]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 496,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 345067,
              Y_COORD: 661527,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.03000110428924, 40.648342231227275]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 497,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 346617,
              Y_COORD: 663035,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02444750916914, 40.652507117222264]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 498,
              SITENAME: "SWEDES MINE",
              ALTNAME: "SWEEDS MINE",
              BEGDATE: 1855,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 482103.8125,
              Y_COORD: 749669.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.53625011615325, 40.89150305264431]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 499,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 334823.865785999,
              Y_COORD: 713450.701745999,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.06812633404112, 40.79069188727491]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 500,
              SITENAME: "RIDDLE MINE",
              ALTNAME: "REDELL MINE",
              BEGDATE: 1872,
              ENDDATE: 1891,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 348250.368304,
              Y_COORD: 722583.211913999,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.01983135709345, 40.81598803409366]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 501,
              SITENAME: "FAIRVIEW MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 497160.65625,
              Y_COORD: 776494.625,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.4817664770433, 40.96514154488176]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 502,
              SITENAME: "HIBERNIA MINE",
              ALTNAME: " ",
              BEGDATE: 1722,
              ENDDATE: 1916,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 495281.84375,
              Y_COORD: 770866.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.48857270418061, 40.94969284188343]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 503,
              SITENAME: "DECKER MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "MONTVILLE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 519185.78125,
              Y_COORD: 771026.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "BOONTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.40203126148964, 40.95009097657792]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 504,
              SITENAME: "CLINE MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 331993.21875,
              Y_COORD: 674399.625,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.07742171479325, 40.68345061701157]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 505,
              SITENAME: "SOLOMON MINE",
              ALTNAME: "SALMON MINE",
              BEGDATE: 1886,
              ENDDATE: 1886,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 428301.28125,
              Y_COORD: 733869.125,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73071245142872, 40.84790791234296]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 506,
              SITENAME: "SKELLENGER MINE",
              ALTNAME: " ",
              BEGDATE: 1867,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 437270.3125,
              Y_COORD: 710677.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.69810181112466, 40.78430783299746]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 507,
              SITENAME: "LEAK MINE",
              ALTNAME: "LEAKE MINE",
              BEGDATE: 1866,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 446573.8125,
              Y_COORD: 719195.75,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6645613651828, 40.80774320833745]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 508,
              SITENAME: "BARNES MINE",
              ALTNAME: " ",
              BEGDATE: 1869,
              ENDDATE: 1872,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 452332.125,
              Y_COORD: 724066.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.64378763081321, 40.82114194105561]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 509,
              SITENAME: "THORP MINE",
              ALTNAME: " ",
              BEGDATE: 1910,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 455803.4375,
              Y_COORD: 725807.625,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.63125397996563, 40.82593537357844]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 510,
              SITENAME: "FORD MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1896,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 470478.96875,
              Y_COORD: 794113.25,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.57844358867375, 41.01347762418997]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 511,
              SITENAME: "LOSEY EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 1881,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN BORO",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 465852.09375,
              Y_COORD: 825833.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59533629064106, 41.100532211806225]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 512,
              SITENAME: "ANDERSON MINE",
              ALTNAME: " ",
              BEGDATE: 1856,
              ENDDATE: 1868,
              MJRMINERAL: "LIMONITE",
              MUN: "MANSFIELD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 371799.03125,
              Y_COORD: 704060.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.93441934946404, 40.76549588346578]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 513,
              SITENAME: "NEW MINE",
              ALTNAME: " ",
              BEGDATE: 1868,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "OXFORD TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 354700.28125,
              Y_COORD: 715603.25,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.9963854185141, 40.79693150157338]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 514,
              SITENAME: "MATTISON MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 380498.09375,
              Y_COORD: 702230.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.90298319332972, 40.760587277038006]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 515,
              SITENAME: "CANISTEAR MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "VERNON TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 498902.09375,
              Y_COORD: 830481.875,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.47540528450769, 41.113328594996794]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 516,
              SITENAME: "RUTHERFORD MINE",
              ALTNAME: " ",
              BEGDATE: 1888,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WEST MILFORD TWP",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 509173.40625,
              Y_COORD: 831921.25,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.4381235558684, 41.117265461297166]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 517,
              SITENAME: "STOUTENBERG MINE",
              ALTNAME: " ",
              BEGDATE: 1872,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 408561.5,
              Y_COORD: 717217.625,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.80185992370305, 40.8020357891213]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 518,
              SITENAME: "GAFFNEY MINE",
              ALTNAME: " ",
              BEGDATE: 1874,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "BYRAM TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 445173.375,
              Y_COORD: 788694.9375,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.67010872106513, 40.9985061327402]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 519,
              SITENAME: "LAWSON MINE",
              ALTNAME: "LAWLESS",
              BEGDATE: 1880,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOPATCONG BORO",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 446216.71875,
              Y_COORD: 769285.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.66619492759875, 40.94523494073999]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 520,
              SITENAME: "HIGH LEDGE MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROXBURY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 447134.03125,
              Y_COORD: 745742,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.66271563899832, 40.88061439705231]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 521,
              SITENAME: "BLACK HILLS MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1900,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 461082.03125,
              Y_COORD: 740972.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61224939344018, 40.86758335090834]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 522,
              SITENAME: "CANFIELD MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 461648.71875,
              Y_COORD: 743599.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61021227976056, 40.874795278226635]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 523,
              SITENAME: "MUNSON'S MINE",
              ALTNAME: " ",
              BEGDATE: 1859,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "DOVER  TOWN",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 476897.15625,
              Y_COORD: 743453.375,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.5550694131577, 40.87443386024387]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 524,
              SITENAME: "EUREKA MINE",
              ALTNAME: " ",
              BEGDATE: 1871,
              ENDDATE: 1871,
              MJRMINERAL: "MAGNETITE",
              MUN: "ALLAMUCHY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 413559.96875,
              Y_COORD: 754863.75,
              ELEMENT: "IRON",
              QUAD_NAME: "TRANQUILITY NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.78424537407673, 40.90541757493486]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 525,
              SITENAME: "GREEN FARM MINE",
              ALTNAME: "CARROLL",
              BEGDATE: 1873,
              ENDDATE: 1884,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 382205.1875,
              Y_COORD: 747158.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89755629188802, 40.883931713731705]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 526,
              SITENAME: "DAFFORD MINE",
              ALTNAME: " ",
              BEGDATE: 1879,
              ENDDATE: 1880,
              MJRMINERAL: "LIMONITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 399005.0625,
              Y_COORD: 694199.25,
              ELEMENT: "IRON",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.83606183273305, 40.73875589141771]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 527,
              SITENAME: "SHARPS MINE",
              ALTNAME: "CREGAR MINE",
              BEGDATE: 1871,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "CLINTON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 389362.3125,
              Y_COORD: 665935.875,
              ELEMENT: "IRON",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.87043084318758, 40.66106695357014]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 528,
              SITENAME: "OLD FURNANCE MINE",
              ALTNAME: " ",
              BEGDATE: 1778,
              ENDDATE: 1884,
              MJRMINERAL: "MAGNETITE",
              MUN: "CLINTON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 393216.375,
              Y_COORD: 670328.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.85660255313145, 40.67316791461536]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 529,
              SITENAME: "COKESBURY MINE",
              ALTNAME: "COKESBURG",
              BEGDATE: 1776,
              ENDDATE: 1873,
              MJRMINERAL: "MAGNETITE",
              MUN: "TEWKSBURY TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 399612.03125,
              Y_COORD: 674333.875,
              ELEMENT: "IRON",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.83359911843098, 40.684232102749014]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 530,
              SITENAME: "FOX HILL MINE",
              ALTNAME: "FISHER MINE",
              BEGDATE: 1873,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "TEWKSBURY TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 414674.65625,
              Y_COORD: 686414.75,
              ELEMENT: "IRON",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.77942320173291, 40.71753831299218]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 531,
              SITENAME: "SULPHUR HILL MINE",
              ALTNAME: " ",
              BEGDATE: 1857,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "ANDOVER TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 428155.5625,
              Y_COORD: 792150.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWTON EAST NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73179755886017, 41.00788389491327]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 532,
              SITENAME: "ANNANDALE GRAPHITE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "CLINTON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 37,
              X_COORD: 388634.952643,
              Y_COORD: 661574.278661999,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "CALIFON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.8729860242511, 40.649085927364716]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 533,
              SITENAME: "BLOOMINGDALE MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "GRAPHITE",
              MUN: "RIVERDALE BORO",
              COUNTY: "MORRIS",
              REFERENCES: 37,
              X_COORD: 540518.270190999,
              Y_COORD: 788066.048003999,
              ELEMENT: "GRAPHITE",
              QUAD_NAME: "POMPTON PLAINS NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.32467600854382, 40.99677208773738]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 534,
              SITENAME: "KISPAUGH MINE SOUTH",
              ALTNAME: " ",
              BEGDATE: 1871,
              ENDDATE: 1900,
              MJRMINERAL: "MAGNETITE",
              MUN: "LIBERTY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 369396,
              Y_COORD: 747511,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.94388939598994, 40.88473080562727]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 535,
              SITENAME: "GARRISON FARM EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 1858,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 375495,
              Y_COORD: 754059,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.92194521061367, 40.90278699378562]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 536,
              SITENAME: "STINSON MINE",
              ALTNAME: " ",
              BEGDATE: 1881,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 376961,
              Y_COORD: 755671,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.9166694361458, 40.90723100370912]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 537,
              SITENAME: "HOWELL FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1943,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 384583,
              Y_COORD: 760291,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Howell Farm"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.88916772475001, 40.92000864510317]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 538,
              SITENAME: "HOWELL FARM MINE",
              ALTNAME: " ",
              BEGDATE: 1800,
              ENDDATE: 1943,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 383813,
              Y_COORD: 759687,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Howell Farm"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89194429610998, 40.91834130981413]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 539,
              SITENAME: "CARTER MINE",
              ALTNAME: "WILLEVER",
              BEGDATE: 1880,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "HARMONY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 319202,
              Y_COORD: 688008,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Carter Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.12389158905492, 40.72056398681312]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 540,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 345071,
              Y_COORD: 662134,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.029999873472, 40.65000848155669]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 541,
              SITENAME: "SWAYZE MINE",
              ALTNAME: "BETHLEHEM",
              BEGDATE: 1868,
              ENDDATE: 1889,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 348030,
              Y_COORD: 667378,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Swayze Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.01944738400401, 40.66445142029307]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 542,
              SITENAME: "SWAYZE MINE",
              ALTNAME: "BETHLEHEM",
              BEGDATE: 1868,
              ENDDATE: 1889,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 347645,
              Y_COORD: 667381,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Swayze Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02083527400971, 40.66445340870379]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 543,
              SITENAME: "SWAYZE MINE",
              ALTNAME: "BETHLEHEM",
              BEGDATE: 1868,
              ENDDATE: 1889,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 347412,
              Y_COORD: 666977,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Swayze Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.0216665337255, 40.66334065411959]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 544,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "MOUNT OLIVE TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 428318.46875,
              Y_COORD: 731594.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73062866926968, 40.841663114780395]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 545,
              SITENAME: "WILLIAMS MINE",
              ALTNAME: " ",
              BEGDATE: 1815,
              ENDDATE: 1833,
              MJRMINERAL: "MAGNETITE",
              MUN: "VERNON TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 496107.1875,
              Y_COORD: 844882.875,
              ELEMENT: "IRON",
              QUAD_NAME: "WAWAYANDA NJ-NY",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.48554026681026, 41.1528586097227]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 546,
              SITENAME: "HICKORY MT. & VALLEY MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: "NJGS FILES",
              X_COORD: 551719.75,
              Y_COORD: 837435.75,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.28365037562783, 41.132215311065885]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 547,
              SITENAME: "MILLEN MINE",
              ALTNAME: "MELLEN",
              BEGDATE: 1855,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 465034.25,
              Y_COORD: 744255.5,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59797193447315, 40.87660718627414]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 548,
              SITENAME: "MT HOPE MINE SPANCER SHFT",
              ALTNAME: " ",
              BEGDATE: 1710,
              ENDDATE: 1969,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 483954.71875,
              Y_COORD: 767613.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.52957699380624, 40.94076073601265]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 549,
              SITENAME: "WELDON MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 1902,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 469484.21875,
              Y_COORD: 785388.5,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58201871700754, 40.989526642845576]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 550,
              SITENAME: "HAZARD MINE",
              ALTNAME: " ",
              BEGDATE: 1877,
              ENDDATE: 1877,
              MJRMINERAL: "LIMONITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 341843.5625,
              Y_COORD: 676636.375,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.04195360893053, 40.68976248725307]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 551,
              SITENAME: "HILT MINE",
              ALTNAME: " ",
              BEGDATE: 1855,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROXBURY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 439816.34375,
              Y_COORD: 743402.5,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.68916232457755, 40.87415224155673]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 552,
              SITENAME: "KEAN MINE",
              ALTNAME: " ",
              BEGDATE: 1883,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 443019.40625,
              Y_COORD: 716487.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.67738228283034, 40.80029028087967]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 553,
              SITENAME: "SMITH'S MINE",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1882,
              MJRMINERAL: "MAGNETITE",
              MUN: "LIBERTY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 362845.8125,
              Y_COORD: 740172.125,
              ELEMENT: "IRON",
              QUAD_NAME: "WASHINGTON NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.967437750441, 40.864493001086245]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 554,
              SITENAME: "DAY MINE",
              ALTNAME: " ",
              BEGDATE: 1910,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "WEST MILFORD TWP",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 498677.4375,
              Y_COORD: 828814.1875,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.47622228595334, 41.10875123177502]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 555,
              SITENAME: "FISHER EXPLORATION",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 397802.3125,
              Y_COORD: 715724.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "HACKETTSTOWN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.84070400983994, 40.79782851168198]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 556,
              SITENAME: "LEWIS MINE",
              ALTNAME: "HERRICK",
              BEGDATE: 0,
              ENDDATE: 1870,
              MJRMINERAL: "MAGNETITE",
              MUN: "MENDHAM TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 461545.5,
              Y_COORD: 718918.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.6104730042459, 40.807047489048955]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 557,
              SITENAME: "SWAYZE HEMATITE MINE",
              ALTNAME: "OSMAN MINE",
              BEGDATE: 1877,
              ENDDATE: 1882,
              MJRMINERAL: "HEMATITE",
              MUN: "HOPE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 370638.40625,
              Y_COORD: 767779.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.93976444539744, 40.940380886593054]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 558,
              SITENAME: "HIGH BRIDGE MINES",
              ALTNAME: "TAYLOR MINE",
              BEGDATE: 1720,
              ENDDATE: 1889,
              MJRMINERAL: "MAGNETITE",
              MUN: "HIGH BRIDGE BORO",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 383596.875,
              Y_COORD: 670165.625,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.89128094847875, 40.672609020013965]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 559,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "INDEPENDENCE TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 385291,
              Y_COORD: 746727,
              ELEMENT: "IRON",
              QUAD_NAME: "BLAIRSTOWN NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.88638898557278, 40.88278573901365]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 560,
              SITENAME: "CARTER MINE",
              ALTNAME: "WILLEVER",
              BEGDATE: 1880,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "HARMONY TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 320048,
              Y_COORD: 687800,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Carter Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.12083416431334, 40.72000951450918]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 561,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 345761,
              Y_COORD: 661624,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02750211668915, 40.6486199467665]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 562,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 345023,
              Y_COORD: 666992,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.03027843453877, 40.6633426004696]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 563,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "HOLLAND TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 326204,
              Y_COORD: 653350,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.09778010847222, 40.625565030333625]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 564,
              SITENAME: "WAWAYANDA MINE",
              ALTNAME: " ",
              BEGDATE: 1854,
              ENDDATE: 1891,
              MJRMINERAL: "MAGNETITE",
              MUN: "VERNON TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 521355.25,
              Y_COORD: 866801.25,
              ELEMENT: "IRON",
              QUAD_NAME: "WAWAYANDA NJ-NY",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.39375446029258, 41.21297220074038]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 565,
              SITENAME: "NJ ZINC COMPANY MINE",
              ALTNAME: "STERLING",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "ZINC",
              MUN: "OGDENSBURG BORO",
              COUNTY: "SUSSEX",
              REFERENCES: "26, 28, 29",
              X_COORD: 463238,
              Y_COORD: 819638.6875,
              ELEMENT: "ZINC",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.60479483584805, 41.08352068473073]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 566,
              SITENAME: "ROSEBERRY MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "LIMONITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: "NJGS FILES",
              X_COORD: 335086.46875,
              Y_COORD: 718365.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.06729277425265, 40.80418713005076]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 567,
              SITENAME: "HOPLER MINE",
              ALTNAME: "BARTLEYVILL",
              BEGDATE: 1868,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "WASHINGTON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 425489.03125,
              Y_COORD: 721483.5,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.74075512375043, 40.81388921690667]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 568,
              SITENAME: "CHARLOTTESBURG MINE",
              ALTNAME: " ",
              BEGDATE: 1765,
              ENDDATE: 1888,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 511102.4375,
              Y_COORD: 796225.125,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.4312242048297, 41.01928066064476]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 569,
              SITENAME: "COMBS MINE",
              ALTNAME: " ",
              BEGDATE: 1828,
              ENDDATE: 1881,
              MJRMINERAL: "MAGNETITE",
              MUN: "RANDOLPH TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 460899.8125,
              Y_COORD: 721830.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61281914983351, 40.81503723498667]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 570,
              SITENAME: "ANDOVER MINE",
              ALTNAME: " ",
              BEGDATE: 1776,
              ENDDATE: 1863,
              MJRMINERAL: "HEMATITE",
              MUN: "ANDOVER TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 427285.1875,
              Y_COORD: 790597.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWTON EAST NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.73493623272472, 41.00361541824323]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 571,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "FRANKLIN TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 330334,
              Y_COORD: 671537,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.08333590720791, 40.675562901670965]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 572,
              SITENAME: "ASBURY",
              ALTNAME: "LAKE MINE",
              BEGDATE: 1854,
              ENDDATE: 1879,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 354381,
              Y_COORD: 673009,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Updated 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.9966682794419, 40.68000894009735]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 573,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "LEBANON TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 374358,
              Y_COORD: 677863,
              ELEMENT: "IRON",
              QUAD_NAME: "HIGH BRIDGE NJ",
              GPS: "YES",
              COMMENTS: "Added 2005"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.92472337506995, 40.693620397320274]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 574,
              SITENAME: "ROBERTS",
              ALTNAME: " ",
              BEGDATE: 1873,
              ENDDATE: 1889,
              MJRMINERAL: "MAGNETITE",
              MUN: "SPARTA TWP",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 472900,
              Y_COORD: 812986,
              ELEMENT: "IRON",
              QUAD_NAME: "FRANKLIN NJ",
              GPS: "YES",
              COMMENTS: "Updated 2006"
            },
            geometry: {
              type: "Point",
              coordinates: [-74.56972478186623, 41.065286563963035]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 575,
              SITENAME: "CHARLOTTE MINE",
              ALTNAME: "BEMCO MINE",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BYRAM TWP",
              COUNTY: "SUSSEX",
              REFERENCES: "NJGS FILES",
              X_COORD: 424905.4375,
              Y_COORD: 768395.5625,
              ELEMENT: "URANIUM",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.74333470486552, 40.9426549744144]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 576,
              SITENAME: "SAMUEL WILDS MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RIVERDALE BORO",
              COUNTY: "MORRIS",
              REFERENCES: "NJGS FILES",
              X_COORD: 540689.8125,
              Y_COORD: 788159,
              ELEMENT: "IRON",
              QUAD_NAME: "POMPTON PLAINS NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.32405384762457, 40.9970262852142]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 577,
              SITENAME: "HARVEY MINE",
              ALTNAME: "HURD MINE",
              BEGDATE: 1855,
              ENDDATE: 1920,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHARTON BORO",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 468493.4375,
              Y_COORD: 752395.625,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.58549098534019, 40.898961320588754]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 578,
              SITENAME: "TIGER MINE",
              ALTNAME: " ",
              BEGDATE: 1880,
              ENDDATE: 1883,
              MJRMINERAL: "MAGNETITE",
              MUN: "CHESTER TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 440093.1875,
              Y_COORD: 706485.375,
              ELEMENT: "IRON",
              QUAD_NAME: "CHESTER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.68787501813247, 40.772817733951676]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 579,
              SITENAME: "WANAQUE- LONDON MINE",
              ALTNAME: "IRON HILL",
              BEGDATE: 1799,
              ENDDATE: 1905,
              MJRMINERAL: "MAGNETITE",
              MUN: "BLOOMINGDALE BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 542945.125,
              Y_COORD: 811043.0625,
              ELEMENT: "IRON",
              QUAD_NAME: "WANAQUE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.31570794829584, 41.05982720125706]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 580,
              SITENAME: "WRIGHTENOUR MINE",
              ALTNAME: "HENDERSON",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 546111.3125,
              Y_COORD: 833718.4375,
              ELEMENT: "IRON",
              QUAD_NAME: "WANAQUE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.3040413327842, 41.1220484146638]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 581,
              SITENAME: "HOPE MOUNTAIN MINE",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 1868,
              MJRMINERAL: "MAGNETITE",
              MUN: "RINGWOOD BORO",
              COUNTY: "PASSAIC",
              REFERENCES: 2,
              X_COORD: 556930.5,
              Y_COORD: 843438.5625,
              ELEMENT: "IRON",
              QUAD_NAME: "GREENWOOD LAKE NYNJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.26467465751325, 41.14865477861307]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 582,
              SITENAME: "HURD MINE",
              ALTNAME: "HURDTOWN",
              BEGDATE: 1855,
              ENDDATE: 1903,
              MJRMINERAL: "MAGNETITE",
              MUN: "JEFFERSON TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 465233.34375,
              Y_COORD: 779648.75,
              ELEMENT: "IRON",
              QUAD_NAME: "DOVER NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.59739446505384, 40.97375962625665]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 583,
              SITENAME: "KAISER MINE",
              ALTNAME: " ",
              BEGDATE: 1882,
              ENDDATE: 1891,
              MJRMINERAL: "MAGNETITE",
              MUN: "WHITE TWP",
              COUNTY: "WARREN",
              REFERENCES: 2,
              X_COORD: 342432.6875,
              Y_COORD: 721359.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "BELVIDERE NJ-PA",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-75.04082291264405, 40.81253198155175]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 584,
              SITENAME: "PARDEE MINE",
              ALTNAME: " ",
              BEGDATE: 1870,
              ENDDATE: 1884,
              MJRMINERAL: "MAGNETITE",
              MUN: "ROCKAWAY TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 496316.09375,
              Y_COORD: 789851.125,
              ELEMENT: "IRON",
              QUAD_NAME: "NEWFOUNDLAND NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.48481640970739, 41.00180426061511]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 585,
              SITENAME: "KING MINE",
              ALTNAME: " ",
              BEGDATE: 1853,
              ENDDATE: 1880,
              MJRMINERAL: "MAGNETITE",
              MUN: "MINE HILL TWP",
              COUNTY: "MORRIS",
              REFERENCES: 2,
              X_COORD: 461406.75,
              Y_COORD: 739767.8125,
              ELEMENT: "IRON",
              QUAD_NAME: "MENDHAM NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.61106972684401, 40.864276819917016]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 586,
              SITENAME: "HAGGERTY MINE",
              ALTNAME: " ",
              BEGDATE: 1885,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "STANHOPE BORO",
              COUNTY: "SUSSEX",
              REFERENCES: 2,
              X_COORD: 438465.28125,
              Y_COORD: 759163.3125,
              ELEMENT: "IRON",
              QUAD_NAME: "STANHOPE NJ",
              GPS: " ",
              COMMENTS: " "
            },
            geometry: {
              type: "Point",
              coordinates: [-74.69417452453908, 40.917406416610014]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 587,
              SITENAME: "SWAYZE MINE",
              ALTNAME: "BETHLEHEM",
              BEGDATE: 1868,
              ENDDATE: 1889,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: 2,
              X_COORD: 346798,
              Y_COORD: 667487,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Updated 2004, working of Swayze Mine"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02389075942196, 40.66473055232234]
            }
          },
          {
            type: "Feature",
            properties: {
              OBJECTID: 588,
              SITENAME: "UNNAMED",
              ALTNAME: " ",
              BEGDATE: 0,
              ENDDATE: 0,
              MJRMINERAL: "MAGNETITE",
              MUN: "BETHLEHEM TWP",
              COUNTY: "HUNTERDON",
              REFERENCES: "NJGS FILES",
              X_COORD: 346413,
              Y_COORD: 667489,
              ELEMENT: "IRON",
              QUAD_NAME: "BLOOMSBURY NJ",
              GPS: "YES",
              COMMENTS: "Added 2004"
            },
            geometry: {
              type: "Point",
              coordinates: [-75.02527863322713, 40.66472974054703]
            }
          }
        ]
      }
    ];
    var random =
      points[0].features[Math.floor(Math.random() * points[0].features.length)];
    //alert(random);

    return random;
  }

  let points = getGpsPoints();





});
