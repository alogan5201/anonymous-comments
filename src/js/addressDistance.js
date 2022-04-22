/* jshint esversion: 8 */
import "./firebase";
import HaversineGeolocation from "haversine-geolocation";

import "utils/commentscript.js";
import {
  popupContent,
  getLatLon,
  getAddress,
  getElevation,
  getGeojson,
  addBookmark,

} from "utils/geocoder";

window.addEventListener("DOMContentLoaded", () => {
  async function getElevationData(lon, lat) {
    // Construct the API request

    const elvevationResponse = await getElevation(lat, lon);
    const data = elvevationResponse.data;

    // Display the longitude and latitude values

    // Get all the returned features
    const allFeatures = data.features;
    // For each returned feature, add elevation data to the elevations array
    const elevations = allFeatures.map((feature) => feature.properties.ele);
    // In the elevations array, find the largest value
    const highestElevation = Math.max(...elevations);
    setTimeout(() => {
      $(".altitude").html(`<strong>${highestElevation} meters</strong>  `);
    }, 500);
  }
  var loader = document.getElementById("loader");
  const map = L.mapbox
    .map("map", null, { zoomControl: false })
    .setView([38.25004425273146, -85.75576792471112], 11);
  L.mapbox.accessToken =
    "pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA";

  const layer = L.mapbox
    .styleLayer("mapbox://styles/mapbox/streets-v11")
    .addTo(map)
    .once("load", finishedLoading);
  // add your tiles to the map

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
  map.on("layeradd", function (e) {
    if ($("#loader").hasClass("loading")) {
      $("#loader").removeClass("loading").addClass("d-none");
    }
  });
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
    map.fitBounds(e.bounds);
    let icon = locationControl._icon;
    let lat = e.latlng.lat;

    let lon = e.latlng.lng;
    let obj = { lat: lat, lon: lon };
    localStorage.setItem("userlocation", `${JSON.stringify(obj)}`);

    const d = await getAddress(lat, lon);
    const data = d.data;
    let addressName =
      data.features.length > 0 ? data.features[0].place_name : null;
    if (data.features.length > 0) {
      console.log($("form").first().find("input:eq(0)"));
      console.log(data);
      $("#addressInputFieldOrigin").val(data.features[0].place_name);
    }

    const dmsCalculated = DDtoDMS(lat, lon);

    const allData = {
      name: addressName,
      lat: lat,
      lon: lon,
      dms: { lat: dmsCalculated.lat, lon: dmsCalculated.lon },
      origin: true,
    };

    const p = popupContent(allData);
    var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);

    marker1.setLatLng([lat, lon]).bindPopup(popup).openPopup();
    locationControl.stop();
    setTimeout(() => {
      $(icon).css("background-color", "black");
    }, 1000);
  });

  async function setOrigin(lat, lon) {
    const d = await getAddress(lat, lon);

    const data = d.data;
    if (data.features.length > 0) {
      $("#addressInputFieldOrigin").val(data.features[0].place_name);
      const origin = data.features[0];
      let originLatLon = data.features[0].geometry.coordinates;
      let originLat = originLatLon[1];
      let originLon = originLatLon[0];
      let originResults = {
        title: origin.place_name,
        lat: originLat,
        lon: originLon,
      };
      const geojsonData = getGeojson(originResults);
      featureLayer.setGeoJSON(geojsonData);
      $("#lonInputField").focus();
    } else if (data.features.length == 0) {
      alert("No Address found from your location");
    }
  }
  const title = $("title").html();

  const pageTitle = title.slice(11);

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
  const App = function _App() {
    return `
   <h1>Global State = [${App.state.count}] </h1>
  `;
  };

  const handler = {
    set: function (obj, prop, value) {
      obj[prop] = value;
    },
  };

  App.state = new Proxy({ count: 0 }, handler);

  // Initial Loading of the App

  async function convertAddressToCoordinates(address) {
    const data = await getLatLon(address);
    return data.data;
  }

  $("#getDistanceForm").on("submit", async function (e) {
    e.preventDefault();

    $("#loader").removeClass("d-none").addClass("loading");
    const popupCheck = marker1.isPopupOpen();
    if (popupCheck) {
      marker1.closePopup();
    }
    const coordsOrigin = await convertAddressToCoordinates(
      e.currentTarget[0].value
    );

    const coordsDestination = await convertAddressToCoordinates(
      e.currentTarget[1].value
    );

    const result = await Promise.all([coordsOrigin, coordsDestination]);

    const origin = result[0].features[0];
    let originLatLon = result[0].features[0].geometry.coordinates;
    let originLat = originLatLon[1];
    let originLon = originLatLon[0];

    const destination = result[1].features[0];
    let destinationLatLon = result[1].features[0].geometry.coordinates;
    let destinationLat = destinationLatLon[1];
    let destinationLon = destinationLatLon[0];

    const points = [
      {
        latitude: originLat,
        longitude: originLon,
      },
      {
        latitude: destinationLat,
        longitude: destinationLon,
      },
    ];

    const originDMS = DDtoDMS(originLat, originLon);
    const destinationDMS = DDtoDMS(destinationLat, destinationLon);

    const distance = HaversineGeolocation.getDistanceBetween(
      points[0],
      points[1],
      "mi"
    );
    let originResults = {
      name: origin.place_name,
      lat: originLat,
      lon: originLon,
      dms: { lat: originDMS.lat, lon: originDMS.lon },
      origin: true,
    };

    let destinationResults = {
      name: destination.place_name,
      lat: destinationLat,
      lon: destinationLon,
      dms: { lat: destinationDMS.lat, lon: destinationDMS.lon },
      distance: `${distance} miles`,
      destination: true,
    };

    const markerCoords = marker1.getLatLng();
    const markerContent = marker1.getPopup();

    const originPopup = popupContent(originResults);
    const destinationPopup = popupContent(destinationResults);

    const popup1 = L.popup().setContent(originPopup);
    const popup2 = L.popup().setContent(destinationPopup);

    marker1.setLatLng([originLat, originLon]).bindPopup(popup1);

    marker2.setLatLng([destinationLat, destinationLon]).bindPopup(popup2);

    $("#distanceInput").val(`${distance} miles`);
    $("#distanceInput").focus();
    map.fitBounds(
      [
        [originLat, originLon],
        [destinationLat, destinationLon],
      ],
      { padding: [50, 50] }
    );
  });

  $("#map").on("click", "#getAltitude", function (e) {
    e.preventDefault();
    let width = $(this).width()
    let hstack = $(this).parent().parent()

    $(hstack).children().first().removeClass("me-auto").addClass("mx-auto")
    $(hstack).children().first().html(`
   <button class="btn btn-outline-primary border-0 text-center mx-auto" type="button" disabled style = "width:${width}px !important">
   <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
 </button>
 `)

    let newPopupContent = $(this).parents("div.popupContent").parent().html();

    if ($(this).hasClass("origin")) {
      console.log("has class origin");
      marker1.setPopupContent(newPopupContent)
      let originCoords = marker1.getLatLng();
      getElevationData(originCoords.lng, originCoords.lat);
    } else {
      marker2.setPopupContent(newPopupContent)
      let destinationCoords = marker2.getLatLng();
      getElevationData(destinationCoords.lng, destinationCoords.lat);
    }
  });
  $("#map").on("click", ".origin.bookmark-btn", function (e) {
    e.preventDefault();
    let cachedData = localStorage.getItem("origin-data");
    const data = JSON.parse(cachedData);

    name = name.replace(/^\s+|\s+$/gm, "");

    console.log("bookmark is origin");
    let popup = marker1.getPopup();
    $(this).prop("disabled", true);
    $(this).children().last().removeClass("far").addClass("fas");
    addBookmark("origin-data");

    let newPopupContent = $(this).parents("div.popupContent").parent().html();

    marker1.setPopupContent(newPopupContent);
  });
  $("#map").on("click", ".destination.bookmark-btn", function (e) {
    e.preventDefault();
    let cachedData = localStorage.getItem("destination-data");
    let parsed = JSON.parse(cachedData);
    console.log(parsed);

    name = name.replace(/^\s+|\s+$/gm, "");

    console.log("bookmark is origin");
    let popup = marker2.getPopup();
    $(this).prop("disabled", true);
    $(this).children().last().removeClass("far").addClass("fas");

    addBookmark("destination-data");

    let newPopupContent = $(this).parents("div.popupContent").parent().html();

    marker2.setPopupContent(newPopupContent);

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
});
