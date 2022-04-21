/* jshint esversion: 8 */
import "./firebase"
import 'utils/commentscript.js'
import { popupContent, getLatLon , getAddress, getElevation, generateUID} from 'utils/geocoder'

function test (e) {
  e.preventDefault()
}
window.addEventListener('DOMContentLoaded', () => {
  let scrollPos = 0
  const mainNav = document.getElementById('mainNav')
  const headerHeight = mainNav.clientHeight
})
const path = window.location.pathname
$(document).ready(function () {
  function ConvertDMSToDD (degrees, minutes, seconds, direction) {
    var dd = degrees + minutes / 60 + seconds / (60 * 60)

    if (direction == 'S' || direction == 'W') {
      dd = dd * -1
    } // Don't do anything for N or E
    return dd
  }

  const uid = generateUID()
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

    let sLat = Math.round((latitude - dLat - mLat / 60) * 1e3 * 3600) / 1e3
   let dLon = Math.floor(longitude)
  let  mLon = Math.floor((longitude - dLon) * 60)
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
  const map = L.mapbox.map('map',  null, { zoomControl: false }).setView([38.25004425273146, -85.75576792471112], 11)

  L.mapbox
    .styleLayer('mapbox://styles/mapbox/streets-v11')
    .addTo(map) // add your tiles to the map
    .once('load', finishedLoading)


    function finishedLoading() {
      // first, toggle the class 'done', which makes the loading screen
      // fade out
    setTimeout(() => {
      $("#map").removeClass("invisible")

    }, 1000);

  }
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
    let lat = e.latitude
    let lon = e.longitude
     let icon = locationControl._icon
    $(icon).css('background-color', 'hsl(217deg 93% 60%)')
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
    const data = {
      lat: lat,
      lon: lon,
      dms: {lat:`${ dmsCalculated.lat.degrees}, ${dmsCalculated.lat.minutes}, ${dmsCalculated.lat.seconds}`, lon: `${dmsCalculated.lon.degrees}, ${dmsCalculated.lon.minutes}, ${dmsCalculated.lon.seconds} `}
          }

      const p = popupContent(data)

     var popup = L.popup({ autoPan: true, keepInView:false }).setContent(p)
    marker
      .setLatLng([lat, lon])
      .bindPopup(popup)
      .openPopup()

      setTimeout(() => {
         $(icon).css('background-color', 'black')
      }, 1000);
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
    const elvevationResponse = await getElevation(lat, lon)
    const data = elvevationResponse.data
    const allFeatures = data.features
    const elevations = allFeatures.map(feature => feature.properties.ele)
    const highestElevation = Math.max(...elevations)
    $('.altitude').html(`<div> ${highestElevation} meters </div>`)
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
  $('#latlonForm').on('submit', function (e) {
    e.preventDefault()
       const submitText =  $('form :submit').first().text()
  console.log(  $('form :submit').first().parent())
  $('form :submit').first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  ${submitText}`)

  let icon = locationControl._icon
    $(icon).css('background-color', 'black')
    let latInput = document.getElementById('latInputField')
    let lonInput = document.getElementById('lonInputField')
    const lat = e.currentTarget[0].value
    const lon = e.currentTarget[1].value

    const parsedLat = parseFloat(lat)
    const parsedLon = parseFloat(lon)
    north.checked = lat >= 0
    south.check = lat < 0
    east.checked = lon >= 0
    west.checked = lon < 0
    const dmsCalculated = DDtoDMS(lat, lon)

    map.fitBounds([[lat, lon]], {
      padding: [100, 100]
    })
 $('form :submit').first().html(submitText)
    $('#degrees-lat').val(dmsCalculated.lat.degrees)
    $('#minutes-lat').val(dmsCalculated.lat.minutes)
    $('#seconds-lat').val(dmsCalculated.lat.seconds)
    $('#degrees-lon').val(dmsCalculated.lon.degrees)
    $('#minutes-lon').val(dmsCalculated.lon.minutes)
    $('#seconds-lon').val(dmsCalculated.lon.seconds)
    //  ${dmsCalculated.lat} ${dmsCalculated.lon}
    const data = {
      lat: lat,
      lon: lon,
      dms: {lat:dmsCalculated.popupMessage.lat, lon: dmsCalculated.popupMessage.lon}
          }

      const p = popupContent(data)
    marker
      .setLatLng([lat, lon])
      .bindPopup(p)
      .openPopup()
  })
  const title = $('title').html()

  const pageTitle = title.slice(11)
  let bookmarkControl = new L.Control.Bookmarks({
    name: pageTitle
  }).addTo(map)

  $('#map').on('click', '#getAltitude', function (e) {
    e.preventDefault()
    let coords = marker.getLatLng()

    $(this).parent().html(`<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading
</button>`)
    getElevationData(coords.lng, coords.lat)
  })

    $('#map').on('click', '.bookmark-btn', function (e) {
    e.preventDefault()
    $(this).children().last().removeClass("far").addClass("fas")
 $(this).prop("disabled",true);


 let btn = $(this).parent().children(":input").is(":checked")
let pressed = $(this).attr("aria-pressed")

const allItems = $(this).parent().parent().parent().parent().children()
let first = $(this).parent().parent().parent().parent().children().first()
let second = $(first).next('span.lat')
let allButlast = allItems.length -1

let name
let dms
for (let index = 0; index < allButlast; index++) {
  const element = allItems[index];



if($(element).hasClass("location-name") ){
    let text = $(element).text()

name = text

}
else if($(element).hasClass('dms')){
  let text = $(element).text()
dms = text

}


}

let coords = marker.getLatLng()




const obj = {
name: name,
latlng: [coords.lat, coords.lng],
lat: coords.lat,
lon: coords.lon,
dms: dms,
path: path,
key: uid,

}


addEntry(obj)




/*
    $(this).parent().html(`    <button type="button" class="btn btn-outline-primary  btn-sm ms-auto text-right bookmark-btn" data-bs-toggle="button" autocomplete="off">Bookmark <i class="far fa-bookmark"></i></button>`)
*/

  })

  //bookmark-btn
function addEntry(data) {
let allEntries = data.path
let entryItem = data.key
    // Parse any JSON previously stored in allEntries
    var existingEntries = JSON.parse(localStorage.getItem(allEntries));
    if(existingEntries == null) existingEntries = [];
   const entry = data
    localStorage.setItem(entryItem, JSON.stringify(entry));
    // Save allEntries back to local storage
    existingEntries.push(entry);
    localStorage.setItem(allEntries, JSON.stringify(existingEntries));
};

map.on('popupopen', function(e) {
    var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
    px.y -= e.target._popup._container.clientHeight/2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    map.panTo(map.unproject(px),{animate: true}); // pan to new center
});
})
