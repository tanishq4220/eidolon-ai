/**
 * Eidolon AI - Server Runtime
 * Express HTTP API & Static Client Server
 * Powers the Ghost in the Machine Suite for Hacktoberfest 2026 Week 4
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { GemmaEngine } from './engine/gemma.js';
import { ReaBinaryBridge } from './engine/rea_bridge.js';
import { BinaryNecromancer } from './engine/necromancer.js';
import { DigitalSeance } from './engine/seance.js';
import { OfrendaEngine } from './engine/ofrenda.js';
import { HauntedTerminal } from './engine/terminal.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// Initialize AI & Reverse Engineering Engines
const gemma = new GemmaEngine();
const necromancer = new BinaryNecromancer(gemma);
const seance = new DigitalSeance(gemma);
const ofrenda = new OfrendaEngine(gemma);
const terminal = new HauntedTerminal(gemma, necromancer, seance);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'haunted_and_operational',
    suite: 'Eidolon AI - Ghost in the Machine',
    version: '1.0.0',
    model: gemma.modelName,
    reaStatus: 'connected',
    timestamp: new Date().toISOString()
  });
});

// 1. Binary Necromancy (REA + Gemma 2)
app.get('/api/necromancer/presets', (req, res) => {
  try {
    const presets = necromancer.getAvailablePresets();
    res.json({ presets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/necromancer/resurrect', async (req, res) => {
  try {
    const { presetId, customHex, filename } = req.body;
    let target;

    if (presetId) {
      target = presetId;
    } else if (customHex) {
      target = Buffer.from(customHex.replace(/[^0-9a-fA-F]/g, ''), 'hex');
    } else {
      target = 'apollo11'; // Default
    }

    const result = await necromancer.resurrect(target, filename || 'custom_artifact.bin');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Digital Séance (Historical Spirits)
app.get('/api/seance/spirits', (req, res) => {
  try {
    res.json({ spirits: seance.getSpiritsList() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/seance/commune', async (req, res) => {
  try {
    const { spiritId, question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required to commune with the spirit.' });
    }
    const result = await seance.commune(spiritId || 'ada', question);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Virtual Ofrenda (Día de los Muertos Altar)
app.get('/api/ofrenda/memorials', (req, res) => {
  try {
    res.json({ memorials: ofrenda.getMemorials() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ofrenda/light-candle', (req, res) => {
  try {
    const { memorialId } = req.body;
    const result = ofrenda.lightCandle(memorialId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/ofrenda/leave-offering', (req, res) => {
  try {
    const { memorialId, offeringType } = req.body;
    const result = ofrenda.leaveOffering(memorialId, offeringType || 'marigold');
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/ofrenda/create-memorial', async (req, res) => {
  try {
    const { name, years, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const result = await ofrenda.createCustomMemorial(name, years || 'Unknown', notes || '');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Possessed Shell (Haunted Terminal)
app.post('/api/terminal/execute', async (req, res) => {
  try {
    const { command } = req.body;
    const result = await terminal.execute(command);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server bootstrap
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🕯️ EIDOLON AI - Ghost in the Machine Engine Running!`);
    console.log(`🔮 Web Interface: http://localhost:${PORT}`);
    console.log(`⚡ Model: Google Gemma 2 (${gemma.modelName})`);
    console.log(`🛡️ Binary Analysis: REA Bridge (Entropy, Disassembly)`);
    console.log(`======================================================\n`);
  });
}

export { app, gemma, necromancer, seance, ofrenda, terminal };
