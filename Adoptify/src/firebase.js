import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCzq0NQ7JixgWh4iPkRauZg5ZBuFxfoGYY",
  authDomain: "adoptify-ed7a4.firebaseapp.com",
  projectId: "adoptify-ed7a4",
  storageBucket: "adoptify-ed7a4.firebasestorage.app",
  messagingSenderId: "539892185377",
  appId: "1:539892185377:web:6f8a628da41fb7573a2660",
  measurementId: "G-LSS5CGT188"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()