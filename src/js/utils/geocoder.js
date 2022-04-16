import { httpsCallable, getFunctions } from 'firebase/functions'

const functions = getFunctions()


export async function getLatLon(city) {

  const getLatLonData = httpsCallable(functions, 'getLatLon')
  return  getLatLonData({
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

export async function getAddress(lat, lon) {
  const getLatLonData = httpsCallable(functions, 'getAddress')
  return  getLatLonData({
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
export async function getElevation(lat, lon) {
  const getElevationData = httpsCallable(functions, 'getElevation')
  return  getElevationData({
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
export async function getMatrix(first, second) {
  const getMatrixData = httpsCallable(functions, 'getElevation')
  return  getMatrixData({
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
export default {getLatLon, getAddress, getElevation, getMatrix}
