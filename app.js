import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyD2OtSczxlyg5J83cH_LppTlmKiZBrnsjM",
  authDomain: "kamsichat-d44c8.firebaseapp.com",
  projectId: "kamsichat-d44c8",
  storageBucket: "kamsichat-d44c8.firebasestorage.app",
  messagingSenderId: "321241004770",
  appId: "1:321241004770:web:752bc021950addc4147cbb"
};

// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM
const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");
const email = document.getElementById("email");
const password = document.getElementById("password");
const userDisplay = document.getElementById("userDisplay");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("message");
const groupSelect = document.getElementById("groupSelect");

let currentUser = null;

// 🔐 SIGN UP
window.signUp = async () => {
  await createUserWithEmailAndPassword(auth, email.value, password.value);
  alert("Account created");
};

// 🔐 LOGIN
window.login = async () => {
  await signInWithEmailAndPassword(auth, email.value, password.value);
};

// 👤 AUTH STATE
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user.email;

    userDisplay.innerText = "Logged in as: " + currentUser;

    authDiv.style.display = "none";
    appDiv.classList.remove("hidden");

    loadMessages();
  }
});

// 💬 SEND MESSAGE
window.sendMessage = async () => {
  const msg = messageInput.value;
  const group = groupSelect.value;

  if (!msg) return;

  await addDoc(collection(db, "messages"), {
    user: currentUser,
    text: msg,
    group: group,
    time: Date.now()
  });

  messageInput.value = "";
};

// 👀 LOAD MESSAGES
function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("time"));

  onSnapshot(q, (snapshot) => {
    chatBox.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.group !== groupSelect.value) return;

      const div = document.createElement("div");
      div.classList.add("message");

      if (data.user === currentUser) {
        div.classList.add("me");
      } else {
        div.classList.add("other");
      }

      div.innerText = data.user + ": " + data.text;

      chatBox.appendChild(div);
    });
  });
}