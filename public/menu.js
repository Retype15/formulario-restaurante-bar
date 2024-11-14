// Función para mostrar/ocultar el menú desplegable
function toggleMenu() {
    const menuDropdown = document.getElementById('menuDropdown');
    menuDropdown.style.display = menuDropdown.style.display === 'block' ? 'none' : 'block';
}

// Función para verificar la contraseña y descargar el archivo
function verifyPassword() {
    const enteredPassword = document.getElementById('passwordInput').value;
    const correctPassword = "{{ENV_PASSWORD}}"; // Usar variable de entorno en Vercel

    if (enteredPassword === correctPassword) {
        downloadData();
    } else {
        document.getElementById('menuMessage').innerText = "Contraseña incorrecta";
    }
}

// Función para descargar la carpeta comprimida (requiere soporte en el servidor)
function downloadData() {
    fetch('/download-data')
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                throw new Error('Error al descargar los datos');
            }
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
