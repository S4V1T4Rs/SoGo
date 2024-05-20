// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from '@firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBY4y8CVvIuJt7YDhZrgRte9UXBoIXepk8',
  authDomain: 's4v1t4r-1e438.firebaseapp.com',
  projectId: 's4v1t4r-1e438',
  storageBucket: 's4v1t4r-1e438.appspot.com',
  messagingSenderId: '260939672795',
  appId: '1:260939672795:web:ca4c1721da8f337f32b0fe',
  measurementId: 'G-1KFN289YGL'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
