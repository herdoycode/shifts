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

async function updateTable() {
  // אחזור מזהה המשתמש הנוכחי מתוך LocalStorage
  const userId = localStorage.getItem("userId");

  // אחזור המשמרות מ-Firestore
  const shifts = await getShiftsFromFirestore(userId);

  // עדכון הטבלה עם המשמרות מ-Firestore
  const tbody = document.querySelector(".shifts-table tbody");
  tbody.innerHTML = "";

  let totalWages = 0;

  shifts.forEach((shift) => {
    const row = tbody.insertRow();
    row.innerHTML = `
          <td>${shift.date}</td>
          <td>${shift.startTime}</td>
          <td>${shift.endTime}</td>
          <td>${shift.hourlyWage}</td>
          <td>${shift.role}</td>
          <td>${shift.branch}</td>
          <td>${shift.hourlyWage * 3}</td>
          <td> <button class="btn-delete">Delete</button> </td>
      `;
    totalWages += shift.hourlyWage;
  });

  // הוספת שורת סיכום לטבלה
  const totalRow = tbody.insertRow();
  totalRow.innerHTML = `<td colspan="6">סה"כ שכר</td><td>${totalWages}</td>`;
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
