# 🔥 KamsiChat

KamsiChat is a real-time chat application built with HTML, CSS, JavaScript, and Firebase.

## 🚀 Features
- 🔐 User Authentication (Sign up / Login)
- 💬 Real-time Messaging
- 👥 Group Chats (General, Gaming, School)
- 📸 Image Sharing
- 🎤 Voice Notes
- ✔️ Seen Ticks (✓✓)
- ⌨️ Typing Indicator

## 🛠 Tech Stack
- HTML
- CSS
- JavaScript (Vanilla)
- Firebase (Auth, Firestore, Storage)

## 📂 Project Structure
kamsichat/
│
├── index.html
├── style.css
├── app.js
├── README.md

## ⚙️ Setup Instructions

1. Clone the repo:
git clone https://github.com/YOUR_USERNAME/kamsichat.git

2. Open folder:
cd kamsichat

3. Open index.html in browser

## 🔥 Firebase Setup

1. Go to Firebase Console
2. Create a project
3. Enable:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage

4. Replace firebaseConfig in app.js with your own config

## 🔐 Firestore Rules (for testing only)

allow read, write: if true;

⚠️ Change to secure rules later:
allow read, write: if request.auth != null;

## 🌐 Live Demo
Coming soon...

## 📱 Future Improvements
- 📞 Voice & Video Calls
- 👥 Advanced Group System
- 🧠 AI Chatbot
- 🌙 Dark/Light Mode Toggle

---

## 👑 Author
Built by Paschal (Kamsi)
