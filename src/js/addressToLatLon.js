import {Modal} from 'bootstrap/dist/js/bootstrap.esm.min.js'
import 'utils/commentscript'
import {
  addBookmark,
  generateUID,
  getAddress,
  getLatLon,
  popupContent,
  toggleAltitude,
  toggleBookmark,
  closePopup,
} from 'utils/geocoder'
import './firebase'
import {getIp} from './firebase'

const uid = generateUID()

// commentReply( name, id, date, message)
// comment (id, name, date, message, likes, dislikes)
let filterCommentSuccess = new Modal(document.getElementById('filterCommentSuccess'), {
  keyboard: false,
})
let filterCommentFail = new Modal(document.getElementById('filterCommentFail'), {
  keyboard: false,
})
Date.prototype.toShortFormat = function() {
  let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  let day = this.getDate()

  let monthIndex = this.getMonth()
  let monthName = monthNames[monthIndex]

  let year = this.getFullYear()

  return `${monthName} ${year}`
}

let today = new Date()
const prettyDate = today.toShortFormat()
const siteTitle = $('#site-title').text()

const path = window.location.pathname

$(function() {
  /**
   *---------------------------------------------------------------------
   * !! MAP SCRIPT START
   * -------------------------------------------------------------------
   */
  async function convertLatLon(lat, lon) {
    const d = await getAddress(lat, lon)
    const data = d.data

    if (data.features.length == 0) {
      $('.alert-warning')
        .removeClass('invisible')
        .addClass('visible')
    } else if (data.features.length > 0 && $('.alert-warning').hasClass('visible')) {
      $('.alert-warning')
        .removeClass('visible')
        .addClass('invisible')
    }
    return data
  }

  async function convertAddress(city) {
    const data = await getLatLon(city)
    return data.data
  }

  function DDtoDMS(lat, lon) {
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
    let result = {lat: latResult, lon: lonResult}
    return result
  }

  L.mapbox.accessToken = 'pk.eyJ1IjoibmluYTU2ODIiLCJhIjoiY2xoNnFvYTJwMDhzczNtcXFiZ3c4Y3BoYiJ9.QsbZzVVQmdUqEpce-hq49A'
  const map = L.mapbox.map('map', null, {zoomControl: false}).setView([38.25004425273146, -85.75576792471112], 11)

  L.mapbox
    .styleLayer('mapbox://styles/mapbox/streets-v11')
    .addTo(map) // add your tiles to the map
    .once('load', finishedLoading)

  function finishedLoading() {
    // first, toggle the class 'done', which makes the loading screen
    // fade out
    setTimeout(() => {
      $('#map').removeClass('invisible')
    }, 1000)
  }
  $('#mapTest').on('click', function(e) {
    e.preventDefault()
  })
  const marker = L.marker([0, 0], {
    icon: L.mapbox.marker.icon({
      'marker-size': 'large',

      'marker-color': 'blue',
    }),
  }).addTo(map)
  var locationControl = L.control
    .locate({
      circleStyle: {opacity: 0},
      followCircleStyle: {opacity: 0},
      drawCircle: false,
      follow: false,
      setView: false,
      remainActive: false,
      showPopup: false,
      locateOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
      },
    })
    .addTo(map)

  map.on('locationfound', async function(e) {
    let lat = e.latitude
    let lon = e.longitude

    const address = await convertLatLon(lat, lon)

    const dmsCalculated = DDtoDMS(lat, lon)
    const data = {
      address: address.features[0].place_name,
      lat: lat,
      lon: lon,
      dms: {lat: dmsCalculated.lat, lon: dmsCalculated.lon},
    }

    const p = popupContent(data)
    var popup = L.popup({autoPan: true, keepInView: true}).setContent(p)

    setTimeout(() => {
      map.fitBounds([[lat, lon]], {padding: [50, 50], maxZoom: 13})
      marker
        .setLatLng([lat, lon])
        .bindPopup(popup)
        .openPopup()
      if (address.features.length > 0) {
        $('form')
          .first()
          .find('input:eq(0)')
          .val(address.features[0].place_name)

        $('main')
          .find('input:eq(1)')
          .val(lat)
        $('main')
          .find('input:eq(2)')
          .val(lon)
      }
    }, 1000)
  })

  map.on('locationerror', async function(e) {
    locationControl.stop()
    // TODO UPDATE other pages with ip address fallback
    let icon = locationControl._icon
    $(icon).css('background-color', 'hsl(217deg 93% 60%)')
    const ip = await getIp()

    if (ip.latitude) {
      let lat = ip.latitude
      let lon = ip.longitude

      const submitText = $('form :submit')
        .first()
        .text()

      //hsl(217deg 93% 60%)
      let icon = locationControl._icon
      $(icon).css('background-color', 'hsl(217deg 93% 60%)')

      const address = await convertLatLon(lat, lon)

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
      $('form :submit')
        .first()
        .html(`${submitText}`)
      map.fitBounds([[lat, lon]], {padding: [50, 50], maxZoom: 13})

      const dmsCalculated = DDtoDMS(lat, lon)

      const data = {
        address: address.features[0].place_name,
        lat: lat,
        lon: lon,
        dms: {lat: dmsCalculated.lat, lon: dmsCalculated.lon},
      }

      const p = popupContent(data)
      var popup = L.popup({autoPan: true, keepInView: true}).setContent(p)
      // # TODO: ADD to all converts

      marker
        .setLatLng([lat, lon])
        .bindPopup(popup)
        .openPopup()
      setTimeout(() => {
        $(icon).css('background-color', 'black')
      }, 1000)
    }
  })

  $('form')
    .first()
    .on('submit', async function(e) {
      e.preventDefault()

      const submitText = $('form :submit')
        .first()
        .text()
      $(
        'form :submit'
      ).first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  ${submitText}`)

      const value = $(this)
        .find('input:eq(0)')
        .val()

      const fetchResponse = await convertAddress(value)

      setTimeout(() => {
        if (fetchResponse.features.length > 0) {
          let lat = fetchResponse.features[0].geometry.coordinates[1]
          let lon = fetchResponse.features[0].geometry.coordinates[0]

          $('#LatitudeInput').val(lat)
          $('#LongitudeInput').val(lon)

          const dmsCalculated = DDtoDMS(lat, lon)

          map.fitBounds([[lat, lon]], {padding: [50, 50], maxZoom: 13})

          $('form :submit')
            .first()
            .html(submitText)
          // # TODO: ADD to all converts
          const data = {
            address: value,
            lat: lat,
            lon: lon,
            dms: {lat: dmsCalculated.lat, lon: dmsCalculated.lon},
          }

          const p = popupContent(data)
          var popup = L.popup({autoPan: true, keepInView: true}).setContent(p)

          marker
            .setLatLng([lat, lon])
            .bindPopup(popup)
            .openPopup()
        }
      }, 200)
    })

  $('#map').on('click', '#getAltitude', function(e) {
    e.preventDefault()
    toggleAltitude(this, marker)
  })

  map.on('popupopen', function(e) {
    var px = map.project(e.target._popup._latlng) // find the pixel location on the map where the popup anchor is
    px.y -= e.target._popup._container.clientHeight / 2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    map.panTo(map.unproject(px), {animate: true})
    $('.leaflet-top.leaflet-left').css('opacity', '0')
    // TODO update
  })
  map.on('popupclose', function(e) {
    // TODO update
    $('.leaflet-top.leaflet-left').css('opacity', '1')
  })
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


`

  /*
  $("#map").on("click", ".bookmark-btn", function (e) {
    e.preventDefault();
    $(this).prop("disabled", true);
    marker.closePopup();
    let currentPopup = marker.getPopup();
    currentPopup.setContent(toast);
    currentPopup.openPopup();
  });
  */
  var bookmarkModal = new Modal(document.getElementById('bookmarkModal'), {
    keyboard: false,
  })
  var bookmarkToggle = document.getElementById('bookmarkModal')
  // relatedTarget

  $('#bookmarkForm').on('submit', function(e) {
    e.preventDefault()
    let input = $(this).find('input:eq(0)')
    console.log(e.target)
    let locationData = JSON.parse(localStorage.getItem('location-data'))
    locationData.name = input[0].value
    localStorage.setItem('location-data', JSON.stringify(locationData))
    addBookmark('location-data')
    bookmarkModal.hide(bookmarkToggle)
    $(this)
      .find('input:eq(0)')
      .val('')
    let p = popupContent(locationData)
    marker.setPopupContent(p)
  })

  // TODO ADD "   <%- include(`${partials}/modal.ejs`); -%>   " to all pages
})
