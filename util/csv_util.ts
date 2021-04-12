#!/usr/bin/env ts-node-script

import fs from 'fs';
import { Lang } from '../types/global';
import { parseString } from '@fast-csv/parse';

type TableType<TValue> = {
  <T extends (string | number), K extends string>(
    contents: string, inputs: [key: K, ...indices: T[]], outputs: undefined,
  ): Promise<Record<K extends '#' ? number : string, Record<T, TValue>>>;
  <T extends (string | number), K extends string>(
    contents: string, inputs: (string | number)[], outputs: [key: string | number, ...indices: T[]],
  ): Promise<Record<K extends '#' ? number : string, Record<T, TValue>>>;
};

const _BASE_GITHUB = 'https://raw.githubusercontent.com/';
const _INTL_GITHUB = 'xivapi/ffxiv-datamining/master/csv/';
const _CN_GITHUB = 'thewakingsands/ffxiv-datamining-cn/master/';
const _KO_GITHUB = 'Ra-Workspace/ffxiv-datamining-ko/master/csv/';


// Turn names from tables into JavaScript-safe ascii string keys.
export const cleanName = (str: string): string => {
  if (!str || str === '')
    return str;

  // The Tam\u2013Tara Deepcroft
  str = str.replace(/\u2013/, '-');

  // The <Emphasis>Whorleater</Emphasis> Extreme
  str = str.replace(/<\/?Emphasis>/, '');

  // Various symbols to get rid of.
  str = str.replace(/[':(),]/, '');

  // Sigmascape V4.0 (Savage)
  str = str.replace(/\./, '');

  // Common case hyphen: TheSecondCoilOfBahamutTurn1
  // Special case hyphen: ThePalaceOfTheDeadFloors1_10
  str = str.replace(/([0-9])-([0-9])/, '_');
  str = str.replace(/[-]/, '');

  // Of course capitalization isn't consistent, that'd be ridiculous.
  str = str.split(' ').map((s) => `${s[0]?.toUpperCase() ?? ''}${s.substring(1)}`).join('');

  // collapse remaining whitespace
  str = str.replace(/\s+/, '');

  // remove non-ascii characters
  str = str.replace(/[^0-9A-z_]/, '');
  return str;
};

// inputs[0] is the key column for the returned map
export const makeMap: TableType<any> = async (
    contents: string, inputs: (string | number)[], outputs?: (string | number)[],
): Promise<Record<string, Record<string, any>>> => {
  const map = {} as Record<string, Record<string, any>>;

  const { keys, rows } = await
  new Promise<{ keys: string[]; rows: string[][] }>((resolve, reject) => {
    const rows: string[][] = [];
    parseString(contents, { skipRows: 1 })
      .on('error', (err) => reject(err))
      .on('data', (row: string[]) => rows.push(row))
      .on('end', (rowCount: number) => {
        if (rowCount === 0)
          reject(`csv reads no data`);

        const keys = rows.shift() ?? [];
        rows.shift();

        resolve({
          keys,
          rows,
        });
      });
  });

  const indices = [];
  for (const input of inputs) {
    if (typeof input === 'number') {
      indices.push(input);
      continue;
    }
    indices.push(keys.indexOf(input));
  }
  if (!outputs)
    outputs = inputs;

  for (const row of rows) {
    const output = {} as Record<string|number, string>;
    for (let i = 0; i < indices.length; i++) {
      const out = outputs[i];
      const indice = indices[i];
      if (out && indice)
        output[out] = row[indice] ?? '';
      if (indices[0] && indices[0] in row)
        console.log(`key collision for [${inputs.join()}], [${outputs.join()}]`);
    }
    map[row[indices[0] ?? 0] ?? ''] = output;
  }
  return map;
};

makeMap(String(fs.readFileSync('../Status.csv')), ['#', 'Name'], undefined).then((map) => {
  // console.log(map);
});

type IGetTable = {
  <T extends (string | number)>(
    table: string, inputs: T[], outputs?: undefined,
  ): Promise<Record<T, Record<string, string>>>;
  <T extends (string | number)>(
    table: string, inputs: (string | number)[], outputs: T[],
  ): Promise<Record<T, Record<string, string>>>;
};

const __getRemoteTable: IGetTable = async (
    url: string, inputs: (string | number)[], outputs?: (string | number)[],
): Promise<Record<string | number, Record<string, string>>> => {
  const response = await fetch(url);
  const contents = await response.text();
  return makeMap(contents, inputs, outputs);
};

export const getIntlTable: IGetTable = async (
    table: string, inputs: (string | number)[], outputs?: string[],
) => {
  const url = `${_BASE_GITHUB}${_INTL_GITHUB}${table}.csv`;
  return __getRemoteTable(url, inputs, outputs);
};

export const getKoTable: IGetTable = (
    table: string, inputs: (string | number)[], outputs?: string[],
) => {
  const url = `${_BASE_GITHUB}${_KO_GITHUB}${table}.csv`;
  return __getRemoteTable(url, inputs, outputs);
};

export const getCnTable: IGetTable = (
    table: string, inputs: (string | number)[], outputs?: string[],
) => {
  const url = `${_BASE_GITHUB}${_CN_GITHUB}${table}.csv`;
  return __getRemoteTable(url, inputs, outputs);
};

export const getLocaleTable: {
  <T extends (string | number)>(
    table: string, locale: Lang, inputs: T[], outputs?: undefined,
  ): Promise<Record<T, string>>;
  <T extends (string | number)>(
    table: string, locale: Lang, inputs: (string | number)[], outputs: T[],
  ): Promise<Record<T, string>>;
} = (
    table: string, locale: Lang, inputs: (string | number)[], outputs?: string[],
) => {
  if (locale === 'cn')
    return getCnTable(table, inputs, outputs as undefined);
  else if (locale === 'ko')
    return getKoTable(table, inputs, outputs as undefined);
  throw new Error(`Invalid locale: ${locale}`);
};

export const getRawCsv = (table: string, locale: Lang): string => {
  let url = '';
  if (locale === 'cn')
    url = `${_BASE_GITHUB}${_CN_GITHUB}${table}.csv`;
  else if (locale === 'ko')
    url = `${_BASE_GITHUB}${_KO_GITHUB}${table}.csv`;
  else
    throw new Error(`Invalid locale: ${locale}`);

  return url;
  // with urllib.request.urlopen(url) as response:
  //     return io.StringIO(response.read().decode("utf-8"))
};
