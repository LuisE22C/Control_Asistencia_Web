// Reemplaza estos valores con tu propio Channel ID y API Key
const channelID = '2659610'; // Reemplaza con el ID de tu canal
const apiKey = 'BXLMO6DV3DS8HGUF'; // Reemplaza con tu API Key de lectura
const results = 100; // Número de resultados que deseas obtener (máximo 8000)

// URL para obtener los datos del canal en formato JSON
const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=${results}`;

// Función para obtener los datos de ThingSpeak y cargarlos en la tabla
function fetchData() {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const feeds = data.feeds;
        displayData(feeds);
    })
    .catch(error => {
        console.error("Error al obtener los datos:", error);
    });
}

// Función para mostrar los datos en la tabla
function displayData(feeds) {
    const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    
    // Limpiar la tabla antes de añadir los datos
    tableBody.innerHTML = "";

    // Iterar sobre cada feed y agregarlo a la tabla
    feeds.forEach(feed => {
        const row = tableBody.insertRow(); // Insertar una nueva fila en la tabla

        const dateCell = row.insertCell(0); // Celda para la fecha y hora
        const uidCell = row.insertCell(1);  // Celda para el UID de la tarjeta
        const nombreCell = row.insertCell(2);  // Celda para el nombre
        const apellidoCell = row.insertCell(3);  // Celda para el apellido
        const horaCell = row.insertCell(4);  // Celda para la hora de entrada

        // Asignar los valores obtenidos
        dateCell.textContent = feed.created_at; 
        uidCell.textContent = feed.field1; // UID de la tarjeta RFID (Campo 1)
        nombreCell.textContent = feed.field2; // Nombre (Campo 2)
        apellidoCell.textContent = feed.field3; // Apellido (Campo 3)
        horaCell.textContent = feed.field4; // Hora de entrada (Campo 4)
    });
}

// Función para aplicar el filtro de fecha
function applyDateFilter() {
    const filterDate = document.getElementById('filter-date').value;
    if (filterDate) {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            const feeds = data.feeds.filter(feed => feed.created_at.startsWith(filterDate));
            displayData(feeds);
        })
        .catch(error => {
            console.error("Error al filtrar los datos:", error);
        });
    } else {
        fetchData(); // Si no hay filtro, mostrar todos los datos
    }
}

// Llama a la función cuando la página cargue
window.onload = fetchData;
