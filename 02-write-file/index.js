const fs = require('fs');
const path = require('path');
const out = fs.createWriteStream(path.join(__dirname, './text.txt'));
process.stdout.write('Приветствуем! Введите любой текст!\n');
process.on('SIGINT', () => {
  process.stdout.write('Пока!');
  process.exit();
});
process.stdin.on('data', data => {
  if (data.toString().trim() == 'exit') {
    process.stdout.write('Пока!');
    process.exit();
  } else {
    out.write(data.toString());
    process.on('SIGINT', () => {
      process.stdout.write('Пока!');
      process.exit();
    });
  }
});
console.log(path.join(__dirname, './text.txt'))

  
  
  
  

