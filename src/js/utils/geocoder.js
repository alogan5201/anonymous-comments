import { httpsCallable, getFunctions } from 'firebase/functions'

const functions = getFunctions()


export async function getLatLon(city) {

  const getLatLon = httpsCallable(functions, 'getLatLon')
  return  getLatLon({
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

export default {getLatLon}
