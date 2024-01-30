import express from 'express';
import {WebSocket, WebSocketServer} from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

//import {toggleRow, getRowStatus, setRow, increaseRow} from './apiFunctions.mjs'

//declaring global variables to track socket clients
const clients = [];

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {  
    switch(message) {
      case "webpage":
        clients.push(ws);
        console.log(`New webpage connection (total: ${clients.length})`);
        break;

      case "m":
        ws.send(`[micro]: ${microStatus}`);
        break;

      default: 
        console.log('Error: invalid socket read');
    }
  });

  ws.on('close', () => {
      console.log('closing connection');
  });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

