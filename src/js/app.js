import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

const withAuth = document.querySelector(".with-auth");
const withoutAuth = document.querySelector(".without-auth");

const renderNav = () => {
  if (isAuthenticated) withoutAuth.classList.add("remove");
  if (!isAuthenticated) withAuth.classList.add("remove");
};
renderNav();

const docRef = doc(db, "users", isAuthenticated);
const docSnap = await getDoc(docRef);

const name = document.getElementById("user-name");

if (docSnap.exists()) {
  name.innerText = docSnap.data().firstName;
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("userId");
  window.location.href = "/pages/login.html";
});
