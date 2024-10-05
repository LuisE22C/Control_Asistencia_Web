// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyANLiwy3bJ3FCeKW39lyQSbwfa0OexseP8",
  authDomain: "loginasistencia-2756d.firebaseapp.com",
  projectId: "loginasistencia-2756d",
  storageBucket: "loginasistencia-2756d.appspot.com",
  messagingSenderId: "62546692621",
  appId: "1:62546692621:web:0a1718e69812d302192344"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Manejador del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();  // Evitar el envío automático del formulario

  // Obtener los valores de email y contraseña
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Iniciar sesión con Firebase Authentication
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      document.getElementById('message').textContent = "Login exitoso, redirigiendo...";
      // Redirigir a la página principal si el login es exitoso
      setTimeout(() => {
        window.location.href = 'index.html'; // Redirigir a index.html
      }, 2000);  // Esperar 2 segundos antes de redirigir
    })
    .catch((error) => {
      document.getElementById('message').textContent = "Usuario o contraseña incorrectos.";
    });
});

// Verificar el estado del usuario (si está autenticado)
auth.onAuthStateChanged((user) => {
  if (user) {
    document.getElementById('message').textContent = "Usuario autenticado, redirigiendo...";
    // Si ya está autenticado, redirigir directamente
    setTimeout(() => {
      window.location.href = 'index.html';  // Redirigir a index.html si ya está autenticado
    }, 2000);  // Esperar 2 segundos antes de redirigir
  } else {
    document.getElementById('message').textContent = "Por favor, inicia sesión.";
  }
});

// Cerrar sesión
document.getElementById('logoutButton').addEventListener('click', function () {
  auth.signOut().then(() => {
    document.getElementById('message').textContent = "Sesión cerrada correctamente.";
    document.getElementById('logoutButton').style.display = 'none';
  }).catch((error) => {
    document.getElementById('message').textContent = "Error al cerrar sesión: " + error.message;
  });
});
