import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, 'data', 'site.json');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function readData() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

function writeData(data) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

app.get('/api/site', (_req, res) => {
  try {
    res.json(readData());
  } catch (err) {
    res.status(500).json({ error: 'Failed to read site data' });
  }
});

app.put('/api/site', (req, res) => {
  try {
    writeData(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save site data' });
  }
});

app.put('/api/site/:section', (req, res) => {
  try {
    const data = readData();
    data[req.params.section] = req.body;
    writeData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save section' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
