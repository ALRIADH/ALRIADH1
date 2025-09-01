// =======================
// Firebase Initialization
// =======================
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

// =======================
// تسجيل الدخول
// =======================
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if(!username || !password){
    alert("الرجاء إدخال اسم المستخدم وكلمة المرور");
    return;
  }

  try {
    // البحث عن المستخدم في Firestore لإيجاد UID
    const snapshot = await db.collection("members").where("username","==",username).get();
    if(snapshot.empty){
      alert("اسم المستخدم غير موجود");
      return;
    }

    let uid = "";
    snapshot.forEach(doc => uid = doc.id);

    // تسجيل الدخول عبر Firebase Auth (email = username@rdf.com مؤقت)
    await firebase.auth().signInWithEmailAndPassword(username + "@rdf.com", password);

    // حفظ UID في localStorage
    localStorage.setItem("uid", uid);
    window.location.href = "profile.html";

  } catch (error) {
    alert(error.message);
  }
}

// =======================
// تحميل بيانات العضو في profile.html
// =======================
async function loadProfile() {
  const uid = localStorage.getItem("uid");
  if(!uid){
    window.location.href = "index.html";
    return;
  }

  try {
    const docRef = db.collection("members").doc(uid);
    const docSnap = await docRef.get();

    if(docSnap.exists){
      document.getElementById("userName").innerText = docSnap.data().username;
      document.getElementById("userData").innerText = docSnap.data().extraData;
    } else {
      alert("لم يتم العثور على بياناتك!");
      logout();
    }
  } catch (error) {
    alert(error.message);
  }
}

// =======================
// خروج المستخدم
// =======================
function logout() {
  firebase.auth().signOut();
  localStorage.removeItem("uid");
  window.location.href = "index.html";
}

// =======================
// ربط الأزرار بالدوال
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if(loginBtn) loginBtn.addEventListener("click", login);
  if(logoutBtn) logoutBtn.addEventListener("click", logout);

  // إذا صفحة profile.html، حمّل بيانات العضو
  if(window.location.href.includes("profile.html")) loadProfile();
});
