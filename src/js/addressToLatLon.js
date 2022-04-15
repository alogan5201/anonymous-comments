/* jshint esversion: 8 */
import { initializeApp } from 'firebase/app'

import { comment, commentReply } from 'utils/comments'
import { Modal } from 'bootstrap/dist/js/bootstrap.esm.min.js'
import dompurify from 'dompurify'
import { httpsCallable, getFunctions } from 'firebase/functions'
import { getAuth } from 'firebase/auth'
 import { getDatabase, ref, set, get,  onValue, push, query, orderByValue, increment, orderByChild } from "firebase/database";
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



setTimeout(() => {
  if (auth.currentUser) {
    console.log(auth.currentUser)
  }
}, 1000)






$(function () {
const messageRef= ref(db, `messages${path}`);
/**
 *---------------------------------------------------------------------
 * !! DISPLAY COMMENTS
 * -------------------------------------------------------------------
 */
function displayComments(){
 get(messageRef).then((snapshot) => {
   if (snapshot.exists()) {

     const data = snapshot.val();
   const map = new Map(Object.entries(data));

   for (const [key, value] of map.entries()) {

     let likes = value.likes && value.likes.likes ? value.likes.likes : ''
     let dislikes = value.dislikes && value.dislikes.dislikes ? value.dislikes.dislikes : ''

    const dateinfo = value.date ? value.date : ""
console.log(key, value)
debugger
    let commentsList = commentCard( value.id, value.name, dateinfo, value.message, likes, dislikes)
     $( "#comment-section" ).append(commentsList );
     if(value.replies){
       let ex = extractReplies(value.replies)
       for (let index = 0; index < ex.length; index++) {
       const element = ex[index];
       let recipient = $(`#${element.recipient} .other-comments`)

       let replies = commentReply(element.name, element.id, element.date, element.message)
       $(recipient[0]).append(
`  <div class="col-md-11 p-3 mb-3" >
   <div class="row ">
   <div class="col-lg-12 border-start">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
     <h6 class="fw-bold text-primary mb-1 ">${element.name}</h6>
     <p class="text-muted small m-0">
      ${element.date}
     </p>
     </div>
     <p class="mt-3 mb-0 pb-2">
     ${element.message}
     </p>
   </div>
   </div>
     </div>


`

       )
   }
     }
   }

   } else {
     console.log('no data')
   }
 }).catch((error) => {
   console.error(error);
 });

}


/**
 *---------------------------------------------------------------------
 * !! COMMENT SUBMIT
 * -------------------------------------------------------------------
 */
$('#comment-form').on('submit', function (e) {
  e.preventDefault()

  $('#comment-btn').disabled = true
  const inputs = $('#comment-form :input')
  const children = $(this).children()
  $(
    '#comment-btn'
  ).html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
Verifying..`)

  let name =
    e.currentTarget[0].value.length > 0 ? e.currentTarget[0].value : 'Guest'
  let message = e.currentTarget[1].value
  let cleanMessage = dompurify.sanitize(message)
  let cleanName = dompurify.sanitize(name)

  const addComment = httpsCallable(functions, 'addComment')
  setTimeout(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))

    const uid = userData.uid



    addComment({
      text: cleanMessage,
      name: cleanName,
      uid: userData,
      page: path
    })
      .then(function (result) {
        // Read result of the Cloud Function.
        let sanitizedMessage = result.data.text
        let sanitizedName = result.data.name

        console.log(sanitizedMessage, sanitizedName)
        if (cleanMessage !== sanitizedMessage && cleanName !== sanitizedName) {
          filterCommentFail.toggle()
          $('#comment-btn').disabled = false
          $('#comment-btn').html('Submit')
          for (let index = 0; index < inputs.length; index++) {
            const element = inputs[index]
            element.value = ''
          }
        } else {
          $('#comment-btn').disabled = false
          $('#comment-btn').html('Submit')
          for (let index = 0; index < inputs.length; index++) {
            const element = inputs[index]
            element.value = ''
          }
          let commentComponent = comment(
            uid,
            sanitizedName,
            prettyDate,
            sanitizedMessage,
            '',
            ''
          )
          filterCommentSuccess.toggle()
          $('#comment-section').append(commentComponent)
          $('#comment-btn').disabled = false
        }
      })
      .catch(function (error) {
        // Getting the Error details.
        let code = error.code
        let message = error.message
        let details = error.details
        console.error(
          'There was an error when calling the Cloud Function',
          error
        )
        window.alert(
          'There was an error when calling the Cloud Function:\n\nError Code: ' +
            code +
            '\nError Message:' +
            message +
            '\nError Details:' +
            details
        )
        addCommentButton.disabled = false
      })
  }, 1000)
})
/**
 *---------------------------------------------------------------------
 * !! MAP SCRIPT START
 * -------------------------------------------------------------------
 */
async function convertLatLon (lat, lon) {
  const query = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQycnlhMDBlb2kydXBwZHoyOGNsY3EifQ.E8N4lPy6tiI0xY3nor3MTg`,
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

async function convertAddress (city) {
  const query = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA`,
    { method: 'GET' }
  )
  if (query.status !== 200) {
    alert(query.status)
    return
  }

  const data = await query.json()

  return data
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
      icon: 'fas fa-map-marker-alt', // follow the user's location
      setView: false,
      remainActive: false
    })
    .addTo(map)

  map.on('locationfound', async function (e) {
    let lat = e.latitude
    let lon = e.longitude
    var radius = e.accuracy

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
    // geocoder.query(`${lat}, ${lon}`);

    // map.stopLocate();
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

  async function getElevation (lon, lat) {
    // Construct the API request
    const query = await fetch(
      `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${lon},${lat}.json?layers=contour&limit=50&access_token=pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQycnlhMDBlb2kydXBwZHoyOGNsY3EifQ.E8N4lPy6tiI0xY3nor3MTg`,
      { method: 'GET' }
    )
    if (query.status !== 200) return
    const data = await query.json()
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
    getElevation(lon, lat)
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


});

