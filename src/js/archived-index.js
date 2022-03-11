/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * FirebaseUI initialization to be used in a Single Page application context.
 */

/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Common methods for both the main app page and standalone widget.
 */

 var config = {
  apiKey: "AIzaSyBCU8RRxV3qaSyxOgc4ObSWmUhlfnJsYTo",
  authDomain: "geotools-bc75a.firebaseapp.com",
  projectId: "geotools-bc75a",
  storageBucket: "geotools-bc75a.appspot.com",
  messagingSenderId: "106157954659",
  appId: "1:106157954659:web:3e189110236a2138438a56",
  measurementId: "G-Z6GK19K3L0"
};
firebase.initializeApp(config);


// Google OAuth Client ID, needed to support One-tap sign-up.
// Set to null if One-tap sign-up is not supported.
 var CLIENT_ID =
    '515354421134-d9vqdsf0ilnjpfh0iuv9jn4qlcfmuj79.apps.googleusercontent.com';

/**
 * @return {string} The reCAPTCHA rendering mode from the configuration.
 */
 function getRecaptchaMode() {
  var config = parseQueryString(location.hash);
  return config['recaptcha'] === 'invisible' ?
      'invisible' : 'normal';
}


/**
 * @return {string} The email signInMethod from the configuration.
 */
function getEmailSignInMethod() {
  var config = parseQueryString(location.hash);
  return config['emailSignInMethod'] === 'password' ?
      'password' : 'emailLink';
}


/**
 * @return {boolean} The disable sign up status from the configuration.
 */
function getDisableSignUpStatus() {
  var config = parseQueryString(location.hash);
  return config['disableEmailSignUpStatus'] === 'true';
}


/**
 * @return {boolean} The admin restricted operation status from the configuration.
 */
function getAdminRestrictedOperationStatus() {
  var config = parseQueryString(location.hash);
  return config['adminRestrictedOperationStatus'] === 'true';
}


/**
 * @param {string} queryString The full query string.
 * @return {!Object<string, string>} The parsed query parameters.
 */
function parseQueryString(queryString) {
  // Remove first character if it is ? or #.
  if (queryString.length &&
      (queryString.charAt(0) == '#' || queryString.charAt(0) == '?')) {
    queryString = queryString.substring(1);
  }
  var config = {};
  var pairs = queryString.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    if (pair.length == 2) {
      config[pair[0]] = pair[1];
    }
  }
  return config;
}



