// بعد ما تعمل initializeApp في HTML، نقدر نستخدم Auth و Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// تسجيل الدخول
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("ادخل اسم المستخدم وكلمة المرور");
    return;
  }

  // البحث عن العضو في Firestore
  db.collection("members").where("username", "==", username).get()
    .then(snapshot => {
      if (snapshot.empty) {
        alert("اسم المستخدم غير موجود");
      } else {
        snapshot.forEach(doc => {
          const userData = doc.data();
          const uid = doc.id;

          // تسجيل الدخول باستخدام البريد من Firestore
          auth.signInWithEmailAndPassword(userData.email, password)
            .then(() => {
              localStorage.setItem("uid", uid);
              window.location.href = "profile.html";
            })
            .catch(err => {
              alert("كلمة المرور خطأ أو هناك مشكلة في تسجيل الدخول");
            });
        });
      }
    })
    .catch(err => alert("خطأ في الوصول لقاعدة البيانات: " + err.message));
}

// تسجيل عضوية جديدة
function register() {
  const username = document.getElementById("newUsername").value;
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;
  const extra = document.getElementById("newExtra").value;

  if (!username || !email || !password) {
    alert("املأ كل الحقول لتسجيل العضوية");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const uid = userCredential.user.uid;
      db.collection("members").doc(uid).set({
        username: username,
        extraData: extra,
        email: email
      })
        .then(() => {
          alert("تم إنشاء العضوية بنجاح!");
          document.getElementById("newUsername").value = "";
          document.getElementById("newEmail").value = "";
          document.getElementById("newPassword").value = "";
          document.getElementById("newExtra").value = "";
        });
    })
    .catch(err => alert(err.message));
}

// تحميل بيانات العضو في profile.html
if (window.location.pathname.includes("profile.html")) {
  const uid = localStorage.getItem("uid");
  if (!uid) {
    window.location.href = "index.html";
  } else {
    db.collection("members").doc(uid).get().then(doc => {
      if (doc.exists) {
        document.getElementById("userName").innerText = doc.data().username;
        document.getElementById("userData").innerText = doc.data().extraData;
      }
    }).catch(err => console.log("خطأ في جلب البيانات: ", err));
  }
}

// الخروج
function logout() {
  localStorage.removeItem("uid");
  auth.signOut();
  window.location.href = "index.html";
}
