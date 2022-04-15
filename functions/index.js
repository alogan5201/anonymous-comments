/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use-scrict";
// projects/660236032468/secrets/mapbox/versions/1
const functions = require("firebase-functions");
const sanitizer = require("./sanitizer");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
admin.initializeApp();

// [START allAdd]
// [START addFunctionTrigger]
// Adds two numbers to each other.
exports.addNumbers = functions.https.onCall((data) => {
// [END addFunctionTrigger]
  // [START readAddData]
  // Numbers passed from the client.
  const firstNumber = data.firstNumber;
  const secondNumber = data.secondNumber;
  // [END readAddData]

  // [START addHttpsError]
  // Checking that attributes are present and are numbers.
  if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with " +
        "two arguments 'firstNumber' and 'secondNumber' which must both be numbers.");
  }
  // [END addHttpsError]

  // [START returnAddData]
  // returning result.
  return {
    firstNumber: firstNumber,
    secondNumber: secondNumber,
    operator: "+",
    operationResult: firstNumber + secondNumber,
  };
  // [END returnAddData]
});
// [END allAdd]

// [START messageFunctionTrigger]
// Saves a message to the Firebase Realtime Database but sanitizes the text by removing swearwords.
exports.addComment= functions.https.onCall((data, context) => {

  const text = data.text;
  const name = data.name
const uid = data.uid
const page = data.page
 if (!(typeof text === "string") || text.length === 0) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with " +
        "one arguments 'text' containing the message text to add.");
  }

  const authenticated = context.auth ? context.auth.uid : null;

  // [END authIntegration]


  // [START returnMessageAsync]
  // Saving the new message to the Realtime Database.
   // Sanitize the message.

  const sanitizedName = sanitizer.sanitizeText(name);


  const sanitizedMessage = sanitizer.sanitizeText(text); // Sanitize the message.
  return admin.database().ref(`/messages${page}`).push({
    text: sanitizedMessage,
    author: { uid, name},
  }).then(() => {
    console.log('New Message written');
    // Returning the sanitized message to the client.
    return { text: sanitizedMessage, name: sanitizedName, uid: uid };
  })
  // [END returnMessageAsync]
    .catch((error) => {
    // Re-throwing the error as an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('unknown', error.message, error);
    });
  // [END_EXCLUDE]
});
// [END messageFunctionTrigger]
