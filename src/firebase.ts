import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZfNQLSVD_CVWoGcyBRdotsrGFrRMUM3s",
  authDomain: "smartnote-af664.firebaseapp.com",
  projectId: "smartnote-af664",
  storageBucket: "smartnote-af664.firebasestorage.app",
  messagingSenderId: "887060569322",
  appId: "1:887060569322:web:49c39cc8b3f5b128350b93",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
