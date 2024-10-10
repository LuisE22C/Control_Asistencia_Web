/*!
* Start Bootstrap - Freelancer v7.0.7 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

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

// Función para descargar los datos como PDF con el formato específico
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Agregar el encabezado del PDF
    doc.setFontSize(18);
    doc.text('Escuela Técnica Ciencias Aplicada Esteca PC', 20, 20);
    
    doc.setFontSize(16);
    doc.text('Control de Asistencia Alumnos', 20, 30);
    doc.text('Taller de Electrónica', 20, 40);

    // Agregar la fecha filtrada
    const filterDate = document.getElementById('filter-date').value || 'Sin filtrar';
    doc.setFontSize(14);
    doc.text(`Fecha de Asistencia: ${filterDate}`, 20, 50);

    // Crear la tabla de asistencia
    const table = document.getElementById('data-table');
    const rows = table.getElementsByTagName('tr');

    // Definir posición inicial para los datos de la tabla
    let yPos = 70;

    // Encabezado de la tabla
    doc.setFontSize(12);
    doc.text('Fecha y Hora', 20, yPos);
    doc.text('Tarjeta ID', 60, yPos);
    doc.text('Nombre', 100, yPos);
    doc.text('Apellido', 140, yPos);
    doc.text('Hora de Entrada', 180, yPos);

    // Agregar los datos de la tabla
    yPos += 10; // Aumentar la posición para empezar con los datos
    for (let i = 1; i < rows.length; i++) { // Comenzar en 1 para saltar el encabezado
        const cells = rows[i].getElementsByTagName('td');
        doc.text(cells[0].textContent, 20, yPos); // Fecha y Hora
        doc.text(cells[1].textContent, 60, yPos); // Tarjeta ID
        doc.text(cells[2].textContent, 100, yPos); // Nombre
        doc.text(cells[3].textContent, 140, yPos); // Apellido
        doc.text(cells[4].textContent, 180, yPos); // Hora de Entrada
        yPos += 10; // Siguiente fila

        // Si se alcanza el final de la página, agregar una nueva
        if (yPos > 280) {
            doc.addPage();
            yPos = 20;
        }
    }

    // Descargar el archivo PDF
    doc.save('asistencia.pdf');
    
}


// Llama a la función cuando la página cargue
window.onload = fetchData;

// Función para descargar los datos como archivo XLS
function downloadXLS() {
    // Obtener la tabla de HTML
    const table = document.getElementById('data-table');
    
    // Crear una nueva hoja de cálculo (workbook)
    const wb = XLSX.utils.book_new();
    
    // Convertir la tabla a un formato legible por Excel
    const ws = XLSX.utils.table_to_sheet(table);
    
    // Agregar la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, "Asistencia");

    // Generar el archivo XLS y descargarlo
    XLSX.writeFile(wb, "asistencia.xlsx");
}

// Función para buscar por nombre o apellido
function searchByName() {
    const input = document.getElementById('search-name').value.toLowerCase(); // Convertir a minúsculas para evitar problemas de mayúsculas
    const table = document.getElementById('data-table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // Empezar en 1 para evitar el encabezado
        const nombreCell = rows[i].getElementsByTagName('td')[2]; // Columna del nombre
        const apellidoCell = rows[i].getElementsByTagName('td')[3]; // Columna del apellido
        const nombre = nombreCell.textContent.toLowerCase();
        const apellido = apellidoCell.textContent.toLowerCase();

        // Mostrar la fila si coincide el nombre o apellido
        if (nombre.includes(input) || apellido.includes(input)) {
            rows[i].style.display = ''; // Mostrar la fila
        } else {
            rows[i].style.display = 'none'; // Ocultar la fila
        }
    }
}

// Función para buscar por hora de entrada
function searchByTime() {
    const input = document.getElementById('search-time').value; // Obtener el valor del campo de hora
    const table = document.getElementById('data-table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // Empezar en 1 para evitar el encabezado
        const horaCell = rows[i].getElementsByTagName('td')[4]; // Columna de la hora de entrada
        const hora = horaCell.textContent;

        // Mostrar la fila si coincide la hora de entrada
        if (hora.includes(input)) {
            rows[i].style.display = ''; // Mostrar la fila
        } else {
            rows[i].style.display = 'none'; // Ocultar la fila
        }
    }
}

// Función para aplicar ambos filtros (nombre/apellido y hora)
function applyFilters() {
    const nameInput = document.getElementById('search-name').value.toLowerCase();
    const timeInput = document.getElementById('search-time').value;

    const table = document.getElementById('data-table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // Empezar en 1 para evitar el encabezado
        const nombreCell = rows[i].getElementsByTagName('td')[2]; // Columna del nombre
        const apellidoCell = rows[i].getElementsByTagName('td')[3]; // Columna del apellido
        const horaCell = rows[i].getElementsByTagName('td')[4]; // Columna de la hora de entrada

        const nombre = nombreCell.textContent.toLowerCase();
        const apellido = apellidoCell.textContent.toLowerCase();
        const hora = horaCell.textContent.substring(0, 5); // Solo la hora y minutos (HH:MM)

        // Verificar las condiciones de búsqueda
        const matchesName = !nameInput || nombre.includes(nameInput) || apellido.includes(nameInput); // Si el campo de nombre está vacío, coinciden todos
        const matchesTime = !timeInput || hora === timeInput; // Si el campo de hora está vacío, coinciden todos

        // Mostrar la fila solo si ambos filtros coinciden
        if (matchesName && matchesTime) {
            rows[i].style.display = ''; // Mostrar la fila
        } else {
            rows[i].style.display = 'none'; // Ocultar la fila
        }
    }
}

