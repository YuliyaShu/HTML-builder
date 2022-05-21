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
    // process.stdin.pipe(out);
    out.write(data.toString());
    process.on('SIGINT', () => {
      process.stdout.write('Пока!');
      process.exit();
    });
  }
});

  
  
  
  

