import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
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

async function getShiftsFromFirestore(userId) {
  try {
    // שאילתת המשמרות של המשתמש לפי מזהה המשתמש (UserId)
    const q = query(collection(db, "shifts"), where("userId", "==", userId));
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
  const userId = localStorage.getItem("userId");
  const shifts = await getShiftsFromFirestore(userId);
  console.log(shifts);

  let totalHourlyWages = 0;

  for (let i = 0; i < shifts.length; i++) {
    // Add the value of the 'pet' property of each object to the totalPets variable
    totalHourlyWages += parseInt(shifts[i].hourlyWage);
  }
  const averageHourlyWage = totalHourlyWages / shifts.length;

  function calculateTotalSalary(shifts) {
    let totalSalary = 0;

    shifts.forEach((shift) => {
      const startTime = new Date(`2000-01-01T${shift.startTime}`);
      const endTime = new Date(`2000-01-01T${shift.endTime}`);
      const hoursWorked = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours
      const salaryForShift = Math.ceil(hoursWorked) * shift.hourlyWage;
      totalSalary += salaryForShift;
    });
    return Math.ceil(totalSalary);
  }
  const totalShiftWages = calculateTotalSalary(shifts);

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
  ).innerHTML = `<h1>${averageHourlyWage}</h1> <p>שכר שעתי ממוצע:</p>`;
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

updateMetrics();

setTimeout(() => window.location.reload(), 7000);
