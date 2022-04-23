import { httpsCallable, getFunctions } from "firebase/functions";
import { v4 as uuidv4 } from "uuid";
import { Toast } from "bootstrap/dist/js/bootstrap.esm.min.js";
Date.prototype.toShortFormat = function () {
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let day = this.getDate();

  let monthIndex = this.getMonth();
  let monthName = monthNames[monthIndex];

  let year = this.getFullYear();

  return `${monthName} ${year}`;
};

let today = new Date();
const prettyDate = today.toShortFormat();
export function generateUID() {
  const uid = uuidv4();
  return uid;
}
const functions = getFunctions();
export function clearForm(form) {
  var inputs = form.elements;

  let i;
  for (i = 0; i < inputs.length; i++) {
    if (inputs[i].nodeName === "INPUT") {
      // Update text input
      inputs[i].value = "";
    }
  }
}
export function altitudeLoading() {
  let data = ` <div class="  altitude mx-auto">
  <button class="btn btn-outline-primary border-0 text-center my-auto" type="button" disabled="">
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
</button>
</div>
<div class=" border ms-auto">
  <button type="button" class="btn btn-outline-primary  btn-sm text-right   bookmark-btn" data-bs-toggle="button" autocomplete="off">Bookmark <i class="far fa-bookmark"></i></button>
</div>`;
  return data;
}

export function popupContent(input) {
  const uid = generateUID();
  function createElement(field, className) {
    let output = `<li class="list-group-item border-0 pt-2 px-1 border-bottom location-name ${className}"> ${field}</li>`;
    return output;
  }
  let altitude = input.altitude ? input.altitude : null;
  let weatherData = input.weather ? input.weather : null;
  let address = input.address ? input.address : null;
  let name = input.name ? input.name : null;

  let storedData = {
    name: name,
    address: address,
    lat: input.lat,
    lon: input.lon,
    dms: { lat: input.dms.lat, lon: input.dms.lon },
    weather: weatherData,
    path: window.location.pathname,
    uid: uid,
    date: prettyDate,
    altitude: altitude,
  };

  let nameElm = input.name
    ? createElement(
        input.name.charAt(0).toUpperCase() + input.name.slice(1),
        "bookmark-name fs-6"
      )
    : "";
  localStorage.setItem("location-data", JSON.stringify(storedData));
  if (input.origin || input.destination) {
    saveOriginDestination(input);
  }
  let addressElm = input.address
    ? createElement(input.address, "address fs-6")
    : "";
  let distance = input.distance
    ? createElement(input.distance, "distance fs-6")
    : "";
  let origin = input.origin ? "origin" : "";
  let originTitle = input.origin
    ? createElement("Origin", "origin-title fs-6")
    : "";
  let destination = input.destination ? "destination" : "";
  let destinationTitle = input.destination
    ? createElement("Destination", "destination-title fs-6")
    : "";
  let weather = input.weather
    ? `    <li class="list-group-item border-0 px-1 fs-6 py-0">
    <div class="hstack gap-3">
<div class = "weather" > ${input.weather.currentWeather}</div>
<div class=""><span> <img style="max-width: 50px" src="http://openweathermap.org/img/wn/${input.weather.imgIcon}@2x.png" class="img-fluid rounded-start" alt="..."></span></div>
<div class="temp">${input.weather.temp}°F</div>
</div></li>`
    : "";

  let bookmarked = input.name
    ? `<button type="button" class="badge bg-primary border border-primary text-white btn-sm text-right   ${origin} ${destination}  bookmark-btn" data-bs-toggle="button" autocomplete="off" disabled>Bookmark <i class="fas fa-bookmark"></i></button>`
    : `<button type="button" class="${origin} ${destination} badge bg-transparent border border-primary text-primary btn-sm text-right   bookmark-btn" data-bs-toggle="button" autocomplete="off">Bookmark <i class="far fa-bookmark"></i></button>`;
  let altitudeElm = altitude
    ? `<strong class="${origin}${destination}">${altitude}</strong>`
    : `<button class="badge bg-primary border-white  getAltitude ${origin}${destination}  getAltitude" id="getAltitude" type="button" >
Get Altitude
</button>`;

  const data = `  <div id = "popupContent" class="row popupContent position-relative">
  <div class="col p-0 popup-content">

    <div class="card-body px-3 pt-2 pb-1">
      <ul class="list-group border-0">
      ${destinationTitle} ${originTitle} ${nameElm} ${weather} ${addressElm}
        <li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2">  Latitude: <span
              class="lat">${input.lat} </span></li>
        <li class="list-group-item border-0 px-1 fs-6 py-0">
         Longitude:
               <span class="lon">${input.lon}</span></li>
        <li class="list-group-item border-0 px-1 fs-6 pt-0 pb-1 dms"> ${input.dms.lat} ${input.dms.lon}</li>
        ${distance}
        <li class="list-group-item border-0 px-1 pt-1 fs-6 py-0 pb-1  border-top">
          <div class="hstack">
            <div class="  altitude me-auto">
        ${altitudeElm}
            </div>
            <div class=" border ms-auto">
             ${bookmarked}
            </div>
        </li>
      </ul>
    </div>

  </div>

</div> `;
  return data;
}
let toast = `


<div class="col p-0 popup-bookmark" style="padding-top: 2rem;">

<div class="card-body ps-4 pe-4 pt-4 pb-3">
  <ul class="list-group border-0" style="justify-content: end;">
<li class=" invisible list-group-item border-0 px-1 pt-1 fs-6 py-0 pb-1  border-top" style="padding-right: 0 !important;">
      <div class="hstack">

        <div class=" border ms-auto">
          <button type="button" class="badge bg-transparent border border-secondary text-secondary btn-sm text-right   bookmark-btn" data-bs-toggle="button" autocomplete="off">Cancel</button>
        </div>
    </div></li>
    <form class="bookmark-form" role="form">

    <div class="input-group ms-auto " style="margin-left: auto !important;">
    <input type="text" class="form-control bookmark-input" placeholder="Boomark Name" aria-label="Recipient's
      username" aria-describedby="add-bookmark-btn" required>
    <button class="btn btn-outline-secondary" type="submit" id="add-bookmark-btn">+</button>
  </div>
    </form>


    <li class=" invisible list-group-item border-0 px-1 pt-1 fs-6 py-0 pb-1  border-top" style="padding-right: 0 !important;">
      <div class="hstack">

        <div class=" border ms-auto">
          <button type="button" class="badge bg-transparent border border-secondary text-secondary btn-sm text-right   bookmark-btn" data-bs-toggle="button" autocomplete="off">Cancel</button>
        </div>
    </div></li>
  </ul>
</div>
</div>


`;
function saveOriginDestination(input) {
  const uid = generateUID();
  const address = input.address ? input.address : null;
  const name = input.name ? input.name : null;
  const altitude = input.altitude ? input.altitude : null;

  if (input.origin) {
    let originData = {
      address: address,
      name: name,
      lat: input.lat,
      lon: input.lon,
      dms: { lat: input.dms.lat, lon: input.dms.lon },
      origin: true,
      uid: uid,
      date: prettyDate,
      path: window.location.pathname,
      altitude: altitude,
    };
    localStorage.setItem("origin-data", JSON.stringify(originData));
  } else if (input.destination) {
    let destinationData = {
      address: address,
      name: name,
      lat: input.lat,
      lon: input.lon,
      dms: { lat: input.dms.lat, lon: input.dms.lon },
      destination: true,
      uid: uid,
      date: prettyDate,
      path: window.location.pathname,
      altitude: altitude,
    };
    localStorage.setItem("destination-data", JSON.stringify(destinationData));
  }
}

