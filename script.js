// Geocodificador de Google Maps (definido al cargar el mapa)
let geocoder;
let map;
let marker;

// Captura del formulario para crear el archivo JSON
document.getElementById('localForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const diasOperacion = Array.from(document.querySelectorAll('.dia.selected')).map(el => parseInt(el.getAttribute('data-dia')));
    const metodosPago = Array.from(document.querySelectorAll('.metodo.selected')).map(el => parseInt(el.getAttribute('data-metodo')));

    const platos = Array.from(document.querySelectorAll('.plato')).map(plato => ({
        nombre: plato.querySelector('[name="plato_nombre"]').value,
        precio: parseFloat(plato.querySelector('[name="plato_precio"]').value),
        calidad: plato.querySelector('[name="plato_calidad"]').value,
        pedidos_promedio: parseInt(plato.querySelector('[name="plato_pedidos"]').value)
    }));

    const coordenadas = document.getElementById('ubicacion').value;
    const direccion = coordenadas ? 'Ubicación marcada en el mapa' : document.getElementById('direccion').value;

    const localData = {
        nombre: document.getElementById('nombre').value,
        direccion: direccion,
        municipio: document.getElementById('municipio').value,
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
        opciones_entrega: document.getElementById('opciones_entrega').value,
        opciones_reserva: document.getElementById('opciones_reserva').value,
        rango_precios: {
            minimo: parseFloat(document.getElementById('rango_precios_min').value),
            maximo: parseFloat(document.getElementById('rango_precios_max').value)
        },
        metodos_pago: metodosPago,
        promociones_descuentos: document.getElementById('promociones_descuentos').value,
        menu: platos,
        ubicacion: {
            municipio: document.getElementById('municipio').value,
            calles: document.getElementById('direccion').value,
            coordenadas: coordenadas,
            direccion: direccion
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

// Inicializar el mapa al cargar la página
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 23.1136, lng: -82.3666 },
        zoom: 12
    });

    geocoder = new google.maps.Geocoder();

    map.addListener('click', function(event) {
        placeMarker(event.latLng);
    });
}

// Colocar marcador en el mapa y geocodificar
function placeMarker(location) {
    if (marker) {
        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
    document.getElementById('ubicacion').value = location.lat() + ',' + location.lng();

    geocoder.geocode({ 'location': location }, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                const addressComponents = results[0].address_components;
                let municipio = '';
                let direccionCompleta = results[0].formatted_address;

                addressComponents.forEach(component => {
                    if (component.types.includes('administrative_area_level_2')) {
                        municipio = component.long_name;
                    }
                });

                document.getElementById('municipio').value = municipio;
                document.getElementById('direccion').value = direccionCompleta;
            } else {
                alert('No se encontraron resultados para la ubicación marcada.');
            }
        } else {
            alert('Geocodificación fallida debido a: ' + status);
        }
    });
}

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

// Cargar Google Maps al final
window.addEventListener('load', function() {
    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&libraries=places&callback=initMap";
    document.body.appendChild(script);
});
