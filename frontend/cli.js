#!/usr/bin/env node
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('debugger_history.sqlite');
db.exec(`
  CREATE TABLE IF NOT EXISTS runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    event_data TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const insertEvent = db.prepare('INSERT INTO runs (session_id, event_data) VALUES (?, ?)');
const getHistory = db.prepare('SELECT * FROM runs ORDER BY timestamp DESC LIMIT 500');

const app = express();
app.use(express.json({ limit: '50mb' })); 

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/debug' });
const PORT = 8000;

const activeConnections = new Set();
let currentSessionId = Date.now().toString();

wss.on('connection', (ws) => {
  console.log('🟢 Frontend connected!');
  activeConnections.add(ws);
  
  ws.on('close', () => {
    activeConnections.delete(ws);
    console.log('🔴 Frontend disconnected');
  });
});


app.post('/api/track', (req, res) => {
  const data = req.body;
  const payload = JSON.stringify(data);
  
  insertEvent.run(currentSessionId, payload);

  activeConnections.forEach(client => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
  
  res.json({ status: 'ok' });
});


app.get('/api/history', (req, res) => {
  const rows = getHistory.all();
  res.json(rows.map(r => JSON.parse(r.event_data)));
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`🚀 Bridge Server running on port ${PORT}`);
  console.log(`📡 Listening for AI agents data...`);
});
