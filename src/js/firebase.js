import { initializeApp } from "firebase/app";
import {
  getDatabase,
  push,
  ref,
  set,
  get,
  onValue,
  increment,
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
}
const path = window.location.pathname;
const commentRef = ref(db, `messages${path}`);
const commentFormInputs = $("#comment-form :input");
const googleProvider = new GoogleAuthProvider();

onAuthStateChanged(auth, (user) => {
  const userData = localStorage.getItem("userData");
  if (user) {
    console.log(user);
    /*
    if (user.isAnonymous) {
      checkIfAnonymousUserExists(user);
    } else {
      checkIfUserExists(user);
    }*/

    //  writeUsertoDatabase(user)
  } else {
    console.log("no user");
    /*   if (!userData) {
      createRandomUser();
    }*/
  }
});

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
export function googleSignin() {
  signInWithRedirect(auth, googleProvider);
}
export function googleSignOut() {
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
export async function createRandomUser() {
  const ipAddress = await getIp();

  signInAnonymously(auth)
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

     
    await  writeUserData(userInfo);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

export async function handleComment(message, name, userData, path) {
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

export function getUser() {
  let result = auth.currentUser ? auth.currentUser : null;
  return result;
}
export default { handleComment, googleSignin, googleSignOut, getUser };
