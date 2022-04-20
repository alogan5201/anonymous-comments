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
  orderByChild
} from "firebase/database";
import { getDate, toggleModal } from "utils/helpers";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  connectAuthEmulator,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
    connectAuthEmulator
} from "firebase/auth";
import { stubString } from "lodash";
import {
  httpsCallable,
  getFunctions,
  connectFunctionsEmulator,
} from "firebase/functions";
import {
  comment,
  commentReply,
  extractReplies,
  replyForm,
} from "utils/comments";
import { Modal } from "bootstrap/dist/js/bootstrap.esm.min.js";

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
const auth = getAuth();
const db = getDatabase();
const functions = getFunctions(app);

if (location.hostname === "localhost") {
  connectFunctionsEmulator(functions, "localhost", 5001);
    connectAuthEmulator(auth, 'http://localhost:9099')
}
const path = window.location.pathname;
const commentRef = ref(db, `messages${path}`);
const commentFormInputs = $("#comment-form :input");
const googleProvider = new GoogleAuthProvider();



onAuthStateChanged(auth, (user) => {
  const userData = localStorage.getItem("userData");
  if (user) {


    if(window.location.href.includes("login")){

   console.log("login", window.location)
    console.log(user);
let history = localStorage.getItem("page-history") || "/"
window.location.replace(history)
    }

  }
});

function loginNav (){

  console.log('login nav user login')
}

function logoutNav (){

    console.log('login nav user already logged in')

}


function writeUserData(userId, userInfo) {
  return set(ref(db, "users"), userInfo);
}

async function getIp() {
  const query = await fetch(`https://ipapi.co/json`, { method: "GET" });
  if (query.status !== 200) {
    alert(query.status);
    return;
  }

  const data = await query.json();

  return data;
}
 function googleSignin() {
  signInWithRedirect(auth, googleProvider);
}
 function googleSignOut() {
  signOut(auth);
}

function checkIfUserExists(data) {
  const uid = data.uid;
  const userRef = ref(db, `users`);
  const users = [];
  return get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const map = new Map(Object.entries(data));
        const values = Array.from(map.values());
        console.log(values);
        for (let index = 0; index < values.length; index++) {
          const element = values[index];
          console.log(index, element.id);
          if (element.id == uid) {
            console.log("user already exists");
            break;
          } else {
            console.log("user does not exist");
          }
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
function checkIfAnonymousUserExists() {
  const userRef = ref(db, `anonymousUsers`);
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const map = new Map(Object.entries(data));

        for (const [key, value] of map.entries()) {
          console.log(key, value);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

async function writeUsertoDatabase(data) {
  get(db, `users/${data.uid}`).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
   const userListRef = ref(db, `users/${data.uid}`);

  const newPostRef = push(userListRef);
return   set(newPostRef, data);
  }
}).catch((error) => {
  console.error(error);
  return error
})  .finally(() => {
let msg = "Promise complete"
    console.log('Promise completed');
    return msg
  });


}
 async function createRandomUser() {
  const ipAddress = await getIp();

 return signInAnonymously(auth)
    .then((data) => {
      let ip = ipAddress || null;

      let userInfo = {
        uid: data.user.uid,
        emailVerified: data.user.emailVerified,
        isAnonymous: data.user.isAnonymous,
        metadata: data.user.metadata,
        ip: ip,
      };
      let userData = JSON.stringify(userInfo);
      localStorage.setItem("userData", userData);
      console.log(userInfo);

      return userInfo

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return error
    });
}

 async function handleComment(message, name, userData, path) {
  const addComment = httpsCallable(functions, "addComment");
  const prettyDate = getDate();

  addComment({
    text: message,
    name: name,
    uid: userData,
    page: path,
  })
    .then(function (result) {
      // Read result of the Cloud Function.
      let sanitizedMessage = result.data.text;
      let sanitizedName = result.data.name;
      const documentId = result.data.id;

      if (message !== sanitizedMessage) {
        toggleModal("fail");

        $("#comment-btn").disabled = false;
        $("#comment-btn").html("Submit");
        for (let index = 0; index < commentFormInputs.length; index++) {
          const element = commentFormInputs[index];
          element.value = "";
        }
      } else {
        const newCommentData = {
          id: documentId,
          name: sanitizedName,
          date: prettyDate,
          message: sanitizedMessage,
        };
        const newComment = push(commentRef);
        set(newComment, newCommentData);
        $("#comment-btn").disabled = false;
        $("#comment-btn").html("Submit");
        for (let index = 0; index < commentFormInputs.length; index++) {
          const element = commentFormInputs[index];
          element.value = "";
        }

        let commentComponent = comment(
          documentId,
          sanitizedName,
          prettyDate,
          sanitizedMessage,
          "",
          ""
        );
        toggleModal("success");
        $("#comment-section").append(commentComponent);
        $("#comment-btn").disabled = false;
      }
    })
    .catch(function (error) {
      // Getting the Error details.
      let code = error.code;
      let message = error.message;
      let details = error.details;
      console.error(
        "There was an error when calling the Cloud Function",
        error
      );
      window.alert(
        "There was an error when calling the Cloud Function:\n\nError Code: " +
          code +
          "\nError Message:" +
          message +
          "\nError Details:" +
          details
      );
      addCommentButton.disabled = false;
    });
}

 function getUser() {

    let result = auth.currentUser ? auth.currentUser : null;

 return result




}
  $("#login-link-icon").on("click", function (e) {
    e.preventDefault();
   localStorage.setItem("page-history", window.location.href)
   window.location.replace("/login")
  });
setTimeout(() => {

if($("#mainNav")){
if(auth.currentUser){

  console.log(auth.currentUser.uid)
  let logoutNav = `    <div class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="login-link-icon"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) -->
              <path
                d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
              /></svg
          ></a>
          <ul class="dropdown-menu" aria-labelledby="login-link-icon">
            <li><a class="dropdown-item" href="#">New project...</a></li>
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <a id="sign-out" class="dropdown-item" href="#">Sign out</a>
            </li>
          </ul>
        </div>`
  $("#user-profile").html(logoutNav);
}
else {

  console.log("no user timed")
}



}




}, 1000);


  $("#user-profile").on("click", "#sign-out", function (e) {
    e.preventDefault();
    console.log(e)
    signOut(auth)
      .then(() => {
        let myModal = new Modal(document.getElementById("modalSignOut"));
        myModal.toggle();
      })
      .catch((error) => {});
  });

