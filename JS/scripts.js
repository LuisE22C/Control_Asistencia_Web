const channelID = '2659610'; 
const apiKey = 'BXLMO6DV3DS8HGUF'; 
const results = 100; 

// URL para obtener los datos del canal en formato JSON
const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=${results}`;


let currentPage = 1;
const recordsPerPage = 20; 
let totalPages = 1; 
let allFeeds = []; 

// Función para obtener los datos de ThingSpeak y cargarlos en la tabla
function fetchData() {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        allFeeds = data.feeds; // Guardar todos los datos en la variable global
        applyDateFilter(); // Aplicar el filtro de fecha al cargar los datos
    })
    .catch(error => {
        console.error("Error al obtener los datos:", error);
    });
}

// Función para aplicar el filtro de fecha
function applyDateFilter() {
    const filterDate = document.getElementById('filter-date').value;
    let filteredFeeds = allFeeds;

    // Si hay una fecha en el filtro, filtrar los datos por esa fecha
    if (filterDate) {
        filteredFeeds = allFeeds.filter(feed => feed.created_at.startsWith(filterDate));
    }

    // Actualizar la paginación después del filtro
    totalPages = Math.ceil(filteredFeeds.length / recordsPerPage);
    displayData(filteredFeeds); // Mostrar los datos filtrados
}

// Función para mostrar los datos de la página actual
function displayData(feeds) {
    const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ""; // Limpiar la tabla antes de añadir los datos

    // Calcular el índice de los registros que se deben mostrar
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, feeds.length);

    // Iterar sobre los feeds correspondientes a la página actual
    for (let i = startIndex; i < endIndex; i++) {
        const feed = feeds[i];
        const row = tableBody.insertRow(); // Insertar una nueva fila en la tabla

        const dateCell = row.insertCell(0); // Celda para la fecha
        const uidCell = row.insertCell(1);  // Celda para el UID de la tarjeta
        const nombreCell = row.insertCell(2);  // Celda para el nombre
        const apellidoCell = row.insertCell(3);  // Celda para el apellido
        const gradoCell = row.insertCell(4);  // Celda para el grado
        const entradaCell = row.insertCell(5);  // Celda para la hora de entrada
        const salidaCell = row.insertCell(6);  // Celda para la hora de salida

        // Extraer solo la fecha (YYYY-MM-DD) de created_at
        const dateOnly = feed.created_at ? feed.created_at.split('T')[0] : "- - -";

        // Asignar los valores obtenidos
        dateCell.textContent = dateOnly || "- - -";
        uidCell.textContent = feed.field1 || "- - -";
        nombreCell.textContent = feed.field2 || "- - -";
        apellidoCell.textContent = feed.field3 || "- - -";
        gradoCell.textContent = feed.field4 || "- - -";
        entradaCell.textContent = feed.field5 || "- - -";
        salidaCell.textContent = feed.field6 || "- - -";
    }

    // Actualizar la información de la página
    document.getElementById('page-info').textContent = `Página ${currentPage} de ${totalPages}`;
}

// Función para cambiar a la página anterior
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        applyDateFilter(); // Aplicar el filtro de fecha al cambiar de página
    }
}

// Función para cambiar a la página siguiente
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        applyDateFilter(); // Aplicar el filtro de fecha al cambiar de página
    }
}

// Escucha los eventos de los botones de paginación
document.getElementById('prev-page').addEventListener('click', prevPage);
document.getElementById('next-page').addEventListener('click', nextPage);

// Escucha los cambios en el filtro de fecha
document.getElementById('filter-date').addEventListener('input', () => {
    currentPage = 1; // Reiniciar a la primera página cuando se aplique un filtro
    applyDateFilter(); // Volver a aplicar el filtro de fecha cuando cambie
});

// Cargar los datos cuando la página cargue
window.onload = fetchData;


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

// Función para descargar los datos como PDF
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'mm', 'legal');

    // Función para convertir una imagen de URL a base64
    async function getBase64FromUrl(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    // Cargar la imagen desde la URL
    const imageUrl = '/assets/img/esteca.png';
    const imageBase64 = await getBase64FromUrl(imageUrl);

    // Agregar la imagen al PDF
    doc.addImage(imageBase64, 'JPEG', 10, 10, 30, 30);

    // Agregar el encabezado del PDF
    doc.setFontSize(18);
    doc.text('Escuela Técnica Ciencias Aplicada Esteca PC', 70, 20);
    doc.setFontSize(16);
    doc.text('Control de Asistencia Alumnos', 70, 30);
    doc.text('Taller de Electrónica', 70, 40);

    // Agregar la fecha filtrada
    const filterDate = document.getElementById('filter-date').value || 'Sin filtrar';
    doc.setFontSize(14);
    doc.text(`Fecha de Asistencia: ${filterDate}`, 70, 50);

    // Crear la tabla de asistencia
    const table = document.getElementById('data-table');
    const rows = table.getElementsByTagName('tr');

    let yPos = 70;

    // Encabezado de la tabla
    doc.setFontSize(12);
    doc.text('Fecha', 20, yPos);
    doc.text('Tarjeta ID', 80, yPos);
    doc.text('Nombre', 110, yPos);
    doc.text('Apellido', 140, yPos);
    doc.text('Grado', 180, yPos);
    doc.text('Entrada', 240, yPos);
    doc.text('Salida', 280, yPos);

    yPos += 10;

    // Agregar los datos de la tabla
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        doc.text(cells[0].textContent, 20, yPos);
        doc.text(cells[1].textContent, 80, yPos);
        doc.text(cells[2].textContent, 110, yPos);
        doc.text(cells[3].textContent, 140, yPos);
        doc.text(cells[4].textContent, 180, yPos);
        doc.text(cells[5].textContent, 240, yPos);
        doc.text(cells[6].textContent, 280, yPos);
        yPos += 10;

        if (yPos > 180) {
            doc.addPage();
            yPos = 20;
        }
    }

    doc.save('asistencia.pdf');
}

// Función para descargar los datos como archivo XLS
function downloadXLS() {
    const table = document.getElementById('data-table');
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
    XLSX.writeFile(wb, "asistencia.xlsx");
}

// Cargar los datos cuando la página cargue
window.onload = fetchData;

// Escucha los eventos de filtro y descarga
document.getElementById('filter-date').addEventListener('change', applyDateFilter);
document.getElementById('search-name').addEventListener('keyup', applyFilter);
document.getElementById('download-pdf').addEventListener('click', downloadPDF);
document.getElementById('download-xls').addEventListener('click', downloadXLS);




