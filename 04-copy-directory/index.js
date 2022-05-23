const fs = require('fs');
const path = require('path');

const ff = path.join(__dirname, 'files');
const fff = path.join(__dirname, 'files-copy'); 

fs.promises.mkdir(fff, {recursive: true}, () => {});
fs.readdir(fff,{withFileTypes: true}, (err, items) => {
  items.forEach((item) => {fs.unlink(path.join(fff, item.name), () => {});
  });
  fs.readdir(ff,{withFileTypes: true}, (err, items) => {
    items.forEach((item) => {
      fs.copyFile(path.join(ff, item.name), path.join(fff, item.name),() => {});});
  });
});