export function addBookmark(entryKey) {
  let allEntries = "bookmarks";

  // Parse any JSON previously stored in allEntries
  var existingEntries = JSON.parse(localStorage.getItem(allEntries));
  if (existingEntries == null) existingEntries = [];
  const entry = JSON.parse(localStorage.getItem(entryKey));
  entry.bookmarked = true;
  // Save allEntries back to local storage
  existingEntries.push(entry);
  localStorage.setItem(allEntries, JSON.stringify(existingEntries));
}
export async function getLatLon(city) {
  const getLatLonData = httpsCallable(functions, "getLatLon");
  return getLatLonData({
    city: city,
  })
    .then(function (result) {
      let data = JSON.stringify(result);
      return result;
    })
    .catch(function (error) {
      // Getting the Error details.
      let code = error.code;
      let message = error.message;
      let details = error.details;
      console.error(
        "There was an error when calling the Cloud Function",
        error
      );
      window.alert(
        "There was an error when calling the Cloud Function:\n\nError Code: " +
          code +
          "\nError Message:" +
          message +
          "\nError Details:" +
          details
      );
    });
}

export async function getAddress(lat, lon) {
  const getLatLonData = httpsCallable(functions, "getAddress");
  return getLatLonData({
    lat: lat,
    lon: lon,
  })
    .then(function (result) {
      return result;
    })
    .catch(function (error) {
      // Getting the Error details.
      let code = error.code;
      let message = error.message;
      let details = error.details;
      console.error(
        "There was an error when calling the Cloud Function",
        error
      );
      window.alert(
        "There was an error when calling the Cloud Function:\n\nError Code: " +
          code +
          "\nError Message:" +
          message +
          "\nError Details:" +
          details
      );
    });
}

