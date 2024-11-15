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
                const municipio = data.address.city || data.address.town || data.address.village || data.address.county || '';  // Municipio o provincia
                const provincia = data.address.state || '';  // Ciudad o estado
                const codigoPostal = data.address.postcode || '';  // Código postal
                const pais = data.address.country || '';  // País (ej. Cuba)

                // Distribuir los datos en los campos correspondientes del formulario
                //document.getElementById('nombre').value = nombre || ''; // Número o nombre de la casa
                document.getElementById('calle').value = calle || ''; // Nombre de la calle
                document.getElementById('consejo').value = consejo || ''; // Barrio o consejo
                document.getElementById('municipio').value = municipio || ''; // Municipio
                document.getElementById('provincia').value = provincia || ''; // Ciudad
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
                if (!provincia) {
                    document.getElementById('provincia').value = 'Ciudad no disponible';
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

document.getElementById('client_container').addEventListener('click', function(event) {
    if (event.target.classList.contains('toggle-client')) {
        const body = event.target.closest('.client').querySelector('.client-body');
        body.classList.toggle('active');
        event.target.textContent = body.classList.contains('active') ? '▲' : '▼';
    }
    if (event.target.classList.contains('remove-client')) {
        event.target.closest('.client').remove();
    }
});

// Actualización dinámica del nombre del plato en el encabezado
document.getElementById('client_container').addEventListener('input', function(event) {
    if (event.target.name === 'client_nombre') {
        const header = event.target.closest('.client').querySelector('.client-nombre');
        header.textContent = event.target.value || 'Nuevo Cliente';
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
            <input type="text" name="plato_nombre" required>

            <label for="plato_precio">Precio:</label>
            <input type="number" name="plato_precio" required>

            <label for="plato_calidad">Calidad:</label>
            <input type="text" name="plato_calidad" required>

            <label for="plato_pedidos">Cantidad de Pedidos Promedio:</label>
            <input type="number" name="plato_pedidos" required>
        </div>
    `;
    document.getElementById('menu_container').appendChild(platoContainer);
});

//Anadir nuevos clientes
document.getElementById('add_client').addEventListener('click', function() {
    const clientContainer = document.createElement('div');
    clientContainer.classList.add('client');
    clientContainer.innerHTML = `
        <div class="client-header">
            <button type="button" class="toggle-client">▼</button>
            <span class="client-nombre">Nuevo Cliente</span>
            <button type="button" class="remove-client">Eliminar</button>
        </div>
        <div class="client-body">
            <label for="plato_nombre">Nombre del Cliente:</label>
            <input type="text" name="client_nombre" required>
			<label for="client_edad">Edad:</label>
			<input type="number" name="client_edad" required>
			
			<label for="client_genero">Genero del cliente:</label>
			<select id="client_genero" name="client_genero" required>
                <option value="" disabled selected hidden>Seleccione una opción</option>
				<option value="0">Masculino</option>
                <option value="1">Femenino</option>
                <option value="2">Otro</option>
                <option value="3">Prefiero no decir</option>
            </select>

			<label for="client_frec_visitas">Frecuencia de visitas:</label>
			<select id="client_frec_visitas" name="client_frec_visitas" required>
                <option value="" disabled selected hidden>Seleccione una opción</option>
				<option value="0">Primera vez</option>
                <option value="1">Ocasionalmente (1-2 veces al mes)</option>
                <option value="2">Regularmente (1-2 veces a la semana)</option>
                <option value="3">Frecuentemente (más de 2 veces a la semana)</option>
            </select>
			
			<label for="client_pref_alim">Preferencias alimentarias:</label>
			<select id="client_pref_alim" name="client_pref_alim" required>
				<option value="0">Sin preferencias</option>
                <option value="1">Vegetariano</option>
                <option value="2">Vegano</option>
                <option value="3">Sin gluten</option>
                <option value="4">Sin lactosa</option>
                <option value="5">Otros</option> 
            </select>
			
			<label for="client_gasto">Gasto promedio por visita:</label>
			<input type="number" name="client_gasto" placeholder="El gasto promedio que gastas por visita" required>
			
			<label for="client_preferences">Seleccione el producto que mas consume:</label>
			<select id="client_preferences" name="client_preferences">
				<option value="0">Sin preferencias</option>
			</select>
			
			<label for="client_general_calif">Calificacion general:</label>
			<select id="client_general_calif" name="client_general_calif" required>
				<option value="" disabled selected hidden>Seleccione una opción</option>
				<option value="1">1 estrella (Muy malo)</option>
                <option value="2">2 estrellas (Malo)</option>
                <option value="3">3 estrellas (Regular)</option>
                <option value="4">4 estrellas (Bueno)</option>
                <option value="5">5 estrellas (Excelente)</option>
            </select>			
			<label for="client_recomendado">Recomendarias este lugar a otros?:</label>
			<select id="client_recomendado" name="client_recomendado" required>
				<option value="" disabled selected hidden>Seleccione una opción</option>
				<option value="0">No</option>
                <option value="1">Si</option>
            </select>
			
        </div>
    `;
    document.getElementById('client_container').appendChild(clientContainer);
});

// Captura del formulario para crear el archivo JSON
document.getElementById('localForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const diasOperacion = Array.from(document.querySelectorAll('.dia.selected')).map(el => parseInt(el.getAttribute('data-dia')));
    const metodosPago = Array.from(document.querySelectorAll('.metodo.selected')).map(el => parseInt(el.getAttribute('data-metodo')));
    const opcionesEntrega = Array.from(document.querySelectorAll('.entrega.selected')).map(el => parseInt(el.getAttribute('data-entrega')));
    const opcionesReserva = Array.from(document.querySelectorAll('.reserva.selected')).map(el => parseInt(el.getAttribute('data-reserva')));
	
	// Guardar los datos de los platos
    const platos = Array.from(document.querySelectorAll('.plato')).map(plato => ({
        nombre: plato.querySelector('[name="plato_nombre"]').value,
        precio: parseFloat(plato.querySelector('[name="plato_precio"]').value),
        calidad: plato.querySelector('[name="plato_calidad"]').value,
        pedidos_promedio: parseInt(plato.querySelector('[name="plato_pedidos"]').value)
    }));
	
	// Guardar Datos de los clientes
    const clients = Array.from(document.querySelectorAll('.client')).map(client => ({
        nombre: client.querySelector('[name="client_nombre"]').value,
		edad: parseInt(client.querySelector('[name="client_edad"]').value),
		genero: parseInt(client.querySelector('[name="client_genero"]').value),
		frec_visitas: parseInt(client.querySelector('[name="client_frec_visitas"]').value),
		pref_alimentaria: parseInt(client.querySelector('[name="client_pref_alim"]').value),
		gasto: parseInt(client.querySelector('[name="client_gasto"]').value),
		general_calif: parseInt(client.querySelector('[name="client_general_calif"]').value),
		recomendado: parseInt(client.querySelector('[name="client_recomendado"]').value)
    }));

    const localData = {
        nombre: document.getElementById('nombre').value,
        //direccion: direccion,
        telefono: document.getElementById('telefono').value,
        correo_electronico: document.getElementById('correo').value,
        pagina_web: document.getElementById('pagina_web').value,
        tipo_establecimiento: parseInt(document.getElementById('tipo_establecimiento').value),
		tipo_cocina: parseInt(document.getElementById('tipo_cocina').value),
        horario: {
            apertura: document.getElementById('horario_apertura').value,
            cierre: document.getElementById('horario_cierre').value,
            dias_operacion: diasOperacion
        },
        capacidad: parseInt(document.getElementById('capacidad').value),
		opciones_reserva: opcionesReserva,
        opciones_entrega: opcionesEntrega,
        rango_precios: {
            minimo: parseFloat(document.getElementById('rango_precios_min').value),
            maximo: parseFloat(document.getElementById('rango_precios_max').value)
        },
        metodos_pago: metodosPago,
        promociones_descuentos: document.getElementById('promociones_descuentos').value,
        menu: platos,
		clientes: clients,
        ubicacion: {
            calle: document.getElementById('calle').value, // Nuevo campo: Calle
            consejo: document.getElementById('consejo').value, // Nuevo campo: Consejo o vecindario
            municipio: document.getElementById('municipio').value, // Nuevo campo: Municipio
            provincia: document.getElementById('provincia').value, // Nuevo campo: Provincia
            codigo_postal: document.getElementById('codigo_postal').value, // Nuevo campo: Código postal
            pais: document.getElementById('pais').value, // Nuevo campo: País
            coordenadas: document.getElementById('ubicacion').value // Coordenadas del mapa
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


