/* jshint esversion: 8 */
import "./firebase";
import "utils/commentscript.js";
import {
  addBookmark,
  generateUID,
  getAddress,
  getLatLon,
  popupContent,
  toggleAltitude,
  toggleBookmark,
} from "utils/geocoder";
import { getIp } from "./firebase";
import { Toast, Modal } from "bootstrap/dist/js/bootstrap.esm.min.js";

const uid = generateUID();
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

window.addEventListener("DOMContentLoaded", () => {
  let scrollPos = 0;
  const mainNav = document.getElementById("mainNav");
  const headerHeight = mainNav.clientHeight;

  function ConvertDMSToDD(degrees, minutes, seconds, direction) {
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

  function finishedLoading() {
    // first, toggle the class 'done', which makes the loading screen
    // fade out
    setTimeout(() => {
      $("#map").removeClass("invisible");
    }, 1000);
  }

  // var myLayer = L.mapbox.featureLayer().addTo(map);
  const marker = L.marker([0, 0], {
    icon: L.mapbox.marker.icon({
      "marker-size": "large",

      "marker-color": "blue",
    }),
  }).addTo(map);

  // L.marker is a low-level marker constructor in Leaflet.
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
  /**
   *
   * TODO Create PYTHON SCRIPT to render partials pages and change leaflet cdn script and css link
   */
  map.on("locationfound", async function (e) {
  

 
      let lat = e.latitude;
      let lon = e.longitude;
      var radius = e.accuracy;
      const address = await convertLatLon(lat, lon);
      const submitText = $("form :submit").first().text();
      console.log($("form :submit").first().parent());
      $("form :submit").first().html(`${submitText}`);
      if (address.features[0]) {
        $("input").first().val(address.features[0].place_name);
      }
      await fetchWeather(lat, lon);
    
 
  
    locationControl.stop();

    // map.stopLocate();
  });

  map.on("locationerror", async function (e) {
    locationControl.stop();
    // TODO UPDATE other pages with ip address fallback
    let icon = locationControl._icon;
    const ip = await getIp();

    if (ip.latitude) {
      (async () => {
        let lat = ip.latitude;
        let lon = ip.longitude;
        const address = await convertLatLon(lat, lon);
        const submitText = $("form :submit").first().text();
        console.log($("form :submit").first().parent());
        $("form :submit").first().html(`${submitText}`);
        if (address.features[0]) {
          $("input").first().val(address.features[0].place_name);
        }
        await fetchWeather(lat, lon);
      })().catch((err) => {
        console.error(err);
      });
    }
  });

  const results = document.getElementById("destinationResult");
  const originResult = document.getElementById("originResult");

  // Clear results container when search is cleared.
  // 83.653482  -71.383935

  async function convertAddress(city) {
    const query = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?types=neighborhood,address,place&access_token=pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA`,
      { method: "GET" }
    );
    if (query.status !== 200) {
      alert(query.status);
      return;
    }

    const data = await query.json();
    return data;
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
  async function fetchWeather(lat, lon) {
    const query = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid&appid=6185638fa6045f2f694129e53175d997`,
      { method: "GET" }
    );
    if (query.status !== 200) {
      return;
    }
    map.fitBounds([[lat, lon]], {
      padding: [50, 50],
      maxZoom: 13,
    });
    let addressField = $("#searchInput");
    let latlonField = `<li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2"> <span><strong> Latitude: </strong> <span class="lat">${lat} </span></span></li> <li class="list-group-item border-0 px-1 fs-6 py-0"><span> <strong>
                  Longitude: <span class="lon">${lon}</span> </span></li>`;
    let location = addressField.length > 0 ? addressField[0].value : null;
    const data = await query.json();
    const imgIcon = data.weather[0].icon;
    const currentWeather = data.weather[0].main;
    const temp = data.main.temp;
    $('#latlonForm').find("input:eq(0)").val(lat)
    $('#latlonForm').find("input:eq(1)").val(lon)
    
    const dmsCalculated = DDtoDMS(lat, lon);
    console.log(addressField[0].value);
    const weatherdata = {
      address: location,
      lat: lat,
      lon: lon,
      dms: { lat: dmsCalculated.lat, lon: dmsCalculated.lon },
      weather: { currentWeather: currentWeather, imgIcon: imgIcon, temp: temp },
    };

    const p = popupContent(weatherdata);

    var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);

    marker.setLatLng([lat, lon]).bindPopup(popup).openPopup();

    var alertPlaceholder = document.querySelector(".weather-alert-placeholder");

    function postLog(icon, weather, temperature) {
      let wrapper = document.createElement("div");
      wrapper.innerHTML = ` <div
        class="alert alert-light d-flex align-items-center"
        role="alert"
        >
        <img
          style="max-width: 50px"
          src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
          alt=""
          srcset=""
        />
        ${currentWeather} and ${temp}°F
        </div>`;

      alertPlaceholder.append(wrapper);
    }

    if (alertPlaceholder.childElementCount == 0) {
      postLog(` <img
    style="max-width: 50px"
    src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
    alt=""
    srcset=""
    />
    ${currentWeather} and ${temp}°F`);
    } else if (alertPlaceholder.childElementCount == 1) {
      postLog(` <img
    style="max-width: 50px"
    src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
    alt=""
    srcset=""
    />
    ${currentWeather} and ${temp}°F`);
    } else if (alertPlaceholder.childElementCount == 2) {
      $("#liveAlertPlaceholder").empty();
      setTimeout(() => {
        postLog(` <img
    style="max-width: 50px"
    src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
    alt=""
    srcset=""
    />
    ${currentWeather} and ${temp}°F`);
      }, 200);
    }

    if ($("#output-field-input").hasClass("is-invalid")) {
      $("#output-field-input").removeClass("is-invalid");
    }
  }

  $("#findWeatherForm").on("submit", async function (e) {
    e.preventDefault();
    let inputs = e.currentTarget.elements;

    const result = await convertAddress($(this).find("input:eq(0)").val());

    //
    if (result.features[0]) {
      if ($(".alert-warning").hasClass("visible")) {
        $(".alert-warning").removeClass("visible").addClass("invisible");
      }
      let coords = result.features[0].center;

      let lat = coords[1];
      let lon = coords[0];

      await fetchWeather(lat, lon);
    } else {
      $(".alert-warning").removeClass("invisible").addClass("visible");
    }

    /*
    for (i = 0; i < inputs.length; i++) {
      if (inputs[i].nodeName === "INPUT" && inputs[i].type === "search") {
        // Update text input
        const result = await convertAddress(inputs[i].value);
        if (result.features[0]) {
          let coords = result.features[0].center;

          let lat = coords[1];
          let lon = coords[0];

          CoordsApp.state.origin = coords;

          await fetchWeather(lat, lon);
        } else if (!result.features[0]) {
          alert("no address found");
        }
      }
    } */
  });

  async function convertLatLon(lat, lon) {
    const query = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?types=neighborhood,address,place&access_token=pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA`,
      { method: "GET" }
    );
    if (query.status !== 200) {
      return;
    }

    const data = await query.json();
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
  $("#findWeatherAddressForm").on("submit", async function (e) {
    e.preventDefault();
    const submitText = $("form :submit").first().text();
    console.log($("form :submit").first().parent());
    $(
      "form :submit"
    ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  ${submitText}`);
    const query = encodeURI(e.currentTarget[0].value);
    const latLon = await convertAddress(query);

    let lat = latLon.features[0].center[1];
    let lon = latLon.features[0].center[0];
    $("#LatitudeInput").val(lat);
    $("#LongitudeInput").val(lon);
    map.fitBounds([[lat, lon]], {
      padding: [50, 50],
      maxZoom: 13,
    });
    $("form :submit").first().html(submitText);
    const weather = await latLonWeather(lat, lon);
    const imgIcon = weather.weather[0].icon;
    const currentWeather = weather.weather[0].main;
    const temp = weather.main.temp;

    var popup = L.popup({ autoPan: true, keepInView: true })
      .setContent(`<div class="row" >
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${currentWeather}</h5>
          <p class="card-text">

            <span>   <img style="max-width: 50px" src="http://openweathermap.org/img/wn/${imgIcon}@2x.png" class="img-fluid rounded-start" alt="..."></span>

            <span>
              ${temp}°F </span>

          </p>

        </div>
      </div>
    </div>
  </div>`);

    marker.setLatLng([lat, lon]).bindPopup(popup).openPopup();

    var alertPlaceholder = document.querySelector(".weather-alert-placeholder");

    function postLog(icon, weather, temperature) {
      let wrapper = document.createElement("div");
      wrapper.innerHTML = ` <div
        class="alert alert-light d-flex align-items-center"
        role="alert"
        >
        <img
          style="max-width: 50px"
          src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
          alt=""
          srcset=""
        />
        ${currentWeather} and ${temp}°F
        </div>`;

      alertPlaceholder.append(wrapper);
    }

    if (alertPlaceholder.childElementCount == 0) {
      postLog(` <img
style="max-width: 50px"
src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
alt=""
srcset=""
/>
${currentWeather} and ${temp}°F`);
    } else if (alertPlaceholder.childElementCount == 1) {
      postLog(` <img
style="max-width: 50px"
src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
alt=""
srcset=""
/>
${currentWeather} and ${temp}°F`);
    } else if (alertPlaceholder.childElementCount == 2) {
      $("#liveAlertPlaceholder").empty();
      setTimeout(() => {
        postLog(` <img
  style="max-width: 50px"
  src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
  alt=""
  srcset=""
/>
${currentWeather} and ${temp}°F`);
      }, 200);
    }
  });

  $("#latlonForm").on("submit", async function (e) {
    e.preventDefault();
    let lat = e.currentTarget[0].value;
    let lon = e.currentTarget[1].value;
    const coords = await convertLatLon(lat, lon);
    await fetchWeather(lat, lon);

    if (coords.features.length == 0) {
      $(".target-address").val("");
    } else if (coords.features.length > 0) {
      $(".target-address").val(coords.features[0].place_name);
    }


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

 
        var bookmarkModal = new Modal(document.getElementById("bookmarkModal"), {
    keyboard: false
  });
  var bookmarkToggle = document.getElementById( "bookmarkModal" );
  
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
