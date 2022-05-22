const path = require('path');
const fs = require('fs');

const builder = {

  removeDir() {
    const dir = path.join(__dirname,'/project-dist');
    const pathToFile = path.join(dir, './style.css');
    fs.exists(pathToFile, (exist) => {
      if (exist)    {
        fs.unlink(pathToFile, (err) => {
          if (err) {
            return console.error(err);
          } 
        });
      }
    });

    fs.rm(dir, { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
      builder.createFolder();
    });
  },
      
  createFolder() {
    const dir = path.join(__dirname,'/project-dist');
    fs.exists(dir, (exist) => {
      if (exist)    {
        builder.removeDir();
      } else {
        fs.mkdir(dir, (err) => {
          if (err) {
            return console.error(err);
          }
          builder.createCSS();
          builder.copyAssets();
          builder.createHTML();
        });
      }
    });
    
    
  },

  createCSS() {
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
              const pathToFile = path.join(pathToBundle, './style.css');
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
  },

  copyAssets() {
    const obj ={
      pathFiles: path.join(__dirname, './assets'),
      pathEnd: path.join(__dirname, './project-dist'),
      pathAssetsInProject: path.join(__dirname, './project-dist', './assets'),
      
      removeDir(from, to) {
        fs.rm(to, { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          obj.createDir(from, to);
        });
      },
      
      createDir(from, to) {
        fs.exists(to, (exist) => {
          if (exist)    {
            obj.removeDir(from ,to);
          } else {
            fs.mkdir(to, (err) => {
              if (err) {
                return console.error(err);
              } 
              obj.copyFiles(from, to);
            });
          }
        });

       
      },
      
      copyFiles(from, to) {
        fs.readdir(from, {withFileTypes: true}, (err, files) => {
          if (err) {
            console.log(err);
          } else {
            files.forEach(file => {
              if (!file.isDirectory()) {
                fs.copyFile(path.join(from, file.name), path.join(to, file.name), (err) => {
                  if (err) {
                    console.log('Error Found:', err);
                  } 
                });
              }
              else {
                const pathFiles2 = path.join(__dirname, './assets', file.name);
                const pathAssetsInProject2 = path.join(__dirname, './project-dist', './assets', file.name);
                this.createDir(pathFiles2, pathAssetsInProject2);
              }
            });
          }
        });
      },
    };
    obj.createDir(obj.pathFiles, obj.pathAssetsInProject);
  },

  createHTML() {
    const pathFiles = path.join(__dirname, './template.html');
    fs.readFile(pathFiles, 'utf8', function(err, data){
      if (err) {
        return console.error(err);
      }
      const pathToBundle = path.join(__dirname, './project-dist');
      const pathToFile = path.join(pathToBundle, './index.html');
      fs.exists(pathToFile, (exist) => {
        if (exist)    {
          fs.truncate(pathToFile, () => {if (err) console.error(err);});
          fs.createWriteStream(pathToFile);
          fs.appendFile(pathToFile, data, () => {
            if (err) console.log(err);
            newComponents();
          });
        } 
        else {
          fs.createWriteStream(pathToFile);
          fs.appendFile(pathToFile, data, () => {
            if (err) console.log(err);
            newComponents();
          });
        }
        function newComponents() {
          const htmlText = fs.createReadStream(pathToFile);
          htmlText.on('data', chunk => {
            let text = chunk.toString();
            const components = path.join(__dirname, './components');
            fs.readdir(components, { withFileTypes: true }, (err, files) => {
              if (err) console.log(err);
              files.forEach(file => {
                let replace;
                const whatToChange = `{{${file.name.split('.').slice(0, -1).join('.')}}}`;
                fs.readFile(path.join(__dirname, './components', file.name), 'utf8', function(err, data){
                  if (err) console.error(err);
                  replace = text.replace(whatToChange, data);
                  text = replace;
                  fs.truncate(pathToFile, () => {if (err) console.error(err);});
                  fs.createWriteStream(pathToFile);
                  fs.appendFile(pathToFile, replace, () => {if (err) console.log(err);});
                });
              });
              
            });
          });
        }
      });
    });
  },
  
};
builder.createFolder();