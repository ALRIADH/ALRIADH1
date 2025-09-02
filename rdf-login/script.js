// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXeOtXWIc1qyDIxh4EPu1nxmGswrNiqLo",
  authDomain: "password-a409.firebaseapp.com",
  projectId: "password-a409",
  storageBucket: "password-a409.firebasestorage.app",
  messagingSenderId: "883669716957",
  appId: "1:883669716957:web:e9c1222757dd10f3497034"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// تسجيل الدخول
function login(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // البحث عن العضو في Firestore
  db.collection("members").where("username","==",username).get()
  .then(snapshot=>{
    if(snapshot.empty){
      alert("اسم المستخدم غير موجود");
    } else {
      snapshot.forEach(doc=>{
        const userData = doc.data();
        const uid = doc.id;

        // تسجيل الدخول باستخدام UID من Auth
        auth.signInWithEmailAndPassword(userData.email,password)
        .then(()=> {
          localStorage.setItem("uid", uid);
          window.location.href = "profile.html";
        })
        .catch(err=>{
          alert("كلمة المرور خطأ");
        });
      });
    }
  });
}

// تسجيل عضوية جديدة
function register(){
  const username = document.getElementById("newUsername").value;
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;
  const extra = document.getElementById("newExtra").value;

  auth.createUserWithEmailAndPassword(email,password)
  .then(userCredential=>{
    const uid = userCredential.user.uid;
    db.collection("members").doc(uid).set({
      username: username,
      extraData: extra,
      email: email
    })
    .then(()=> {
      alert("تم إنشاء العضوية بنجاح!");
      document.getElementById("newUsername").value = "";
      document.getElementById("newEmail").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("newExtra").value = "";
    });
  })
  .catch(err=> alert(err.message));
}

// صفحة العضو
const uid = localStorage.getItem("uid");
if(uid && window.location.pathname.includes("profile.html")){
  db.collection("members").doc(uid).get().then(doc=>{
    if(doc.exists){
      document.getElementById("userName").innerText = doc.data().username;
      document.getElementById("userData").innerText = doc.data().extraData;
    }
  });
}

// الخروج
function logout(){
  localStorage.removeItem("uid");
  auth.signOut();
  window.location.href="index.html";
}
