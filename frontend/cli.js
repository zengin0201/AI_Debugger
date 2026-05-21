#!/usr/bin/env node
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/ws/debug' });

const PORT = 8000;


const activeConnections = new Set();

wss.on('connection', (ws) => {
  console.log('🟢 Chrome Extension connected!');
  activeConnections.add(ws);
  
  ws.on('close', () => {
    activeConnections.delete(ws);
    console.log('🔴 Chrome Extension disconnected');
  });
});

app.post('/api/track', (req, res) => {
  const data = req.body;
  const payload = JSON.stringify(data);
  

  activeConnections.forEach(client => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(payload);
    }
  });
  
  res.json({ status: 'ok' });
});


app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`🚀 Bridge Server running on port ${PORT}`);
  console.log(`📡 Listening for AI agents data...`);
});