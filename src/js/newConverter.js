/* jshint esversion: 8 */
import "./firebase";
import "utils/commentscript.js";
import {
  generateUID,
  getAddress,
  getElevation,
  getLatLon,
  popupContent,
  addBookmark,
  altitudeLoading
} from "utils/geocoder";
import { getIp } from "./firebase";
import { computeDestinationPoint } from "geolib";
function test(e) {
  e.preventDefault();
}
window.addEventListener("DOMContentLoaded", () => {
  let scrollPos = 0;
  const mainNav = document.getElementById("mainNav");
  const headerHeight = mainNav.clientHeight;
});

$(document).ready(function() {
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

      "marker-color": "blue"
    })
  }).addTo(map);
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

  async function findAddress(lat, lon) {
    const d = await getAddress(lat, lon);
    const data = d.data;

    return data;
  }

  map.on("locationfound", async function(e) {
    let lat = e.latitude;
    let lon = e.longitude;
    await updateLocation(lat, lon);
  });
  map.on("locationerror", async function(e) {
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
    let alertHtml = result.features.length > 0 ? "" : alertMessage;
    $(".alerts").html(alertHtml);
    locationControl.stop();
    $("#latInputField").val(lat);
    $("#lonInputField").val(lon);

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
      name: result.features[0].place_name,
      lat: lat,
      lon: lon,
      dms: { lat: dmsLat, lon: dmsLon }
    };

    const p = popupContent(data);
    var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);
    map.fitBounds([[lat, lon]], { padding: [50, 50] });

    marker
      .setLatLng([lat, lon])
      .bindPopup(popup)
      .openPopup();
  }
  const coordinatesGeocoder = function(query) {
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
          coordinates: [lng, lat]
        },
        place_name: "Lat: " + lat + " Lng: " + lng,
        place_type: ["coordinate"],
        properties: {},
        type: "Feature"
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

  async function getElevationData(lon, lat) {
    // Construct the API request
    const elvevationResponse = await getElevation(lat, lon);
    const data = elvevationResponse.data;

    // Display the longitude and latitude values

    // Get all the returned features
    const allFeatures = data.features;
    // For each returned feature, add elevation data to the elevations array
    const elevations = allFeatures.map(feature => feature.properties.ele);
    // In the elevations array, find the largest value
    const highestElevation = Math.max(...elevations);
    $(".altitude").html(`<div> ${highestElevation} meters </div>`);
  }
  $("#map").on("click", "#getAltitude", function(e) {
    e.preventDefault();

    $(this)
      .parent()
      .parent()
      .html(altitudeLoading());

    const markerLocation = marker.getLatLng();
    console.log(markerLocation);
    getElevationData(markerLocation.lng, markerLocation.lat);
  });

  // Clear results container when search is cleared.

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

  const title = $("title").html();

  const pageTitle = title.slice(11);
  let bookmarkControl = new L.Control.Bookmarks({
    name: pageTitle
  }).addTo(map);

  $("#all-forms").on("submit", async function(e) {
    e.preventDefault();
    console.log(e.target);
    let targetId = $(e.target).attr("id");
    if (targetId == "addressForm") {
      await firstForm();
    } else if (targetId == "latlonForm") {
      await secondForm();
    } else if (targetId == "myDmsForm") {
      await thirdForm();
    } else {
      alert("Error processing form");
    }
  });

  // !! First Form
  async function firstForm() {
    const submitText = $("#addressForm :submit")
      .first()
      .text();

    $(".alerts").html("");
    const value = $("#addressForm")
      .find("input:eq(0)")
      .val();
    console.log(value);

    $(
      "#addressForm :submit"
    ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    ${submitText}`);

    const fetchResponse = await convertAddress(value);

    let lat = fetchResponse.features[0].geometry.coordinates[1];
    let lon = fetchResponse.features[0].geometry.coordinates[0];

    const dmsCalculated = DDtoDMS(lat, lon);

    setTimeout(() => {
      if (fetchResponse.features.length > 0) {
        $("#latlonForm")
          .find("input:eq(0)")
          .val(lat);
        $("#latlonForm")
          .find("input:eq(1)")
          .val(lon);

        $("#degrees-lat").val(dmsCalculated.lat.degrees);
        $("#minutes-lat").val(dmsCalculated.lat.minutes);
        $("#seconds-lat").val(dmsCalculated.lat.seconds);
        $("#degrees-lon").val(dmsCalculated.lon.degrees);
        $("#minutes-lon").val(dmsCalculated.lon.minutes);
        $("#seconds-lon").val(dmsCalculated.lon.seconds);

        const data = {
          name: fetchResponse.features[0].place_name,
          lat: lat,
          lon: lon,
          dms: {
            lat: dmsCalculated.popupMessage.lat,
            lon: dmsCalculated.popupMessage.lon
          }
        };
        const p = popupContent(data);
        var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);
        map.fitBounds([[lat, lon]], { padding: [50, 50] });
        marker
          .setLatLng([lat, lon])
          .bindPopup(popup)
          .openPopup();
        $("form :submit")
          .first()
          .html(submitText);
      }
    }, 200);
  }

  //! ! Second Form
  async function secondForm() {
    $('#latlonForm input[type="submit"]').prop("disabled", true);
    $(".alerts").html("");
    let latInput = document.getElementById("latInputField");
    let lonInput = document.getElementById("lonInputField");
    const lat = $("#latlonForm")
      .find("input:eq(0)")
      .val();
    const lon = $("#latlonForm")
      .find("input:eq(1)")
      .val();

    const submitText = $("#latlonForm :submit")
      .first()
      .text();
    $(
      "#latlonForm :submit"
    ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    ${submitText}`);
    north.checked = lat >= 0;
    south.check = lat < 0;
    east.checked = lon >= 0;
    west.checked = lon < 0;
    const dmsCalculated = DDtoDMS(lat, lon);
    const result = await findAddress(lat, lon);
    let address =
      result.features.length > 0 ? result.features[0].place_name : "";
    $("#searchInput").val(address);
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
    let alertHtml = result.features.length > 0 ? "" : alertMessage;
    $(".alerts").html(alertHtml);
    setTimeout(() => {
      map.fitBounds([[lat, lon]], {
        padding: [100, 100]
      });

      $("#degrees-lat").val(dmsCalculated.lat.degrees);
      $("#minutes-lat").val(dmsCalculated.lat.minutes);
      $("#seconds-lat").val(dmsCalculated.lat.seconds);
      $("#degrees-lon").val(dmsCalculated.lon.degrees);
      $("#minutes-lon").val(dmsCalculated.lon.minutes);
      $("#seconds-lon").val(dmsCalculated.lon.seconds);
      const data = {
        name: address,
        lat: lat,
        lon: lon,
        dms: {
          lat: dmsCalculated.popupMessage.lat,
          lon: dmsCalculated.popupMessage.lon
        }
      };
      const p = popupContent(data);
      var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);

      marker
        .setLatLng([lat, lon])
        .bindPopup(popup)
        .openPopup();

      $("#latlonForm :submit")
        .first()
        .html(`${submitText}`);
    }, 200);
  }
  //! ! Third Form
  async function thirdForm() {
    $(".alerts").html(""); // Iterate over the form controls
    const submitText = $("#myDmsForm :submit")
      .first()
      .text();
    $(
      "#myDmsForm :submit"
    ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    ${submitText}`);
    let latRadio = north.checked ? "N" : "S";
    let lonRadio = west.checked ? "W" : "E";
    let test = $("#myDmsForm")
      .find("input:eq(2)")
      .val();
    console.log(test);

    let latField = [
      parseFloat(
        $("#myDmsForm")
          .find("input:eq(2)")
          .val()
      ),
      parseFloat(
        $("#myDmsForm")
          .find("input:eq(3)")
          .val()
      ),
      parseFloat(
        $("#myDmsForm")
          .find("input:eq(4)")
          .val()
      ),
      latRadio
    ];
    let lonField = [
      parseFloat(
        $("#myDmsForm")
          .find("input:eq(7)")
          .val()
      ),
      parseFloat(
        $("#myDmsForm")
          .find("input:eq(8)")
          .val()
      ),
      parseFloat(
        $("#myDmsForm")
          .find("input:eq(9)")
          .val()
      ),
      lonRadio
    ];

    let lat = ConvertDMSToDD(latField);
    let lon = ConvertDMSToDD(lonField);
    // let lon = ConvertDMStoDD(lonField)

    let lonReduced = lon.toFixed(8);
    let latReduced = lat.toFixed(8);
    const result = await findAddress(lat, lon);

    latlonForm.elements[0].value = latReduced;
    latlonForm.elements[1].value = lonReduced;

    let address =
      result.features.length > 0 ? result.features[0].place_name : "";
    $("#searchInput").val(address);

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
    let alertHtml = result.features.length > 0 ? "" : alertMessage;
    $(".alerts").html(alertHtml);
    map.fitBounds([[lat, lon]], {
      padding: [100, 100]
    });
    const data = {
      name: address,
      lat: lat,
      lon: lon,
      dms: {
        lat: `${latField[0]}° ${latField[1]}' ${latField[2]}`,
        lon: `${lonField[0]}° ${lonField[1]}' ${lonField[2]}`
      }
    };
    const p = popupContent(data);
    var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);

    marker
      .setLatLng([lat, lon])
      .bindPopup(popup)
      .openPopup();

    $("#myDmsForm :submit")
      .first()
      .html(`${submitText}`);
  }
  $("#map").on("click", "#getAltitude", function(e) {
    e.preventDefault();
    let coords = marker.getLatLng();

    $(
      this
    ).parent().html(`<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading
</button>`);
    getElevationData(coords.lng, coords.lat);
  });

  $("#map").on("click", ".bookmark-btn", function(e) {
    e.preventDefault();
    let cachedData = localStorage.getItem("location-data");
    let parsed = JSON.parse(cachedData);
    let coords = marker.getLatLng();
    name = name.replace(/^\s+|\s+$/gm, "");
    $(this).prop("disabled", true);
    $(this)
      .children()
      .last()
      .removeClass("far")
      .addClass("fas");
    addBookmark("location-data");
    let newPopupContent = $(this)
      .parents("div.popupContent")
      .parent()
      .html();
    marker.setPopupContent(newPopupContent);
  });

  map.on("popupopen", function(e) {
    var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
    px.y -= e.target._popup._container.clientHeight / 2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    map.panTo(map.unproject(px), { animate: true });
    $(".leaflet-top.leaflet-left").css("opacity", "0");
    // TODO update
  });
  map.on("popupclose", function(e) {
    // TODO update
    $(".leaflet-top.leaflet-left").css("opacity", "1");
  });
});
