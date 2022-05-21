const path = require('path');
const fs = require('fs');
const pathFiles = path.join(__dirname, './styles');
fs.readdir(pathFiles, { withFileTypes: true }, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      if (!file.isDirectory() && file.name.split('.').slice(1, 2).join('.') == 'css') {
        fs.readFile(path.join(pathFiles, file.name), 'utf8', function(err, data){
          if (err) {
            return console.error(err);
          }
          const pathToBundle = path.join(__dirname, './project-dist');
          const pathToFile = path.join(pathToBundle, './bundle.css');
          fs.exists(pathToFile, (exist) => {
            if (exist)    {
              fs.unlink(pathToFile, () => {
                if (err) {
                  return console.error(err);
                } 
                fs.createWriteStream(pathToFile);
                fs.appendFile(pathToFile, data, () => {if (err) console.log(err);});
              });
            } else {
              fs.createWriteStream(pathToFile);
              fs.appendFile(pathToFile, data, () => {if (err) console.log(err);});
            }
          });
        });
      }
    });
  }
});