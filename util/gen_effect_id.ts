// !/usr/bin/env python

import path from 'path';
import fs from 'fs';

import { cleanName, getIntlTable } from './csv_util';
import { CoinachWriter } from './coinach';

// Maybe this should be called Status like the table, but everything else
// says gain/lose effects.
const _EFFECTS_OUTPUT_FILE = 'effect_id.ts';

// There are a looooot of duplicate effect names in pvp, and it's impossible
// to differentiate other than manually.  There's also older effects that
// did different things that are still around.
//
// This is a map of id to skill name (for smoke testing/documentation).
const knownMapping = {
  'Thundercloud': '164',
  'Battle Litany': '786',
  'Right Eye': '1453',
  'Left Eye': '1454',
  'Meditative Brotherhood': '1182',
  'Brotherhood': '1185',
  'Embolden': '1297',
  'Technical Finish': '1822',
  'Sheltron': '1856',
  'Lord of Crowns': '1876',
  'Lady of Crowns': '1877',
  'Divination': '1878',
  'The Balance': '1882',
  'The Bole': '1883',
  'The Arrow': '1884',
  'The Spear': '1885',
  'The Ewer': '1886',
  'The Spire': '1887',
  'Sword Oath': '1902',
  'Tactician': '1951',
  // This is for others, 1821 is for self.
  'Standard Finish': '2105',
  'The Wanderer\'s Minuet': '2216',
  'Mage\'s Ballad': '2217',
  'Army\'s Paeon': '2218',
  'Stormbite': '1201',
  'Caustic Bite': '1200',
  'Windbite': '129',
  'Venomous Bite': '124',
  'Flourishing Fan Dance': '1820',
  'Higanbana': '1228',
  'Wildfire': '861',
} as const;


const printError = (
    header: string, what: string, map: Record<string, any>, key: string,
): void => {
  console.error((`${header} ${what}: ${JSON.stringify(map[key])}`));
};


const makeEffectMap = (table: Record<string, Record<string, string>>) => {
  const foundNames = new Set();

  const map = {} as Record<string, string>;
  for (const [id, effect] of Object.entries(table)) {
    const rawName = effect['Name'] ?? '';
    const name = cleanName(rawName);
    if (!name)
      continue;

    if (rawName in knownMapping) {
      if (id !== knownMapping[rawName as keyof typeof knownMapping]) {
        printError('skipping', rawName, table, id);
        continue;
      }
    }

    if (name in map) {
      printError('collision', name, table, id);
      printError('collision', name, table, map[name] as string);
      delete map[name];
      continue;
    }
    if (name in foundNames) {
      printError('collision', name, table, id);
      continue;
    }

    foundNames.add(name);
    map[name] = id;
  }
  // Make sure everything specified in known_mapping was found in the above loop.
  for (const [rawName, id] of Object.entries(knownMapping)) {
    const name = cleanName(rawName);
    if (!(name in foundNames))
      printError('missing', name, knownMapping, rawName);
  }

  // Store ids as hex.
  return map;
};


const table = getIntlTable('Status', ['#', 'Name', 'Icon', 'PartyListPriority']);

const writer = new CoinachWriter(null, true);
writer.write(
    path.join('resources', _EFFECTS_OUTPUT_FILE),
    path.basename(fs.realpathSync(__filename)),
    'EffectId',
    makeEffectMap(table),
);
