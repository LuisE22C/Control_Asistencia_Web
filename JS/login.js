// Importar las funciones que se necesitan desde Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCyaQxAjiirvETynhSyZDTjuJt__re-ytA",
  authDomain: "loginasistencia-a6515.firebaseapp.com",
  projectId: "loginasistencia-a6515",
  storageBucket: "loginasistencia-a6515.appspot.com",
  messagingSenderId: "1024242564864",
  appId: "1:1024242564864:web:46dd63428b1e826cd1fde5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Manejador del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Evitar el envío automático del formulario

  // Obtener los valores de email y contraseña
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Iniciar sesión con Firebase Authentication
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Redirigir a la página main.html
      window.location.href = 'main.html';
    })
    .catch((error) => {
      // Mostrar alerta en caso de error
      alert("Usuario incorrecto. Por favor, verifica tus credenciales.");
    });
});

// Cerrar sesión al hacer clic en el enlace
document.getElementById('logoutLink').addEventListener('click', function (event) {
  event.preventDefault();  // Prevenir el comportamiento por defecto del enlace

  signOut(auth).then(() => {
    // Mostrar un mensaje confirmando que se cerró la sesión
    document.getElementById('message').textContent = "Sesión cerrada correctamente.";

    // Redirigir a la página de inicio de sesión
    window.location.href = 'index.html';  // Cambia esto por la página de inicio de sesión si es diferente
  }).catch((error) => {
    // Mostrar un mensaje de error si ocurre un problema al cerrar sesión
    document.getElementById('message').textContent = "Error al cerrar sesión: " + error.message;
  });
});







