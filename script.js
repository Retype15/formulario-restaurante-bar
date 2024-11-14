// Inicialización de Leaflet para el mapa
let map;
let marker;

// Crear el mapa
function initMap() {
    // Crear el mapa centrado en una ubicación inicial
    map = L.map('map').setView([23.1136, -82.3666], 12); // Coordenadas iniciales de Cuba, por ejemplo.

    // Añadir una capa de mapa base usando OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Configurar el marcador al hacer clic en el mapa
    map.on('click', function(event) {
        placeMarker(event.latlng);
    });
}

//Funcion para obtener la poss del usuario y centrar el mpapa
document.getElementById('obtener_ubicacion').addEventListener('click', getUserLocation);

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const latlng = L.latLng(lat, lng);

            // Mover el mapa a la ubicación del usuario
            map.setView(latlng, 12);

            // Colocar un marcador en la ubicación del usuario
            placeMarker(latlng);
        }, function(error) {
            alert('No se pudo obtener la ubicación del usuario.');
        });
    } else {
        alert('La geolocalización no está disponible en este navegador.');
    }
}


// Colocar marcador en el mapa y obtener la ubicación
function placeMarker(latlng) {
    if (marker) {
        marker.setLatLng(latlng);  // Si ya hay un marcador, lo mueve a la nueva ubicación
    } else {
        marker = L.marker(latlng).addTo(map);  // Si no hay marcador, lo crea en la ubicación indicada
    }

    // Actualizar el campo de ubicación con las coordenadas lat, lng
    const ubicacionField = document.getElementById('ubicacion');
    ubicacionField.value = latlng.lat + ',' + latlng.lng;  // Se muestra la latitud y longitud como texto

    // Obtener la dirección de la ubicación con Nominatim (geocodificación de OpenStreetMap)
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data && data.address) {
                // Extraer los datos de la dirección
                //const nombre = data.address.house_number || '';  // Número de la casa (ej. 158)
                const calle = data.address.road || '';  // Nombre de la calle (ej. "Lugareño")
                const consejo = data.address.suburb || data.address.neighbourhood || '';  // Barrio o consejo (si está disponible)
                const municipio = data.address.city || data.address.town || data.address.village || data.address.county || '';  // Municipio o ciudad
                const ciudad = data.address.state || '';  // Ciudad o estado
                const codigoPostal = data.address.postcode || '';  // Código postal
                const pais = data.address.country || '';  // País (ej. Cuba)

                // Distribuir los datos en los campos correspondientes del formulario
                //document.getElementById('nombre').value = nombre || ''; // Número o nombre de la casa
                document.getElementById('calle').value = calle || ''; // Nombre de la calle
                document.getElementById('consejo').value = consejo || ''; // Barrio o consejo
                document.getElementById('municipio').value = municipio || ''; // Municipio
                document.getElementById('ciudad').value = ciudad || ''; // Ciudad
                document.getElementById('codigo_postal').value = codigoPostal || ''; // Código postal
                document.getElementById('pais').value = pais || ''; // País

                // Si no se encuentra alguno de estos valores, se puede mostrar un mensaje por defecto
                if (!municipio) {
                    document.getElementById('municipio').value = 'Municipio no disponible';
                }
				if (!calle) {
                    document.getElementById('calle').value = 'Calle no disponible';
                }
                if (!consejo) {
                    document.getElementById('consejo').value = 'Consejo no disponible';
                }
                if (!ciudad) {
                    document.getElementById('ciudad').value = 'Ciudad no disponible';
                }
                if (!codigoPostal) {
                    document.getElementById('codigo_postal').value = 'Código postal no disponible';
                }
                if (!pais) {
                    document.getElementById('pais').value = 'País no disponible';
                }
            } else {
                alert('No se encontró dirección para esta ubicación.');
            }
        })
        .catch(error => {
            console.error('Error al obtener la dirección:', error);
            alert('Hubo un error al obtener la dirección.');
        });
}




