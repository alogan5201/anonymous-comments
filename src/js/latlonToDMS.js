/* jshint esversion: 8 */
import "./firebase";
import "utils/commentscript.js";
import {
  popupContent,
  getLatLon,
  getAddress,
  generateUID,
  addBookmark,
  toggleBookmark,
  getAltitude,
  toggleAltitude,
} from "utils/geocoder";
import { getIp } from "./firebase";
import { Toast, Modal } from "bootstrap/dist/js/bootstrap.esm.min.js";

function test(e) {
  e.preventDefault();
}
window.addEventListener("DOMContentLoaded", () => {
  let scrollPos = 0;
  const mainNav = document.getElementById("mainNav");
  const headerHeight = mainNav.clientHeight;
});
const path = window.location.pathname;
$(document).ready(function () {
  function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes / 60 + seconds / (60 * 60);

    if (direction == "S" || direction == "W") {
      dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  }

  const uid = generateUID();
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
    localStorage.setItem("userLatLon", `${lat}, ${lon}`);

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

    map.fitBounds([[lat, lon]], {
      padding: [50, 50],
      maxZoom: 13,
    });
    const data = {
      lat: lat,
      lon: lon,
      dms: {
        lat: `${dmsCalculated.lat.degrees}, ${dmsCalculated.lat.minutes}, ${dmsCalculated.lat.seconds}`,
        lon: `${dmsCalculated.lon.degrees}, ${dmsCalculated.lon.minutes}, ${dmsCalculated.lon.seconds} `,
      },
    };

    const p = popupContent(data);

    var popup = L.popup({ autoPan: true, keepInView: false }).setContent(p);
    marker.setLatLng([lat, lon]).bindPopup(popup).openPopup();
  }

  // Clear results container when search is cleared.

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
  $("#latlonForm").on("submit", function (e) {
    e.preventDefault();
    const submitText = $("form :submit").first().text();

    $(
      "form :submit"
    ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  ${submitText}`);

    let icon = locationControl._icon;
    $(icon).css("background-color", "black");
    let latInput = document.getElementById("latInputField");
    let lonInput = document.getElementById("lonInputField");
    const lat = e.currentTarget[0].value;
    const lon = e.currentTarget[1].value;

    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);
    north.checked = lat >= 0;
    south.check = lat < 0;
    east.checked = lon >= 0;
    west.checked = lon < 0;
    const dmsCalculated = DDtoDMS(lat, lon);

    map.fitBounds([[lat, lon]], {
      padding: [50, 50],
      maxZoom: 13,
    });
    $("form :submit").first().html(submitText);
    $("#degrees-lat").val(dmsCalculated.lat.degrees);
    $("#minutes-lat").val(dmsCalculated.lat.minutes);
    $("#seconds-lat").val(dmsCalculated.lat.seconds);
    $("#degrees-lon").val(dmsCalculated.lon.degrees);
    $("#minutes-lon").val(dmsCalculated.lon.minutes);
    $("#seconds-lon").val(dmsCalculated.lon.seconds);
    //  ${dmsCalculated.lat} ${dmsCalculated.lon}
    const data = {
      lat: lat,
      lon: lon,
      dms: {
        lat: dmsCalculated.popupMessage.lat,
        lon: dmsCalculated.popupMessage.lon,
      },
    };

    const p = popupContent(data);
    marker.setLatLng([lat, lon]).bindPopup(p).openPopup();
  });

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
  } );
  
        var bookmarkModal = new Modal(document.getElementById("bookmarkModal"), {
    keyboard: false
  });
  var bookmarkToggle = document.getElementById( "bookmarkModal" );
  
  $( "#bookmarkForm" ).on( "submit", function ( e ) {
    e.preventDefault();
    let data = "location-data" 
    let input = $( this ).find( "input:eq(0)" );
    console.log( e.target );
    let locationData = JSON.parse( localStorage.getItem( data ) );
    locationData.name = input[ 0 ].value;
    let p = popupContent( locationData );
    marker.setPopupContent( p );
    localStorage.setItem( data, JSON.stringify( locationData ) );
    
    addBookmark( data );
    bookmarkModal.hide( bookmarkToggle );
    $( this )
      .find( "input:eq(0)" )
      .val( "" );
  })
});
