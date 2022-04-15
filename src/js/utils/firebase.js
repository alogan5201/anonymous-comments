import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";

 const app = initializeApp({
  apiKey: "AIzaSyBCU8RRxV3qaSyxOgc4ObSWmUhlfnJsYTo",
  authDomain: "geotools-bc75a.firebaseapp.com",
  projectId: "geotools-bc75a",
  storageBucket: "geotools-bc75a.appspot.com",
  messagingSenderId: "106157954659",
  appId: "1:106157954659:web:3e189110236a2138438a56",
  measurementId: "G-Z6GK19K3L0",
});
const auth = getAuth();

export default async function createRandomUser(){

  signInAnonymously(auth)
  .then((data) => {
  console.log(data)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error)
  });

}





