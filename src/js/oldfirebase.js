import { Modal } from "bootstrap/dist/js/bootstrap.esm.min.js";
import { initializeApp } from "firebase/app";
import {
  getAuth, GoogleAuthProvider, onAuthStateChanged,
  signInAnonymously, signInWithRedirect, signOut
} from "firebase/auth";
import {
  get, getDatabase, push, ref,
  set
} from "firebase/database";
import {
  connectFunctionsEmulator, getFunctions, httpsCallable
} from "firebase/functions";
import {
  comment, replyForm
} from "utils/comments";
import { getDate, toggleModal } from "utils/helpers";

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
 const prettyDate = getDate();
if (location.hostname === "localhost") {
  connectFunctionsEmulator(functions, "localhost", 5001);

}
const path = window.location.pathname;
const commentRef = ref(db, `messages${path}`);
const commentFormInputs = $("#comment-form :input");
const googleProvider = new GoogleAuthProvider();

// login-link-text login-link-icon

onAuthStateChanged(auth, (user) => {
  const userData = localStorage.getItem("userData");
  if (user) {


    if (window.location.href.includes("login")) {

  
      let history = localStorage.getItem("page-history") || "/"
      window.location.replace(history)
    }

  }
});



function writeUserData(userId, userInfo) {
  return set(ref(db, "users"), userInfo);
}

export async function getIp() {
  const query = await fetch(`https://ipapi.co/json`, { method: "GET" });
  if (query.status !== 200) {
    alert(query.status);
    return;
  }

  const data = await query.json();
  let lat = data.latitude
  let lon = data.longitude
  let obj = { lat: lat, lon: lon }
  localStorage.setItem("userlocation", `${JSON.stringify(obj)}`)

  return data;
}
export function googleSignin() {
  return signInWithRedirect(auth, googleProvider);
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
      return set(newPostRef, data);
    }
  }).catch((error) => {
    console.error(error);
    return error
  }).finally(() => {
    let msg = "Promise complete"
    console.log('Promise completed');
    return msg
  });


}
export async function createRandomUser() {
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

export async function handleComment(message, name, userData, path) {
  const addComment = httpsCallable(functions, "addComment");
 

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
  

       $('#comment-btn').prop("disabled", false);
        $("#comment-btn").html("Submit");
        for (let index = 0; index < commentFormInputs.length; index++) {
          const element = commentFormInputs[index];
          element.value = "";
        }
              toggleModal("fail");
      } else if (message == sanitizedMessage) {
        const newCommentData = {
          id: documentId,
          name: sanitizedName,
          date: prettyDate,
          message: sanitizedMessage,
        };
        const newComment = push(commentRef);
        set(newComment, newCommentData);
      
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
            $('#comment-btn').prop("disabled", false);
        $("#comment-btn").html("Submit");
        toggleModal("success");
        $("#comment-section").append(commentComponent);
   
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
     $('#comment-btn').prop("disabled", false);
        $("#comment-btn").html("Submit");
    });
}

if ( !window.location.pathname.includes( "login" ) )
{

  

  $( "#mainNav" ).on( "click", "#sign-out", function ( e ) {
    

  e.preventDefault();
  console.log(e)
  signOut(auth)
    .then(() => {
    let myModal = new Modal(document.getElementById("modalSignOut"));
      myModal.toggle();
      toggleLogInNav()
       


    })
    .catch( ( error ) => {} );
   
  }
  
  
  
  );


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

  if ($("#mainNav")) {
    if (auth.currentUser) {

      toggleLogOutNav()
      if ( $( '#comment-form' ) )
      {
               $('#panelsStayOpen-collapseOne').addClass("d-none")


      }
    }
    else {
      toggleLogInNav()

    }



  }

}, 1000 );


function toggleLogOutNav () {
  
        let logoutNav = `    <div class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="login-link-icon"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 448 512">
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

function toggleLogInNav () {
  
      let loginNav = `
                          <div class="nav-item">
                            <a class="nav-link" href="/login" id="login-link-icon">
                              <svg width="15px" xmlns="https://www.w3.org/2000/svg" viewBox="0 0
                                448 512">
                                <!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) -->
                                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0
                                  224 0 96 57.3 96 128s57.3 128 128 128zm89.6
                                  32h-16.7c-22.2 10.2-46.9 16-72.9
                                  16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0
                                  422.4V464c0 26.5 21.5 48 48 48h352c26.5 0
                                  48-21.5
                                  48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg></a>

                            </div>
                         `
      
       $("#user-profile").html(loginNav);
}
export async function sanitizeReply(message, name, userData, path) {
  const addComment = httpsCallable(functions, "addComment");
 

  return addComment({
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
      const userid = result.data.uid

      if (message !== sanitizedMessage) {
        let returnmessage = "user is swearing"
         return returnmessage
     
           
      } else if (message == sanitizedMessage) {
        const newCommentData = {
          id: documentId,
          name: sanitizedName,
          date: prettyDate,
          message: sanitizedMessage,
          uid: userid,
          status: true
        };
       return newCommentData
   
      }
      return result
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
   return error
    });
}
export function addCommentMessage(data) {
  const path = window.location.pathname;
  const addComment = httpsCallable(functions, "addComment");
    const docId = data.docId

  


  addComment({
    text: data.cleanMessage,
    name: data.cleanName,
    uid: data.uid,
    page: path,
  })
    .then(function (result) {

      // Read result of the Cloud Function.
      let sanitizedMessage = result.data.text;
      let sanitizedName = result.data.name;

      if (data.cleanMessage !== sanitizedMessage) {
      
        let message = `message ${ cleanMessage } was not clean`
        return message
      } else
      {
      
       return get(commentRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const map = new Map(Object.entries(data));

              for (const [key, value] of map.entries()) {
                if (value.id == docId) {
                  const postListRef = ref(
                    db,
                    `messages${path}${key}/replies`
                  );
                    let messageContent = {
                    name: data.sanitizedName,
                    id: data.uid,
                    message: data.sanitizedMessage,
                    date: prettyDate,
                    recipient: value.id,
                 } 
                  const newPostRef = push(postListRef);
                 set(newPostRef, messageContent);
                  return messageContent
                }
              }
              
            } 
          })
          .catch((error) => {
            console.error( error );
            return error
          });

  
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
    return error
    });
}



export default { addCommentMessage, googleSignin, createRandomUser, getIp, sanitizeReply }
