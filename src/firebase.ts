import {
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";

import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  // Dùng API key Firebase Web mà Firebase Console đã cấp cho bạn
  apiKey: "YOUR_FIREBASE_WEB_API_KEY",

  authDomain: "smartnote-af664.firebaseapp.com",
  projectId: "smartnote-af664",
  storageBucket: "smartnote-af664.firebasestorage.app",
  messagingSenderId: "887060569322",
  appId: "1:887060569322:web:49c39cc8b3f5b128350b93",
};

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

export const auth = getAuth(app);

setPersistence(
  auth,
  browserLocalPersistence
).catch((error) => {
  console.error(
    "Firebase persistence error:",
    error
  );
});

export default app;