document.addEventListener("DOMContentLoaded", () => {

/**
 * @return {string} The reCAPTCHA rendering mode from the configuration.
 */
  function getUiConfig() {
   return {
     'callbacks': {
       // Called when the user has been successfully signed in.
       'signInSuccessWithAuthResult': function(authResult, redirectUrl) {
         if (authResult.user) {
           handleSignedInUser(authResult.user);
         }
         if (authResult.additionalUserInfo) {
           document.getElementById('is-new-user').textContent =
               authResult.additionalUserInfo.isNewUser ?
               'New User' : 'Existing User';
         }
         // Do not redirect.
         return false;
       }
     },
     // Opens IDP Providers sign-in flow in a popup.
     'signInFlow': 'popup',
     'signInOptions': [
       // TODO(developer): Remove the providers you don't need for your app.
       {
         provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
         // Required to enable ID token credentials for this provider.
         clientId: CLIENT_ID
       },


       {
         provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
         // Whether the display name should be displayed in Sign Up page.
         requireDisplayName: true,
         signInMethod: getEmailSignInMethod(),
         disableSignUp: {
           status: getDisableSignUpStatus()
         }
       },


     ],
     // Terms of service url.
   //  'tosUrl': 'https://www.google.com',
     // Privacy policy url.
    // 'privacyPolicyUrl': 'https://www.google.com',
     'credentialHelper': CLIENT_ID && CLIENT_ID != 'YOUR_OAUTH_CLIENT_ID' ?
         firebaseui.auth.CredentialHelper.GOOGLE_YOLO :
         firebaseui.auth.CredentialHelper.NONE,
     'adminRestrictedOperation': {
       status: getAdminRestrictedOperationStatus()
     }
   };
 }

 // Initialize the FirebaseUI Widget using Firebase.
 var ui = new firebaseui.auth.AuthUI(firebase.auth());
 // Disable auto-sign in.
 ui.disableAutoSignIn();


 /**
  * @return {string} The URL of the FirebaseUI standalone widget.
  */
 function getWidgetUrl() {
   return '/widget#recaptcha=' + getRecaptchaMode() + '&emailSignInMethod=' +
       getEmailSignInMethod() + '&disableEmailSignUpStatus=' +
       getDisableSignUpStatus() + '&adminRestrictedOperationStatus=' +
       getAdminRestrictedOperationStatus();
 }


 /**
  * Redirects to the FirebaseUI widget.
  */
 var signInWithRedirect = function() {
   window.location.assign(getWidgetUrl());
 };


 /**
  * Open a popup with the FirebaseUI widget.
  */
 var signInWithPopup = function() {
   window.open(getWidgetUrl(), 'Sign In', 'width=985,height=735');
 };

 $(document).ready(function () {
  console.log('jquery works')
});
 /**
  * Displays the UI for a signed in user.
  * @param {!firebase.User} user
  */
 var handleSignedInUser = function() {

   document.getElementById('sign-in').style.display = 'block';
   document.getElementById('sign-in').style.display = 'none';


 };


 /**
  * Displays the UI for a signed out user.
  */
 var handleSignedOutUser = function() {
   document.getElementById('sign-in').style.display = 'none';
   document.getElementById('sign-in').style.display = 'block';

 };

 // Listen to change in auth state so it displays the correct UI for when
 // the user is signed in or not.
 firebase.auth().onAuthStateChanged(function(user) {

   user ? handleSignedInUser(user) : handleSignedOutUser();
 });

 /**
  * Deletes the user's account.
  */
 var deleteAccount = function() {
   firebase.auth().currentUser.delete().catch(function(error) {
     if (error.code == 'auth/requires-recent-login') {
       // The user's credential is too old. She needs to sign in again.
       firebase.auth().signOut().then(function() {
         // The timeout allows the message to be displayed after the UI has
         // changed to the signed out state.
         setTimeout(function() {
           alert('Please sign in again to delete your account.');
         }, 1);
       });
     }
   });
 };


 /**
  * Handles when the user changes the reCAPTCHA, email signInMethod or email
  * disableSignUp config.
  */
 function handleConfigChange() {
   var newRecaptchaValue = document.querySelector(
       'input[name="recaptcha"]:checked').value;
   var newEmailSignInMethodValue = document.querySelector(
       'input[name="emailSignInMethod"]:checked').value;
   var currentDisableSignUpStatus =
       document.getElementById("email-disableSignUp-status").checked;
   var currentAdminRestrictedOperationStatus =
       document.getElementById("admin-restricted-operation-status").checked;
   location.replace(
       location.pathname + '#recaptcha=' + newRecaptchaValue +
       '&emailSignInMethod=' + newEmailSignInMethodValue +
       '&disableEmailSignUpStatus=' + currentDisableSignUpStatus +
       '&adminRestrictedOperationStatus=' +
       currentAdminRestrictedOperationStatus);
   // Reset the inline widget so the config changes are reflected.
   ui.reset();
   ui.start('#firebaseui-container', getUiConfig());
 }


 /**
  * Initializes the app.
  */
 var initApp = function() {
   document.getElementById('sign-in-with-redirect').addEventListener(
       'click', signInWithRedirect);
   document.getElementById('sign-in-with-popup').addEventListener(
       'click', signInWithPopup);
   document.getElementById('sign-out').addEventListener('click', function() {
     firebase.auth().signOut();
   });
   document.getElementById('delete-account').addEventListener(
       'click', function() {
         deleteAccount();
       });

   document.getElementById('recaptcha-normal').addEventListener(
       'change', handleConfigChange);
   document.getElementById('recaptcha-invisible').addEventListener(
       'change', handleConfigChange);
   // Check the selected reCAPTCHA mode.
   document.querySelector(
       'input[name="recaptcha"][value="' + getRecaptchaMode() + '"]')
       .checked = true;

   document.getElementById('email-signInMethod-password').addEventListener(
       'change', handleConfigChange);
   document.getElementById('email-signInMethod-emailLink').addEventListener(
       'change', handleConfigChange);
   // Check the selected email signInMethod mode.
   document.querySelector(
       'input[name="emailSignInMethod"][value="' + getEmailSignInMethod() + '"]')
       .checked = true;
   document.getElementById('email-disableSignUp-status').addEventListener(
       'change', handleConfigChange);
   document.getElementById("email-disableSignUp-status").checked =
       getDisableSignUpStatus();
   document.getElementById('admin-restricted-operation-status').addEventListener(
       'change', handleConfigChange);
   document.getElementById("admin-restricted-operation-status").checked =
       getAdminRestrictedOperationStatus();
 };

$(document).ready(function () {


  $('#sign-out').on('click', function () {
    firebase.auth().signOut();

  });

});
 //window.addEventListener('load', initApp);



});


