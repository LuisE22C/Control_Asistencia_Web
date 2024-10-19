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

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  // Verificar si el formulario existe antes de agregar el event listener
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
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
  } else {
    console.error("El formulario de inicio de sesión no fue encontrado.");
  }
});


document.addEventListener('DOMContentLoaded', function () {
  // Manejador del botón de cerrar sesión
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', function (event) {
      event.preventDefault();  // Prevenir el comportamiento por defecto del botón

      signOut(auth).then(() => {
        // Mostrar un mensaje confirmando que se cerró la sesión
        alert("Sesión cerrada correctamente.");

        // Redirigir a la página de inicio de sesión
        window.location.href = 'index.html';
      }).catch((error) => {
        // Mostrar un mensaje de error si ocurre un problema al cerrar sesión
        alert("Error al cerrar sesión: " + error.message);
      });
    });
  } else {
    console.error("El botón de cerrar sesión no fue encontrado.");
  }
});
