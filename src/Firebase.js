// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCy-4l7y4gxEBOiXpow0owHt3S-RNYVSlg',
  authDomain: 'movie-discovery-app-firebase.firebaseapp.com',
  projectId: 'movie-discovery-app-firebase',
  storageBucket: 'movie-discovery-app-firebase.firebasestorage.app',
  messagingSenderId: '539568743127',
  appId: '1:539568743127:web:531b14183fb3efef51c692',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
