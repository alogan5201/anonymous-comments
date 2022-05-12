/* jshint esversion: 8 */
import HaversineGeolocation from "haversine-geolocation";

import "./firebase";
import {
  addBookmark,
  getAddress,
  getGeojson,
  getLatLon,
  popupContent,
  toggleAltitude,
getMatrix, 
addBookmarkTable
} from "utils/geocoder";

window.addEventListener("DOMContentLoaded", () => {

  if(localStorage.getItem("bookmarks")){

    document.getElementById("bookmarkListButton").style.opacity=1
    addBookmarkTable()
  let bmaploc = localStorage.getItem("bookmarkMapLocation")
  if(bmaploc && bmaploc.length > 0){
    localStorage.setItem("bookmarkMapLocation", "")
  }
  
  }
  const myBookmarkModal = new bootstrap.Modal(document.getElementById('bookmarkListModal'))

const run = (promises) => promises.reduce((p, c) => p.then((rp) => c.then((rc) => [...rp, rc])), Promise.resolve([]));

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

  async function fetchWeather(lat, lon) {
    const query = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid&appid=6185638fa6045f2f694129e53175d997`,
      { method: "GET" }
    );
    if (query.status !== 200) {
      const message = "error"
      return message;
    }
   

    const data = await query.json();
    const imgIcon = data.weather[0].icon;
    const currentWeather = data.weather[0].main;
    const temp = data.main.temp;

  
    const weatherdata = {
      weather: { currentWeather: currentWeather, imgIcon: imgIcon, temp: temp },
    };

  return weatherdata
   
  }
    async function callMatrix(first, second) {
    const data = await getMatrix(first, second);

    const json = data.data;
    const durations = json.durations[0];
    const travelTime = durations[1];
    const result = format(travelTime); // //

   return result
  

 
  }



  var loader = document.getElementById( "loader" );
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
      remainActive: false,
      showPopup: false,
      locateOptions: {
        enableHighAccuracy: true,
      },
    })
    .addTo(map);


  

  



  map.on("locationfound", async function (e) {
    let icon = locationControl._icon;
    let lat = e.latlng.lat;

    let lon = e.latlng.lng;
    map.fitBounds([[lat, lon]], { padding: [50, 50], maxZoom: 13 });
    let obj = { lat: lat, lon: lon };
    localStorage.setItem("userlocation", `${JSON.stringify(obj)}`);

    const d = await getAddress(lat, lon);
    const data = d.data;
    let addressName =
      data.features.length > 0 ? data.features[0].place_name : null;
    if (data.features.length > 0) {
      $("#OriginInput").val(data.features[0].place_name);
    }

    const dmsCalculated = DDtoDMS(lat, lon);

    const allData = {
      address: addressName,
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
      $("#OriginInput").val(data.features[0].place_name);
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
      $("#DestinationInput").focus();
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

/* -------------------------------------------------------------------------- */
/*                    ! MAIN FORM !                               */
/* -------------------------------------------------------------------------- */


$("#getDistanceForm").on("submit", async function (e) {
    e.preventDefault();
let legendContainer = map.getContainer(".leaflet-html-legend")
if(legendContainer){



}


    const submitText = $("form :submit").first().text();
    $(
      "form :submit"
    ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  ${submitText}`);

    const popupCheck1 = marker1.isPopupOpen();
    const popupCheck2 = marker2.isPopupOpen();
    if (popupCheck1 || popupCheck2) {
      let marker = popupCheck1 ? marker1 : marker2;
      marker.closePopup();
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
    let originContext = origin.context;
    let originQuery = result[0].query
    const destination = result[1].features[0];
    let destinationLatLon = result[1].features[0].geometry.coordinates;
    let destinationLat = destinationLatLon[1];
    let destinationLon = destinationLatLon[0];
      let destinationContext = destination.context;
      let destinationQuery = result[1].query
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
      address: origin.place_name,
      lat: originLat,
      lon: originLon,
      dms: { lat: originDMS.lat, lon: originDMS.lon },
      origin: true,
      context: originContext,
      query: originQuery,
    };

    let destinationResults = {
      address: destination.place_name,
      lat: destinationLat,
      lon: destinationLon,
      dms: { lat: destinationDMS.lat, lon: destinationDMS.lon },
      destination: true,
      context: destinationContext,
      query: destinationQuery,
    };

    const markerCoords = marker1.getLatLng();
    const markerContent = marker1.getPopup();

    const originPopup = popupContent(originResults);
    const destinationPopup = popupContent(destinationResults);
 var popup1 = L.popup({ autoPan: true, keepInView: true }).setContent(originPopup)
    const popup2 = L.popup({ autoPan: true, keepInView: true }).setContent(destinationPopup);

    marker1.setLatLng([originLat, originLon]).bindPopup(popup1);

    marker2.setLatLng([destinationLat, destinationLon]).bindPopup(popup2);


    map.fitBounds(
      [
        [originLat, originLon],
        [destinationLat, destinationLon],
      ],
      { padding: [50, 50] }
    );
    $("form :submit").first().html(submitText);
getAllData(originResults, destinationResults, distance)
  });

