import express from 'express';
import {WebSocket, WebSocketServer} from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

import {toggleRow, getRowStatus, setRow, increaseRow} from './apiFunctions.mjs'

const clients = [];

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  try {
  ws.on('message', (message) => {
    message = message.toString();
    const regex = /\[([^\]]+)\]/; //matches items between square brackets
    const result = message.match(regex);
    //check if regex match
    let command;
    let data;
    if(!result || result.length <= 1){
      // console.log("Error: could not parse [command] format");
      command = message;
    } else {
      command = result[1];
      const bracketIndex = message.indexOf(']');
      data = message.substring(bracketIndex + 1);
    }

    console.log(`Received: ${message}`);
    console.log(`Command: ${command}`);
      
    switch(command) {
      case "sE": // set emg val
	      console.log("going to set emg val now");
        prependRow(0, data, (err, newMovementLogRow) => {
          if (err) {
            console.error(`Error: ${err}`);
          } else {
            console.log(`Result: ${newMovementLogRow}`);
          }
        }); 

      case "gE": // Get emg val
        getRowStatus(0, (err, emgVal) => {
          if (err) {
            console.error(`Error(here2): ${err}`);
          } else {
            console.log(`${emgVal}`);
            ws.send(`[emg val]: ${emgVal}`);
          }
        }); 
        break;

      default: 
        console.log('Error: invalid socket read');
    }
  });

  ws.on('close', () => {
      console.log('closing connection');
  });
  } catch (e) {
	console.log(`e: ${e}`);
  }
});

server.listen(8081, () => {
    console.log('Server listening on port 3000');
});

