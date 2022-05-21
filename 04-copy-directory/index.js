const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname,'/files-copy');

const obj ={
  removeDir() {
    fs.rm(dir, { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
      obj.createDir();
      obj.copyFiles();
    });
  },

  createDir() {
    fs.mkdir(dir, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log('Folder created!');
    });
  },

  copyFiles() {
    const pathFiles = path.join(__dirname, './files');
    fs.readdir(pathFiles, {withFileTypes: true}, (err, files) => {
      if (err)
        console.log(err);
      else {
        files.forEach(file => {
          if (!file.isDirectory()) {
            fs.copyFile(path.join(pathFiles, file.name), path.join(dir, file.name), (err) => {
              if (err) {
                console.log('Error Found:', err);
              } 
            });
          }
        });
      }
    });
  },


};


fs.exists(dir, (exist) => {
  if (exist)    {
    obj.removeDir();
  } else {
    obj.createDir();
    obj.copyFiles();
  }
});

