import {
  initializeApp,
  getApps,
  getApp,
} from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // GIỮ NGUYÊN CONFIG FIREBASE HIỆN TẠI CỦA BẠN
  apiKey: "...",
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
