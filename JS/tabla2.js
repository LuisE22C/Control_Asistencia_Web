
// URL para obtener los datos del canal en formato JSON
const channelID2 = '2659610'; // Cambia el ID si es necesario
const apiKey2 = 'BXLMO6DV3DS8HGUF';
const results2 = 100;

const url2 = `https://api.thingspeak.com/channels/${channelID2}/feeds.json?api_key=${apiKey2}&results=${results2}`;

let currentPage2 = 1;
const recordsPerPage2 = 20;
let totalPages2 = 1;
let allFeeds2 = [];

// Función para obtener los datos de ThingSpeak y cargarlos en la segunda tabla
function fetchData2() {
    fetch(url2)
    .then(response => response.json())
    .then(data => {
        allFeeds2 = data.feeds;
        displayData2(allFeeds2);
    })
    .catch(error => {
        console.error("Error al obtener los datos:", error);
    });
}

// Función para mostrar los datos en la segunda tabla
function displayData2(feeds) {
    const tableBody = document.getElementById('data-table-2').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ""; // Limpiar la tabla antes de añadir los datos

    const startIndex = (currentPage2 - 1) * recordsPerPage2;
    const endIndex = Math.min(startIndex + recordsPerPage2, feeds.length);

    for (let i = startIndex; i < endIndex; i++) {
        const feed = feeds[i];
        const row = tableBody.insertRow();

        const dateCell = row.insertCell(0);
        const uidCell = row.insertCell(1);
        const nombreCell = row.insertCell(2);
        const apellidoCell = row.insertCell(3);
        const gradoCell = row.insertCell(4);
        const entradaCell = row.insertCell(5);
        const salidaCell = row.insertCell(6);

        const dateOnly = feed.created_at ? feed.created_at.split('T')[0] : "- - -";
        dateCell.textContent = dateOnly || "- - -";
        uidCell.textContent = feed.field1 || "- - -";
        nombreCell.textContent = feed.field2 || "- - -";
        apellidoCell.textContent = feed.field3 || "- - -";
        gradoCell.textContent = feed.field4 || "- - -";
        entradaCell.textContent = feed.field5 || "- - -";
        salidaCell.textContent = feed.field6 || "- - -";
    }

    totalPages2 = Math.ceil(feeds.length / recordsPerPage2);
    document.getElementById('page-info-2').textContent = `Página ${currentPage2} de ${totalPages2}`;
}

// Función para cambiar a la página anterior en la segunda tabla
function prevPage2() {
    if (currentPage2 > 1) {
        currentPage2--;
        displayData2(allFeeds2);
    }
}

// Función para cambiar a la página siguiente en la segunda tabla
function nextPage2() {
    if (currentPage2 < totalPages2) {
        currentPage2++;
        displayData2(allFeeds2);
    }
}

// Función para aplicar el filtro por nombre, apellido o grado en la segunda tabla
function applyFilter() {
    const filterText = document.getElementById('search-name').value.toLowerCase();
    if (filterText) {
        const filteredFeeds = allFeeds2.filter(feed => 
            (feed.field2 && feed.field2.toLowerCase().includes(filterText)) || 
            (feed.field3 && feed.field3.toLowerCase().includes(filterText)) || 
            (feed.field4 && feed.field4.toLowerCase().includes(filterText))
        );
        displayData2(filteredFeeds);
    } else {
        displayData2(allFeeds2);
    }
}

// Escucha los eventos de los botones de paginación
document.getElementById('prev-page-2').addEventListener('click', prevPage2);
document.getElementById('next-page-2').addEventListener('click', nextPage2);

// Cargar los datos cuando la página cargue
window.onload = fetchData2;

