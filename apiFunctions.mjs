import fs from 'fs';

function parseString(inputString) {
  const regex = /([a-zA-Z])(\d{1,2})/;
  
  const match = inputString.match(regex);
  
  if (match) {
    const letter = match[1];
    const number = parseInt(match[2], 10); 
    return [letter, number];
  } else {
    return null;
  }
}

export function toggleRow(row, callback) {
  const filePath = './apiData.txt';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback(err);
      return;
    }
      
    const lines = data.split('\n');
    let firstLine = lines[row];
    const parts = firstLine.split('|');
    const textAfterColon = parts[1].trim();
    
    let valStatus;
    if (textAfterColon === "0") {
      valStatus = "1";
    } else {
      valStatus = "0";
    }

    console.log(`testing ${parts[0]}| ${valStatus}`);
    
    lines[row] = `${parts[0]}|${valStatus}`;
    
    const updatedContent = lines.join('\n');
    
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }

      callback(null, valStatus);
    });
  });
}

export function setRow(row, val, callback) {
  const filePath = './apiData.txt';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback(err);
      return;
    }
      
    const lines = data.split('\n');
    let firstLine = lines[row];
    const parts = firstLine.split('|');
    const textAfterColon = parts[1].trim();
    
    let valStatus = val;

    console.log(`testing ${parts[0]}| ${valStatus}`);
    
    lines[row] = `${parts[0]}|${valStatus}`;
    
    const updatedContent = lines.join('\n');
    
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }

      callback(null, valStatus);
    });
  });
}

export function increaseRow(row, val, callback) {
  const filePath = './apiData.txt';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback(err);
      return;
    }
      
    const lines = data.split('\n');
    let firstLine = lines[row];
    const parts = firstLine.split('|');
    const textAfterColon = parts[1].trim();
    
    let valStatus;
    if (textAfterColon.includes(val)) {
      let parsedVal = parseString(textAfterColon);
      valStatus = `${parsedVal[0]}${parsedVal[1] + 1}`;
    } else {
      valStatus = `${val}1`;
    }

    console.log(`testing ${parts[0]}|${valStatus}`);
    
    lines[row] = `${parts[0]}|${valStatus}`;
    
    const updatedContent = lines.join('\n');
    
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }

      callback(null, valStatus);
    });
  });
}

export function getRowStatus(row, callback) {

  const filePath = './apiData.txt';
  let valStatus;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
  
    // Split the content into lines
    const lines = data.split('\n');

    let firstLine = lines[row];

    // Split the string by colon
    const parts = firstLine.split('|');

    // Get the text after the colon (index 1)
    valStatus = parts[1].trim();
    let returnString = valStatus;
    callback(null, returnString);
  });
}

export function prependRow(row, val, callback) {
  const filePath = './apiData.txt';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback(err);
      return;
    }
      
    const lines = data.split('\n');
    let firstLine = lines[row];
    const parts = firstLine.split('|');
    const textAfterColon = parts[1].trim();
    
    let processedString = textAfterColon.replace(/,/g, '","');
    processedString = processedString.replace(/\[/g, '["');
    processedString = processedString.replace(/\]/g, '"]');
    let valArr = JSON.parse(processedString);
    valArr.pop();
    valArr.unshift(null);
    valArr[0] = `${val}`;
    
    lines[row] = `${parts[0]}|[${valArr}]`;
    
    const updatedContent = lines.join('\n');
    
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }

      callback(null, valArr);
    });
  });
}

export function checkRowForInArrVal(row, callback) {
  const filePath = './apiData.txt';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback(err);
      return;
    }
      
    const lines = data.split('\n');
    let firstLine = lines[row];
    const parts = firstLine.split('|');
    const textAfterColon = parts[1].trim();
        
    let valArr = JSON.parse(textAfterColon);
    let newArr = []
    for(let i = 0; i < 20; i++) {
      if(valArr[i] != -1) {
        newArr.push(valArr[i]);
      } else {
        break;
      }
    }
    const smallestElement = Math.min(...newArr);
    const largestElement = Math.max(...newArr);
    const difference = largestElement - smallestElement;
    
    callback(null, difference);
  });
}