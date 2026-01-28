import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1J3ao4OZ39O25arMv4ZNySXTQG4SjfOg",
  authDomain: "chargewealth-82efc.firebaseapp.com",
  projectId: "chargewealth-82efc",
  storageBucket: "chargewealth-82efc.firebasestorage.app",
  messagingSenderId: "670158399396",
  appId: "1:670158399396:web:54730ae35850b94d600331",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);