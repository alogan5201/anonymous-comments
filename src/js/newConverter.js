/* jshint esversion: 8 */
import "utils/commentscript.js";
import {
  addBookmark,
  getAddress,
  getLatLon,
  popupContent,
  toggleAltitude,
  toggleBookmark,
} from "utils/geocoder";
import "./firebase";
import { Toast, Modal } from "bootstrap/dist/js/bootstrap.esm.min.js";

import { getIp } from "./firebase";
function test(e) {
  e.preventDefault();
}

window.addEventListener("DOMContentLoaded", () => {
  const alertMessage = `
  <div class="alert alert-primary d-flex align-items-center" role="alert">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </svg>
  <div>
  No Address Found
  </div>
  </div>

  `;
  const north = document.getElementById("north");
  const south = document.getElementById("south");

  const east = document.getElementById("east");
  const west = document.getElementById("west");

  const latlonForm = document.getElementById("latlonForm");

  async function convertAddress(city) {
    const data = await getLatLon(city);
    return data.data;
  }
  function ParseDMS(input) {
    var parts = input.split(/[^\d\w]+/);
    var lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
    var lng = ConvertDMSToDD(parts[4], parts[5], parts[6], parts[7]);
  }

  function ParseDMS(input) {
    var parts = input.split(/[^\d\w]+/);
    var lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
    var lng = ConvertDMSToDD(parts[4], parts[5], parts[6], parts[7]);
  }

  function ConvertDMSToDD(arr) {
    let degrees = arr[0];
    let minutes = arr[1];
    let seconds = arr[2];
    let direction = arr[3];
    var dd = degrees + minutes / 60 + seconds / (60 * 60);

    if (direction == "S" || direction == "W") {
      dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  }
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
    let result = {
      lat: {
        degrees: degreesLatitude,
        minutes: minutesLatitude,
        seconds: secondsLatitude,
      },
      lon: {
        degrees: degreesLongitude,
        minutes: minutesLongitude,
        seconds: secondsLongitude,
      },
      popupMessage: { lat: latResult, lon: lonResult },
    };
    return result;
  }
  function check(elm) {
    document.getElementById(elm).checked = true;
  }

  const convertLocationData = document.getElementById("convertLocationData");
  const LatitudeInput = document.getElementById("LatitudeInput");
  const LongitudeInput = document.getElementById("LongitudeInput");
  const latlonGeocoderBtn = document.getElementById("latlonGeocoderBtn");

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
    .once("load", finishedLoading);

  function finishedLoading() {
    // first, toggle the class 'done', which makes the loading screen
    // fade out
    setTimeout(() => {
      $("#map").removeClass("invisible");
    }, 1000);
  }
  // L.marker is a low-level marker constructor in Leaflet.
  const marker = L.marker([0, 0], {
    icon: L.mapbox.marker.icon({
      "marker-size": "large",

      "marker-color": "blue",
    }),
  }).addTo(map);
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
    let lat = e.latitude;
    let lon = e.longitude;
    await updateLocation(lat, lon);
  });
  map.on("locationerror", async function (e) {
    if (e.message == "Geolocation error: Timeout expired.") {
      const ip = await getIp();
      let lat = ip.latitude;
      let lon = ip.longitude;
      await updateLocation(lat, lon);
    }
  });
  async function updateLocation(lat, lon) {
    const result = await findAddress(lat, lon);

    let address =
      result.features.length > 0 ? result.features[0].place_name : "";
    localStorage.setItem("userLatLon", `${lat}, ${lon}`);

    $("#searchInput").val(address);

    let alertHtml = result.features.length > 0 ? "" : alertMessage;
    $(".alerts").html(alertHtml);
    locationControl.stop();
    $("#LatitudeInput").val(lat);
    $("#LongitudeInput").val(lon);

    north.checked = lat >= 0;
    south.check = lat < 0;
    east.checked = lon >= 0;
    west.checked = lon < 0;

    const dmsCalculated = DDtoDMS(lat, lon);
    document.getElementById("degrees-lat").value = dmsCalculated.lat.degrees;
    document.getElementById("minutes-lat").value = dmsCalculated.lat.minutes;
    document.getElementById("seconds-lat").value = dmsCalculated.lat.seconds;
    document.getElementById("degrees-lon").value = dmsCalculated.lon.degrees;
    document.getElementById("minutes-lon").value = dmsCalculated.lon.minutes;
    document.getElementById("seconds-lon").value = dmsCalculated.lon.seconds;

    let dmsLat = `${dmsCalculated.lat.degrees}° ${dmsCalculated.lat.minutes}' ${dmsCalculated.lat.degrees}''`;

    let dmsLon = `${dmsCalculated.lon.degrees}° ${dmsCalculated.lon.minutes}' ${dmsCalculated.lon.seconds}''`;
    const data = {
      address: result.features[0].place_name,
      lat: lat,
      lon: lon,
      dms: { lat: dmsLat, lon: dmsLon },
    };

    const p = popupContent(data);
    var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);
    map.fitBounds([[lat, lon]], { padding: [50, 50], maxZoom: 13 });

    marker.setLatLng([lat, lon]).bindPopup(popup).openPopup();
  }





  // !! First Form form#addressForm

