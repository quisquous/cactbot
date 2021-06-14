import fs from 'fs';
import { ArgumentParser } from 'argparse';

const timeRe = /^\s*#?\s*([0-9]+(?:\.[0-9]+)?)\s+"/;
const firstNumRe = /([0-9]+(?:\.[0-9]+)?)/;

const adjustLines = (lines, adjust) => {
  for (const line of lines) {
    const match = timeRe.exec(line);
    if (match) {
      const time = parseFloat(match[1]) + adjust;
      console.log(line.replace(firstNumRe, time.toFixed(1)));
    } else {
      console.log(line);
    }
  }
};

const main = () => {
  const parser = new ArgumentParser({ description: 'Argparse example' });

  parser.addArgument(['-f', '--file'], {
    help: 'The timeline file to adjust times in',
  });
  parser.addArgument(['-a', '--adjust'], {
    type: Number,
    help: 'The amount of time to adjust each entry by',
  });

  const args = parser.parseArgs();
  adjustLines(fs.readFileSync(args.file).toString().split('\n'), args.adjust);
};

void main();
