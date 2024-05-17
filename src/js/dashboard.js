import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
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

async function getShiftsFromFirestore() {
  try {
    // שאילתת המשמרות של המשתמש לפי מזהה המשתמש (UserId)
    const q = collection(db, "shifts");
    const querySnapshot = await getDocs(q);

    // המרת התוצאות למערך של משמרות
    const shifts = querySnapshot.docs.map((doc) => doc.data());
    return shifts;
  } catch (error) {
    console.error("Error getting shifts from Firestore:", error);
    return [];
  }
}

async function updateMetrics() {
  const shifts = await getShiftsFromFirestore();

  const totalHourlyWages = shifts.reduce(
    (total, shift) => total + shift.hourlyWage,
    0
  );
  const averageHourlyWage = totalHourlyWages / shifts.length;

  const totalShiftWages = shifts.reduce(
    (total, shift) => total + shift.shiftWage,
    0
  );
  const averageShiftWage = totalShiftWages / shifts.length;

  const branchesCount = {};
  shifts.forEach((shift) => {
    branchesCount[shift.branch] = (branchesCount[shift.branch] || 0) + 1;
  });
  const mostWorkedBranch = Object.keys(branchesCount).reduce((a, b) =>
    branchesCount[a] > branchesCount[b] ? a : b
  );

  const rolesWages = {};
  shifts.forEach((shift) => {
    rolesWages[shift.role] = (rolesWages[shift.role] || 0) + shift.shiftWage;
  });
  const highestPayingRole = Object.keys(rolesWages).reduce((a, b) =>
    rolesWages[a] > rolesWages[b] ? a : b
  );

  document.getElementById(
    "average-hourly-wage"
  ).innerHTML = `<h1>${averageHourlyWage.toFixed(
    2
  )}</h1> <p>שכר שעתי ממוצע:</p>`;
  document.getElementById(
    "average-shift-wage"
  ).innerHTML = `<h1>${averageShiftWage.toFixed(
    2
  )}</h1> <p>שכר משמרת ממוצע: </p>`;
  document.getElementById(
    "most-worked-branch"
  ).innerHTML = `<h1>${mostWorkedBranch}</h1> <p>הסניף הכי פעיל: </p>`;
  document.getElementById(
    "highest-paying-role"
  ).innerHTML = `<h1>${highestPayingRole}</h1> <p>התפקיד הכי משתלם: </p>`;
}

setTimeout(updateMetrics(), 60000);
