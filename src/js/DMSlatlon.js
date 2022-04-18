/* jshint esversion: 8 */
import 'utils/commentscript.js'
import {  getElevation } from 'utils/geocoder'
function test (e) {
  e.preventDefault()
}
window.addEventListener('DOMContentLoaded', () => {
  let scrollPos = 0
  const mainNav = document.getElementById('mainNav')
  const headerHeight = mainNav.clientHeight
})

$(document).ready(function () {
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
  function ParseDMS (input) {
    var parts = input.split(/[^\d\w]+/)
    var lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3])
    var lng = ConvertDMSToDD(parts[4], parts[5], parts[6], parts[7])
  }

  function ParseDMS (input) {
    var parts = input.split(/[^\d\w]+/)
    var lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3])
    var lng = ConvertDMSToDD(parts[4], parts[5], parts[6], parts[7])
  }

  function ConvertDMSToDD (arr) {
    let degrees = arr[0]
    let minutes = arr[1]
    let seconds = arr[2]
    let direction = arr[3]
    var dd = degrees + minutes / 60 + seconds / (60 * 60)

    if (direction == 'S' || direction == 'W') {
      dd = dd * -1
    } // Don't do anything for N or E
    return dd
  }
  function DDtoDMS (lat, lon) {
    //

    let latitude = Math.abs(lat)
    let longitude = Math.abs(lon)
    let dLat = Math.floor(latitude)
    let mLat = Math.floor((latitude - dLat) * 60)

   let sLat = Math.round((latitude - dLat - mLat / 60) * 1e3 * 3600) / 1e3
    let dLon = Math.floor(longitude)
    let mLon = Math.floor((longitude - dLon) * 60)
    let sLon = Math.floor((longitude - dLon - mLon / 60) * 1e3 * 3600) / 1e3
    let degreesLatitude = dLat
    let minutesLatitude = mLat
    let secondsLatitude = sLat
    let degreesLongitude = dLon
    let minutesLongitude = mLon
    let secondsLongitude = sLon

    let latResult = `${degreesLatitude}° ${minutesLatitude}' ${secondsLatitude}''`

    let lonResult = `${degreesLongitude}° ${minutesLongitude}' ${secondsLongitude}''`
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
    }
    return result
  }
  function check (elm) {
    document.getElementById(elm).checked = true
  }

  const convertLocationData = document.getElementById('convertLocationData')
  const latInputField = document.getElementById('latInputField')
  const lonInputField = document.getElementById('lonInputField')
  const latlonGeocoderBtn = document.getElementById('latlonGeocoderBtn')

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
    { origin: [], destination: [], userLocation: [], trackingUser: false },
    myhandler
  )

  L.mapbox.accessToken =
    'pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA'
  const map = L.mapbox.map('map').setView([37.9, -77], 6)

  L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11').addTo(map) // add your tiles to the map
