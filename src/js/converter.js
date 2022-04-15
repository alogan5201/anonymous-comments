import 'utils/commentscript.js'
function test (e) {
  e.preventDefault()
}
window.addEventListener('DOMContentLoaded', () => {
  let scrollPos = 0
  const mainNav = document.getElementById('mainNav')
  const headerHeight = mainNav.clientHeight
})

$(document).ready(function () {
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
  const map = L.mapbox
    .map('map')
    .setView([37.9, -77], 6)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'))
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
      icon: 'fas fa-map-marker-alt', // follow the user's location
      setView: false,
      remainActive: false
    })
    .addTo(map)

  map.on('locationfound', function (e) {
    let lat = e.latitude
    let lon = e.longitude
    var radius = e.accuracy

    localStorage.setItem('userLatLon', `${lat}, ${lon}`)
    /*
    L.marker(e.latlng)
      .addTo(map)
      .bindPopup("You are within " + radius + " meters from this point")
      .openPopup();
*/

    locationControl.stop()
    geocoder.query(`${lat}, ${lon}`)

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

  const geocoder = new MapboxGeocoder({
    accessToken:
      'pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQycnlhMDBlb2kydXBwZHoyOGNsY3EifQ.E8N4lPy6tiI0xY3nor3MTg',
    minLength: 500000,
    localGeocoder: coordinatesGeocoder,
    flyTo: false,

    reverseGeocode: true
  })
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
  geocoder.addTo('#geocoder')
  geocoder.on('result', e => {
    const coords = geocoder.getProximity()
    const suggestionBox = document.querySelector('.suggestions-wrapper')
    //
    //
    CoordsApp.state.origin = e.result.center

    let latitude = e.result.center[1]
    let longitude = e.result.center[0]
    latInputField.value = latitude
    lonInputField.value = longitude
    DDtoDMS(latitude, longitude)

    if (e.result.place_type == 'address') {
      outputInputField.value = e.result.place_name
    } else if (e.result_place_type == 'coordinate') {
      outputInputField.value = `${latitude}, ${longitude}`
    }
    if ($('#output-field-input').hasClass('is-invalid')) {
      $('#output-field-input').removeClass('is-invalid')
    }
    map.fitBounds([[latitude, longitude]], {
      padding: [100, 100]
    })
    /*
    L.marker(e.latlng)
      .addTo(map)
      .bindPopup("You are within " + radius + " meters from this point")
      .openPopup();
*/

    /*
    paddingTopLeft: [0, 0],
      paddingBottomRight: [100, 0],

*/

    //  map.zoomOut();
    marker
      .setLatLng([latitude, longitude])
      .bindPopup(
        `
      <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${geocoder._inputEl.value}</h5>
            <p class="card-text">



            <span><strong> Latitude: </strong> <span class="lat">${latitude} </span></span> <span> <strong>
            Longitude: <span class="lon">${longitude}</span></strong> </span>

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

  // Clear results container when search is cleared.
  geocoder.on('clear', () => {
    CoordsApp.state.origin = []

    const minLength = geocoder.getMinLength()

    if (minLength > 20) {
      geocoder.setMinLength(5)
    }
  })
  geocoder.on('error', e => {})

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
        document.querySelector(
          'h4.travel-time'
        ).innerHTML = `Travel time is ${result.hours} hour(s) & ${result.minutes} minutes`
      })
  }

  function getUserLocation () {
    if ('geolocation' in navigator) {
      function success (position) {
        let lat = position.coords.latitude

        let lon = position.coords.longitude

        geocoder.query(`${lat}, ${lon}`)

        // map.flyTo([lat,lon], 11)
        marker.setLatLng([lat, lon])

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
      //
    }
  }

  async function handleConvertLocationDataBtn (e) {
    e.preventDefault()

    let inputValue = geocoder.inputString

    if (geocoder._inputEl.value.length == 0) {
      $(geocoder._inputEl).addClass(' invalid')
    } else {
      const geocodedVal = CoordsApp.state.origin
      const reverseGeocoded = coordinatesGeocoder(inputValue)
      //
      if (!reverseGeocoded) {
        //

        let lon = parseFloat(geocodedVal[0])
        let lat = parseFloat(geocodedVal[1])

        //
        DDtoDMS(lat, lon)

        outputInputField.value = ` ${CoordsApp.state.origin[1]}, ${CoordsApp.state.origin[0]} `
        latInputField.value = CoordsApp.state.origin[1]
        lonInputField.value = CoordsApp.state.origin[0]
        // CoordsApp.state.origin
      } else if (reverseGeocoded) {
        let lon = parseFloat(geocodedVal[0])
        let lat = parseFloat(geocodedVal[1])

        DDtoDMS(lat, lon)

        outputInputField.value = ` ${CoordsApp.state.origin[1]}, ${CoordsApp.state.origin[0]} `
        latInputField.value = CoordsApp.state.origin[1]
        lonInputField.value = CoordsApp.state.origin[0]
      }
    }
  }

  $('#convertLocationData').click(async function (e) {
    e.preventDefault()
    let lat = CoordsApp.state.origin[1]
    let lon = CoordsApp.state.origin[0]

    // geocoder.query("Birmingham, Alabama")

    let inputVal = geocoder._inputEl.value
    geocoder.query(inputVal)
  })
  $('#latlonGeocoderBtn').click(function (e) {
    e.preventDefault()

    geocoder.fresh = true
    geocoder.clear()
    outputInputField.value = ''
    const minLength = geocoder.getMinLength()

    geocoder.setMinLength(5000000)

    let latInput = document.getElementById('latInputField')
    let lonInput = document.getElementById('lonInputField')
    const lat = latInput.value
    const lon = lonInput.value

    const parsedLat = parseFloat(lat)
    const parsedLon = parseFloat(lon)

    geocoder.query(`${parsedLat}, ${parsedLon}`)
    map.flyTo([parsedLat, parsedLon], 11)
    marker.setLatLng([parsedLat, parsedLon])
    setTimeout(() => {
      if (geocoder._inputEl.value.length == 0) {
        $('#output-field-input').focusin()
        $('#output-field-input').addClass('is-invalid')
        DDtoDMS(parsedLat, parsedLon)
        outputInputField.value = 'No Address Found'
        geocoder.fresh = true
        geocoder.clear()
      }
    }, 200)
  })

  $('#dmsBtn').click(function (e) {
    e.preventDefault()
    geocoder.fresh = true
    geocoder.clear()
    outputInputField.value = ''
    let dmsInputs = dmsForm.elements
    //
    geocoder.setMinLength(5000000)
    let northSouth = south.checked ? -1 : 1
    let eastWest = west.checked ? -1 : 1
    let dLat = parseFloat(degreesLat.value) || 0
    let mLat = parseFloat(minutesLat.value) || 0
    let sLat = parseFloat(secondsLat.value) || 0

    let dLon = parseFloat(degreesLon.value) || 0
    let mLon = parseFloat(minutesLon.value) || 0
    let sLon = parseFloat(secondsLon.value) || 0
    let lat = northSouth * (dLat + mLat / 60 + sLat / 3600)
    let lon = eastWest * (dLon + mLon / 60 + sLon / 3600)
    let latitude = Math.round(lat * 1e7) / 1e7
    let longitude = lon

    latInputField.value = latitude
    lonInputField.value = longitude
    geocoder.query(`${lat}, ${lon}`)

    setTimeout(() => {
      if (geocoder._inputEl.value.length == 0) {
        $('#output-field-input').focusin()
        $('#output-field-input').addClass('is-invalid')
        map.flyTo([lat, lon], 11)
        marker.setLatLng([lat, lon])
        outputInputField.value = 'No Address Found'
        geocoder.fresh = true
        geocoder.clear()
      }
    }, 200)
  })

  let bookmarkControl = new L.Control.Bookmarks({
    name: 'converter'
  }).addTo(map)
})
