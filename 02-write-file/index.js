const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const wr = fs.createWriteStream(path.join(__dirname, 'destination.txt'));
const rl = readline.createInterface({ input, output });
output.write('Наберите текст. Он сохранится в файле\n');
rl.on('line', (input) => {
  wr.write(`${input}\n`);
  if (input === 'exit'){
    rl.close(console.log('Работа завершена'));
  }
});