// Configuración de Firebase (Reemplaza con tus datos)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
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
        document.getElementById('message').textContent = "Login exitoso, bienvenido " + user.email;
        document.getElementById('logoutButton').style.display = 'block';
      })
      .catch((error) => {
        document.getElementById('message').textContent = "Error: " + error.message;
      });
  });
  
  // Verificar el estado del usuario (si está autenticado)
  auth.onAuthStateChanged((user) => {
    if (user) {
      document.getElementById('message').textContent = "Usuario autenticado: " + user.email;
      document.getElementById('logoutButton').style.display = 'block';
    } else {
      document.getElementById('message').textContent = "No hay usuario autenticado.";
      document.getElementById('logoutButton').style.display = 'none';
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
  