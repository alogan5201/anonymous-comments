/* jshint esversion: 8 */
import HaversineGeolocation from "haversine-geolocation";
import "utils/commentscript.js";
import {
  generateUID, getAddress,
  getElevation, getLatLon, popupContent, addBookmark
} from "utils/geocoder";
import "./firebase";









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

  L.mapbox.accessToken =
    "pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA";
  const map = L.mapbox
    .map("map", null, { zoomControl: false })
    .setView([38.25004425273146, -85.75576792471112], 11);

  const layer = L.mapbox
    .styleLayer("mapbox://styles/mapbox/streets-v11")
    .addTo(map)
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
      //
      "marker-color": "red",
    }),
  }).addTo(map);
  // add your tiles to the map
  function finishedLoading() {
    // first, toggle the class 'done', which makes the loading screen
    // fade out
    setTimeout(() => {
      $("#map").removeClass("invisible");
    }, 1000);
    // L.marker is a low-level marker constructor in Leaflet.
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
        timeout: 3000,
      },
    })
    .addTo(map);



  map.on("locationfound", function (e) {
    console.log(e)

    let icon = locationControl._icon;
    $("form")
      .first()
      .find("input:eq(2)").val("")
    $("form")
      .first()
      .find("input:eq(3)").val("")
    let lat = e.latlng.lat;

    let lon = e.latlng.lng;
    map.fitBounds([[lat, lon]], { padding: [50, 50] });
    const dmsCalculated = DDtoDMS(lat, lon);

    var inputs = document.getElementById("latlonForm").elements;

    if (inputs[0].nodeName === "INPUT" && inputs[0].type === "number") {
      // Update text input
      inputs[0].value = lat;
      inputs[1].value = lon;
    }
    const data = {

      lat: lat,
      lon: lon,
      dms: { lat: dmsCalculated.lat, lon: dmsCalculated.lon },
      origin: true
    };
    const p = popupContent(data);
    var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);
    marker1.setLatLng([lat, lon]).bindPopup(popup).openPopup();
    locationControl.stop();

  });

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

  $("#originTest").click(function (e) {
    e.preventDefault();
  });
  $("#destinationTest").click(function (e) {
    e.preventDefault();
  });
  $("#switchTest").click(function (e) {
    e.preventDefault();
  });
  console.log(
    $("form")
      .first()
      .find("input:eq(2)")
  );
  $("#latlonForm").on("submit", function (e) {
    e.preventDefault();
    const popupCheck = marker1.isPopupOpen()
    if (popupCheck) {

      marker1.closePopup()
    }

    const submitText = $("form :submit").first().text();
    console.log($("form :submit").first().parent());
    $(
      "form :submit"
    ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  ${submitText}`);
    let inputs = document.getElementById("latlonForm").elements;
    let icon = locationControl._icon;
    let originLat = inputs[0].value;
    let originLon = inputs[1].value;
    let destinationLat = inputs[2].value;
    let destinationLon = inputs[3].value;

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
    const originDMSCalculated = DDtoDMS(originLat, originLon);
    const destinationDMSCalculated = DDtoDMS(destinationLat, destinationLon);

    const distance = HaversineGeolocation.getDistanceBetween(
      points[0],
      points[1],
      "mi"
    );


    let originResults = {

      lat: originLat,
      lon: originLon,
      dms: { lat: originDMSCalculated.lat, lon: originDMSCalculated.lon },
      origin: true,
    };
    let destinationResults = {

      lat: destinationLat,
      lon: destinationLon,
      dms: { lat: destinationDMSCalculated.lat, lon: destinationDMSCalculated.lon },
      destination: true
    };
    const originPopup = popupContent(originResults);
    const destinationPopup = popupContent(destinationResults)

    const popup1 = L.popup().setContent(originPopup);
    const popup2 = L.popup().setContent(destinationPopup);
    marker1
      .setLatLng([originLat, originLon])
      .bindPopup(popup1)



    marker2
      .setLatLng([destinationLat, destinationLon])
      .bindPopup(popup2)

    $("#distanceInput").val(`${distance} miles`);
    map.fitBounds(
      [
        [originLat, originLon],
        [destinationLat, destinationLon],
      ],
      { padding: [50, 50] }
    );
    $("form :submit").first().html(submitText);
  });


  $("#map").on("click", "#getAltitude", function (e) {
    $(
      this
    ).parent().html(`<button class="btn btn-outline-primary border-0 text-center my-auto" type="button" disabled="">
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  </button>`);
    e.preventDefault();
    if ($(this).hasClass("origin")) {
      console.log("has class origin")

      let originCoords = marker1.getLatLng()
      getElevationData(originCoords.lng, originCoords.lat);
    }
    else {
      let destinationCoords = marker2.getLatLng()
      getElevationData(destinationCoords.lng, destinationCoords.lat);
    }
  });


  $("#map").on("click", ".origin.bookmark-btn", function (e) {
    e.preventDefault();
    let cachedData = localStorage.getItem("origin-data")
    const data = JSON.parse(cachedData)


    name = name.replace(/^\s+|\s+$/gm, "");

    console.log("bookmark is origin")
    let popup = marker1.getPopup()
    $(this).prop("disabled", true)
    $(this).children().last().removeClass("far").addClass("fas")
    addBookmark("origin-data")


    let newPopupContent = $(this).parents("div.popupContent").parent().html()

    marker1.setPopupContent(newPopupContent)


  });
  $("#map").on("click", ".destination.bookmark-btn", function (e) {
    e.preventDefault();
    let cachedData = localStorage.getItem("destination-data")
    let parsed = JSON.parse(cachedData)
    console.log(parsed)

    name = name.replace(/^\s+|\s+$/gm, "");

    console.log("bookmark is origin")
    let popup = marker2.getPopup()
    $(this).prop("disabled", true)
    $(this).children().last().removeClass("far").addClass("fas")
    debugger
    addBookmark("destination-data")


    let newPopupContent = $(this).parents("div.popupContent").parent().html()

    marker2.setPopupContent(newPopupContent)


  });
  map.on('popupopen', function (e) {
    var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
    px.y -= e.target._popup._container.clientHeight / 2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    map.panTo(map.unproject(px), { animate: true });
    $('.leaflet-top.leaflet-left').css('opacity', '0');
    // TODO update
  });
  map.on('popupclose', function (e) {
    // TODO update
    $('.leaflet-top.leaflet-left').css('opacity', '1');
  });



});