$("#addressForm").on("submit", async function (e) {
    e.preventDefault();
    clearAlert();
    $("form#addressForm :submit").prop("disabled", true);
    const submitText = "Convert";

    const value = $(this).find("input:eq(0)").val();

    $(
      "#addressForm :submit"
    ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  ${submitText}`);

    const fetchResponse = await convertAddress(value);

    let lat = fetchResponse.features[0].geometry.coordinates[1];
    let lon = fetchResponse.features[0].geometry.coordinates[0];

    const dmsCalculated = DDtoDMS(lat, lon);

    if (fetchResponse.features.length > 0) {
      $("form#addressForm :submit").prop("disabled", false);
      const data = {
        address: fetchResponse.features[0].place_name,
        lat: lat,
        lon: lon,
        dms: {
          lat: dmsCalculated.popupMessage.lat,
          lon: dmsCalculated.popupMessage.lon,
        },
      };
      firstFormSuccess(data, dmsCalculated);
    } else {
      $("form#addressForm :submit").prop("disabled", false);
      $(".alerts").html(alertMessage);
    }
  });

  function firstFormSuccess(data, dmsCalculated) {
    $("#latlonForm").find("input:eq(0)").val(data.lat);
    $("#latlonForm").find("input:eq(1)").val(data.lon);

    $("#degrees-lat").val(dmsCalculated.lat.degrees);
    $("#minutes-lat").val(dmsCalculated.lat.minutes);
    $("#seconds-lat").val(dmsCalculated.lat.seconds);
    $("#degrees-lon").val(dmsCalculated.lon.degrees);
    $("#minutes-lon").val(dmsCalculated.lon.minutes);
    $("#seconds-lon").val(dmsCalculated.lon.seconds);

    const p = popupContent(data);
    var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);
    map.fitBounds([[data.lat, data.lon]], { padding: [50, 50], maxZoom: 13 });
    marker.setLatLng([data.lat, data.lon]).bindPopup(popup).openPopup();
    $("#getRoute").html("Convert");
  }
  //! ! Second Form
  $("form#latlonForm").submit(async function (e) {
    e.preventDefault();
    clearAlert();
    const submitText = "Convert";
    $("form#latlonForm :submit").prop("disabled", true);

    $(
      "form#latlonForm :submit"
    ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    ${submitText}`);

    const lat = $(this).find("input:eq(0)").val();
    const lon = $(this).find("input:eq(1)").val();

    north.checked = lat >= 0;
    south.check = lat < 0;
    east.checked = lon >= 0;
    west.checked = lon < 0;
    const dmsCalculated = DDtoDMS(lat, lon);
    const result = await findAddress(lat, lon);
    let address =
      result.features.length > 0 ? result.features[0].place_name : "";
    $("#searchInput").val(address);
    if (result.features.length > 0) {
      const data = {
        address: address,
        lat: lat,
        lon: lon,
        dms: {
          lat: dmsCalculated.popupMessage.lat,
          lon: dmsCalculated.popupMessage.lon,
        },
      };
      $("form#latlonForm :submit").prop("disabled", false);
      secondFormSuccess(data, dmsCalculated);
    } else {
      $("form#latlonForm :submit").prop("disabled", false);
      $(".alerts").html(alertMessage);
    }
  });

  function secondFormSuccess(data, dmsCalculated) {
    map.fitBounds([[data.lat, data.lon]], {
      padding: [100, 100],
      maxZoom: 13,
    });

    $("#degrees-lat").val(dmsCalculated.lat.degrees);
    $("#minutes-lat").val(dmsCalculated.lat.minutes);
    $("#seconds-lat").val(dmsCalculated.lat.seconds);
    $("#degrees-lon").val(dmsCalculated.lon.degrees);
    $("#minutes-lon").val(dmsCalculated.lon.minutes);
    $("#seconds-lon").val(dmsCalculated.lon.seconds);

    const p = popupContent(data);
    var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);

    marker.setLatLng([data.lat, data.lon]).bindPopup(popup).openPopup();

    $("#latlonForm :submit").html("Convert");
  }
  //! ! Third Form
  $("form#myDmsForm").submit(async function (e) {
    e.preventDefault();
    clearAlert();
    const submitText = "Convert";
    $("form#myDmsForm :submit").prop("disabled", true);

    $(
      "form#myDmsForm :submit"
    ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    ${submitText}`);

    let latRadio = north.checked ? "N" : "S";
    let lonRadio = west.checked ? "W" : "E";
    let test = $(this).find("input:eq(2)").val();
    console.log(test);

    let latField = [
      parseFloat($(this).find("input:eq(2)").val()),
      parseFloat($(this).find("input:eq(3)").val()),
      parseFloat($(this).find("input:eq(4)").val()),
      latRadio,
    ];
    let lonField = [
      parseFloat($(this).find("input:eq(7)").val()),
      parseFloat($(this).find("input:eq(8)").val()),
      parseFloat($(this).find("input:eq(9)").val()),
      lonRadio,
    ];

    let lat = ConvertDMSToDD(latField);
    let lon = ConvertDMSToDD(lonField);
    // let lon = ConvertDMStoDD(lonField)

    let lonReduced = lon.toFixed(8);
    let latReduced = lat.toFixed(8);
    const result = await findAddress(lat, lon);

    latlonForm.elements[0].value = latReduced;
    latlonForm.elements[1].value = lonReduced;

    if (result.features.length > 0) {
      let address = result.features[0].place_name;
      const data = {
        address: address,
        lat: lat,
        lon: lon,
        dms: {
          lat: `${latField[0]}° ${latField[1]}' ${latField[2]}`,
          lon: `${lonField[0]}° ${lonField[1]}' ${lonField[2]}`,
        },
      };
      $("form#myDmsForm :submit").prop("disabled", false);
      $("form#myDmsForm :submit").first().html(`${submitText}`);
      thirdFormSuccess(data);
    } else {
      $("form#myDmsForm :submit").prop("disabled", false);
      $(".alerts").html(alertMessage);
    }
  });
  function thirdFormSuccess(data) {
    $("#searchInput").val(data.address);

    map.fitBounds([[data.lat, data.lon]], {
      padding: [100, 100],
      maxZoom: 13,
    });

    const p = popupContent(data);
    var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);

    marker.setLatLng([data.lat, data.lon]).bindPopup(popup).openPopup();
  }
  $("#map").on("click", "#getAltitude", function (e) {
    e.preventDefault();
    toggleAltitude(this, marker);
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


  function clearAlert() {
    let alerts = document.querySelector(".alerts");
    if (alerts.innerText.length > 1) {
      alerts.innerText = "";
    } else {
      return;
    }
  }

    var bookmarkModal = new Modal(document.getElementById("bookmarkModal"), {
    keyboard: false
  });
  var bookmarkToggle = document.getElementById("bookmarkModal");
  // relatedTarget

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
