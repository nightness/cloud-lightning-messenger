// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.6.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.3/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBHpKV6SSJImZK1vJPGiJwKnogLBMkgfro",
    authDomain: "cloud-lightning.firebaseapp.com",
    databaseURL: "https://cloud-lightning.firebaseio.com",
    projectId: "cloud-lightning",
    storageBucket: "cloud-lightning.appspot.com",
    messagingSenderId: "357266467361",
    appId: "1:357266467361:web:627d7e1b7817256cfbd160",
    measurementId: "G-CFXNQMD10X"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messenging = firebase.messaging();
