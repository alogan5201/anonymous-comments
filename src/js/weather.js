/* jshint esversion: 8 */
import "./firebase"
import 'utils/commentscript.js'
let geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      },
      properties: {
        currentWeather: '',
        temp: '',
        image: '',
        'marker-color': '#35A2D1',
        'marker-size': 'large'
      }
    }
  ]
}

function inputFocus (x) {
  if ($('#secondOutput').hasClass('second')) {
    $('#secondOutput')
      .removeClass('second')
      .addClass('fadeOut')
    $('#firstOutput')
      .removeClass('first')
      .addClass('fadeOut')
    setTimeout(() => {
      $('#secondOutput').addClass('d-none')
      $('#firstOutput').addClass('d-none')
    }, 2000)
  }

  //
}

window.addEventListener('DOMContentLoaded', () => {
  let scrollPos = 0
  const mainNav = document.getElementById('mainNav')
  const headerHeight = mainNav.clientHeight

  function ConvertDMSToDD (degrees, minutes, seconds, direction) {
    var dd = degrees + minutes / 60 + seconds / (60 * 60)

    if (direction == 'S' || direction == 'W') {
      dd = dd * -1
    } // Don't do anything for N or E
    return dd
  }
  const north = document.getElementById('north')
  const south = document.getElementById('south')
  const degreesLat = document.getElementById('degrees-lat')
  const minutesLat = document.getElementById('minutes-lat')
  const secondsLat = document.getElementById('seconds-lat')

  const degreesLon = document.getElementById('degrees-lon')
  const minutesLon = document.getElementById('minutes-lon')
  const secondsLon = document.getElementById('seconds-lon')
  const east = document.getElementById('east')
  const west = document.getElementById('west')
  const outputInputField = document.getElementById('output-field-input')
  const dmsBtn = document.getElementById('dmsBtn')
  const dmsForm = document.getElementById('dms')

  const latlonForm = document.getElementById('latlonForm')

  function DDtoDMS (lat, lon) {
    //

    let latitude = Math.abs(lat)
    let longitude = Math.abs(lon)
    let dLat = Math.floor(latitude)
    let mLat = Math.floor((latitude - dLat) * 60)

    sLat = Math.round((latitude - dLat - mLat / 60) * 1e3 * 3600) / 1e3
    dLon = Math.floor(longitude)
    mLon = Math.floor((longitude - dLon) * 60)
    sLon = Math.floor((longitude - dLon - mLon / 60) * 1e3 * 3600) / 1e3
    let degreesLatitude = dLat
    let minutesLatitude = mLat
    let secondsLatitude = sLat
    let degreesLongitude = dLon
    let minutesLongitude = mLon
    let secondsLongitude = sLon

    let latResult = `${degreesLatitude}° ${minutesLatitude}' ${secondsLatitude}''`

    let lonResult = `${degreesLongitude}° ${minutesLongitude}' ${secondsLongitude}''`
    let result = { lat: latResult, lon: lonResult }
    return result
  }
  function check (elm) {
    document.getElementById(elm).checked = true
  }

  const convertLocationData = document.getElementById('convertLocationData')
  const latInputField = document.getElementById('latInputField')
  const lonInputField = document.getElementById('lonInputField')

  const App = function _App () {
    return `
   <h1>Global State = [${App.state.count}] </h1>
  `
  }

  const handler = {
    set: function (obj, prop, value) {
      obj[prop] = value
    }
  }

  App.state = new Proxy({ count: 0 }, handler)

  // Initial Loading of the App

  const CoordsApp = function _CoordsApp () {
    return `
   <h1>Origin State = [${CoordsApp.state.origin}] </h1> </br>
   <h1>Destination State = [${CoordsApp.state.destination}] </h1>
   <h1>User Location = [${CoordsApp.state.userLocation}] </h1>
   <h1>trackingUser =  ${CoordsApp.state.trackingUser}</h1>
  `
  }

  const myhandler = {
    set: function (obj, prop, value) {
      obj[prop] = value
    }
  }

  CoordsApp.state = new Proxy(
    { origin: [], destination: [], userLocation: [] },
    myhandler
  )
  L.mapbox.accessToken =
    'pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA'

  const finishedLoading = () => {
    setTimeout(function () {
      // then, after a half-second, add the class 'hide', which hides
      // it completely and ensures that the user can interact with the
      // map again.
    }, 500)
  }

  const map = L.mapbox.map('map').setView([37.9, -77], 6)

  L.mapbox
    .styleLayer('mapbox://styles/mapbox/streets-v11')
    .addTo(map) // add your tiles to the map
    .on('load', finishedLoading)

  // var myLayer = L.mapbox.featureLayer().addTo(map);
  const marker = L.marker([0, 0], {
    icon: L.mapbox.marker.icon({
      'marker-size': 'large',

      'marker-color': 'blue'
    })
  }).addTo(map)

  // L.marker is a low-level marker constructor in Leaflet.

  var locationControl = L.control
    .locate({
      circleStyle: { opacity: 0 },
      followCircleStyle: { opacity: 0 },
      drawCircle: false,
        follow: false,
      setView: false,
      iconLoading: 'spinner-border spinner-border-sm map-spinner',
      remainActive: false,
      icon: 'my-geo-icon',
      locateOptions: {
        enableHighAccuracy: true
}
    })
    .addTo(map)
/**
 *
 * TODO Create PYTHON SCRIPT to render partials pages and change leaflet cdn script and css link
 */
  map.on('locationfound', function (e) {
    let lat = e.latitude
    let lon = e.longitude
    var radius = e.accuracy;


    (async () => {
      const address = await convertLatLon(lat, lon)
      const submitText =  $('form :submit').first().text()
      console.log(  $('form :submit').first().parent())
      $('form :submit').first().html(`${submitText}`)
      if (address.features[0]) {
        $('input')
          .first()
          .val(address.features[0].place_name)
      }
      await fetchWeather(lat, lon)
    })().catch(err => {
      console.error(err)
    })
    locationControl.stop()

    // map.stopLocate();
  })

  map.on('locationerror', function () {
    alert('Position could not be found')
  })

  const coordinatesGeocoder = function (query) {
    // Match anything which looks like
    // decimal degrees coordinate pair.
    const matches = query.match(
      /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
    )
    if (!matches) {
      return null
    }

    function coordinateFeature (lng, lat) {
      return {
        center: [lng, lat],
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        place_name: 'Lat: ' + lat + ' Lng: ' + lng,
        place_type: ['coordinate'],
        properties: {},
        type: 'Feature'
      }
    }

    const coord1 = Number(matches[1])
    const coord2 = Number(matches[2])
    const geocodes = []

    if (coord1 < -90 || coord1 > 90) {
      // must be lng, lat
      geocodes.push(coordinateFeature(coord1, coord2))
    }

    if (coord2 < -90 || coord2 > 90) {
      // must be lat, lng
      geocodes.push(coordinateFeature(coord2, coord1))
    }

    if (geocodes.length === 0) {
      // else could be either lng, lat or lat, lng
      geocodes.push(coordinateFeature(coord1, coord2))
      geocodes.push(coordinateFeature(coord2, coord1))
    }

    return geocodes
  }

  const results = document.getElementById('destinationResult')
  const originResult = document.getElementById('originResult')

  // Clear results container when search is cleared.
  // 83.653482  -71.383935

  async function convertAddress (city) {
    const query = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?types=neighborhood,address,place&access_token=pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA`,
      { method: 'GET' }
    )
    if (query.status !== 200) {
      alert(query.status)
      return
    }

    const data = await query.json()
    return data
  }

  async function fetchWeather (lat, lon) {
    const query = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid&appid=6185638fa6045f2f694129e53175d997`,
      { method: 'GET' }
    )
    if (query.status !== 200) {
      return
    }
    map.fitBounds([[lat, lon]], {
      padding: [100, 100]
    })
    const data = await query.json()
    const imgIcon = data.weather[0].icon
    const currentWeather = data.weather[0].main
    const temp = data.main.temp
    $('#latInputField').val(lat)
    $('#lonInputField').val(lon)
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
    </div>`)

    marker
      .setLatLng([lat, lon])
      .bindPopup(popup)
      .openPopup()

    var alertPlaceholder = document.querySelector('.weather-alert-placeholder')

    function postLog (icon, weather, temperature) {
      let wrapper = document.createElement('div')
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
        </div>`

      alertPlaceholder.append(wrapper)
    }

    if (alertPlaceholder.childElementCount == 0) {
      postLog(` <img
    style="max-width: 50px"
    src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
    alt=""
    srcset=""
    />
    ${currentWeather} and ${temp}°F`)
    } else if (alertPlaceholder.childElementCount == 1) {
      postLog(` <img
    style="max-width: 50px"
    src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
    alt=""
    srcset=""
    />
    ${currentWeather} and ${temp}°F`)
    } else if (alertPlaceholder.childElementCount == 2) {
      $('#liveAlertPlaceholder').empty()
      setTimeout(() => {
        postLog(` <img
    style="max-width: 50px"
    src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
    alt=""
    srcset=""
    />
    ${currentWeather} and ${temp}°F`)
      }, 200)
    }

    if ($('#output-field-input').hasClass('is-invalid')) {
      $('#output-field-input').removeClass('is-invalid')
    }
  }

  $('#findWeatherForm').on('submit', async function (e) {
    e.preventDefault()
    let inputs = e.currentTarget.elements

    const result = await convertAddress(
      $(this)
        .find('input:eq(0)')
        .val()
    )

    //
    if (result.features[0]) {
      if ($('.alert-warning').hasClass('visible')) {
        $('.alert-warning')
          .removeClass('visible')
          .addClass('invisible')
      }
      let coords = result.features[0].center

      let lat = coords[1]
      let lon = coords[0]



      await fetchWeather(lat, lon)
    } else {
      $('.alert-warning')
        .removeClass('invisible')
        .addClass('visible')
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
  })

  async function convertLatLon (lat, lon) {
    const query = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?types=neighborhood,address,place&access_token=pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA`,
      { method: 'GET' }
    )
    if (query.status !== 200) {
      return
    }

    const data = await query.json()
    if (data.features.length == 0) {
      $('.alert-warning')
        .removeClass('invisible')
        .addClass('visible')
    } else if (
      data.features.length > 0 &&
      $('.alert-warning').hasClass('visible')
    ) {
      $('.alert-warning')
        .removeClass('visible')
        .addClass('invisible')
    }
    return data
  }
  $('#findWeatherAddressForm').on('submit', async function (e) {
    e.preventDefault()
   const submitText =  $('form :submit').first().text()
  console.log(  $('form :submit').first().parent())
  $('form :submit').first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  ${submitText}`)
    const query = encodeURI(e.currentTarget[0].value)
    const latLon = await convertAddress(query)

    let lat = latLon.features[0].center[1]
    let lon = latLon.features[0].center[0]
    $('#latInputField').val(lat)
    $('#lonInputField').val(lon)
    map.fitBounds([[lat, lon]], {
      padding: [100, 100]
    })
     $('form :submit').first().html(submitText)
    const weather = await latLonWeather(lat, lon)
    const imgIcon = weather.weather[0].icon
    const currentWeather = weather.weather[0].main
    const temp = weather.main.temp

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
  </div>`)

    marker
      .setLatLng([lat, lon])
      .bindPopup(popup)
      .openPopup()

    var alertPlaceholder = document.querySelector('.weather-alert-placeholder')

    function postLog (icon, weather, temperature) {
      let wrapper = document.createElement('div')
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
        </div>`

      alertPlaceholder.append(wrapper)
    }

    if (alertPlaceholder.childElementCount == 0) {
      postLog(` <img
style="max-width: 50px"
src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
alt=""
srcset=""
/>
${currentWeather} and ${temp}°F`)
    } else if (alertPlaceholder.childElementCount == 1) {
      postLog(` <img
style="max-width: 50px"
src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
alt=""
srcset=""
/>
${currentWeather} and ${temp}°F`)
    } else if (alertPlaceholder.childElementCount == 2) {
      $('#liveAlertPlaceholder').empty()
      setTimeout(() => {
        postLog(` <img
  style="max-width: 50px"
  src="http://openweathermap.org/img/wn/${imgIcon}@2x.png"
  alt=""
  srcset=""
/>
${currentWeather} and ${temp}°F`)
      }, 200)
    }
  })

  $('#latlonForm').on('submit', async function (e) {
    e.preventDefault()
    let lat = e.currentTarget[0].value
    let lon = e.currentTarget[1].value
    const coords = await convertLatLon(lat, lon)
    await fetchWeather(lat, lon)

    if (coords.features.length == 0) {
      $('.target-address').val('')
    } else if (coords.features.length > 0) {
      $('.target-address').val(coords.features[0].place_name)
    }
    /*
    setTimeout(() => {
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

      let address =
        coords.features.length > 0 ? coords.features[0].place_name : "";

      $("input")
        .first()
        .val(address);

      let alertHtml = coords.features.length > 0 ? "" : alertMessage;
      $(".alerts").html(alertHtml);

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

      marker
        .setLatLng([lat, lon])
        .bindPopup(popup)
        .openPopup();
      var alertPlaceholder = document.querySelector(
        ".weather-alert-placeholder"
      );

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
    }, 500);
 */
  })
  function addRoute () {
    App.state.count++

    const origin = CoordsApp.state.origin

    const destination = CoordsApp.state.destination

    // map.flyTo([centerLat, centerLon])
    /* map.panInsideBounds([
         [origin[1] , origin[0] ], // southwestern corner of the bounds
         [destination[1] , destination[0], {padding: [50,50]} ] // northeastern corner of the bounds
       ]);
       //

      geojson.features[0].geometry.coordinates = [origin[0], origin[1]];
      geojson.features[1].geometry.coordinates = [destination[0], destination[1]]

  */
    //
    let latD = destination[1]
    let lonD = destination[0]
    let latO = origin[1]
    let lonO = origin[0]
    geojson.features[0].geometry.coordinates = [lonO, latO]
    geojson.features[1].geometry.coordinates = [lonD, latD]
    //
    featureLayer.setGeoJSON(geojson).addTo(map)

    // featureLayer.setGeoJSON(geojson).addTo(map);

    /*
      map.fitBounds(featureLayer.getBounds(), {
  padding: [50,50]

      });
      map.zoomOut()
  */

    let latOrigin = origin[1]
    let lonOrigin = origin[0]
    let latDest = destination[1]
    let lonDest = destination[0]
    //
    map.fitBounds(
      [
        [latOrigin, lonOrigin],
        [latDest, lonDest]
      ],
      { padding: [50, 50] }
    )
  }

  function addNewRoute () {
    const origin = CoordsApp.state.origin

    const destination = CoordsApp.state.destination
    let latD = destination[1]
    let lonD = destination[0]
    let latO = origin[1]
    let lonO = origin[0]
    geojson.features[0].geometry.coordinates = [lonO, latO]
    geojson.features[1].geometry.coordinates = [lonD, latD]

    featureLayer.setGeoJSON(geojson)
    // A simple line from origin to destination.

    // A single point that animates along the route.
    // Coordinates are initially set to origin.

    // Calculate the distance in kilometers between route start/end point.

    // animate(counter);
    featureLayer.setGeoJSON(geojson)

    let latOrigin = origin[1]
    let lonOrigin = origin[0]
    let latDest = destination[1]
    let lonDest = destination[0]
    //
    map.fitBounds(
      [
        [latOrigin, lonOrigin],
        [latDest, lonDest]
      ],
      {
        padding: [50, 50]
      }
    )
  }

  function format (time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600)
    var mins = ~~((time % 3600) / 60)

    let result = {
      hours: hrs,
      minutes: mins
    }
    // Output like "1:01" or "4:03:59" or "123:03:59"
    return result
  }

  function callMatrix (first, second) {
    fetch(
      `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${first};${second}?&access_token=pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQycnlhMDBlb2kydXBwZHoyOGNsY3EifQ.E8N4lPy6tiI0xY3nor3MTg`
    )
      .then(response => response.json())
      .then(json => {
        const durations = json.durations[0]
        const travelTime = durations[1]
        const result = format(travelTime)
        // //

        var alertPlaceholder = document.getElementById('liveAlertPlaceholder')
        var alertTrigger = document.getElementById('liveAlertBtn')

        function postLog (message) {
          var wrapper = document.createElement('div')
          wrapper.innerHTML = `
    <div class="alert alert-secondary d-flex align-items-center justify-content-between" role="alert">
     <div class="alertMessage">
       ${message}
     </div>


   </div>`

          alertPlaceholder.append(wrapper)
        }
        if (alertPlaceholder.childElementCount == 0) {
          postLog(`${result.hours} hour(s) and ${result.minutes} minutes`)
        } else if (alertPlaceholder.childElementCount == 1) {
          postLog(`${result.hours} hour(s) and ${result.minutes} minutes`)
        } else if (alertPlaceholder.childElementCount == 2) {
          $('#liveAlertPlaceholder').empty()
          setTimeout(() => {
            postLog(`${result.hours} hour(s) and ${result.minutes}`)
          }, 200)
        }
      })
  }

  function getUserLocation () {
    if ('geolocation' in navigator) {
      function success (position) {
        let lat = position.coords.latitude

        let lon = position.coords.longitude

        //
        map.flyTo([lat, lon], 11)

        geojson.features[0].geometry.coordinates = [lon, lat]

        //
        featureLayer.setGeoJSON(geojson).addTo(map)
        CoordsApp.state.userLocation = [lon, lat]
        // alert(lat)
      }

      function error (err) {
        console.warn(`ERROR(${err.code}): ${err.message}`)
      }
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }

      navigator.geolocation.getCurrentPosition(success, error, options)
    } else {
      /// /
    }
  }

  // getUserLocation();

  const title = $('title').html()

  const pageTitle = title.slice(11)

  let bookmarkControl = new L.Control.Bookmarks({
    name: pageTitle
  }).addTo(map)


})
