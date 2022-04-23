/* jshint esversion: 8 */
import "./firebase";
import "utils/commentscript.js";
import {
  getLatLon,
  getAddress,
  getGeojson,
  getMatrix,
  clearForm,
  popupContent,
  toggleAltitude,
  toggleBookmark,
  addBookmark,
  altitudeLoading,
} from "utils/geocoder";
let geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [0, 0],
      },
      properties: {
        title: "Mapbox DC",
        description: "1714 14th St NW, Washington DC",
        "marker-color": "#35A2D1",
        "marker-size": "large",
        "marker-symbol": "1",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [0, 0],
      },
      properties: {
        title: "Mapbox SF",
        description: "155 9th St, San Francisco",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "2",
      },
    },
  ],
};
function inputFocus(x) {
  if ($("#secondOutput").hasClass("second")) {
    $("#secondOutput").removeClass("second").addClass("fadeOut");
    $("#firstOutput").removeClass("first").addClass("fadeOut");
    setTimeout(() => {
      $("#secondOutput").addClass("d-none");
      $("#firstOutput").addClass("d-none");
    }, 2000);
  }

  //
}
/***
 *
 *  TODO: FIX POPUP
 */

const App = function _App() {
  return App.state.count;
};

const handler = {
  set: function (obj, prop, value) {
    obj[prop] = value;
  },
};

