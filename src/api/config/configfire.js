// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from '@firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBggYXUlAbV18TDShf1gn0jOkMRVUneDek',
  authDomain: 'bd-s4v1t4r.firebaseapp.com',
  projectId: 'bd-s4v1t4r',
  storageBucket: 'bd-s4v1t4r.appspot.com',
  messagingSenderId: '330910554125',
  appId: '1:330910554125:web:14fd12aeb60c82d9031d44',
  measurementId: 'G-VZJW3B52HN'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
