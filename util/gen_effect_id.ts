import path from 'path';

import { CoinachWriter } from './coinach';
import { Table, cleanName, getIntlTable } from './csv_util';

// Maybe this should be called Status like the table, but everything else
// says gain/lose effects.
const effectsOutputFile = 'effect_id.ts';

// TODO: add renaming?
// Almagest: 563

// There are a looooot of duplicate effect names in pvp, and it's impossible
// to differentiate other than manually.  There's also older effects that
// did different things that are still around.
//
// This is a map of id to skill name (for smoke testing/documentation).
const knownMapping = {
  'Thundercloud': '164',
  'Battle Litany': '786',
  'Right Eye': '1910',
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
  'Chain Stratagem': '1221',
  'Vulnerability Up': '638',
} as const;

// These custom name of effect will not be checked, but you'd better make it clean.
// Use this only when you need to handle different effects with a same name.
const customMapping = {
  'EmboldenSelf': '1239',
} as const;


const printError = (
    header: string,
    what: string,
    map: Record<string | number, unknown>,
    key: string,
) =>
  console.error(`${header} ${what}: ${JSON.stringify(map[key])}`);


const makeEffectMap = (table: Table<'#', 'Name'>) => {
  const foundNames = new Set();

  const map = new Map<string, string>();
  for (const [id, effect] of Object.entries(table)) {
    const rawName = effect['Name'];
    if (!rawName)
      continue;
    const name = cleanName(rawName);
    // Skip empty strings.
    if (!name)
      continue;

    if (rawName in knownMapping) {
      if (id !== knownMapping[rawName as keyof typeof knownMapping]) {
        printError('skipping', rawName, table, id);
        continue;
      }
    }

    if (map.has(name)) {
      printError('collision', name, table, id);
      printError('collision', name, table, map.get(name) ?? '');
      map.delete(name);
      continue;
    }
    if (foundNames.has(name)) {
      printError('collision', name, table, id);
      continue;
    }

    foundNames.add(name);
    map.set(name, id);
  }

  // Make sure everything specified in known_mapping was found in the above loop.
  for (const rawName of Object.keys(knownMapping)) {
    const name = cleanName(rawName);
    if (name && !foundNames.has(name))
      printError('missing', name, knownMapping, rawName);
  }

  // Add custom effect name for necessary duplicates.
  for (const [name, id] of Object.entries(customMapping))
    map.set(name, id);

  // Store ids as hex.
  map.forEach((id, name) => map.set(name, parseInt(id).toString(16).toUpperCase()));

  return Object.fromEntries(map);
};


void (async () => {
  const table = await getIntlTable('Status', ['#', 'Name', 'Icon', 'PartyListPriority']);

  const writer = new CoinachWriter(null, true);
  void writer.writeTypeScript(
      path.join('resources', effectsOutputFile),
      'gen_effect_id.ts',
      null,
      null,
      true,
      makeEffectMap(table),
  );
})();
