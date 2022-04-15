import { initializeApp } from 'firebase/app'
import {
  getDatabase,

} from 'firebase/database'

import {
  getAuth,

  onAuthStateChanged,

  signInAnonymously,

} from 'firebase/auth'
import { stubString } from 'lodash'

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

async function getIp () {
  const query = await fetch(
    `https://ipapi.co/json`,
    { method: 'GET' }
  )
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

      let ip = ipAddress ? ipAddress : null

      let userInfo = {
"uid": data.user.uid,
"emailVerified": data.user.emailVerified,
  "isAnonymous": data.user.isAnonymous,
  "providerData": data.user.providerData,
    "createdAt": data.user.createdAt,
    "lastLoginAt": data.user.lastLoginAt,
  "ip": ip
}
let userData = JSON.stringify(userInfo)
      localStorage.setItem('userData', userData)

    })
    .catch(error => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(error)
    })
}

onAuthStateChanged(auth, user => {
  const userData = localStorage.getItem('userData')
  if (user || userData) {
    console.log('user signed in')
    if(userData){
    let parsed = JSON.parse(userData)
      console.log(parsed.uid)
    }

  } else {
    if (!userData) {
      createRandomUser()
    }
  }
})




