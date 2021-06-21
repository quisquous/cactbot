import fetch from 'node-fetch';
import yaml from 'js-yaml';
import { CoinachReader, CoinachWriter } from './coinach';
import { getKoTable, readCsvContent } from './csv_util';

const locales = ['de', 'en', 'fr', 'ja'] as const;
const tackleId = 33;
const seafoodId = 47;
const base = 'https://xivapi.com/';
const fishTrackerBase = (
  'https://raw.githubusercontent.com/icykoneko/ff14-fish-tracker-app/master/private/fishData.yaml'
);
let xivapiKey: string | undefined;
// First argument is the API key
if (process.argv.length > 1)
  xivapiKey = process.argv[1];


const cleanupGerman = (word: string): string[] => {
  word = word.replace('[A]', 'er');
  word = word.replace('[p]', '');
  word = word.replace('[t]', 'der');

  if (word.indexOf('[a]') === -1)
    return [word];

  // [a] is complicated, and can mean different things in different contexts.
  // Just cover all our bases here.
  const endings = ['e', 'en', 'es', 'er'];
  return endings.map((x) => word.replace('[a]', x));
};


type XivapiFilter = {
  id?: string;
  columns?: string | ReadonlyArray<string>;
} & {
  [s: string]: string | ReadonlyArray<string>;
}

type XivapiResult<Columns> = Columns extends string ? {[s in Columns]: unknown} : any;

type XivapiResults<Columns> = {
  Results: XivapiResult<Columns>;
  Pagination: {
    Page: number;
    PageNext: number | null;
    PagePrev: number | null;
    PageTotal: number;
    Results: number;
    ResultsPerPage: number;
    ResultsTotal: number;
  };
};

type XivapiFunc<Filter = XivapiFilter> =
  (content: string, filter: Filter) =>
  Promise<XivapiResults<Pick<Filter, 'columns'>>>;

/** Fetches content columns from XIVAPI */
const xivapi: XivapiFunc = async (content, filters = {}) => {
  let page = 1;
  let url = `${base}${content}`;
  let byId = false;

  // IDs are just part of the url path
  if (filters.id) {
    url += `/${filters.id}`;
    byId = true;
    delete filters['id'];
  }

  // Add the key
  url += '?';
  if (xivapiKey)
    url += `key=${xivapiKey}`;

  // Filters are added onto the URL as a query string
  if (Object.keys(filters).length > 0)
    url += '&' + new URLSearchParams(filters as Record<string, string>).toString();

  const response = await (await fetch(`${url}&page=${page}`)).json();

  let results;
  if (!byId) {
    results = response['Results'];
  } else {
    // Searches by ID do not have pagination separate from results
    results = response;
  }

  // Loop requests until the page is over
  while (!byId && response['Pagination']['Page'] !== response['Pagination']['PageTotal']) {
    page += 1;
    const response = await fetch(`${url}&page=${page}`);
    if (response.status !== 200) {
      console.log(response.status);
      console.log(response.headers);
      console.log(await response.text());
      process.exit();
    }

    results += (await response.json())['Results'];
  }

  return results;
};


const fishTracker = async () => {
  const response = await fetch(fishTrackerBase);
  if (response.status !== 200) {
    console.log(response.status);
    console.log(response.headers);
    console.log(await response.text());
    process.exit();
  }

  return yaml.load(await response.text());
};


