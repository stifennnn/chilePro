// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Importa el módulo de autenticación
import { getFirestore } from "firebase/firestore"; // Importa el módulo de Firestore

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB0UhuFqXkofkP1gKJQMwVVANWPyFd28WE",
  authDomain: "chilepro-8da38.firebaseapp.com",
  projectId: "chilepro-8da38",
  storageBucket: "chilepro-8da38.firebasestorage.app",
  messagingSenderId: "860104593267",
  appId: "1:860104593267:web:99a5247ba4478272b87f06",
  measurementId: "G-EN6HELMHG8",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Inicializa el módulo de autenticación
const db = getFirestore(app); // Inicializa el módulo de Firestore

// Exporta los módulos que necesitas
export { auth, db };
export default firebaseConfig;