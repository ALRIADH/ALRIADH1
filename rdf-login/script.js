import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔹 بيانات مشروعك في Firebase
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
const db = getFirestore(app);

// 🔹 تسجيل الدخول
export async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const q = query(collection(db, "members"), where("username", "==", username));
  const querySnapshot = await getDocs(q);

  if(querySnapshot.empty){
    alert("اسم المستخدم غير موجود");
    return;
  }

  let valid = false;
  querySnapshot.forEach(docItem => {
    if(docItem.data().password === password){
      localStorage.setItem("uid", docItem.id);
      valid = true;
      window.location.href = "profile.html";
    }
  });

  if(!valid) alert("كلمة المرور خطأ");
}

// 🔹 تحميل بيانات العضو
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

// 🔹 خروج
export function logout(){
  localStorage.removeItem("uid");
  window.location.href = "index.html";
}

// 🔹 تحميل بيانات profile تلقائي
if(window.location.href.includes("profile.html")){
  loadProfile();
}
