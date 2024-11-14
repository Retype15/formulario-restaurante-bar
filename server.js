// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Ruta para guardar el archivo JSON en la carpeta 'data'
app.post('/save-data', (req, res) => {
    const localData = req.body;
    const localName = localData.nombre.replace(/\s+/g, '_').toLowerCase();
    const filePath = path.join(__dirname, 'data', `${localName}.json`);

    // Guardar el archivo en la carpeta 'data'
    fs.writeFile(filePath, JSON.stringify(localData, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar el archivo:', err);
            return res.status(500).json({ message: 'Error al guardar el archivo' });
        }
        res.status(200).json({ message: 'Archivo guardado correctamente' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
