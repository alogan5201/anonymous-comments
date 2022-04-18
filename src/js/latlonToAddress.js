/* jshint esversion: 8 */
import {popupContent,  getLatLon , getAddress, getElevation} from 'utils/geocoder'
import { Dropdown } from 'bootstrap/dist/js/bootstrap.esm.min.js'
import 'utils/commentscript.js'

var dropdownElementList = [].slice.call(
  document.querySelectorAll('.dropdown-toggle')
)
const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new Dropdown(dropdownToggleEl)
})

function test (e) {
  e.preventDefault()
}
window.addEventListener('DOMContentLoaded', () => {
  let scrollPos = 0
  const mainNav = document.getElementById('mainNav')
  const headerHeight = mainNav.clientHeight
})

$(document).ready(function () {
  function DDtoDMS (lat, lon) {


    let latitude = Math.abs(lat)
    let longitude = Math.abs(lon)
    let dLat = Math.floor(latitude)
    let mLat = Math.floor((latitude - dLat) * 60)

   let sLat = Math.round((latitude - dLat - mLat / 60) * 1e3 * 3600) / 1e3
   let dLon = Math.floor(longitude)
  let  mLon = Math.floor((longitude - dLon) * 60)
  let  sLon = Math.floor((longitude - dLon - mLon / 60) * 1e3 * 3600) / 1e3
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
      iconLoading: 'spinner-border spinner-border-sm map-spinner',
      remainActive: false,
      icon: 'my-geo-icon',
      locateOptions: {
        enableHighAccuracy: true
      }
    })
    .addTo(map)
  async function findAddress (lat, lon) {
    const d = await getAddress(lat, lon)
    const data = d.data
    return data
  }
  map.on('locationfound', async function (e) {
    let icon = locationControl._icon
    $(icon).css('background-color', 'hsl(217deg 93% 60%)')
    let lat = e.latitude
    let lon = e.longitude
    var radius = e.accuracy
    const submitText =  $('form :submit').first().text()
    console.log(  $('form :submit').first().parent())
    $('form :submit').first().html(`${submitText}`)
    localStorage.setItem('userLatLon', `${lat}, ${lon}`)

    locationControl.stop()
    const result = await findAddress(lat, lon)

    const address = result.features[0].place_name
    $('#latInputField').val(lat)
    $('#lonInputField').val(lon)
    $('#addressInput').val(address)
    map.fitBounds([[lat, lon]], {
      padding: [100, 100]
    })

    const dmsCalculated = DDtoDMS(lat, lon)
    marker
      .setLatLng([lat, lon])
      .bindPopup(
        `
        <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${address}</h5>
              <p class="card-text">



              <span><strong> Latitude: </strong> <span class="lat">${lat} </span></span> <span> <strong>
              Longitude: <span class="lon">${lon}</span></strong> </span>
              <br>
              <div class= "mt-1">
              ${dmsCalculated.lat} ${dmsCalculated.lon}
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


      `
      )
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
    const elvevationResponse = await getElevation(lat, lon)
    const data = elvevationResponse.data

    const allFeatures = data.features
    // For each returned feature, add elevation data to the elevations array
    const elevations = allFeatures.map(feature => feature.properties.ele)
    // In the elevations array, find the largest value
    const highestElevation = Math.max(...elevations)
    $('.altitude').html(`<div> ${highestElevation} meters </div>`)
  }
  $(document).on('click', '#getAltitude', function (e) {
    e.preventDefault()
    let lat = $('.lat').html()
    let lon = $('.lon').html()
    getElevationData(lon, lat)
  })

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

  $('#latlonForm').on('submit', async function (e) {
    e.preventDefault()
 let icon = locationControl._icon
    $(icon).css('background-color', 'black')
    console.log(icon)
    let latInput = document.getElementById('latInputField')
    let lonInput = document.getElementById('lonInputField')
    const lat = latInput.value
    const lon = lonInput.value

    const parsedLat = parseFloat(lat)
    const parsedLon = parseFloat(lon)

    const result = await findAddress(lat, lon)
    const dmsCalculated = DDtoDMS(lat, lon)

    let address =
      result.features.length > 0 ? result.features[0].place_name : ''
    $('#addressInput').val(address)

    const alertMessage = `
    <div class="alert alert-warning d-flex align-items-center" role="alert">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
    <div>
    No Address Found
    </div>
    </div>

    `
    let alertHtml = result.features.length > 0 ? '' : alertMessage
    $('.alerts').html(alertHtml)
    map.fitBounds([[lat, lon]], {
      padding: [100, 100]
    })

    marker
      .setLatLng([lat, lon])
      .bindPopup(
        `
          <div class="row">
          <div class="col">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${address}</h5>
                <p class="card-text">



                <span><strong> Latitude: </strong> <span class="lat">${lat} </span></span> <span> <strong>
                Longitude: <span class="lon">${lon}</span></strong> </span>
                <br>
                <div class= "mt-1">
                ${dmsCalculated.lat} ${dmsCalculated.lon}
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


        `
      )
      .openPopup()
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


})