App.state = new Proxy({ count: 0 }, handler);
window.addEventListener("DOMContentLoaded", () => {
  async function convertLatLon(lat, lon) {
    const d = await getAddress(lat, lon);
    const data = d.data;

    if (data.features.length == 0) {
      $(".alert-warning").removeClass("invisible").addClass("visible");
    } else if (
      data.features.length > 0 &&
      $(".alert-warning").hasClass("visible")
    ) {
      $(".alert-warning").removeClass("visible").addClass("invisible");
    }
    return data;
  }

  async function convertAddress(city) {
    const data = await getLatLon(city);
    return data.data;
  }

  let scrollPos = 0;
  const mainNav = document.getElementById("mainNav");
  const headerHeight = mainNav.clientHeight;

  function DDtoDMS(lat, lon) {
    //

    let latitude = Math.abs(lat);
    let longitude = Math.abs(lon);
    let dLat = Math.floor(latitude);
    let mLat = Math.floor((latitude - dLat) * 60);

    let sLat = Math.round((latitude - dLat - mLat / 60) * 1e3 * 3600) / 1e3;
    let dLon = Math.floor(longitude);
    let mLon = Math.floor((longitude - dLon) * 60);
    let sLon = Math.floor((longitude - dLon - mLon / 60) * 1e3 * 3600) / 1e3;
    let degreesLatitude = dLat;
    let minutesLatitude = mLat;
    let secondsLatitude = sLat;
    let degreesLongitude = dLon;
    let minutesLongitude = mLon;
    let secondsLongitude = sLon;

    let latResult = `${degreesLatitude}° ${minutesLatitude}' ${secondsLatitude}''`;

    let lonResult = `${degreesLongitude}° ${minutesLongitude}' ${secondsLongitude}''`;
    let result = { lat: latResult, lon: lonResult };
    return result;
  }

  const CoordsApp = function _CoordsApp() {
    return `
 <h1>Origin State = [${CoordsApp.state.origin}] </h1> </br>
 <h1>Destination State = [${CoordsApp.state.destination}] </h1>
 <h1>User Location = [${CoordsApp.state.userLocation}] </h1>
 <h1>trackingUser =  ${CoordsApp.state.trackingUser}</h1>
`;
  };

  const myhandler = {
    set: function (obj, prop, value) {
      obj[prop] = value;
    },
  };

  CoordsApp.state = new Proxy(
    { origin: [], destination: [], userLocation: [] },
    myhandler
  );
  L.mapbox.accessToken =
    "pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA";

  const map = L.mapbox
    .map("map", null, { zoomControl: false })
    .setView([38.25004425273146, -85.75576792471112], 11);

  L.mapbox
    .styleLayer("mapbox://styles/mapbox/streets-v11")
    .addTo(map) // add your tiles to the map
    .once("load", finishedLoading);

  const marker1 = L.marker([0, 0], {
    icon: L.mapbox.marker.icon({
      "marker-size": "large",

      "marker-color": "blue",
    }),
  }).addTo(map);

  const marker2 = L.marker([0, 0], {
    icon: L.mapbox.marker.icon({
      "marker-size": "large",

      "marker-color": "red",
    }),
  }).addTo(map);
  function finishedLoading() {
    // first, toggle the class 'done', which makes the loading screen
    // fade out
    setTimeout(() => {
      $("#map").removeClass("invisible");
    }, 1000);
  }
  // L.marker is a low-level marker constructor in Leaflet.

  var featureLayer = L.mapbox.featureLayer().addTo(map);

  const coordinatesGeocoder = function (query) {
    // Match anything which looks like
    // decimal degrees coordinate pair.
    const matches = query.match(
      /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
    );
    if (!matches) {
      return null;
    }

    function coordinateFeature(lng, lat) {
      return {
        center: [lng, lat],
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        place_name: "Lat: " + lat + " Lng: " + lng,
        place_type: ["coordinate"],
        properties: {},
        type: "Feature",
      };
    }

    const coord1 = Number(matches[1]);
    const coord2 = Number(matches[2]);
    const geocodes = [];

    if (coord1 < -90 || coord1 > 90) {
      // must be lng, lat
      geocodes.push(coordinateFeature(coord1, coord2));
    }

    if (coord2 < -90 || coord2 > 90) {
      // must be lat, lng
      geocodes.push(coordinateFeature(coord2, coord1));
    }

    if (geocodes.length === 0) {
      // else could be either lng, lat or lat, lng
      geocodes.push(coordinateFeature(coord1, coord2));
      geocodes.push(coordinateFeature(coord2, coord1));
    }

    return geocodes;
  };

  $("#originTest").click(function (e) {
    e.preventDefault();
    $("#getTravelForm").find("input:eq(0)").val("Atlanta, GA");
    $("#getTravelForm").find("input:eq(1)").val("Lagrange, GA");
  });

  $("#switchTest").click(function (e) {
    e.preventDefault();

    $("#getTravelForm").find("input:eq(0)").val("Birmingham, AL");
    $("#getTravelForm").find("input:eq(1)").val("Mobile, AL");
  });

  function format(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);

    let result = {
      hours: hrs,
      minutes: mins,
    };
    // Output like "1:01" or "4:03:59" or "123:03:59"
    return result;
  }

  async function callMatrix(first, second) {
    const data = await getMatrix(first, second);

    const json = data.data;
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

      alertPlaceholder.appendChild(wrapper);
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

    /*
   if(localStorage.getItem('travel-time-two')){
    $(".first").addClass("fadeOut").removeClass("first")
    $(".second").addClass("fadeOut").removeClass("second")
    localStorage.removeItem('travel-time-two');
    localStorage.removeItem('travel-time-one');

    setTimeout(() => {
      $("button.first").remove();
      $("button.second").remove();
      $('#addressHistory').append(` <button type="button" class="list-group-item list-group-item-action first">${result.hours} hour(s) and ${result.minutes} minutes </button>`);
      localStorage.setItem('travel-time-one', `${result.hours}hour(s)${result.minutes}`);
    }, 600);

   } else if (localStorage.getItem('travel-time-one') && !localStorage.getItem('travel-time-two')){
    $('#addressHistory').append(` <button type="button" class="list-group-item list-group-item-action second">${result.hours} hour(s) and ${result.minutes} minutes</button>`);
    localStorage.setItem('travel-time-two', `${result.hours}hour(s)${result.minutes}`);

   } else {
    $('#addressHistory').append(` <button type='button' class='list-group-item list-group-item-action first'>${result.hours} hour(s) and ${result.minutes} minutes </button>`);
    localStorage.setItem('travel-time-one', `${result.hours}hour(s)${result.minutes}`);
   }
               */
  }

  var locationControl = L.control
    .locate({
      circleStyle: { opacity: 0 },
      followCircleStyle: { opacity: 0 },
      drawCircle: false,
      follow: false,
      setView: false,
      iconLoading: "spinner-border spinner-border-sm map-spinner",
      remainActive: false,
      icon: "my-geo-icon",
      locateOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
      },
    })
    .addTo(map);

  map.on("locationfound", async function (e) {
    let lat = e.latitude;
    let lon = e.longitude;
    let icon = locationControl._icon;
    let x = document.querySelectorAll("form");
    let form = x[0];
    clearForm(form);
    map.fitBounds(e.bounds, { padding: [50, 50], maxZoom: 13 });
    let obj = { lat: lat, lon: lon };
    localStorage.setItem("userlocation", `${JSON.stringify(obj)}`);

    geojson.features[0].geometry.coordinates = [lon, lat];

    const result = await convertLatLon(lat, lon);
    const dmsCalculated = DDtoDMS(lat, lon);

    const origin = result.features[0];
    let originLatLon = result.features[0].geometry.coordinates;
    let originLat = originLatLon[1];
    let originLon = originLatLon[0];
    let originResults = {
      address: origin.place_name,
      lat: originLat,
      lon: originLon,
      dms: { lat: dmsCalculated.lat, lon: dmsCalculated.lon },
      origin: true,
    };
    if (result.features.length > 0) {
      $("form").first().find("input:eq(0)").val(result.features[0].place_name);
    }

    const p = popupContent(originResults);
    var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);

    marker1.setLatLng([lat, lon]).bindPopup(popup).openPopup();

    locationControl.stop();

    // And hide the geolocation button
  });

  // If the user chooses not to allow their location
  // to be shared, display an error message.
  map.on("locationerror", function () {
    console.log("Position could not be found");
  });

  // !! Travel FORM   ---------------------------------------------->

  /**
 *
 *
   //✅
 *  */
  function consoleRed(message) {
    let msg = `%c ${message}`;
  }
  function consoleBlue(message) {
    let msg = `%c ${message}`;
  }

  async function addRouteTest(locationData) {
    let latOrigin = locationData.origin.lat;
    let lonOrigin = locationData.origin.lon;
    let latDestination = locationData.destination.lat;
    let lonDestination = locationData.destination.lon;

    const query1 = `${lonOrigin},${latOrigin}`;
    const query2 = `${lonDestination},${latDestination}`;
    //  destinationMarker.setLatLng(origin[1], origin[0])
    await callMatrix(query1, query2);

    let origin = locationData.origin;
    let destination = locationData.destination;

    const originPopup = popupContent(locationData.origin);
    const destinationPopup = popupContent(locationData.destination);

    const popup1 = L.popup().setContent(originPopup);
    const popup2 = L.popup().setContent(destinationPopup);

    marker1.setLatLng([latOrigin, lonOrigin]).bindPopup(popup1);

    marker2.setLatLng([latDestination, lonDestination]).bindPopup(popup2);
    map.fitBounds(
      [
        [latOrigin, lonOrigin],
        [latDestination, lonDestination],
      ],
      { padding: [50, 50], maxZoom: 13 }
    );
    const submitText = $("form :submit").first().text();
    $("form :submit").first().html(submitText);
  }
  // ** NEW FORM   ------------------------------------------------->

  $("#getTravelForm").on("submit", async function (e) {
    e.preventDefault();
    const submitText = $("form :submit").first().text();
    console.log($("form :submit").first().parent());
    $(
      "form :submit"
    ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  ${submitText}`);
    const popupCheck = marker1.isPopupOpen();
    if (popupCheck) {
      marker1.closePopup();
    }
    const originInput = $(this).find("input:eq(0)").val();
    const destinationInput = $(this).find("input:eq(1)").val();

    const originFetch = await convertAddress(originInput);
    const destinationFetch = await convertAddress(destinationInput);

    const result = await Promise.all([originFetch, destinationFetch]);

    const origin = result[0].features[0];
    let originLatLon = result[0].features[0].geometry.coordinates;
    let originLat = originLatLon[1];
    let originLon = originLatLon[0];
    const destination = result[1].features[0];
    let destinationLatLon = result[1].features[0].geometry.coordinates;
    let destinationLat = destinationLatLon[1];
    let destinationLon = destinationLatLon[0];

    const originDMS = DDtoDMS(originLat, originLon);
    const destinationDMS = DDtoDMS(destinationLat, destinationLon);

    let originResults = {
      address: origin.place_name,
      lat: originLat,
      lon: originLon,
      dms: { lat: originDMS.lat, lon: originDMS.lon },
      origin: true,
    };

    let destinationResults = {
      address: destination.place_name,
      lat: destinationLat,
      lon: destinationLon,
      dms: { lat: destinationDMS.lat, lon: destinationDMS.lon },
      destination: true,
    };

    const locationData = {
      origin: originResults,
      destination: destinationResults,
    };

    addRouteTest(locationData);
  });

  $("#map").on("click", "#getAltitude", function (e) {
    e.preventDefault();

    if ($(this).hasClass("origin")) {
      toggleAltitude(this, marker1);
    } else {
      toggleAltitude(this, marker2);
    }
  });
  $("#map").on("click", ".origin.bookmark-btn", function (e) {
    e.preventDefault();

    toggleBookmark(this, marker1);
  });
  $("#map").on("click", ".destination.bookmark-btn", function (e) {
    e.preventDefault();
    toggleBookmark(this, marker2);
  });
  map.on("popupopen", function (e) {
    var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
    px.y -= e.target._popup._container.clientHeight / 2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    map.panTo(map.unproject(px), { animate: true });
    $(".leaflet-top.leaflet-left").css("opacity", "0");
    // TODO update
  });
  map.on("popupclose", function (e) {
    // TODO update
    $(".leaflet-top.leaflet-left").css("opacity", "1");
  });

  $("#map").on("click", "#add-bookmark-btn", function (e) {
    let input = $(this).parent().children().first();

    if (input[0].value.length < 1) {
      $(input).addClass("is-invalid");
      $(this).parent()
        .append(`   <div id="validationServer03Feedback" class="invalid-feedback">
      Please provide a name.
  </div>`);
    } else {
      const markerCheck = marker1.isPopupOpen();
      const localData = markerCheck ? "origin-data" : "destination-data";
      const marker = markerCheck ? marker1 : marker2;
      let locationData = JSON.parse(localStorage.getItem(localData));
      let ldata = JSON.parse(localStorage.getItem("location-data"));
      let altitude = ldata.altitude ? ldata.altitude : null;
      ldata.altitude = altitude;
      locationData.name = input[0].value;
      ldata.bookmarked = true;
      ldata.name = input[0].value;
      localStorage.setItem("location-data", JSON.stringify(ldata));
      addBookmark("location-data");

      let p = popupContent(locationData);
      marker.setPopupContent(p);
    }
  });
});
