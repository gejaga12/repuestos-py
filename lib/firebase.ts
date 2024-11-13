import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAr0kbEYHsrp7z2AK9ZFNEub8zfFpRyPLQ",
  authDomain: "repuestos-py.firebaseapp.com",
  projectId: "repuestos-py",
  storageBucket: "repuestos-py.appspot.com", // Fixed storage bucket
  messagingSenderId: "546608995360",
  appId: "1:546608995360:web:77a7eaa61655cb6bfaf045"
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };