import { httpsCallable, getFunctions } from "firebase/functions";
import { v4 as uuidv4 } from "uuid";
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


export function popupContent(input) {
  const uid = generateUID()
  function createElement(field, className) {
    let output = `<li class="list-group-item border-0 pt-2 px-1 border-bottom location-name ${className}"> ${field}</li>`;
    return output;
  }
  let weatherData = input.weather ? input.weather : null;
  let nameData = input.name ? input.name : null;

  let storedData = {
    name: nameData,
    lat: input.lat,
    lon: input.lon,
    dmslat: input.dms.lat,
    dmslon: input.dms.lon,
    weather: weatherData,
    path: window.location.pathname,
    uid: uid,
    date: prettyDate,

  };

  localStorage.setItem("location-data", JSON.stringify(storedData));

  if (input.origin || input.destination) {
    saveOriginDestination(input)

  }


  let distance = input.distance ? createElement(input.distance, "distance") : "";
  let origin = input.origin ? "origin" : ""
  let originTitle = input.origin ? createElement("Origin", "origin-title fs-6") : ""
  let destination = input.destination ? "destination" : ""
  let destinationTitle = input.destination ? createElement("Destination", "destination-title fs-6") : ""
  let weather = input.weather
    ? `  ${createElement(
      input.weather.currentWeather,
      "weather"
    )}  <span><img style="max-width: 50px" src="http://openweathermap.org/img/wn/${input.weather.imgIcon
    }@2x.png" class="img-fluid rounded-start" alt="..."></span><span>${input.weather.temp
    }°F </span>`
    : "";
  let name = input.name ? ` ${createElement(input.name, "name fs-6")}` : "";

  let data = `  <div id = "popupContent" class="row popupContent">
  <div class="col p-0">

    <div class="card-body px-3 pt-2 pb-1">
      <ul class="list-group border-0">
      ${destinationTitle} ${originTitle} ${name} ${weather}
        <li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2">  Latitude: <span
              class="lat">${input.lat} </span></li>
        <li class="list-group-item border-0 px-1 fs-6 py-0">
         Longitude:
               <span class="lon">${input.lon}</span></li>
        <li class="list-group-item border-0 px-1 fs-6 py-0 dms"> ${input.dms.lat} ${input.dms.lon}</li>
        ${distance}
        <li class="list-group-item border-0 px-1 fs-6 py-0 pb-1 pt-2 border-top">
          <div class="hstack gap-3">
            <div class="  altitude mx-auto">
              <button class="btn btn-primary btn-sm btn-sm ${origin}${destination}  getAltitude" id="getAltitude" type="button">
                Get Altitude
              </button>
            </div>
            <div class=" border ms-auto">
              <button type="button"  class="btn btn-outline-primary  btn-sm text-right ${origin} ${destination} bookmark-btn"
                data-bs-toggle="button" autocomplete="off">Bookmark <i class="far fa-bookmark"></i></button>
            </div>
        </li>
      </ul>
    </div>

  </div>
</div>`;
  return data;
}
function saveOriginDestination(input) {
  const uid = generateUID()
  if (input.origin) {
    let originData = {
      name: input.name,
      lat: input.lat,
      lon: input.lon,
      dmslat: input.dms.lat,
      dmslon: input.dms.lon,
      origin: true,
      uid: uid,
      date: prettyDate,
      path: window.location.pathname

    }
    localStorage.setItem("origin-data", JSON.stringify(originData));

  }



  else if (input.destination) {

    let destinationData = {
      name: input.name,
      lat: input.lat,
      lon: input.lon,
      dmslat: input.dms.lat,
      dmslon: input.dms.lon,
      destination: true,
      uid: uid,
      date: prettyDate,
      path: window.location.pathname,

    }
    localStorage.setItem("destination-data", JSON.stringify(destinationData));
  }
}

export function addBookmark(entryKey) {
  let allEntries = "bookmarks"


  // Parse any JSON previously stored in allEntries
  var existingEntries = JSON.parse(localStorage.getItem(allEntries));
  if (existingEntries == null) existingEntries = [];
  const entry = JSON.parse(localStorage.getItem(entryKey));

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
export async function getElevation(lat, lon) {
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
export default {
  getLatLon,
  getAddress,
  getElevation,
  getMatrix,
  getGeojson,
  generateUID,
  addBookmark
};
