
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBStDgKCiHMrGneSjfCZ_z8Yo9SmHiDS10",
  authDomain: "finacal-tracker.firebaseapp.com",
  projectId: "finacal-tracker",
  storageBucket: "finacal-tracker.firebasestorage.app",
  messagingSenderId: "647254326216",
  appId: "1:647254326216:web:b86d76f0357263c9581efd",
  measurementId: "G-FJ9BZ90X9L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'consent' });
export { db, auth, provider,doc, setDoc };