async function getElevation(lat, lon) {
  const getElevationData = httpsCallable(functions, "getElevation");
  return getElevationData({
    lat: lat,
    lon: lon,
  })
    .then(function (result) {
      return result;
    })
    .catch(function (error) {
      // Getting the Error details.
      let code = error.code;
      let message = error.message;
      let details = error.details;
      console.error(
        "There was an error when calling the Cloud Function",
        error
      );
      window.alert(
        "There was an error when calling the Cloud Function:\n\nError Code: " +
          code +
          "\nError Message:" +
          message +
          "\nError Details:" +
          details
      );
    });
}

async function getAltitude(lon, lat) {
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
    $(".altitude").removeClass("mx-auto").addClass("me-auto");
    $(".altitude").html(`<strong>${highestElevation} meters</strong>  `);
  }, 500);
}

export function toggleBookmark(item, marker) {
  $(item).prop("disabled", true);
  $("#add-bookmark-btn").prop("disabled", true);
  $(item)
    .removeClass("bg-transparent text-primary")
    .addClass("bg-primary text-white");
  $(item).children().last().removeClass("far").addClass("fas");
  $(item).text("Bookmarked");
  let locationData = JSON.parse(localStorage.getItem("location-data"));

  let newPopupContent = $(item).parents("div.popupContent").parent().html();

  //marker.setPopupContent(newPopupContent);
  $(item).parents("div.popupContent").html(toast);
}

export async function toggleAltitude(item, marker) {
  let width = $(item).width();
  let hstack = $(item).parent().parent();

  $(hstack).children().first().removeClass("me-auto").addClass("mx-auto");
  $(hstack).children().first().html(`
   <button class="btn btn-outline-primary border-0 text-center mx-auto" type="button" disabled style = "width:${width}px !important">
   <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
 </button>
 `);

  let coords = marker.getLatLng();

  const elvevationResponse = await getElevation(coords.lat, coords.lng);
  const data = elvevationResponse.data;

  // Display the longitude and latitude values

  // Get all the returned features
  const allFeatures = data.features;
  // For each returned feature, add elevation data to the elevations array
  const elevations = allFeatures.map((feature) => feature.properties.ele);
  // In the elevations array, find the largest value
  const highestElevation = Math.max(...elevations);

  setTimeout(() => {
    $(".altitude").removeClass("mx-auto").addClass("me-auto");
    $(".altitude").html(`<strong>${highestElevation} meters</strong>  `);
    let locationData = JSON.parse(localStorage.getItem("bookmarks"));
    let len = locationData.length;
    let last = locationData[len - 1];
    last.altitude = `${highestElevation} meters`;
    console.log(locationData);
    localStorage.setItem("bookmarks", JSON.stringify(locationData));
    let newPopupContent = $(item).parents("div.popupContent").parent().html();
    marker.setPopupContent(newPopupContent);
  }, 500);
}

export async function getMatrix(first, second) {
  const getMatrixData = httpsCallable(functions, "getMatrix");
  return getMatrixData({
    first: first,
    second: second,
  })
    .then(function (result) {
      return result;
    })
    .catch(function (error) {
      // Getting the Error details.
      let code = error.code;
      let message = error.message;
      let details = error.details;
      console.error(
        "There was an error when calling the Cloud Function",
        error
      );
      window.alert(
        "There was an error when calling the Cloud Function:\n\nError Code: " +
          code +
          "\nError Message:" +
          message +
          "\nError Details:" +
          details
      );
    });
}

export function getGeojson(first, second) {
  const blank = { lat: 0, lon: 0, title: "" };
  const destination = second || blank;

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [first.lon, first.lat],
        },
        properties: {
          title: "Origin",
          description: first.title,
          "marker-color": "#35A2D1",
          "marker-size": "large",
          "marker-symbol": "1",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [destination.lon, destination.lat],
        },
        properties: {
          title: "Destination",
          description: destination.title,
          "marker-color": "#fc4353",
          "marker-size": "large",
          "marker-symbol": "2",
        },
      },
    ],
  };

  return geojson;
}

/*

, toggleBookmark,
  toggleAltitude
} from "utils/geocoder";





 */
export default {
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
};