/** Returns dictionaries for places, fish, and place->fish mapping */
const getFishData = async () => {
  // Generate the columns needed
  const columns = ['ID', 'PlaceName.ID'];

  locales.forEach((locale) => {
    columns.push(`PlaceName.Name_${locale}`);
    columns.push(`PlaceName.NameNoArticle_${locale}`);
  });

  for (let i = 0; i < 10; i++) {
    locales.forEach((locale) => {
      columns.push(`Item${i}.ID`);
      columns.push(`Item${i}.Singular_${locale}`);
      columns.push(`Item${i}.Plural_${locale}`);
    });
  }

  const results = await xivapi('FishingSpot', { columns: columns });

  // Build the data dicts from results
  const places = Object.fromEntries(locales.map((locale) => [locale, {}]));
  const fishes = Object.fromEntries(locales.map((locale) => [locale, {}]));
  const placefish = {};

  results.forEach((result) => {
    // Skip spots without place names
    if (!result['PlaceName']['Name_en'])
      continue;

    locales.forEach((locale) => {
      const placeId = result['PlaceName']['ID'];

      if (locale === 'fr') {
        // This is to specifically to turn `Arbre à pappus` into `L'arbre à pappus`.
        // Other French names already have `L'` in the front, so we can't treat it
        // as optional in the regex.  See: //2651.
        places[locale][placeId] = result['PlaceName'][`Name_${locale}`];
      } else {
        // However, English specifically is much more inconsistent about when "The"
        // appears in the Name_en field.  "Limsa Lominsa lower decks" has a "The" in
        // game, but not in Name_en.  "The Source" has a "The" in game, but does have
        // one in Name_en.  Prefering NameNoArticle_en removes all "Thes" from English.

        // Occasionally, PlaceName data will have null or empty strings in the NameNoArticle field.
        // In these instances, I believe it simply defaults to the Name attribute.
        places[locale][placeId] =
            result['PlaceName'][`NameNoArticle_${locale}`] ?? result['PlaceName'][`Name_${locale}`];
      }

      const idList = [];

      for (let item = 0; item < 10; item++) {
        const fish = result[`Item${item}`];

        // Skip if no name
        if (!fish[`Singular_${locale}`])
          continue;

        let flist = [];
        if (locale === 'de') {
          fish['Singular_de'] = cleanupGerman(fish['Singular_de']);
          fish['Plural_de'] = cleanupGerman(fish['Plural_de']);
          flist = fish['Singular_de'];
          flist.concat(fish['Plural_de']);
        } else {
          flist = [fish[`Singular_${locale}`], fish[`Plural_${locale}`]];
        }

        // uniq
        flist = flist.filter((v, i, a) => a.indexOf(v) === i);
        // delistify if only one element
        if (flist.length === 1)
          flist = flist[0];

        fishes[locale][fish['ID']] = flist;

        // Add fish to id list
        idList.push(fish['ID']);
      }

      if (placeId in placefish) {
        // not efficient to do this, but number of fish is small
        placefish[placeId] = new Array(new Set(placefish[placeId]).add(idList)).sort();
      } else {
        placefish[placeId] = idList.sort();
      }
    });
  });

  return { places, fishes, placefish };
};


const getTackle = async () => {
  // Also get fishing tackle
  const response = await xivapi(
      'ItemUICategory', { 'id': tackleId.toString(), 'columns': ['GameContentLinks.Item.ItemUICategory'] },
  );

  const itemIds = response['GameContentLinks']['Item']['ItemUICategory'];
  const columns = ['ID', ...locales.map((locale) => `Singular_${locale}`)];

  const results = await xivapi('Item', { 'columns': columns, 'ids': itemIds });

  const tackle = {};

  locales.forEach((locale) => {
    const localeTackle = {};

    results.forEach((result) => {
      if (locale === 'de')
        result['Singular_de'] = cleanupGerman(result['Singular_de']);
      localeTackle[result['ID']] = result[`Singular_{locale}`];
    });

    tackle[locale] = localeTackle;
  });

  return tackle;
};


const findFishByName = (fishes, name) => {
  for (const [id, value] of Object.entries(fishes['en'])) {
    if (Array.isArray(value)) {
      for (const actualName of value) {
        if (actualName === name)
          return id;
      }
    } else {
      if (value === name)
        return id;
    }
  }
};


const getTugs = async (fishes) => {
  const tugs = {};
  const data = await fishTracker();
  for (const fish of data) {
    if ('tug' in fish && fish['tug'])
      const id = findFishByName(fishes, fish['name'].lower());
    let tug = 0;
    const tugName = fish['tug'].casefold();

    if (tugName === 'light')
      tug = 1;
    else if (tugName === 'medium')
      tug = 2;
    else if (tugName === 'heavy' || tugName === 'legendary')
      tug = 3;
    else
      console.log('unknown tug type: ' + tugName);

    if (tug && id)
      tugs[id] = tug;
  }

  return tugs;
};


