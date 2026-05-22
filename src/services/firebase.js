import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut,
} from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAmaL4JhMBNX6YYwESxjekCdd9jNmiJYGY',
  authDomain: 'smart-student-companion-94def.firebaseapp.com',
  projectId: 'smart-student-companion-94def',
  storageBucket: 'smart-student-companion-94def.firebasestorage.app',
  messagingSenderId: '220782507009',
  appId: '1:220782507009:web:2736f1795a394d7dd1fc00',
  measurementId: 'G-Q6FTRBBJNR',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const addNote = async (userId, title, description) => {
  const notesRef = collection(db, 'users', userId, 'notes');
  const docRef = await addDoc(notesRef, { title, description, timestamp: serverTimestamp() });
  return docRef.id;
};

export const getNotes = async (userId) => {
  const notesRef = collection(db, 'users', userId, 'notes');
  const q = query(notesRef, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteNote = async (userId, noteId) => {
  await deleteDoc(doc(db, 'users', userId, 'notes', noteId));
};
