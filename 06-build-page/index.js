const {
  readdir,
  readFile,
  writeFile,
  copyFile,
  mkdir,
} = require('fs/promises');
const { resolve, extname, join, basename } = require('path');
  
const distPath = resolve(__dirname, 'project-dist');
  
async function crF(path) {
  await mkdir(path, { recursive: true });
}
  
async function gfi(path, extFilter) {
  const files = await readdir(path, { withFileTypes: true });
  let filteredFiles;
  if (extFilter) {
    filteredFiles = files.filter((file) => {
      return file.isFile() && extname(file.name) === extFilter;
    });
  }
  return extFilter ? filteredFiles : files;
}
  
async function getLinks(folder, extFilter) {
  const fullPath = resolve(__dirname, folder);
  const files = await gfi(fullPath, extFilter);
  const paths = files.map((file) => resolve(fullPath, file.name));
  return paths;
}
  
async function getChunks(paths) {
  const chunks = Promise.all(
    paths.map(async (path) => {
      return {
        name: basename(path).split('.')[0],
        content: await readFile(path, 'utf8'),
      };
    })
  );
  return chunks;
}
  
async function crCss(name) {
  const bundleCssPath = resolve(distPath, name);
  const files = await getLinks('styles', '.css');
  const chunks = await getChunks(files);
  const bundle = chunks.map((chunk) => chunk.content).join('\n\n');
  writeFile(bundleCssPath, bundle);
}
  
async function copyF(currentFolder) {
  const folderPath = resolve(__dirname, currentFolder);
  const content = await gfi(folderPath);
  content.map(async (item) => {
    if (item.isDirectory()) {
      const itemPath = join(currentFolder, item.name);
      copyF(itemPath);
    } else {
      const oldFilePath = resolve(folderPath, item.name);
      const newFolderPath = resolve(distPath, currentFolder);
      await crF(newFolderPath);
      const newFilePath = resolve(newFolderPath, item.name);
      copyFile(oldFilePath, newFilePath);
    }
  });
}
  
async function injC(src, components, dest) {
  const srcPath = resolve(__dirname, src);
  const componentsFolder = resolve(__dirname, components);
  const paths = await getLinks(componentsFolder, '.html');
  const chunks = await getChunks(paths);
  let template = await readFile(srcPath, 'utf8');
  chunks.map((chunk) => {
    template = template.replace(`{{${chunk.name}}}`, chunk.content);
  });
  const destPath = resolve(distPath, dest);
  writeFile(destPath, template);
}
  
async function dddddd() {
  await crF(distPath);
  await crCss('style.css');
  await copyF('assets');
  await injC('template.html', 'components', 'index.html');
}
  
dddddd();