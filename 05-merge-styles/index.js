const fs = require('fs');
const path = require('path');

const srcFolder = path.join(__dirname, 'styles');
const destFolder = path.join(__dirname, 'project-dist');

const ddd = async () => {
  const wStream = fs.createWriteStream(path.join(destFolder, 'bundle.css'));
  const items = await fs.promises.readdir(srcFolder);
  for (let item of items){
    const rStream = fs.createReadStream(path.join(srcFolder, path.basename(item)), 'utf8');
    fs.stat(path.join(srcFolder, path.basename(item)), (err, st) => {
      if (st.isFile() && path.extname(item) === '.css'){
        rStream.pipe(wStream);
      }
    });
  }
};
ddd();