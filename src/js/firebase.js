import { initializeApp } from 'firebase/app'
import { getDatabase,  push,  ref,
  set,
  get,
  onValue,  increment} from 'firebase/database'
import {getDate , toggleModal} from 'utils/helpers'
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  connectAuthEmulator
} from 'firebase/auth'
import { stubString } from 'lodash'
import { httpsCallable, getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import {
  comment,
  commentReply,
  extractReplies,
  replyForm
} from 'utils/comments'
import { Modal } from 'bootstrap/dist/js/bootstrap.esm.min.js'

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
const app = initializeApp({
  apiKey: 'AIzaSyBCU8RRxV3qaSyxOgc4ObSWmUhlfnJsYTo',
  authDomain: 'geotools-bc75a.firebaseapp.com',
  projectId: 'geotools-bc75a',
  storageBucket: 'geotools-bc75a.appspot.com',
  messagingSenderId: '106157954659',
  appId: '1:106157954659:web:3e189110236a2138438a56',
  measurementId: 'G-Z6GK19K3L0'
})
const auth = getAuth()
const db = getDatabase()
const functions = getFunctions(app)
const path = window.location.pathname
const commentRef = ref(db, `messages${path}`)
const commentFormInputs = $('#comment-form :input')
if (location.hostname === 'localhost') {
  connectFunctionsEmulator(functions, 'localhost', 5001)

}
function writeUserData (userId, userInfo) {

 return set(ref(db, 'anonymousUsers'), userInfo)
}

async function getIp () {
  const query = await fetch(`https://ipapi.co/json`, { method: 'GET' })
  if (query.status !== 200) {
    alert(query.status)
    return
  }

  const data = await query.json()

  return data
}

async function createRandomUser () {
  const ipAddress = await getIp()

  signInAnonymously(auth)
    .then(data => {
      let ip = ipAddress || null

      let userInfo = {
        uid: data.user.uid,
        emailVerified: data.user.emailVerified,
        isAnonymous: data.user.isAnonymous,
        providerData: data.user.providerData,
        createdAt: data.user.createdAt,
        lastLoginAt: data.user.lastLoginAt,
        ip: ip
      }
      let userData = JSON.stringify(userInfo)
      localStorage.setItem('userData', userData)

      writeUserData(userInfo)
    })
    .catch(error => {
      const errorCode = error.code
      const errorMessage = error.message
    })
}

onAuthStateChanged(auth, user => {
  const userData = localStorage.getItem('userData')
  if (user || userData) {
    if (userData) {
      let parsed = JSON.parse(userData)
    }
  } else {
    if (!userData) {
      createRandomUser()
    }
  }
})




 export function handleComment (message, name, userData, path){
    const addComment = httpsCallable(functions, 'addComment')
    const prettyDate = getDate()
    addComment({
      text: message,
      name: name,
      uid: userData,
      page: path
    })
      .then(function (result) {
        // Read result of the Cloud Function.
        let sanitizedMessage = result.data.text
        let sanitizedName = result.data.name
        const documentId = result.data.id

        if (message !== sanitizedMessage) {
          toggleModal("fail")

          $('#comment-btn').disabled = false
          $('#comment-btn').html('Submit')
          for (let index = 0; index < commentFormInputs.length; index++) {
            const element = commentFormInputs[index]
            element.value = ''
          }
        } else {
          const newCommentData = {
            id: documentId,
            name: sanitizedName,
            date: prettyDate,
            message: sanitizedMessage
          }
          const newComment = push(commentRef)
          set(newComment, newCommentData)
          $('#comment-btn').disabled = false
          $('#comment-btn').html('Submit')
          for (let index = 0; index < commentFormInputs.length; index++) {
            const element = commentFormInputs[index]
            element.value = ''
          }

          let commentComponent = comment(
            documentId,
            sanitizedName,
            prettyDate,
            sanitizedMessage,
            '',
            ''
          )
          toggleModal("success")
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
  }

export default {handleComment}
