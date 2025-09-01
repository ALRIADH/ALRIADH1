// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";

// تكوين Firebase (RDF-web)
const firebaseConfig = {
  apiKey: "AIzaSyCXeOtXWIc1qyDIxh4EPu1nxmGswrNiqLo",
  authDomain: "password-a409.firebaseapp.com",
  databaseURL: "https://password-a409-default-rtdb.firebaseio.com",
  projectId: "password-a409",
  storageBucket: "password-a409.firebasestorage.app",
  messagingSenderId: "883669716957",
  appId: "1:883669716957:web:e9c1222757dd10f3497034",
  measurementId: "G-B3DBSGVC7T"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// تسجيل الدخول
export async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const q = query(collection(db, "members"), where("username", "==", username));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("اسم المستخدم غير موجود");
    return;
  }

  querySnapshot.forEach((docSnap) => {
    const userData = docSnap.data();
    if (userData.password === password) {
      localStorage.setItem("uid", docSnap.id);
      window.location.href = "profile.html";
    } else {
      alert("كلمة المرور خطأ");
    }
  });
}

// صفحة العضو
export async function loadProfile() {
  const uid = localStorage.getItem("uid");
  if(!uid){
    window.location.href = "index.html";
    return;
  }
  const docRef = doc(db, "members", uid);
  const docSnap = await getDoc(docRef);
  if(docSnap.exists()){
    document.getElementById("userName").innerText = docSnap.data().username;
    document.getElementById("userData").innerText = docSnap.data().extraData;
  }
}

// خروج
export function logout(){
  localStorage.removeItem("uid");
  window.location.href="index.html";
}

// تحميل بيانات العضو إذا الصفحة profile.html
if (window.location.pathname.includes("profile.html")) {
  loadProfile();
}