// Delegación de eventos para los botones de días y métodos de pago
document.querySelectorAll('.dia').forEach(dia => {
    dia.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

document.querySelectorAll('.metodo').forEach(metodo => {
    metodo.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

document.querySelectorAll('.entrega').forEach(entrega => {
    entrega.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

document.querySelectorAll('.reserva').forEach(reserva => {
    reserva.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

// Delegación de eventos para los botones de platos
document.getElementById('menu_container').addEventListener('click', function(event) {
    if (event.target.classList.contains('toggle-plato')) {
        const body = event.target.closest('.plato').querySelector('.plato-body');
        body.classList.toggle('active');
        event.target.textContent = body.classList.contains('active') ? '▲' : '▼';
    }
    if (event.target.classList.contains('remove-plato')) {
        event.target.closest('.plato').remove();
    }
});

// Actualización dinámica del nombre del plato en el encabezado
document.getElementById('menu_container').addEventListener('input', function(event) {
    if (event.target.name === 'plato_nombre') {
        const header = event.target.closest('.plato').querySelector('.plato-nombre');
        header.textContent = event.target.value || 'Nuevo Plato';
    }
});

// Añadir nuevo plato
document.getElementById('add_plato').addEventListener('click', function() {
    const platoContainer = document.createElement('div');
    platoContainer.classList.add('plato');
    platoContainer.innerHTML = `
        <div class="plato-header">
            <button type="button" class="toggle-plato">▼</button>
            <span class="plato-nombre">Nuevo Plato</span>
            <button type="button" class="remove-plato">Eliminar</button>
        </div>
        <div class="plato-body">
            <label for="plato_nombre">Nombre del Plato:</label>
            <input type="text" name="plato_nombre" required><br><br>

            <label for="plato_precio">Precio:</label>
            <input type="number" name="plato_precio" required><br><br>

            <label for="plato_calidad">Calidad:</label>
            <input type="text" name="plato_calidad" required><br><br>

            <label for="plato_pedidos">Cantidad de Pedidos Promedio:</label>
            <input type="number" name="plato_pedidos" required><br><br>
        </div>
    `;
    document.getElementById('menu_container').appendChild(platoContainer);
});

// Captura del formulario para crear el archivo JSON
document.getElementById('localForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const diasOperacion = Array.from(document.querySelectorAll('.dia.selected')).map(el => parseInt(el.getAttribute('data-dia')));
    const metodosPago = Array.from(document.querySelectorAll('.metodo.selected')).map(el => parseInt(el.getAttribute('data-metodo')));
    const opcionesEntrega = Array.from(document.querySelectorAll('.entrega.selected')).map(el => parseInt(el.getAttribute('opciones-entrega')));
    const opcionesReserva = Array.from(document.querySelectorAll('.reserva.selected')).map(el => parseInt(el.getAttribute('opciones-reserva')));
	
    const platos = Array.from(document.querySelectorAll('.plato')).map(plato => ({
        nombre: plato.querySelector('[name="plato_nombre"]').value,
        precio: parseFloat(plato.querySelector('[name="plato_precio"]').value),
        calidad: plato.querySelector('[name="plato_calidad"]').value,
        pedidos_promedio: parseInt(plato.querySelector('[name="plato_pedidos"]').value)
    }));

    const coordenadas = document.getElementById('ubicacion').value;
    //const direccion = document.getElementById('direccion').value;
    const nombreLugar = document.getElementById('nombre').value;
    const calle = document.getElementById('calle').value;
    const consejo = document.getElementById('consejo').value;
    const municipio = document.getElementById('municipio').value;
    const ciudad = document.getElementById('ciudad').value;
    const codigoPostal = document.getElementById('codigo_postal').value;
    const pais = document.getElementById('pais').value;

    const localData = {
        nombre: nombreLugar,
        //direccion: direccion,
        municipio: municipio,
        telefono: document.getElementById('telefono').value,
        correo_electronico: document.getElementById('correo').value,
        pagina_web: document.getElementById('pagina_web').value,
        tipo_cocina: document.getElementById('tipo_cocina').value,
        tipo_establecimiento: parseInt(document.getElementById('tipo_establecimiento').value),
        horario: {
            apertura: document.getElementById('horario_apertura').value,
            cierre: document.getElementById('horario_cierre').value,
            dias_operacion: diasOperacion
        },
        capacidad: parseInt(document.getElementById('capacidad').value),
        opciones_entrega: opcionesEntrega,
        opciones_reserva: opcionesReserva,
        rango_precios: {
            minimo: parseFloat(document.getElementById('rango_precios_min').value),
            maximo: parseFloat(document.getElementById('rango_precios_max').value)
        },
        metodos_pago: metodosPago,
        promociones_descuentos: document.getElementById('promociones_descuentos').value,
        menu: platos,
        ubicacion: {
            calle: calle, // Nuevo campo: Calle
            consejo: consejo, // Nuevo campo: Consejo o vecindario
            municipio: municipio, // Nuevo campo: Municipio
            ciudad: ciudad, // Nuevo campo: Ciudad
            codigo_postal: codigoPostal, // Nuevo campo: Código postal
            pais: pais, // Nuevo campo: País
            coordenadas: coordenadas // Coordenadas del mapa
        }
    };

    const localName = localData.nombre.replace(/\s+/g, '_').toLowerCase();
    const fileName = `${localName}.json`;

    const file = new Blob([JSON.stringify(localData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    document.body.appendChild(a); 
    a.click();
    document.body.removeChild(a); 
});


// Aleatorización de emojis después de cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.background-emojis');
    const emojis = container.innerHTML;

    // Duplicar emojis para llenar el fondo
    for (let i = 0; i < 4; i++) {
        container.innerHTML += emojis;
    }

    document.querySelectorAll('.emoji').forEach(emoji => {
        const randomTop = Math.floor(Math.random() * 100);
        const randomLeft = Math.floor(Math.random() * 100);
        const randomDuration = Math.random() * 10 + 5;

        emoji.style.top = randomTop + '%';
        emoji.style.left = randomLeft + '%';
        emoji.style.animationDuration = randomDuration + 's';
    });
});

// Cargar Leaflet.js al finalizar la carga de la página
window.addEventListener('load', function() {
    initMap();
});


