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
    // Criterion
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
      'AnotherSildihnSubterrane': 'AnotherSildihnSubterraneSavage',
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

      // Unchanged abilities, Criterion.
      '6854': '6854', // unnamed ability before sculptor's passion
      '77AE': '77AE', // sculptor's passion (self-targeted)
      '7491': '7491', // infern brand (self-targeted)
      '74B0': '74B0', // firesteel strike (self-targeted)
    },
  },
  {
    // Sophia
    fileMap: {
      'ui/raidboss/data/03-hw/trial/sophia-ex.ts': 'ui/raidboss/data/06-ew/trial/sophia-un.ts',
      'ui/raidboss/data/03-hw/trial/sophia-ex.txt': 'ui/raidboss/data/06-ew/trial/sophia-un.txt',
    },
    prefix: { 'SophiaEX': 'SophiaUN' },
    other: {
      'ContainmentBayP1T6Extreme': 'ContainmentBayP1T6Unreal',
      'sophia-ex.txt': 'sophia-un.txt',
      '(Extreme)': '(Unreal)',
      ' Extreme': ' Unreal',
    },
    id: {
      '1981': '7D9C', // Scales of Wisdom 1
      '1983': '7D9D', // --Barbelo Separates-- (unnamed, ignored)
      '1984': '7D9E', // --Barbelo Rejoins-- (unnamed, ignored)
      '1988': '7D9F', // Infusion
      '1989': '7DA0', // Unknown (ignored)
      '196E': '7D9B', // Meteor Quasar Snapshot 1
      '19A7': '7DA1', // Meteor Quasar Snapshot 2
      '19A8': '7DA2', // Tilt Quasar Orange (ignored)
      '19A9': '7DA3', // Tilt Quasar Blue (ignored)
      '19AA': '7DA4', // Execute (storage cast)
      '19AB': '7DA5', // Duplicate
      '19AC': '7DA6', // Thunder III
      '19AD': '7DA7', // Execute (Thunder III, ignored)
      '19AE': '7DA8', // Aero III
      '19AF': '7DA9', // Execute (Aero III, ignored)
      '19B0': '7DAA', // Thunder II
      '19B1': '7DAB', // Execute (Thunder II, ignored)
      '19B3': '7DAD', // Dischordant Cleansing 1
      '19B5': '7DAF', // Dischordant Cleansing 2
      '19B6': '7DB0', // Divine Spark
      '19B8': '7DB2', // Gnostic Rant
      '19B9': '7DB3', // Gnostic Spear
      '19BA': '7DB4', // Ring of Pain
      '19BB': '7DB5', // Vertical Kenoma
      '19BC': '7DB6', // Horizontal Kenoma
      '19BE': '7DB8', // Cloudy Heavens
      '19BF': '7DB9', // Light Dew (Execute)
      '19C0': '7DBA', // Light Dew (Onrush)
      '19C1': '7DBB', // Onrush
      '19C2': '7DBC', // Gnosis
      '19C3': '7DBD', // auto-attack
      '19C4': '7DBE', // Arms of Wisdom
      '19C5': '7DBF', // Cintamani
      '1A4C': '7E46', // Quasar (tilt)
      '1A87': '7E81', // Meteor Quasar Detonate
      '1ABE': '7EB8', // Unknown (ignored)
      '1ABF': '7EB9', // Unknown (ignored)
      '1AE0': '7DC5', // Cintamani Enrage
      '1AE1': '7DC6', // Scales of Wisdom 2
    },
  },
  {
    // Zurvan
    fileMap: {
      'ui/raidboss/data/03-hw/trial/zurvan-ex.ts': 'ui/raidboss/data/06-ew/trial/zurvan-un.ts',
      'ui/raidboss/data/03-hw/trial/zurvan-ex.txt': 'ui/raidboss/data/06-ew/trial/zurvan-un.txt',
      'ui/oopsyraidsy/data/03-hw/trial/zurvan-ex.ts': 'ui/oopsyraidsy/data/03-hw/trial/zurvan-un.ts',
    },
    prefix: { 'ZurvanEX': 'ZurvanUN' },
    other: {
      'ContainmentBayZ1T9Extreme': 'ContainmentBayZ1T9Unreal',
      'zurvan-ex.txt': 'zurvan-un.txt',
      '(Extreme)': '(Unreal)',
      ' Extreme': ' Unreal',
      'Sarva': 'Eidos',
    },
    id: {
      '1E3F': '857F', // Metal Cutter
      '1C4E': '8557', // Flare Star puddles appear
      '1C4F': '8558', // Flare Star puddles resolve
      '1C50': '8559', // The Purge
      '1C51': '855A', // Sarva/Eidos 1
      '1C52': '855B', // Twin Spirit 1 (ignored)
      '1C53': '855C', // Twin Spirit 2 (ignored)
      '1C54': '855D', // Flaming Halberd
      '1C55': '855E', // Demonic Dive
      '1C56': '855F', // Cool Flame
      '1C57': '8560', // Sarva/Eidos 2
      '1C58': '8561', // Ice And Fire
      '1C59': '8562', // Biting Halberd
      '1C5A': '8563', // Tail End
      '1C5B': '8564', // Ciclicle
      '1C5C': '8565', // Southern Cross Snapshot
      '1C5D': '8566', // Southern Cross Resolve
      '1C5E': '8657', // Untranslated intermission cast
      '1C5F': '8568', // Sarva/Eidos 3
      '1C60': '8569', // Ahura Mazda
      '1C63': '856C', // Meracydian Meteor (ignored)
      '1C64': '856D', // Comet (ignored)
      '1C67': '8570', // Infinite Fire
      '1C68': '8571', // Infinite Ice
      '1C6B': '8572', // The South Star (ignored)
      '1C6C': '8573', // The North Star (ignored)
      '1C6D': '8576', // Tyrfing (cast)
      '1C6E': '8577', // Tyrfing (resolve, ignored)
      '1C6F': '8578', // Fire III
      '1C70': '8579', // Metal Cutter
      '1C71': '857A', // The Demon's Claw
      '1C72': '857B', // Wave Cannon (stack)
      '1C73': '857C', // Wave Cannon (avoid)
      '1DC7': '857D', // Broken Seal
      '1E09': '857E', // Soar
      '1E31': '856A', // Hard Thrust (ignored)
      '1E32': '856B', // Berserk (ignored)
      '1E35': '856E', // Meracydian Fire
      '1E36': '856F', // Meracydian Fear
      '1E58': '8591', // Flame Halberd Enrage 1
      '1E59': '8592', // Flame Halberd Enrage 2
      '1E64': '859D', // The South Star (ignored)
      '1E65': '859E', // The North Star (ignored)
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

  const lines = inputText.split('\r\n');
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

  return output.join('\r\n');
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
