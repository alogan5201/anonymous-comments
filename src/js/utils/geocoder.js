import { httpsCallable, getFunctions } from 'firebase/functions'
import { v4 as uuidv4 } from 'uuid'

export function generateUID(){
const uid = uuidv4()
return uid
}
const functions = getFunctions()
export function clearForm(form){

var inputs = form.elements;

let i
for (i = 0; i < inputs.length; i++) {
  if (inputs[i].nodeName === "INPUT" ) {
    // Update text input
    inputs[i].value = ""
  }
}

}
export function popupContent (input) {
let weatherData = input.weather ? input.weather : ""
let nameData = input.name ? input.name : null

let storedData = {
name : nameData,
lat: input.lat,
lon: input.lon,
dmslat: input.dms.lat,
dmslon: input.dms.lon
}

console.log(storedData)
console.log(window.location.pathname)
let weather = input.weather ? `  <li class="list-group-item border-0 pt-2 px-1 border-bottom location-name">${input.weather.currentWeather}  </li><li class="list-group-item border-0 pt-2 px-1 border-bottom location-name">  <span>   <img style="max-width: 50px" src="http://openweathermap.org/img/wn/${input.weather.imgIcon}@2x.png" class="img-fluid rounded-start" alt="..."></span><span>${input.weather.temp}°F </span></li>` : ""
let name = input.name ? ` <li class="list-group-item border-0 pt-2 px-1 border-bottom location-name">     <p class="card-title mb-0 fs-6 mt-0">${input.name}</p></li>` : ""

  let data = `   <div class="row">
            <div class="col p-0">

                <div class="card-body px-3 pt-2 pb-1">
                <ul class="list-group border-0">
 ${name} ${weather}
  <li class="list-group-item border-0 px-1 pb-1 fs-6 pt-2"> <span><strong> Latitude: </strong> <span class="lat">${input.lat} </span></span></li>
  <li class="list-group-item border-0 px-1 fs-6 py-0"><span> <strong>
                  Longitude: <span class="lon">${input.lon}</span></strong> </span></li>
  <li class="list-group-item border-0 px-1 fs-6 py-0 dms">  ${input.dms.lat} ${input.dms.lon}</li>
  <li class="list-group-item border-0 px-1 fs-6 py-0 pb-1 pt-2 border-top"><div class="hstack gap-3">
  <div class="  altitude">




  <button class="btn btn-primary btn-sm btn-sm" id="getAltitude" type="button ">
                      Get Altitude
                  </button>



                  </div>
  <div class=" border ms-auto">
  <button type="button" class="btn btn-outline-primary  btn-sm ms-auto text-right bookmark-btn" data-bs-toggle="button" autocomplete="off">Bookmark <i class="far fa-bookmark"></i></button>



</div></li>
</ul>

                </div>


              </div>
            </div>`
  return data
}

export async function getLatLon (city) {
  const getLatLonData = httpsCallable(functions, 'getLatLon')
  return getLatLonData({
    city: city
  })
    .then(function (result) {
      let data = JSON.stringify(result)
      return result
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
    })
}

export async function getAddress (lat, lon) {
  const getLatLonData = httpsCallable(functions, 'getAddress')
  return getLatLonData({
    lat: lat,
    lon: lon
  })
    .then(function (result) {
      return result
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
    })
}
export async function getElevation (lat, lon) {
  const getElevationData = httpsCallable(functions, 'getElevation')
  return getElevationData({
    lat: lat,
    lon: lon
  })
    .then(function (result) {
      return result
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
    })
}
export async function getMatrix (first, second) {
  const getMatrixData = httpsCallable(functions, 'getMatrix')
  return getMatrixData({
    first: first,
    second: second
  })
    .then(function (result) {
      return result
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
    })
}

export function getGeojson (first, second) {
  const blank = { lat: 0, lon: 0, title: '' }
  const destination = second || blank

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [first.lon, first.lat]
        },
        properties: {
          title: 'Origin',
          description: first.title,
          'marker-color': '#35A2D1',
          'marker-size': 'large',
          'marker-symbol': '1'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [destination.lon, destination.lat]
        },
        properties: {
          title: 'Destination',
          description: destination.title,
          'marker-color': '#fc4353',
          'marker-size': 'large',
          'marker-symbol': '2'
        }
      }
    ]
  }

  return geojson
}
export default { getLatLon, getAddress, getElevation, getMatrix, getGeojson, generateUID}
