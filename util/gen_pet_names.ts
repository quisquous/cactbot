import path from 'path';

import fetch from 'node-fetch';

import { CoinachWriter } from './coinach';
import { getCnTable, getKoTable } from './csv_util';

const _OUTPUT_FILE = 'pet_names.ts';

const keys = ['Name'];
const localeKeys = [...keys, 'Name_de', 'Name_fr', 'Name_ja'];

type XivapiResult = {
  Results: {
    [key: number]: Record<'Name' | 'Name_de' | 'Name_fr' | 'Name_ja', string>;
  };
};

const fetchXivapi = async () => {
  const url = 'https://xivapi.com/Pet?columns=' + localeKeys.join(',');
  const response = await fetch(url);
  const json = (await response.json()) as XivapiResult;
  return json.Results;
};

const normalize = (
  content: XivapiResult['Results'],
): Record<'en' | 'de' | 'fr' | 'ja', string[]> => {
  const result: Record<'en' | 'de' | 'fr' | 'ja', string[]> = {
    // cactbot-ignore-missing-translations
    en: [],
    de: [],
    fr: [],
    ja: [],
  };
  for (const [, data] of Object.entries(content)) {
    // skip empty names and duplicates
    if (data.Name === '' || result.en.includes(data.Name))
      continue;

    result.en.push(data.Name);
    result.de.push(data.Name_de);
    result.fr.push(data.Name_fr);
    result.ja.push(data.Name_ja);
  }
  return result;
};

export default async (): Promise<void> => {
  const tables = {
    ...normalize(await fetchXivapi()),
    cn: Object.keys(await getCnTable('Pet', keys)).filter((k) => k !== ''),
    ko: Object.keys(await getKoTable('Pet', keys)).filter((k) => k !== ''),
  };

  const writer = new CoinachWriter(null, true);
  const header = `import { Lang } from './languages';

type PetData = {
  [name in Lang]: readonly string[];
};
`;
  await writer.writeTypeScript(
    path.join('resources', _OUTPUT_FILE),
    'gen_pet_names.ts',
    header,
    'PetData',
    false,
    tables,
  );
};
