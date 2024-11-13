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

    const localData = {
        nombre: document.getElementById('nombre').value,
        direccion: document.getElementById('direccion').value,
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
        menu: platos
    };

    const localName = localData.nombre.replace(/\s+/g, '_').toLowerCase();
    const fileName = `${localName}.json`;

    const file = new Blob([JSON.stringify(localData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
});

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

document.getElementById('add_plato').addEventListener('click', function() {
    const platoContainer = document.createElement('div');
    platoContainer.classList.add('plato');

    platoContainer.innerHTML = `
        <div class="plato-header">
            <span class="plato-nombre">Nuevo Plato</span>
            <button type="button" class="toggle-plato">▼</button>
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

    // Añadir eventos a los nuevos botones
    platoContainer.querySelector('.toggle-plato').addEventListener('click', function() {
        const body = this.parentElement.nextElementSibling;
        body.classList.toggle('active');
        this.textContent = body.classList.contains('active') ? '▲' : '▼';
    });

    platoContainer.querySelector('.remove-plato').addEventListener('click', function() {
        platoContainer.remove();
    });

    // Actualizar el nombre del plato en el encabezado
    platoContainer.querySelector('[name="plato_nombre"]').addEventListener('input', function() {
        platoContainer.querySelector('.plato-nombre').textContent = this.value || 'Nuevo Plato';
    });
});

// Añadir eventos a los botones iniciales
document.querySelectorAll('.toggle-plato').forEach(button => {
    button.addEventListener('click', function() {
        const body = this.parentElement.nextElementSibling;
        body.classList.toggle('active');
        this.textContent = body.classList.contains('active') ? '▲' : '▼';
    });
});

document.querySelectorAll('.remove-plato').forEach(button => {
    button.addEventListener('click', function() {
        this.parentElement.parentElement.remove();
    });
});

// Actualizar el nombre del plato en el encabezado inicial
document.querySelectorAll('[name="plato_nombre"]').forEach(input => {
    input.addEventListener('input', function() {
        this.closest('.plato').querySelector('.plato-nombre').textContent = this.value || 'Nuevo Plato';
    });
});
