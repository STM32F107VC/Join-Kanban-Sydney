const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000; // Dynamischer Port für Hosting
const STORAGE_FILE = './storage.json';

app.use(express.json());

if (!fs.existsSync(STORAGE_FILE)) {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify({}));
}

// POST: Daten speichern
app.post('/item', (req, res) => {
    const { key, value, token } = req.body;
    if (token !== 'XVVNZBR9H7OQFN0AM2E8ACL2BDF75H76T9R5ZYG0') {
        return res.status(403).send({ error: 'Invalid token' });
    }
    const storage = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
    storage[key] = { value };
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(storage));
    res.send({ success: true });
});

// GET: Daten abrufen
app.get('/item', (req, res) => {
    const { key, token } = req.query;
    if (token !== 'XVVNZBR9H7OQFN0AM2E8ACL2BDF75H76T9R5ZYG0') {
        return res.status(403).send({ error: 'Invalid token' });
    }
    const storage = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
    const item = storage[key];
    if (!item) {
        return res.status(404).send({ error: 'Item not found' });
    }
    res.send({ data: item });
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