function formatTravelData(hours, minutes){
let hoursText = hours > 1 ? `${hours} hrs`: hours == 1 ? `${hours} h`: ""
let minutesText = minutes > 1  ? `${minutes} m` : minutes == 1 ? `${minutes} m`: ""
let result = {
hoursText: hoursText,
minutesText: minutesText
}
return result
}
const uppercaseWords = (str) => str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());
function getCity(input){
  for (let index = 0; index < input.context.length; index++) {
  const element = input.context[index];
 
  if(element.id.includes("place")){
 
    return element.text
  }
    
}

 return uppercaseWords(input.query[0]) || null
 
}
async function getAllData(origin, destination, distance){


    

      const query1 = `${origin.lon},${origin.lat}`;
    const query2 = `${destination.lon},${destination.lat}`;
const travel = callMatrix(query1, query2)
const weatherOrigin = fetchWeather(origin.lat, origin.lon)
const weatherDestination = fetchWeather(destination.lat, destination.lon)

let promises = [travel, weatherOrigin, weatherDestination]
run(promises).then((results) => {
/* 
#distance 
  .result-text
#travelTime 
  .result-text
#originWeather
  .result-text
#destinationWeather
  .result-text
  .result-icon
    
*/
let travelFormmatted = formatTravelData(results[0].hours, results[0].minutes)

//document.querySelector("#originWeather .result-text").innerHTML(`${results[1].temp}°F `)
let originName = getCity(origin) || "Origin"
let destinationName = getCity(destination) || "Destination"
  let html = `<div class="map-legend wax-legend">

  <ul class="list-group bg-light w-100 ">
    <li id="distance" class="list-group-item ps-1">Distance: <span class="result-text">${distance} miles</span></li>
    <li id="travelTime" class="list-group-item ps-1">Travel time: <span class="result-text">${travelFormmatted.hoursText} ${travelFormmatted.minutesText}</span></li>
       <li id="originWeather" class="list-group-item ps-1">${originName} weather: <div class="hstack gap-3">
        <div><span class="result-text"> ${results[1].weather.temp}°F </span></div>
        <div><span class="result-icon"><img src="https://openweathermap.org/img/wn/${results[1].weather.imgIcon}@2x.png" alt="twbs" width="25" height="25" class=" flex-shrink-0"></span></div>

      </div>
    </li>
    <li id="destinationWeather" class="list-group-item ps-1">${destinationName} weather: <div class="hstack gap-3">
        <div><span class="result-text"> ${results[2].weather.temp}°F </span></div>
        <div><span class="result-icon"><img src="https://openweathermap.org/img/wn/${results[2].weather.imgIcon}@2x.png" alt="twbs" width="25" height="25" class=" flex-shrink-0"></span></div>

      </div>
    </li>

  </ul>
</div>`
map.legendControl._container.innerHTML = html




   
}).catch(error => console.log(error));
}
  $("#map").on("click", "#getAltitude", function (e) {
    e.preventDefault();

    if ($(this).hasClass("origin")) {
      toggleAltitude(this, marker1);
    } else {
      toggleAltitude(this, marker2);
    }
  });
const myModal = new bootstrap.Modal(document.getElementById('bookmarkModal'))
  
    const bookmarkButton = document.getElementById("bookmarkButton")


function handleButton (t){
 if(t.classList.contains("bookmark-btn")){

myModal.toggle()
}
}

const mapCol = document.querySelector('#mapColumn');
mapCol.addEventListener('click', e => {
  const { target } = e;
  if (target.matches('button')) {
    handleButton(target) // If target is an li, run callback
  }
});

  const bookmarkListButton = document.querySelector('#bookmarkListButton');
  bookmarkListButton.addEventListener('click', e => {
    myBookmarkModal.toggle()
  });


  map.on("popupopen", function (e) {


    var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
    px.y -= e.target._popup._container.clientHeight / 2; // find the height of the popup container, divide by 2, 
    map.panTo(map.unproject(px), { animate: true });
    $(".leaflet-top.leaflet-left").css("opacity", "0");
    // TODO update
  });
  map.on("popupclose", function (e) {


    $(".leaflet-top.leaflet-left").css("opacity", "1");
  });
  var myModalEl = document.getElementById('bookmarkModal')
