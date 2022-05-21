const path = require('path');
const fs = require('fs');
const pathToText = path.join(__dirname,'/text.txt');
const stream = fs.createReadStream(pathToText, 'utf-8');
stream.on('data', chunk => console.log(chunk));
stream.on('error', error => console.log('Error', error.message));
console.log(pathToText)