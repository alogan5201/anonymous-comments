/** letiables available in all js files:
 * all the exported constants from globals.js
 */

/** Directories available as aliases
 * all the paths within Dir in globals.js
 */

import dompurify from "dompurify";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get,  onValue, push, query, orderByValue, increment, orderByChild } from "firebase/database";
 import { getFunctions, httpsCallable , connectFunctionsEmulator} from 'firebase/functions';
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
import { Modal, Dropdown} from 'bootstrap/dist/js/bootstrap.esm.min.js'



import "picturefill";
import "utils/errors";

var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new Dropdown(dropdownToggleEl)
})




let url = window.location.href;
Date.prototype.toShortFormat = function() {

  let monthNames =["Jan","Feb","Mar","Apr",
                    "May","Jun","Jul","Aug",
                    "Sep", "Oct","Nov","Dec"];

  let day = this.getDate();

  let monthIndex = this.getMonth();
  let monthName = monthNames[monthIndex];

  let year = this.getFullYear();

  return `${monthName} ${year}`;
}

let today = new Date();

const prettyDate = today.toShortFormat()


 const app = initializeApp({
  apiKey: "AIzaSyBCU8RRxV3qaSyxOgc4ObSWmUhlfnJsYTo",
  authDomain: "geotools-bc75a.firebaseapp.com",
  projectId: "geotools-bc75a",
  storageBucket: "geotools-bc75a.appspot.com",
  messagingSenderId: "106157954659",
  appId: "1:106157954659:web:3e189110236a2138438a56",
  measurementId: "G-Z6GK19K3L0",
});
//const functions = getFunctions(app);
const auth = getAuth();
// Get a reference to the database service

const googleProvider = new GoogleAuthProvider();

 const functions = getFunctions(app);
if (location.hostname === "localhost") {

connectFunctionsEmulator(functions, "localhost", 5001);
connectAuthEmulator(auth, "http://localhost:9099");
}

if (window.location.href.includes("login")) {
  const App = function _App() {
    return `

       <div class="container w-100 h-100 position-relative ${_App.state.class}" style="    min-width: 100vw !important;
    min-height: 100vh !important; ">
    <div class="spinner-container position-absolute top-50
                left-50" style= "width: 100%; text-align: center">

       <div class="spinner-grow text-primary " role="status">
                <span class="visually-hidden">Loading...</span>
            </div>

    </div>

        </div>


    `;
  };
  App.state = {
    loading: false,
    class: "d-none",
    count: 0,
    toggleState: () => {
      setState(() => {
        App.state.loading = App.state.loading ? false : true;
      });
    },
  };

  function toggleLoading() {
    if (App.state.loading == true) {
      App.state.loading = false;
      App.state.class = "d-none";
    } else {
      App.state.loading = true;
      App.state.class = "";
    }
  }

  $("#google-sign-in").on("click", function (e) {
    e.preventDefault();

    $("main").addClass("d-none");

    $("#spinner-box").removeClass("d-none");
    signInWithRedirect(auth, googleProvider);
  });
  onAuthStateChanged(auth, (user) => {
    if (user) {
      getRedirectResult(auth)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        })
        .finally(() => {
          window.location.replace("/");
        });
    } else {
      $("#spinner-box").addClass("d-none");
      $("main").removeClass("d-none");
    }
  });

  import(/* webpackChunkName: "lazy-module.login" */ "./lazy-module").then(
    (module) => {
      const login = module.default;

      login();
    }
  );
}

window.addEventListener("DOMContentLoaded", (event) => {




  $("#testBtn").on("click", function () {
    let myModal = new Modal(document.getElementById("modalSignOut"));
    myModal.toggle();
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
        let myModal = new Modal(
          document.getElementById("modalSignOut")
        );
        myModal.toggle();
      })
      .catch((error) => {});
  });

  $("#user-btn").on("click", function (e) {
    e.preventDefault();
  });

  // Movie Directory
});
