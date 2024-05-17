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

const handleDelete = (shiftId) => {
  deleteDoc(doc(db, "cities", shiftId))
    .then(() => {
      alert("Shift Deleted!");
      window.location.reload();
    })
    .catch(() => alert("Something Went Worn!"));
};

async function getShiftsFromFirestore(userId) {
  try {
    // שאילתת המשמרות של המשתמש לפי מזהה המשתמש (UserId)
    const q = query(collection(db, "shifts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    // המרת התוצאות למערך של משמרות
    const shifts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return shifts;
  } catch (error) {
    console.error("Error getting shifts from Firestore:", error);
    return [];
  }
}

function calculateHours(startTime, endTime, hourlyWage) {
  // Parse start time
  var startParts = startTime.split(":");
  var startHour = parseInt(startParts[0]);
  var startMinute = parseInt(startParts[1]);

  // Parse end time
  var endParts = endTime.split(":");
  var endHour = parseInt(endParts[0]);
  var endMinute = parseInt(endParts[1]);

  // Calculate total minutes for start and end time
  var totalStartMinutes = startHour * 60 + startMinute;
  var totalEndMinutes = endHour * 60 + endMinute;

  // Calculate the difference in minutes
  var differenceMinutes = totalEndMinutes - totalStartMinutes;

  // Calculate hours and minutes
  var hours = Math.floor(differenceMinutes / 60);
  var minutes = differenceMinutes % 60;

  let totalHours = hours + minutes / 60;

  let salary = totalHours * hourlyWage;

  return Math.ceil(salary);
}

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

async function updateTable() {
  // אחזור מזהה המשתמש הנוכחי מתוך LocalStorage
  const userId = localStorage.getItem("userId");

  // אחזור המשמרות מ-Firestore
  const shifts = await getShiftsFromFirestore(userId);

  // עדכון הטבלה עם המשמרות מ-Firestore
  const tbody = document.querySelector(".shifts-table tbody");
  tbody.innerHTML = "";

  shifts.forEach((shift) => {
    const row = tbody.insertRow();
    row.innerHTML = `
          <td>${shift.date}</td>
          <td>${shift.startTime}</td>
          <td>${shift.endTime}</td>
          <td>${shift.hourlyWage}</td>
          <td>${shift.role}</td>
          <td>${shift.branch}</td>
          <td>${calculateHours(
            shift.startTime,
            shift.endTime,
            shift.hourlyWage
          )}</td>
          <td> <button class="btn-delete">Delete</button> </td>
      `;
  });

  // הוספת שורת סיכום לטבלה
  const totalRow = tbody.insertRow();
  totalRow.innerHTML = `<td colspan="6">סה"כ שכר</td><td>${calculateTotalSalary(
    shifts
  )}</td>`;
}

async function getUserIdByEmail(email) {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    } else {
      console.log(`No user found for email: ${email}`);
      return null;
    }
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateTable(); // עדכון הטבלה בזמן טעינת הדף
});
