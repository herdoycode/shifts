import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
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

const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const userId = localStorage.getItem("userId");
  const date = document.getElementById("date").value;
  const startTime = document.getElementById("start-time").value;
  const endTime = document.getElementById("end-time").value;
  const hourlyWage = document.getElementById("hourly-wage").value;
  const role = document.getElementById("role").value;
  const branch = document.getElementById("branch").value;

  if (!date || !startTime || !endTime || !hourlyWage || !role || !branch) {
    alert("Not allow to mepty");
  }

  const newShift = {
    userId,
    date,
    startTime,
    endTime,
    hourlyWage,
    role,
    branch,
  };

  addDoc(collection(db, "shifts"), newShift)
    .then(() => {
      alert("Shift added successfully");
      window.location.href = "/pages/view-shifts.html";
    })
    .catch(() => alert("Something went worn!"));
});
