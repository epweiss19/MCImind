import express from 'express';
import {WebSocket, WebSocketServer} from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

import {toggleRow, getRowStatus, setRow, increaseRow} from './apiFunctions.mjs'

const clients = [];

function parseString(inputString) {
    const lettersMatch = inputString.match(/[a-zA-Z]+/);
    const numbersMatch = inputString.match(/\d+/);
  
    const letters = lettersMatch ? lettersMatch[0] : '';
    const numbers = numbersMatch ? parseInt(numbersMatch[0], 10) : 0;
  
    return {
      letters: letters,
      numbers: numbers
    };
  }

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log(`Command: ${command}`);

    const result = parseString(inputString);
    console.log("Letters:", result.letters);
    console.log("Numbers:", result.numbers);
      
    switch(result.letters) {
      case "m":
        const currentTime = new Date();
        setRow(1, currentTime, (err, microStatus) => {
          if (err) {
            console.error(`Error: ${err}`);
          } else {
            console.log(`Result: ${microStatus}`);
            ws.send(`[micro]: ${microStatus}`);
          }
        }); 
        break;
      
      case "micro_conn": {
        getRowStatus(1, (err, microStatus) => {
          if (err) {
            console.error(`Error: ${err}`);
          } else {
            const currentTime = new Date();
            const microTime = new Date(microStatus);
            const timeDifference = Math.abs(currentTime - microTime);
            console.log(`Got last micro time of ${microTime}`)
            console.log(`Time difference: ${timeDifference}`);
            if (timeDifference > 10000) {
              console.log("The time difference is more than 10 seconds.");
              console.log(`Result: ${0}`);
              ws.send(`[micro_conn]: ${0}`);
            } else {
              console.log("The time difference is within 10 seconds.");
              console.log(`Result: ${1}`);
              ws.send(`[micro_conn]: ${1}`);
            }
          }
        }); 
        break;
      }

      case "sE": // set emg val
        setRow(0, result.numbers, (err, emgVal) => {
          if (err) {
            console.error(`Error: ${err}`);
          } else {
            console.log(`Result: ${emgVal}`);
            ws.send(`${emgVal}`);
          }
        }); 
        break;

      case "gE": // Get emg val
        getRowStatus(0, (err, emgVal) => {
          if (err) {
            console.error(`Error: ${err}`);
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
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

