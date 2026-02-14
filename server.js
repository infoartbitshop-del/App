const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const ELEMENT_DIR = path.join(__dirname, 'elements', 'snap-card');

// API Config
app.get('/api/config', (req, res) => {
    const configPath = path.join(ELEMENT_DIR, 'config.json');
    if (!fs.existsSync(configPath)) return res.status(404).json({ error: "Not built yet" });

    const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const steps = [];

    for (const [key, value] of Object.entries(rawConfig.slots)) {
        const folderPath = path.join(ELEMENT_DIR, value.folder);
        let options = [];
        if (fs.existsSync(folderPath)) {
            options = fs.readdirSync(folderPath)
                .filter(f => f.endsWith('.html'))
                .map(f => ({ 
                    id: f, 
                    name: f.replace('.html', ''), 
                    file: f 
                }));
        }
        steps.push({ key: key + '_style', label: value.title, source_folder: value.folder, options });
    }
    res.json({ ...rawConfig, steps });
});

// API File
app.get('/api/file', (req, res) => {
    const safePath = path.normalize(req.query.path).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(ELEMENT_DIR, safePath);
    if (fs.existsSync(fullPath)) res.json({ content: fs.readFileSync(fullPath, 'utf-8') });
    else res.status(404).json({ content: "" });
});

app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));
