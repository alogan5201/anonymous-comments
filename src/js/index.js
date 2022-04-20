/** letiables available in all js files:
 * all the exported constants from globals.js
 */

/** Directories available as aliases
 * all the paths within Dir in globals.js
 */

import dompurify from "dompurify";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  push,
  query,
  orderByValue,
  increment,
  orderByChild,
  connectDatabaseEmulator,
} from "firebase/database";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  connectAuthEmulator,
} from "firebase/auth";

//import 'bootstrap/dist/js/bootstrap.bundle';
import { Modal, Dropdown } from "bootstrap/dist/js/bootstrap.esm.min.js";

import "picturefill";
import "utils/errors";

const firebaseConfig = {
  apiKey: "AIzaSyBCU8RRxV3qaSyxOgc4ObSWmUhlfnJsYTo",
  authDomain: "geotools-bc75a.firebaseapp.com",
  databaseURL: "https://geotools-bc75a-default-rtdb.firebaseio.com",
  projectId: "geotools-bc75a",
  storageBucket: "geotools-bc75a.appspot.com",
  messagingSenderId: "106157954659",
  appId: "1:106157954659:web:3e189110236a2138438a56",
  measurementId: "G-Z6GK19K3L0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

var dropdownElementList = [].slice.call(
  document.querySelectorAll(".dropdown-toggle")
);
var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new Dropdown(dropdownToggleEl);
});

let url = window.location.href;
Date.prototype.toShortFormat = function () {
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let day = this.getDate();

  let monthIndex = this.getMonth();
  let monthName = monthNames[monthIndex];

  let year = this.getFullYear();

  return `${monthName} ${year}`;
};

let today = new Date();

const prettyDate = today.toShortFormat();

//const functions = getFunctions(app);
const auth = getAuth();
// Get a reference to the database service
const db = getDatabase();
const googleProvider = new GoogleAuthProvider();

const functions = getFunctions(app);
if (location.hostname === "localhost") {
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectDatabaseEmulator(db, "localhost", 9000);
}

window.addEventListener("DOMContentLoaded", (event) => {
  $("#createUser").on("click", function (e) {
    e.preventDefault();
    const createUser = httpsCallable(functions, "writeDB");
    createUser({
      nina: {
        date_of_birth: "December 9, 1906",
        full_name: "Nina Tchirkova",
      },
    })
      .then(function (result) {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      $("#sign-in-elm").css("display", "none");
      $("#sign-out-elm").css("display", "block");
    } else {
      $("#sign-out-elm").css("display", "none");
      $("#sign-in-elm").css("display", "block");
    }
  });

  $("#sign-out").on("click", async function (e) {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        let myModal = new Modal(document.getElementById("modalSignOut"));
        myModal.toggle();
      })
      .catch((error) => {});
  });

  $("#user-btn").on("click", function (e) {
    e.preventDefault();
  });

  // Movie Directory
});
