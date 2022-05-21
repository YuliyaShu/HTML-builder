const fs = require('fs');
const path = require('path');
const pathFiles = path.join(__dirname, './secret-folder');
fs.readdir(pathFiles, { withFileTypes: true }, (err, files) => {
  if (err)
    console.log(err);
  else {
    console.log("\nSecret-folder filenames:");
    files.forEach(file => {
      if (!file.isDirectory()) {
        fs.stat(path.join(pathFiles, file.name), (err, stats) => {
          console.log(`${file.name.split('.').slice(0, -1).join('.')} - ${path.extname(file.name).substring(1, path.extname(file.name).length)} - ${( stats.size / 1024).toFixed(2) } kb`);
        });
      }
    });
  }
});