const popup = L.popup()
     // L.marker is a low-level marker constructor in Leaflet.

  const marker = L.marker([0, 0], {
    icon: L.mapbox.marker.icon({
      'marker-size': 'large',

      'marker-color': 'blue'
    })

  }).addTo(map)
  var locationControl = L.control
    .locate({
      circleStyle: { opacity: 0 },
      followCircleStyle: { opacity: 0 },
      drawCircle: false,
        follow: false,
      setView: false,
      remainActive: false,
      icon: 'my-geo-icon',
      icon: 'my-geo-icon',
      locateOptions: {
        enableHighAccuracy: true
      }
    })
    .addTo(map)
  async function findAddress (lat, lon) {
    const query = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQycnlhMDBlb2kydXBwZHoyOGNsY3EifQ.E8N4lPy6tiI0xY3nor3MTg`,
      { method: 'GET' }
    )
    if (query.status !== 200) {
      return
    }
    const data = await query.json()

    return data
  }
  map.on('locationfound', async function (e) {
    const submitText =  $('form :submit').first().text()
    console.log(  $('form :submit').first().parent())
    $('form :submit').first().html(`${submitText}`)

    let lat = e.latitude
    let lon = e.longitude
    var radius = e.accuracy

    localStorage.setItem('userLatLon', `${lat}, ${lon}`)

    locationControl.stop()
    $('#latInputField').val(lat)
    $('#lonInputField').val(lon)

    north.checked = lat >= 0
    south.check = lat < 0
    east.checked = lon >= 0
    west.checked = lon < 0

    const dmsCalculated = DDtoDMS(lat, lon)
    document.getElementById('degrees-lat').value = dmsCalculated.lat.degrees
    document.getElementById('minutes-lat').value = dmsCalculated.lat.minutes
    document.getElementById('seconds-lat').value = dmsCalculated.lat.seconds
    document.getElementById('degrees-lon').value = dmsCalculated.lon.degrees
    document.getElementById('minutes-lon').value = dmsCalculated.lon.minutes
    document.getElementById('seconds-lon').value = dmsCalculated.lon.seconds

    map.fitBounds([[lat, lon]], {
      padding: [100, 100]
    })
    popup.setContent(`
    <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">

          <p class="card-text">



          <span><strong> Latitude: </strong> <span class="lat">${lat} </span></span> <span> <strong>
          Longitude:</strong> <span class="lon">${lon}</span> </span>
          <br>
          <div class= "mt-1">
          ${dmsCalculated.popupMessage.lat} ${dmsCalculated.popupMessage.lon}
        </div>
          </p>
          <div class=" mt-2 altitude">
          <button class="btn btn-primary btn-sm getAltitude-btn" id="getAltitude" role="button ">
              Get Altitude
          </button>
      </div>
        </div>
      </div>
    </div>
</div>


  `)
    marker
      .setLatLng([lat, lon])
         .on('popupopen', () => {

      }).bindPopup(popup)
      .openPopup()
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

  async function getElevationData (lon, lat) {
    // Construct the API request

      try {
          const elvevationResponse = await getElevation(lat, lon)
      const data = elvevationResponse.data
           const allFeatures = data.features
    // For each returned feature, add elevation data to the elevations array
    const elevations = allFeatures.map(feature => feature.properties.ele)
    // In the elevations array, find the largest value
    const highestElevation = Math.max(...elevations)
    $('.altitude').html(`<div> ${highestElevation} meters </div>`)

  } catch(err) {
    alert(err); // TypeError: failed to fetch
  }


  }


  // Clear results container when search is cleared.

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

  $('#myDmsForm').on('submit', function (e) {
    e.preventDefault()

    var inputs = document.getElementById('myDmsForm').elements
    // Iterate over the form controls

    let latRadio = north.checked ? 'N' : 'S'
    let lonRadio = west.checked ? 'W' : 'E'

    let latField = [
      parseFloat(e.currentTarget[2].value),
      parseFloat(e.currentTarget[3].value),
      parseFloat(e.currentTarget[4].value),
      latRadio
    ]
    let lonField = [
      parseFloat(e.currentTarget[7].value),
      parseFloat(e.currentTarget[8].value),
      parseFloat(e.currentTarget[9].value),
      lonRadio
    ]

    let lat = ConvertDMSToDD(latField)
    let lon = ConvertDMSToDD(lonField)
    // let lon = ConvertDMStoDD(lonField)

    let lonReduced = lon.toFixed(8)
    let latReduced = lat.toFixed(8)


      map.fitBounds([[lat, lon]], {
        padding: [100, 100]
      })
  const popupContent = `    <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">

          <p class="card-text">



          <span><strong> Latitude: </strong> <span class="lat">${lat} </span></span> <span> <strong>
          Longitude:</strong> <span class="lon">${lon}</span> </span>
          <br>
          <div class= "mt-1">
          ${latField[0]}° ${latField[1]}' ${latField[2]}
          ${lonField[0]}° ${lonField[1]}' ${lonField[2]}
        </div>
          </p>
          <div class=" mt-2 altitude">
          <button class="btn btn-primary btn-sm" id="getAltitude" type="button ">
              Get Altitude
          </button>
      </div>
        </div>
      </div>
    </div>
</div>`
    const check = popup.isOpen()
    console.log(check)
    if(check){
      map.closePopup()
       marker.setLatLng([lat, lon]).bindPopup(popupContent).openPopup()
      latlonForm.elements[0].value = latReduced
      latlonForm.elements[1].value = lonReduced
    }

/*
          popup.setPopupContent(`
    <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">

          <p class="card-text">



          <span><strong> Latitude: </strong> <span class="lat">${lat} </span></span> <span> <strong>
          Longitude:</strong> <span class="lon">${lon}</span> </span>
          <br>
          <div class= "mt-1">
          ${latField[0]}° ${latField[1]}' ${latField[2]}
          ${lonField[0]}° ${lonField[1]}' ${lonField[2]}
        </div>
          </p>
          <div class=" mt-2 altitude">
          <button class="btn btn-primary btn-sm" id="getAltitude" type="button ">
              Get Altitude
          </button>
      </div>
        </div>
      </div>
    </div>
</div>


              .on('popupopen', () => {
        document.getElementById('getAltitude').addEventListener('click',  function(e){
          e.preventDefault()
          $('#getAltitude')
            .html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
Get Altitude`)
 getElevationData(lon, lat)



        })
      })

  `)*/


  })

  const title = $('title').html()

  const pageTitle = title.slice(11)
  let bookmarkControl = new L.Control.Bookmarks({
    name: pageTitle
  }).addTo(map)

  $('.leaflet-bar-part.leaflet-bar-part-single').on('click', function () {
    const submit = $('form :submit').first()
    const submitText =  $('form :submit').first().text()
  console.log(  $('form :submit').first().parent())
  $('form :submit').first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  ${submitText}`)
  });
$('#map').on('click', '.trigger', function() {
    alert('Hello from Toronto!');
});

  $('#map').on('click', '#getAltitude', function (e) {
  e.preventDefault()
   $('#getAltitude')
            .html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
Get Altitude`)
const markerLocation = marker.getLatLng()
console.log(markerLocation)
 getElevationData(markerLocation.lng, markerLocation.lat)
});
})
