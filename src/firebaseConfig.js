import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBP1Ie4uEdglMsYkOcA2Tmgfpfmp0GHia0",
  authDomain: "sistema-pasantias-66457.firebaseapp.com",
  databaseURL: "https://sistema-pasantias-66457-default-rtdb.firebaseio.com",
  projectId: "sistema-pasantias-66457",
  storageBucket: "sistema-pasantias-66457.appspot.com",
  messagingSenderId: "789677840832",
  appId: "1:789677840832:web:663558770677b2108cd025",
  measurementId: "G-NF3VPCSKNZ"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
export const auth = getAuth(app);
export const database = getDatabase(app);