const appendSpecialPlaceNames = async (places) => {
  // handle special german casting names
  const fishingPlaces = Object.keys(places['de']);

  const coin = new CoinachReader(null, null);
  const { keys, rows } = await readCsvContent(await coin.exd('PlaceName', 'de'));

  const placeIdx = 0;
  const xmlIdx = 9;

  for (const row of rows) {
    const place = parseInt(row[placeIdx] ?? '0');
    if (!place)
      continue;
    if (place in fishingPlaces)
      continue;
    const m = /<Case\(2\)>([^<]*)<\/Case>/.exec(row[xmlIdx]);
    if (!m)
      continue;

    if (Array.isArray(places['de'][place]))
      places['de'][place].append(m[1]);
    else
      places['de'][place] = [places['de'][place], m[1]];
  }
  return places;
};


const getCnData = async () => {
  const locales = ['chs', 'en'];
  const base = 'https://cafemaker.wakingsands.com/';

  const { places, fishes, _ } = await getFishData();
  const tackle = getTackle();

  return [places, fishes, tackle];
};


const getKoData = async () => {
  const itemKeys = ['#', 'Singular', 'ItemUICategory'];
  const items = await getKoTable('Item', itemKeys);

  const tackle = {};
  const fishes = {};
  for (const [id, item] of Object.entries(items)) {
    // no plurals
    if (item['ItemUICategory'] === tackleId.toString())
      tackle[parseInt(id)] = item['Singular'];
    else if (item['ItemUICategory'] === seafoodId.toString())
      fishes[parseInt(id)] = item['Singular'];
  }

  // Sorry, this is an unfortunate duplication of get_fish_data
  // xivapi has data in a different way than the csvs do.
  // This does mean that there are more keys here.
  const placeKeys = ['#', 'Name'];
  const placeNames = getKoTable('PlaceName', placeKeys);

  const spotKeys = ['#', 'PlaceName', 'Item[0]'];
  const spots = getKoTable('FishingSpot', spotKeys);

  const places = {};
  for (const [id, spot] of Object.entries(spots)) {
    const placeId = spot['PlaceName'];
    if (placeId === '0')
      continue;
    places[int(placeId)] = placeNames[placeId]['Name'];
  }

  return [
    { 'ko': places },
    { 'ko': fishes },
    { 'ko': tackle },
  ];
};


void (async () => {
  let { places, fishes, placefish } = await getFishData();
  const tackle = await getTackle();
  const tugs = await getTugs(fishes);
  const places = await appendSpecialPlaceNames(places);

  const [cnPlaces, cnFishes, cnTackle] = await getCnData();
  tackle = { tackle, ...{ 'cn': cnTackle['chs'] } };
  places = { places, ...{ 'cn': cnPlaces['chs'] } };
  fishes = { fishes, ...{ 'cn': cnFishes['chs'] } };

  const [koPlaces, koFishes, koTackle] = await getKoData();
  tackle = { tackle, ...koTackle };
  places = { places, ...koPlaces };
  fishes = { fishes, ...koFishes };

  const data = {
    'tackle': tackle,
    'places': places,
    'fish': fishes,
    'placefish': placefish,
    'tugs': tugs,
  };

  const filename = __dirname + '../../ui/fisher/static-data.ts';
  const writer = new CoinachWriter(null, false);

  const header = `import { Lang } from '../../resources/languages';

type LangMapping = {
  [lang in Lang]: {
    [id: string]: string | string[];
  };
};

type FisherData = {
  readonly fish: LangMapping;
  readonly placefish: { [placeId: string]: number[] };
  readonly places: LangMapping;
  readonly tackle: LangMapping;
  readonly tugs: { [fishId: string]: number };
};`;
  await writer.writeTypeScript(
      filename,
      'gen_fisher_data.ts',
      header,
      'FisherData',
      false,
      data,
  );
})();
