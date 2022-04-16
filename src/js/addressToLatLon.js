/* jshint esversion: 8 */
///Users/andrewlogan/Desktop/geo-front-end/src/js/utils/commentscript.js
import 'utils/commentscript'
import { getLatLon , getAddress, getElevation} from 'utils/geocoder'
import {
  comment,
  commentReply,
  extractReplies,
  replyForm
} from 'utils/comments'
import { Modal } from 'bootstrap/dist/js/bootstrap.esm.min.js'
import dompurify from 'dompurify'
import { httpsCallable, getFunctions } from 'firebase/functions'
import { getAuth } from 'firebase/auth'
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  push,
  query,
  orderByValue,
  increment,
  orderByChild
} from 'firebase/database'
async function getAddressData (){
let latlon = await getAddress('33.0393', '-85.0313')

console.log(latlon.data)

}

// commentReply( name, id, date, message)
// comment (id, name, date, message, likes, dislikes)
let filterCommentSuccess = new Modal(
  document.getElementById('filterCommentSuccess'),
  {
    keyboard: false
  }
)
let filterCommentFail = new Modal(
  document.getElementById('filterCommentFail'),
  {
    keyboard: false
  }
)
Date.prototype.toShortFormat = function () {
  let monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  let day = this.getDate()

  let monthIndex = this.getMonth()
  let monthName = monthNames[monthIndex]

  let year = this.getFullYear()

  return `${monthName} ${year}`
}

let today = new Date()
const prettyDate = today.toShortFormat()

const functions = getFunctions()
const db = getDatabase()
const auth = getAuth()
const path = window.location.pathname



$(function () {
  const commentRef = ref(db, `messages${path}`)


  /**
   *---------------------------------------------------------------------
   * !! MAP SCRIPT START
   * -------------------------------------------------------------------
   */
  async function convertLatLon (lat, lon) {

const d = await getAddress(lat, lon)
    const data = d.data
    console.log(data)
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

  async function convertAddress (city) {

    const data  = await getLatLon(city)
    return data.data
  }
  const outputInputField = document.getElementById('output-field-input')
  const latInputField = document.getElementById('latInputField')
  const lonInputField = document.getElementById('lonInputField')

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
    let result = { lat: latResult, lon: lonResult }
    return result
  }

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

  const finishedLoading = () => {
    setTimeout(function () {
      // then, after a half-second, add the class 'hide', which hides
      // it completely and ensures that the user can interact with the
    }, 500)
  }

  L.mapbox.accessToken =
    'pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA'
  const map = L.mapbox.map('map').setView([37.9, -77], 6)

  L.mapbox
    .styleLayer('mapbox://styles/mapbox/streets-v11')
    .addTo(map) // add your tiles to the map
    .on('load', finishedLoading)

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
      locateOptions: {
        enableHighAccuracy: true
}
    })
    .addTo(map)
$('.leaflet-bar-part.leaflet-bar-part-single').on('click', function () {
  const submit = $('form :submit').first()
  const submitText =  $('form :submit').first().text()
console.log(  $('form :submit').first().parent())
$('form :submit').first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
${submitText}`)
});
  map.on('locationfound', async function (e) {
    let lat = e.latitude
    let lon = e.longitude
    var radius = e.accuracy
    const submitText =  $('form :submit').first().text()
    console.log(  $('form :submit').first().parent())
    $('form :submit').first().html(`${submitText}`)
    localStorage.setItem('userLatLon', `${lat}, ${lon}`)

    const address = await convertLatLon(lat, lon)
    setTimeout(() => {
      if (address.features.length > 0) {
        $('form')
          .first()
          .find('input:eq(0)')
          .val(address.features[0].place_name)

        $('#latlonForm')
          .find('input:eq(0)')
          .val(lat)
        $('#latlonForm')
          .find('input:eq(1)')
          .val(lon)
      }

      map.fitBounds([[lat, lon]], { padding: [50, 50] })

      const dmsCalculated = DDtoDMS(lat, lon)

      var popup = L.popup({ autoPan: true, keepInView: true }).setContent(`
            <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${address.features[0].place_name}</h5>
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


          `)

      marker
        .setLatLng([lat, lon])
        .bindPopup(popup)
        .openPopup()
    }, 500)
    locationControl.stop()

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

    // Display the longitude and latitude values

    // Get all the returned features
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

  $('#getTravelForm').on('submit', async function (e) {
    e.preventDefault()
    //
    const value = $(this)
      .find('input:eq(0)')
      .val()
    const fetchResponse = await convertAddress(value)

    setTimeout(() => {
      if (fetchResponse.features.length > 0) {
        let lat = fetchResponse.features[0].geometry.coordinates[1]
        let lon = fetchResponse.features[0].geometry.coordinates[0]

        $('#latlonForm')
          .find('input:eq(0)')
          .val(lat)
        $('#latlonForm')
          .find('input:eq(1)')
          .val(lon)

        const dmsCalculated = DDtoDMS(lat, lon)

        map.fitBounds([[lat, lon]], { padding: [50, 50] })

        var popup = L.popup({ autoPan: true, keepInView: true }).setContent(`
    <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${value}</h5>
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


  `)

        marker
          .setLatLng([lat, lon])
          .bindPopup(popup)
          .openPopup()
      }
    }, 200)
  })

  const title = $('title').html()

  const pageTitle = title.slice(11)

  let bookmarkControl = new L.Control.Bookmarks({
    name: pageTitle
  }).addTo(map)

  $('#comment-form').on('submit', function (e) {
    e.preventDefault()

    let name = e.currentTarget[0].value
    let message = e.currentTarget[1].value

    $('#comment-btn').disabled = true
  })
})
