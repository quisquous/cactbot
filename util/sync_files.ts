import fs from 'fs';
import path from 'path';
import process from 'process';
import * as url from 'url';

// TODO: throw some warnings if id lines aren't translated
// TODO: consider doing this at runtime instead of via regex

const __filename = url.fileURLToPath(new URL('.', import.meta.url));
const __dirname = path.basename(__filename);
const root = path.join(__dirname, '../');

const scriptName = 'ts-node util/sync_files.ts';

const blockCommentByExtension = {
  '.ts': [
    `// This file was autogenerated from running ${scriptName}.`,
    '// DO NOT EDIT THIS FILE DIRECTLY.',
    '',
  ],
  '.txt': [
    `# This file was autogenerated from running ${scriptName}.`,
    '# DO NOT EDIT THIS FILE DIRECTLY.',
    '',
  ],
};

export type ReplaceDict = { [key: string]: string };

export type ZoneReplace = {
  fileMap: ReplaceDict;
  prefix: ReplaceDict;
  other: ReplaceDict;
  id: ReplaceDict;
};

const zoneReplace: ZoneReplace[] = [
  {
    fileMap: {
      'ui/raidboss/data/06-ew/dungeon/another_sildihn_subterrane.ts':
        'ui/raidboss/data/06-ew/dungeon/another_sildihn_subterrane-savage.ts',
      'ui/oopsyraidsy/data/06-ew/dungeon/another_sildihn_subterrane.ts':
        'ui/oopsyraidsy/data/06-ew/dungeon/another_sildihn_subterrane-savage.ts',
      'ui/raidboss/data/06-ew/dungeon/another_sildihn_subterrane.txt':
        'ui/raidboss/data/06-ew/dungeon/another_sildihn_subterrane-savage.txt',
    },
    prefix: { 'ASS': 'ASSS' },
    other: {
      'zoneId: ZoneId.AnotherSildihnSubterrane,': 'zoneId: ZoneId.AnotherSildihnSubterraneSavage,',
      'another_sildihn_subterrane.txt': 'another_sildihn_subterrane-savage.txt',
      '# Another Sil\'dihn Subterrane': '# Another Sil\'dihn Subterrane (Savage)',
    },
    id: {
      '7490': '76BB',
      '7499': '76BC',
      '749C': '76BD',
      '749E': '76BE',
      '74A1': '76BF',
      '74A6': '76C1',
      '74AD': '76C4',
      '74AF': '76C5',
      '74B1': '76C6',
      '74B2': '76C7',
      '74B4': '76C8',
      '74B5': '76C9',
      '74B7': '76CA',
      '74B9': '76CC',
      '74BB': '76CD',
      '7658': '779A',
      '7659': '779B',
      '765A': '779C',
      '765B': '779D',
      '765C': '779E',
      '765D': '779F',
      '765E': '77A0',
      '765F': '77A1',
      '7660': '77A2',
      '7661': '77A3',
      '7662': '77A4',
      '7663': '77A5',
      '7664': '77A6',
      '7666': '77A8',
      '7667': '77A9',
      '7668': '77AA',
      '7669': '77AB',
      '766A': '77AC',
      '766B': '77AD',
      '766C': '77AE',
      '766E': '77B0',
      '766F': '77B1',
      '7670': '77B2',
      '7671': '77B3',
      '7672': '77B4',
      '7673': '77B5',
      '7674': '77B6',
      '7675': '77B7',
      '7676': '77B8',
      '7677': '77B9',
      '7678': '77BA',
      '7679': '77BB',
      '768C': '77BC',
      '768D': '77BE',
      '774F': '7772',
      '7750': '7773',
      '7751': '7774',
      '7752': '7775',
      '7753': '7776',
      '7754': '7777',
      '7755': '7778',
      '7756': '7779',
      '7757': '777A',
      '7758': '777B',
      '7759': '777C',
      '775A': '777D',
      '775D': '7780',
      '775E': '7781',
      '7760': '7783',
      '7761': '7784',
      '7762': '7785',
      '7763': '7786',
      '7764': '7787',
      '7765': '7788',
      '7766': '7789',
      '7767': '778A',
      '7768': '778B',
      '7769': '778C',
      '776A': '778D',
      '776C': '778F',
      '776D': '7790',
      '776E': '7791',
      '776F': '7792',
      '7770': '7793',
      '7771': '7794',
      '77EA': '77EC',
      '7957': '796F',
      '7958': '7970',
      '7959': '7971',
      '795A': '7972',
      '795B': '7973',
      '795C': '7974',
      '795D': '7975',
      '795F': '7977',
      '7960': '7978',
      '7961': '7979',
      '7962': '797A',
      '7963': '797B',
      '7964': '797C',
      '7965': '797D',
      '7966': '797E',
      '7968': '7980',
      '7969': '7981',
      '796A': '7982',
      '796B': '7983',
      '796C': '7984',
      '79E0': '79E1',
      '79F3': '79F4',

      // Unchanged abilities.
      '6854': '6854', // unnamed ability before sculptor's passion
      '77AE': '77AE', // sculptor's passion (self-targeted)
      '7491': '7491', // infern brand (self-targeted)
      '74B0': '74B0', // firesteel strike (self-targeted)
    },
  },
];

const processFile = (filename: string, zone: ZoneReplace, inputText: string): string => {
  const output = [];
  for (const [extension, comment] of Object.entries(blockCommentByExtension)) {
    if (filename.endsWith(extension)) {
      output.push(...comment);
      break;
    }
  }

  const lines = inputText.split('\n');
  const prefixes = Object.entries(zone.prefix);
  const others = Object.entries(zone.other);
  const ids = Object.entries(zone.id);

  for (const inputLine of lines) {
    let line = inputLine;

    // TODO: consider matching: /^\s*id: '/ or /^\s* '/
    for (const [inputId, outputId] of prefixes)
      line = line.replace(` '${inputId} `, ` '${outputId} `);
    for (const [input, output] of others)
      line = line.replace(input, output);
    for (const [inputId, outputId] of ids)
      line = line.replace(`${inputId}`, `${outputId}`);

    output.push(line);
  }

  return output.join('\n');
};

const processAllFiles = async (root: string) => {
  for (const zone of zoneReplace) {
    for (const [input, output] of Object.entries(zone.fileMap)) {
      try {
        const inputFile = await fs.promises.readFile(path.join(root, input));
        const outputText = processFile(input, zone, inputFile.toString());
        await fs.promises.writeFile(output, outputText);
      } catch (e) {
        console.error(e);
      }
    }
  }

  process.exit(0);
};

void processAllFiles(root);
