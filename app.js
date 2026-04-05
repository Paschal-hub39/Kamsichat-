import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, setDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyD2OtSczxlyg5J83cH_LppTlmKiZBrnsjM",
  authDomain: "kamsichat-d44c8.firebaseapp.com",
  projectId: "kamsichat-d44c8",
  storageBucket: "kamsichat-d44c8.firebasestorage.app",
  messagingSenderId: "321241004770",
  appId: "1:321241004770:web:752bc021950addc4147cbb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// DOM Elements
const appDiv = document.getElementById("app");
const authDiv = document.getElementById("auth");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const userDisplay = document.getElementById("userDisplay");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("message");
const imageInput = document.getElementById("imageInput");
const typingStatus = document.getElementById("typingStatus");

let currentUser = null;
let currentGroup = "general";
let audioBlob = null;

// 🔐 AUTHENTICATION
window.signUp = async () => {
  await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
};

window.login = async () => {
  await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user.email;
    userDisplay.innerText = currentUser;
    authDiv.style.display = "none";
    appDiv.classList.remove("hidden");
  }
});

// 🎤 VOICE RECORDING
let mediaRecorder, audioChunks = [];

window.startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];
  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
  mediaRecorder.onstop = () => {
    audioBlob = new Blob(audioChunks, { type: "audio/webm" });
  };
  mediaRecorder.start();
};

window.stopRecording = () => mediaRecorder.stop();

// 💬 SEND MESSAGE
window.sendMessage = async () => {
  let imageUrl = "", audioUrl = "";

  if (imageInput.files[0]) {
    const imgRef = ref(storage, "img/" + Date.now());
    await uploadBytes(imgRef, imageInput.files[0]);
    imageUrl = await getDownloadURL(imgRef);
  }

  if (audioBlob) {
    const audRef = ref(storage, "audio/" + Date.now());
    await uploadBytes(audRef, audioBlob);
    audioUrl = await getDownloadURL(audRef);
    audioBlob = null;
  }

  await addDoc(collection(db, "messages"), {
    username: currentUser,
    message: messageInput.value,
    group: currentGroup,
    imageUrl,
    audioUrl,
    seen: false,
    time: Date.now()
  });

  messageInput.value = "";
  imageInput.value = "";
};

// 👀 REAL-TIME LISTENER
onSnapshot(query(collection(db, "messages"), orderBy("time")), snap => {
  chatBox.innerHTML = "";
  snap.forEach(async d => {
    const data = d.data();
    if (data.group !== currentGroup) return;

    if (data.username !== currentUser && !data.seen) {
      await updateDoc(doc(db, "messages", d.id), { seen: true });
    }

    const div = document.createElement("div");
    div.className = "message " + (data.username === currentUser ? "me" : "other");

    const ticks = data.username === currentUser ? (data.seen ? "✓✓" : "✓") : "";
    let content = `<b>${data.username}</b><br>${data.message} ${ticks}`;

    if (data.imageUrl) content += `<br><img src="${data.imageUrl}" width="150">`;
    if (data.audioUrl) content += `<br><audio controls src="${data.audioUrl}"></audio>`;

    div.innerHTML = content;
    chatBox.appendChild(div);
  });
});

// ⌨️ TYPING INDICATOR
window.startTyping = () => setDoc(doc(db, "typing", "status"), { user: currentUser, typing: true });
window.stopTyping = () => setDoc(doc(db, "typing", "status"), { user: currentUser, typing: false });

onSnapshot(doc(db, "typing", "status"), snap => {
  const d = snap.data();
  typingStatus.innerText = d.typing && d.user !== currentUser ? d.user + " is typing..." : "";
});

// 👥 GROUP SELECTION
window.changeGroup = g => currentGroup = g;
