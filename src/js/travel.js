/* jshint esversion: 8 */
import "./firebase"
import 'utils/commentscript.js'
import { getLatLon, getAddress, getGeojson, getMatrix, clearForm } from 'utils/geocoder'
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
        title: 'Mapbox DC',
        description: '1714 14th St NW, Washington DC',
        'marker-color': '#35A2D1',
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
/***
 *
 *  TODO: FIX POPUP
 */

   const App = function _App () {
     return App.state.count
  }

  const handler = {
    set: function (obj, prop, value) {
      obj[prop] = value
    }
  }

  App.state = new Proxy({ count: 0 }, handler)
window.addEventListener('DOMContentLoaded', () => {
  async function convertLatLon (lat, lon) {
    const d = await getAddress(lat, lon)
    const data = d.data

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
    const data = await getLatLon(city)
    return data.data
  }

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
    /// /

    north.checked = lat >= 0
    south.check = lat < 0
    east.checked = lon >= 0
    west.checked = lon < 0

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

    document.getElementById('degrees-lat').value = degreesLatitude
    document.getElementById('minutes-lat').value = minutesLatitude
    document.getElementById('seconds-lat').value = secondsLatitude
    document.getElementById('degrees-lon').value = degreesLongitude
    document.getElementById('minutes-lon').value = minutesLongitude
    document.getElementById('seconds-lon').value = secondsLongitude
  }
  function check (elm) {
    document.getElementById(elm).checked = true
  }

  const latInputField = document.getElementById('latInputField')
  const lonInputField = document.getElementById('lonInputField')



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
  // L.marker is a low-level marker constructor in Leaflet.

  var featureLayer = L.mapbox.featureLayer().addTo(map)

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

  $('#originTest').click(function (e) {
    e.preventDefault()
    $('#getTravelForm')
      .find('input:eq(0)')
      .val('Atlanta, GA')
    $('#getTravelForm')
      .find('input:eq(1)')
      .val('Lagrange, GA')
  })

  $('#switchTest').click(function (e) {
    e.preventDefault()

    $('#getTravelForm')
      .find('input:eq(0)')
      .val('Birmingham, AL')
    $('#getTravelForm')
      .find('input:eq(1)')
      .val('Mobile, AL')
  })

  function addRoute () {
    App.state.count++

    const origin = CoordsApp.state.origin

    const destination = CoordsApp.state.destination

    let latD = destination[1]
    let lonD = destination[0]
    let latO = origin[1]
    let lonO = origin[0]
    geojson.features[0].geometry.coordinates = [lonO, latO]
    geojson.features[1].geometry.coordinates = [lonD, latD]

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
      { padding: [50, 50] }
    )
  }

  async function addNewRoute (locationData) {
    let latOrigin = locationData.origin.lat
    let lonOrigin = locationData.origin.lon
    let latDestination = locationData.destination.lat
    let lonDestination = locationData.destination.lon

    const query1 = `${lonOrigin},${latOrigin}`
    const query2 = `${lonDestination},${latDestination}`
    //  destinationMarker.setLatLng(origin[1], origin[0])
    await callMatrix(query1, query2)
    geojson.features[0].geometry.coordinates = [lonOrigin, latOrigin]
    geojson.features[1].geometry.coordinates = [lonDestination, latDestination]

    featureLayer.setGeoJSON(geojson)

    featureLayer.setGeoJSON(geojson)

    map.fitBounds(
      [
        [latOrigin, lonOrigin],
        [latDestination, lonDestination]
      ],
      { padding: [50, 50] }
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

  async function callMatrix (first, second) {
    const data = await getMatrix(first, second)

    const json = data.data
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

      alertPlaceholder.appendChild(wrapper)
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

    /*
   if(localStorage.getItem('travel-time-two')){
    $(".first").addClass("fadeOut").removeClass("first")
    $(".second").addClass("fadeOut").removeClass("second")
    localStorage.removeItem('travel-time-two');
    localStorage.removeItem('travel-time-one');

    setTimeout(() => {
      $("button.first").remove();
      $("button.second").remove();
      $('#addressHistory').append(` <button type="button" class="list-group-item list-group-item-action first">${result.hours} hour(s) and ${result.minutes} minutes </button>`);
      localStorage.setItem('travel-time-one', `${result.hours}hour(s)${result.minutes}`);
    }, 600);

   } else if (localStorage.getItem('travel-time-one') && !localStorage.getItem('travel-time-two')){
    $('#addressHistory').append(` <button type="button" class="list-group-item list-group-item-action second">${result.hours} hour(s) and ${result.minutes} minutes</button>`);
    localStorage.setItem('travel-time-two', `${result.hours}hour(s)${result.minutes}`);

   } else {
    $('#addressHistory').append(` <button type='button' class='list-group-item list-group-item-action first'>${result.hours} hour(s) and ${result.minutes} minutes </button>`);
    localStorage.setItem('travel-time-one', `${result.hours}hour(s)${result.minutes}`);
   }
               */
  }

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

  map.on('locationfound', async function (e) {
    let lat = e.latitude
    let lon = e.longitude
   let icon = locationControl._icon
    $(icon).css('background-color', 'hsl(217deg 93% 60%)')
    let x = document.querySelectorAll("form")
    let form = x[0]
    clearForm(form)
    map.fitBounds(e.bounds)

    geojson.features[0].geometry.coordinates = [lon, lat]


    const result = await convertLatLon(lat, lon)
      console.log(result)
const origin = result.features[0]
let originLatLon = result.features[0].geometry.coordinates
  let originLat = originLatLon[1]
      let originLon = originLatLon[0]
let originResults = {
  title: origin.place_name,
  lat: originLat,
  lon: originLon,
}
const blank = {lat: 0, lon: 0, title: ""}
  const geojsonData = getGeojson(originResults)
  featureLayer.setGeoJSON(geojsonData)
  $('form')
        .first()
        .find('input:eq(0)')
        .val(result.features[0].place_name)



    locationControl.stop()

    // And hide the geolocation button
  })

  // If the user chooses not to allow their location
  // to be shared, display an error message.
  map.on('locationerror', function () {
    geolocate.innerHTML = 'Position could not be found'
  })

  // !! Travel FORM   ---------------------------------------------->

  /**
 *
 *
   //✅
 *  */
  function consoleRed (message) {
    let msg = `%c ${message}`
  }
  function consoleBlue (message) {
    let msg = `%c ${message}`
  }

  const addRouteTest = async locationData => {

    let latOrigin = locationData.origin.lat
    let lonOrigin = locationData.origin.lon
    let latDestination = locationData.destination.lat
    let lonDestination = locationData.destination.lon


    const query1 = `${lonOrigin},${latOrigin}`
    const query2 = `${lonDestination},${latDestination}`
    //  destinationMarker.setLatLng(origin[1], origin[0])
    await callMatrix(query1, query2)


    let origin = locationData.origin
    let destination = locationData.destination
    const geoJsondata = getGeojson(origin, destination)
    console.log(geoJsondata)

    featureLayer.setGeoJSON(geoJsondata)

    map.fitBounds(
      [
        [latOrigin, lonOrigin],
        [latDestination, lonDestination]
      ],
      { padding: [50, 50] }
    )
       const submitText =  $('form :submit').first().text()
     $('form :submit').first().html(submitText)
  }
  // ** NEW FORM   ------------------------------------------------->

  $('#getTravelForm').on('submit', async function (e) {
    e.preventDefault()
       const submitText =  $('form :submit').first().text()
  console.log(  $('form :submit').first().parent())
  $('form :submit').first().html(` <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  ${submitText}`)
     let icon = locationControl._icon
    $(icon).css('background-color', 'black')
    const originInput = $(this)
      .find('input:eq(0)')
      .val()
    const destinationInput = $(this)
      .find('input:eq(1)')
      .val()

    const originFetch = await convertAddress(originInput)
    const destinationFetch = await convertAddress(destinationInput)

    const result = await Promise.all([originFetch, destinationFetch])

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



      // ✅

      //  const createRoute = addRoute();

      const locationData = {
        origin: originResults,
        destination: destinationResults
      }

      addRouteTest(locationData)





  })

  let bookmarkControl = new L.Control.Bookmarks().addTo(map)
})
