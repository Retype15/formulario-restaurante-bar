const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para servir un archivo HTML (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

app.get('/download-data', (req, res) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    res.attachment('data.zip');

    archive.pipe(res);
    archive.directory(path.join(__dirname, 'data'), false);
    archive.finalize();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});