const bookmarkform = document.getElementById("bookmarkForm")



bookmarkform.addEventListener("submit", function(e) {
e.preventDefault();

var inputs = document.getElementById("bookmarkForm").elements;

  var bookmarkToggle = document.getElementById("bookmarkModal");
// Iterate over the form controls
for (let i = 0; i < inputs.length; i++) {
  if (inputs[i].nodeName === "INPUT" && inputs[i].type === "text") {
    // Update text input
    let input = inputs[i]
    let marker = marker1.isPopupOpen() ? marker1 : marker2;
    let data = marker1.isPopupOpen() ? "origin-data" : "destination-data"
    let locationData = JSON.parse(localStorage.getItem(data));
    locationData.name = input.value;
     let p = popupContent(locationData);
    marker.setPopupContent( p );
    localStorage.setItem( data, JSON.stringify( locationData ) );
   
    addBookmark(data);
    setTimeout(() => {
       input.value = ""

   
      myModal.hide()
      
    }, 100);
  

  }
}
})



  map.legendControl.addLegend(document.getElementById('myLegend').innerHTML);

myModalEl.addEventListener('shown.bs.modal', function (event) {




let x = document.getElementById("bookmark-name")
x.focus()
})

let bookMarkModalElement = document.getElementById("bookmarkListModal")

myModalEl.addEventListener('hide.bs.modal', function (event) {
  setTimeout(() => {
    let bookmarks = localStorage.getItem("bookmarks")
    let bookmarksBtn = document.getElementById("bookmarkListButton")
  
  }, 500);
    
    })
localStorage.getItem("bookmarkMapLocation")

bookMarkModalElement.addEventListener('hide.bs.modal', function (event) {

if(localStorage.getItem("bookmarkMapLocation")){
  let found = JSON.parse(localStorage.getItem("bookmarkMapLocation"))
  const popupCheck1 = marker1.isPopupOpen();
  const popupCheck2 = marker2.isPopupOpen();
  if (popupCheck1 || popupCheck2) {
    let marker = popupCheck1 ? marker1 : marker2;
    marker.closePopup();
    marker.setLatLng([0, 0])
    
  }
  let html = `<div class="map-legend wax-legend">

  <ul class="list-group bg-light w-100 " style="opacity:0">


  </ul>
</div>`
map.legendControl._container.innerHTML = html

let lat = found.lat;
let lon = found.lon;
var elements = document.querySelectorAll('input.form-control');
Array.prototype.forEach.call(elements, function(el, i){
el.value = ""
});
 setTimeout(() => {
  map.fitBounds([[lat, lon]], { padding: [50, 50], maxZoom: 13 });


 }, 500);



localStorage.setItem("bookmarkMapLocation", "")
 setTimeout(() => {
  const p = `  <div id = "popupContent" class="row popupContent position-relative">
<div class="col p-0 popup-content">

  <div class="card-body px-3 pt-2 pb-1">
    <ul class="list-group border-0">
     <li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2"> ${
       found.name
     } </li>
      <li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2"> ${found.address ||
        ""} </li>
      <li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2">  Latitude: <span
            class="lat">${found.lat} </span></li>
      <li class="list-group-item border-0 px-1 fs-6 py-0">
       Longitude:
             <span class="lon">${found.lon}</span></li>
      <li class="list-group-item border-0 px-1 fs-6 pt-0 pb-1 dms"> ${
        found.dms.lat
      } ${found.dms.lon}</li>
      
      <li class="list-group-item border-0 px-1 pt-1 fs-6 py-0 pb-1  border-top">
    

</div>

</div> `;
  var popup = L.popup({ autoPan: true, keepInView: true }).setContent(p);

  marker1.setLatLng([lat, lon]).bindPopup(popup).openPopup();

 }, 1000);
let destination = $("#map")
$( 'html, body' ).animate({
  scrollTop: $('#map' ).offset().top
},'300');

  
}
  
  })


  let bookmarks = localStorage.getItem("bookmarks")
  let bookmarksBtn = document.getElementById("bookmarkListButton")
  if (bookmarks && bookmarksBtn.classList.contains("d-none")) {
    bookmarksBtn.classList.remove("d-none")


  }

  $("#bookmarkListModal").on('click',"a", function (e) {
    e.preventDefault()

   // myBookmarkModal.hide()
  });

 
});

