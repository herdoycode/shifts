import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVFO8Sit3lhbw7buYAFX2yP_rtb75imoo",
  authDomain: "fire-auth-913ff.firebaseapp.com",
  databaseURL: "https://fire-auth-913ff-default-rtdb.firebaseio.com",
  projectId: "fire-auth-913ff",
  storageBucket: "fire-auth-913ff.appspot.com",
  messagingSenderId: "375622834450",
  appId: "1:375622834450:web:5e5e366a37f8fbc1d53bcb",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const isAuthenticated = localStorage.getItem("userId");

const checkStatus = () => {
  if (!isAuthenticated) return (window.location.href = "/pages/login.html");
};
checkStatus();

const docRef = doc(db, "users", isAuthenticated);
const docSnap = await getDoc(docRef);

const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const username = document.getElementById("username");
const age = document.getElementById("age");
const email = document.getElementById("email");

if (docSnap.exists()) {
  firstName.value = docSnap.data().firstName;
  lastName.value = docSnap.data().lastName;
  username.value = docSnap.data().username;
  age.value = docSnap.data().age;
  email.value = docSnap.data().email;
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}

const submitBtn = document.getElementById("submitBtn");
const userId = localStorage.getItem("userId");

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const docRef = doc(db, "users", userId);
  const updatedUser = {
    firstName: firstName.value,
    lastName: lastName.value,
    username: username.value,
    email: email.value,
    age: age.value,
  };
  setDoc(docRef, updatedUser)
    .then(() => {
      alert("User Updated!");
      window.location.reload();
    })
    .catch(() => alert("Something went worn"));
});
