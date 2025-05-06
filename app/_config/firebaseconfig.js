// app/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDqZK0ygDLA9n4nQGeo3nI4-aQIo0z-zOE",
    authDomain: "cph-dox-app.firebaseapp.com",
    projectId: "cph-dox-app",
    storageBucket: "cph-dox-app.firebasestorage.app",
    messagingSenderId: "1000450722631",
    appId: "1:1000450722631:web:5128c794723bbc44475a62"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

