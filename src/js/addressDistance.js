/* jshint esversion: 8 */
import HaversineGeolocation from 'haversine-geolocation'

import 'utils/commentscript.js'
import {popupContent,  getLatLon , getAddress, getElevation, getGeojson} from 'utils/geocoder'


function init(){
setTimeout(() => {
  console.log(locationControl._event)
  console.log(marker.getLatLng())
}, 1000);

}



const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      },
      properties: {
        'marker-color': 'blue',
        'marker-size': 'large',
        'marker-symbol': '1'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      },
      properties: {
        title: 'Mapbox SF',
        description: '155 9th St, San Francisco',
        'marker-color': '#fc4353',
        'marker-size': 'large',
        'marker-symbol': '2'
      }
    }
  ]
}
var loader = document.getElementById('loader')
const map = L.mapbox.map('map').setView([37.9, -77], 6)
L.mapbox.accessToken =
  'pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA'

const layer = L.mapbox
  .styleLayer('mapbox://styles/mapbox/streets-v11')
  .addTo(map)
   // add your tiles to the map




// L.marker is a low-level marker constructor in Leaflet.

var featureLayer = L.mapbox.featureLayer().addTo(map)
map.on('layeradd', function (e) {
  if ($('#loader').hasClass('loading')) {
    $('#loader')
      .removeClass('loading')
      .addClass('d-none')
  }
})
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
const LocationState = function _LocationState () {
  let data = {
    origin: {
      lat: LocationState.state.lat
    },
    destination: {
      lon: LocationState.state.lon
    }
  }
  return data
}
const myhandler = {
  set: function (obj, prop, value) {
    obj[prop] = value
  }
}

LocationState.state = new Proxy({ lat: null, lon: null }, myhandler)
$(document).on('click', '.leaflet-bar-part.leaflet-bar-part-single', function (
  e
) {
  e.preventDefault()
  alert('clicked')
})

map.on('locationfound', function (e) {
  map.fitBounds(e.bounds)
 let icon = locationControl._icon
    $(icon).css('background-color', 'hsl(217deg 93% 60%)')
  let lat = e.latlng.lat

  let lon = e.latlng.lng

  setOrigin(lat, lon)
 // geojson.features[0].geometry.coordinates = [lon, lat]



  var inputs = document.getElementById('getDistanceForm').elements

  if (inputs[0].nodeName === 'INPUT' && inputs[0].type === 'number') {
    // Update text input
    inputs[0].value = lat
    inputs[1].value = lon
  }

  setTimeout(() => {
    locationControl.stop()
  }, 500)
})

async function setOrigin (lat, lon) {
  const d = await getAddress(lat, lon)

  const data = d.data
  if (data.features.length > 0) {
    $('#addressInputFieldOrigin').val(data.features[0].place_name)
const origin = data.features[0]
let originLatLon = data.features[0].geometry.coordinates
  let originLat = originLatLon[1]
      let originLon = originLatLon[0]
let originResults = {
  title: origin.place_name,
  lat: originLat,
  lon: originLon,
}
 const geojsonData = getGeojson(originResults)
  featureLayer.setGeoJSON(geojsonData)
    $('#lonInputField').focus()
  } else if (data.features.length == 0) {
    alert('No Address found from your location')
  }
}
const title = $('title').html()

const pageTitle = title.slice(11)

let bookmarkControl = new L.Control.Bookmarks({
  name: pageTitle
}).addTo(map)

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


  async function convertAddressToCoordinates (address) {

  const data  = await getLatLon(address)
    return data.data

  }

  $('#getDistanceForm').on('submit', async function (e) {
    e.preventDefault()
     let icon = locationControl._icon
    $(icon).css('background-color', 'black')
    $('#loader')
      .removeClass('d-none')
      .addClass('loading')

    const coordsOrigin = await convertAddressToCoordinates(
      e.currentTarget[0].value
    )

    const coordsDestination = await convertAddressToCoordinates(
      e.currentTarget[1].value
    )

    const result = await Promise.all([coordsOrigin, coordsDestination])

  const origin = result[0].features[0]
let originLatLon = result[0].features[0].geometry.coordinates
  let originLat = originLatLon[1]
      let originLon = originLatLon[0]


let originResults = {
  title: origin.place_name,
  lat: originLat,
  lon: originLon,
}


const destination = result[1].features[0]
let destinationLatLon = result[1].features[0].geometry.coordinates
  let destinationLat = destinationLatLon[1]
      let destinationLon = destinationLatLon[0]


let destinationResults = {
  title: destination.place_name,
  lat: destinationLat,
  lon: destinationLon,
}

    const points = [
      {
        latitude: originLat,
        longitude: originLon
      },
      {
        latitude: destinationLat,
        longitude: destinationLon
      }
    ]
const geoJsondata = getGeojson(originResults, destinationResults)
    const distance = HaversineGeolocation.getDistanceBetween(
      points[0],
      points[1],
      'mi'
    )

    $('#distanceInput').val(`${distance} miles`)
    $('#distanceInput').focus()
featureLayer.setGeoJSON(geoJsondata)
    map.fitBounds(
      [
        [originLat, originLon],
        [destinationLat, destinationLon]
      ],
      { padding: [50, 50] }

    )

    // geojson.features[1].geometry.coordinates = [lonD, latD]
    // featureLayer.setGeoJSON(geojson)
    /*
    let origin = [latO, lonD]
    let destination = [latD, lonD]
    const points = [
      {
        latitude: latO,
        longitude: lonO,
      },
      {
        latitude: latD,
        longitude: lonD,
      },
    ]

    const distance = HaversineGeolocation.getDistanceBetween(points[0], points[1], 'mi')

    $('#distanceInput').val(`${distance} miles`)
    $('#distanceInput').focus()
    map.fitBounds(
      [
        [latO, lonO],
        [latD, lonD],
      ],
      {padding: [50, 50]}
    ) */
  })
  console.log(map)
})

