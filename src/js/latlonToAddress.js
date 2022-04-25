/* jshint esversion: 8 */
import "./firebase";
import {
  getLatLon,
  getAddress,
  getAltitude,
  getMatrix,
  getGeojson,
  generateUID,
  addBookmark,
  altitudeLoading,
  toggleBookmark,
  toggleAltitude,
  closePopup,
   popupContent,
} from "utils/geocoder";
import { Dropdown, Modal } from "bootstrap/dist/js/bootstrap.esm.min.js";
import "utils/commentscript.js";
const uid = generateUID();
var dropdownElementList = [].slice.call(
  document.querySelectorAll(".dropdown-toggle")
);
const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new Dropdown(dropdownToggleEl);
});
const path = window.location.pathname;

  // relatedTarget
window.addEventListener("DOMContentLoaded", () => {
  let scrollPos = 0;
  const mainNav = document.getElementById("mainNav");
  const headerHeight = mainNav.clientHeight;
});

$(document).ready(function () {
  function DDtoDMS(lat, lon) {
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
  function check(elm) {
    document.getElementById(elm).checked = true;
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
    { origin: [], destination: [], userLocation: [], trackingUser: false },
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
    .once("load", finishedLoading); // add your tiles to the map

  // L.marker is a low-level marker constructor in Leaflet.
  const marker = L.marker([0, 0], {
    icon: L.mapbox.marker.icon({
      "marker-size": "large",

      "marker-color": "blue",
    }),
  }).addTo(map);

  function finishedLoading() {
    // first, toggle the class 'done', which makes the loading screen
    // fade out
    setTimeout(() => {
      $("#map").removeClass("invisible");
    }, 1000);
  }
  var locationControl = L.control
    .locate({
      circleStyle: { opacity: 0 },
      followCircleStyle: { opacity: 0 },
      drawCircle: false,
      follow: false,
      setView: false,
      remainActive: false,
      showPopup: false,
      locateOptions: {
        enableHighAccuracy: true,
      },
    })
    .addTo(map);

  async function findAddress(lat, lon) {
    const d = await getAddress(lat, lon);
    const data = d.data;
    return data;
  }
  map.on("locationfound", async function (e) {
    $(".alerts").html("");
    let icon = locationControl._icon;
    $(icon).css("background-color", "hsl(217deg 93% 60%)");
    let lat = e.latitude;
    let lon = e.longitude;
    var radius = e.accuracy;

    const result = await findAddress(lat, lon);

    const address = result.features[0].place_name;
    $("#LatitudeInput").val(lat);
    $("#LongitudeInput").val(lon);
    $("#AddressInput").val(address);
    map.fitBounds([[lat, lon]], {
      padding: [50, 50],
      maxZoom: 13,
    });

    const dmsCalculated = DDtoDMS(lat, lon);
    const data = {
      address: address,
      lat: lat,
      lon: lon,
      dms: { lat: dmsCalculated.lat, lon: dmsCalculated.lon },
    };

    const p = popupContent(data);
    marker.setLatLng([lat, lon]).bindPopup(p).openPopup();
    locationControl.stop();
    setTimeout(() => {
      $(icon).css("background-color", "black");
    }, 1000);
  });
  map.on("locationerror", function () {
    alert("Position could not be found");
  });
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

  // Clear results container when search is cleared.

  $("#latlonForm").on("submit", async function (e) {
    e.preventDefault();
    let icon = locationControl._icon;
    $(".alerts").html("");
    $(icon).css("background-color", "black");
    const submitText = $("form :submit").first().text();

    $(
      "form :submit"
    ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  ${submitText}`);
    let latInput = document.getElementById("LatitudeInput");
    let lonInput = document.getElementById("LongitudeInput");
    const lat = latInput.value;
    const lon = lonInput.value;

    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);

    const result = await findAddress(lat, lon);
    const dmsCalculated = DDtoDMS(lat, lon);

    let address =
      result.features.length > 0 ? result.features[0].place_name : "";
    $( "#AddressInput" ).val( address );
    
    // addressInput ---->  AddressInput 
  //   latInputField   ---> LatitudeInput
    // latInputField ------> LongitudeInput
    const alertMessage = `
    <div class="alert alert-warning d-flex align-items-center" role="alert">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
    <div>
    No Address Found
    </div>
    </div>

    `;
    let alertHtml = result.features.length > 0 ? "" : alertMessage;
    $(".alerts").html(alertHtml);
    map.fitBounds([[lat, lon]], {
      padding: [50, 50],
      maxZoom: 13,
    });

    $("form :submit").first().html(`${submitText}`);
    const data = {
      address: address,
      lat: lat,
      lon: lon,
      dms: { lat: dmsCalculated.lat, lon: dmsCalculated.lon },
    };

    const p = popupContent(data);
    marker.setLatLng([lat, lon]).bindPopup(p).openPopup();
  });

  const title = $("title").html();

  const pageTitle = title.slice(11);

  $("#map").on("click", ".leaflet-bar-part.leaflet-bar-part-single", function (
    e
  ) {
    e.preventDefault();
  });

  function addEntry(key, data) {
    let allEntries = key;
    let entryItem = data.key;
    // Parse any JSON previously stored in allEntries
    var existingEntries = JSON.parse(localStorage.getItem(allEntries));
    if (existingEntries == null) existingEntries = [];
    const entry = data;
    localStorage.setItem(entryItem, JSON.stringify(entry));
    // Save allEntries back to local storage
    existingEntries.push(entry);
    localStorage.setItem(allEntries, JSON.stringify(existingEntries));
  }

  $("#map").on("click", "#getAltitude", function (e) {
    e.preventDefault();
    toggleAltitude(this, marker);
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
      let locationData = JSON.parse(localStorage.getItem("location-data"));
      locationData.name = input[0].value;

      localStorage.setItem("location-data", JSON.stringify(locationData));
      addBookmark("location-data");

      let p = popupContent(locationData);
      marker.setPopupContent(p);
    }
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
  } );
    var bookmarkModal = new Modal(document.getElementById("bookmarkModal"), {
    keyboard: false
  });
  var bookmarkToggle = document.getElementById("bookmarkModal");
    $("#bookmarkForm").on("submit", function(e) {
    e.preventDefault();
    let input = $(this).find("input:eq(0)");
    console.log(e.target);
    let locationData = JSON.parse(localStorage.getItem("location-data"));
    locationData.name = input[0].value;
    localStorage.setItem("location-data", JSON.stringify(locationData));
    addBookmark("location-data");
    bookmarkModal.hide(bookmarkToggle);
    $(this)
      .find("input:eq(0)")
      .val("");
    let p = popupContent(locationData);
    marker.setPopupContent(p);
  } );
});
