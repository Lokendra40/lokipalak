const firebaseConfig = {
  apiKey: "AIzaSyAQgnX8FIeTSscK6vM6_qUmkWbqVRqt_-M",
  authDomain: "lokipalak.firebaseapp.com",
  projectId: "lokipalak",
  storageBucket: "lokipalak.firebasestorage.app",
  messagingSenderId: "872528306988",
  appId: "1:872528306988:web:017cac1caf6ae1de9e8289",
  measurementId: "G-8E0PDM8D65"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const sharedDoc = db.collection("siteData").doc("sharedState");
