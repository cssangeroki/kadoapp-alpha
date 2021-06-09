import firebase from "firebase";
var config = {
    apiKey: "AIzaSyAsQsADg339lsnM48Y4H96uhKTrR2YS5PU",
    authDomain: "kado-76995.firebaseapp.com",
    databaseURL: "https://kado-76995.firebaseio.com",
    projectId: "kado-76995",
    storageBucket: "kado-76995.appspot.com",
    messagingSenderId: "465213085244",
    appId: "1:465213085244:web:4e1af3a3aecd2e15319539",
    measurementId: "G-CJD3S8CZ37"
  };



const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.firestore();
export { db };

//
// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/7.17.2/firebase-app.js"></script>
//
// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/7.17.2/firebase-analytics.js"></script>
//
// <script>
//   // Your web app's Firebase configuration
//   var firebaseConfig = {
//     apiKey: "AIzaSyAsQsADg339lsnM48Y4H96uhKTrR2YS5PU",
//     authDomain: "kado-76995.firebaseapp.com",
//     databaseURL: "https://kado-76995.firebaseio.com",
//     projectId: "kado-76995",
//     storageBucket: "kado-76995.appspot.com",
//     messagingSenderId: "465213085244",
//     appId: "1:465213085244:web:4e1af3a3aecd2e15319539",
//     measurementId: "G-CJD3S8CZ37"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();
// </script>
