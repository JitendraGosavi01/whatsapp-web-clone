import firebase from 'firebase'


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAlxEdRB3G5u5w5nhJKeA7pWGf9lypIOlU",
    authDomain: "absolute-range-101210.firebaseapp.com",
    projectId: "absolute-range-101210",
    storageBucket: "absolute-range-101210.appspot.com",
    messagingSenderId: "4087351206",
    appId: "1:4087351206:web:2be207471a40b644a97167",
    measurementId: "G-13776Y0VS3"
};


// Initialize Firebase

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()
export { auth, provider }
export default db;
