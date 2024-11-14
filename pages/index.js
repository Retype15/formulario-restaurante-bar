// pages/index.js
export default function Home() {
  return (
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario de Restaurantes y Bares</title>
    <link rel="stylesheet" href="styles.css">

    <!-- Cargar los estilos de Leaflet -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
</head>
<body>
	<!-- Botón del menú en la esquina superior derecha -->
    <button class="menu-button" onclick="toggleMenu()">Menú</button>

    <!-- Menú desplegable para la contraseña -->
    <div class="menu-dropdown" id="menuDropdown">
        <label for="passwordInput">Contraseña:</label>
        <input type="password" id="passwordInput" placeholder="Ingresa la contraseña">
        <button onclick="verifyPassword()">Descargar Datos</button>
        <p id="menuMessage"></p>
    </div>

    <div class="background-emojis">
        <div class="emoji">🍔</div>
        <div class="emoji">🍕</div>
        <div class="emoji">🍣</div>
        <div class="emoji">🍩</div>
        <div class="emoji">🍪</div>
        <div class="emoji">🍦</div>
        <div class="emoji">🍫</div>
        <div class="emoji">🍟</div>
        <div class="emoji">🥗</div>
        <div class="emoji">🌭</div>
        <div class="emoji">🍿</div>
        <div class="emoji">🥤</div>
        <!-- Añadir más emojis aquí -->
    </div>

    <div class="container">
        <h1>Formulario de Restaurantes y Bares</h1>
        <form id="localForm">
            <fieldset>
                <legend>Información General</legend>
                <label for="nombre">Nombre del Establecimiento:</label>
                <input type="text" id="nombre" name="nombre" required><br><br>

                <label for="telefono">Teléfono:</label>
                <input type="text" id="telefono" name="telefono" required><br><br>

                <label for="correo">Correo Electrónico:</label>
                <input type="email" id="correo" name="correo" required><br><br>

                <label for="pagina_web">Página Web:</label>
                <input type="url" id="pagina_web" name="pagina_web"><br><br>

                <label for="tipo_cocina">Tipo de Cocina:</label>
                <input type="text" id="tipo_cocina" name="tipo_cocina" required><br><br>

                <label for="tipo_establecimiento">Tipo de Establecimiento:</label>
                <select id="tipo_establecimiento" name="tipo_establecimiento" required>
                    <option value="0">Restaurante</option>
                    <option value="1">Bar</option>
                </select><br><br>
            </fieldset>

            <fieldset>
                <legend>Datos de Operación</legend>
                <label for="horario_apertura">Hora de Apertura:</label>
                <input type="time" id="horario_apertura" name="horario_apertura" required><br><br>

                <label for="horario_cierre">Hora de Cierre:</label>
                <input type="time" id="horario_cierre" name="horario_cierre" required><br><br>

                <label for="dias_operacion">Días de Operación:</label><br>
                <div class="dias-operacion">
                    <div class="dia" data-dia="0">Lunes</div>
                    <div class="dia" data-dia="1">Martes</div>
                    <div class="dia" data-dia="2">Miércoles</div>
                    <div class="dia" data-dia="3">Jueves</div>
                    <div class="dia" data-dia="4">Viernes</div>
                    <div class="dia" data-dia="5">Sábado</div>
                    <div class="dia" data-dia="6">Domingo</div>
                </div><br>

                <label for="capacidad">Capacidad:</label>
                <input type="number" id="capacidad" name="capacidad" required><br><br>

                <label for="opciones_entrega">Opciones de Entrega:</label>
                <input type="text" id="opciones_entrega" name="opciones_entrega"><br><br>

                <label for="opciones_reserva">Opciones de Reserva:</label>
                <input type="text" id="opciones_reserva" name="opciones_reserva"><br><br>
            </fieldset>

            <fieldset>
                <legend>Datos Financieros</legend>
                <label for="rango_precios_min">Rango de Precios Mínimo:</label>
                <input type="number" id="rango_precios_min" name="rango_precios_min" required><br><br>

                <label for="rango_precios_max">Rango de Precios Máximo:</label>
                <input type="number" id="rango_precios_max" name="rango_precios_max" required><br><br>

                <label for="metodos_pago">Métodos de Pago:</label><br>
                <div class="metodos-pago">
                    <div class="metodo" data-metodo="0">BANDEC</div>
                    <div class="metodo" data-metodo="1">En efectivo</div>
                    <div class="metodo" data-metodo="2">Tarjeta de crédito</div>
                    <div class="metodo" data-metodo="3">Transferencia bancaria</div>
                    <div class="metodo" data-metodo="4">Otros</div>
                </div><br>

                <label for="promociones_descuentos">Promociones y Descuentos:</label>
                <input type="text" id="promociones_descuentos" name="promociones_descuentos"><br><br>
            </fieldset>

            <fieldset>
                <legend>Datos del Menú</legend>
                <div id="menu_container"></div>
                <button type="button" id="add_plato">Añadir Plato</button><br><br>
            </fieldset>

            <fieldset>
				<legend>Ubicación</legend>
				<div id="map" style="height: 400px; width: 100%;"></div>
				
				<button type="button" id="obtener_ubicacion">Obtener mi ubicación</button><br><br>
				
				<!-- Campos para la dirección desglosada -->
				<label for="calle">Calle:</label>
				<input type="text" id="calle" name="calle"><br><br>

				<label for="consejo">Consejo:</label>
				<input type="text" id="consejo" name="consejo"><br><br>

				<label for="municipio">Municipio:</label>
				<input type="text" id="municipio" name="municipio"><br><br>

				<label for="ciudad">Ciudad:</label>
				<input type="text" id="ciudad" name="ciudad"><br><br>

				<label for="codigo_postal">Código Postal:</label>
				<input type="text" id="codigo_postal" name="codigo_postal"><br><br>

				<label for="pais">País:</label>
				<input type="text" id="pais" name="pais"><br><br>

				<input type="text" id="ubicacion" name="ubicacion" readonly><br><br>
			</fieldset>


            <button type="submit">Guardar Datos</button>
        </form>
    </div>

    <!-- Cargar el script JavaScript personalizado al final -->
    <script src="script.js"></script>
	<script src="menu.js"></script>

    <!-- Cargar Leaflet.js -->
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
</body>
</html>

  )
}
