// Firebase
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🔹 تسجيل الدخول
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const snapshot = await db.collection("members").where("username","==",username).get();

  if(snapshot.empty){
    alert("اسم المستخدم غير موجود");
    return;
  }

  let valid = false;
  snapshot.forEach(docItem => {
    if(docItem.data().password === password){
      localStorage.setItem("uid", docItem.id);
      valid = true;
      window.location.href = "profile.html";
    }
  });

  if(!valid) alert("كلمة المرور خطأ");
}

// 🔹 تحميل بيانات العضو
async function loadProfile() {
  const uid = localStorage.getItem("uid");
  if(!uid){
    window.location.href = "index.html";
    return;
  }

  const docRef = db.collection("members").doc(uid);
  const docSnap = await docRef.get();

  if(docSnap.exists){
    document.getElementById("userName").innerText = docSnap.data().username;
    document.getElementById("userData").innerText = docSnap.data().extraData;
  }
}

// 🔹 خروج
function logout(){
  localStorage.removeItem("uid");
  window.location.href = "index.html";
}

// 🔹 ربط أزرار مع الدوال
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if(loginBtn) loginBtn.addEventListener("click", login);
  if(logoutBtn) logoutBtn.addEventListener("click", logout);

  if(window.location.href.includes("profile.html")) loadProfile();
});
