#!/usr/bin/env ts-node-script

import { parseString } from '@fast-csv/parse';
import fetch from 'node-fetch';

import { Lang } from '../resources/languages';

const baseGithub = 'https://raw.githubusercontent.com/';
const intlGithub = 'xivapi/ffxiv-datamining/master/csv/';
const cnGithub = 'thewakingsands/ffxiv-datamining-cn/master/';
const koGithub = 'Ra-Workspace/ffxiv-datamining-ko/master/csv/';


export type Table<RowKey extends string, SubKey extends string | number> =
  Record<RowKey extends '#' ? number : string, Record<RowKey | SubKey, string | undefined>>;

export type GetTableFunc = {
  <T extends (string | number), K extends string>(
    table: string, inputs: [key: K, ...indices: T[]],
  ): Promise<Table<K, T>>;
  <T extends (string | number), K extends string>(
    table: string, inputs: (string | number)[], outputs?: [key: K, ...indices: T[]],
  ): Promise<Table<K, T>>;
};

// Turn names from tables into JavaScript-safe ascii string keys.
export const cleanName = (str: string): string => {
  if (!str || str === '')
    return str;

  // The Tam\u2013Tara Deepcroft
  str = str.replace(/\u2013/g, '-');

  // The <Emphasis>Whorleater</Emphasis> Extreme
  str = str.replace(/<\/?Emphasis>/g, '');

  // Various symbols to get rid of.
  str = str.replace(/[':(),]/g, '');

  // Sigmascape V4.0 (Savage)
  str = str.replace(/\./g, '');

  // Common case hyphen: TheSecondCoilOfBahamutTurn1
  // Special case hyphen: ThePalaceOfTheDeadFloors1_10
  str = str.replace(/([0-9])-([0-9])/g, '$1_$2');
  str = str.replace(/[-]/g, ' ');

  // Of course capitalization isn't consistent, that'd be ridiculous.
  str = str.toLowerCase().replace(/(^[a-z])|([\s_]+[^a-z]*[a-z])/g, (match) => match.toUpperCase());

  // collapse remaining whitespace
  str = str.replace(/\s+/g, '');

  // remove non-ascii characters
  str = str.replace(/[^0-9A-z_]/g, '');
  return str;
};

export const readCsvContent =
  async (content: string | string[]): Promise<{ keys: string[]; rows: string[][] }> => {
    return await new Promise<{ keys: string[]; rows: string[][] }>((resolve, reject) => {
      const rows: string[][] = [];
      parseString(Array.isArray(content) ? content.join('\n') : content, {
        skipLines: 1,
        ignoreEmpty: false,
      })
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
  };

// inputs[0] is the key column for the returned map
export const makeMap: GetTableFunc = async (
    contents: string, inputs: (string | number)[], _outputs?: (string | number)[],
) => {
  const { keys, rows } = await readCsvContent(contents);

  const indices = inputs.map((input) => {
    if (typeof input === 'number')
      return input;
    return keys.indexOf(input);
  });

  const outputs = _outputs ?? inputs;

  const map = Object.fromEntries(rows.map((row) => {
    const output = Object.fromEntries(indices.map((indice, index) => {
      return [outputs[index] ?? '', row[indice]];
    }));
    return [row[indices[0] ?? 0] ?? '', output];
  }));
  return map;
};

const getRemoteTable = async (
    url: string, inputs: (string | number)[], outputs?: string[],
) => {
  const response = await fetch(url);
  const contents = await response.text();
  return await makeMap(contents, inputs, outputs as [key: string, ...indices: string[]]);
};

export const getIntlTable: GetTableFunc = async (
    table: string, inputs: (string | number)[], outputs?: string[],
) => {
  const url = `${baseGithub}${intlGithub}${table}.csv`;
  return getRemoteTable(url, inputs, outputs);
};

export const getKoTable: GetTableFunc = (
    table: string, inputs: (string | number)[], outputs?: string[],
) => {
  const url = `${baseGithub}${koGithub}${table}.csv`;
  return getRemoteTable(url, inputs, outputs);
};

export const getCnTable: GetTableFunc = (
    table: string, inputs: (string | number)[], outputs?: string[],
) => {
  const url = `${baseGithub}${cnGithub}${table}.csv`;
  return getRemoteTable(url, inputs, outputs);
};


export const getLocaleTable: {
  <T extends (string | number), K extends string>(
    contents: string, locale: Lang, inputs: [key: K, ...indices: T[]],
  ): Promise<Table<K, T>>;
  <T extends (string | number), K extends string>(
    contents: string, locale: Lang, inputs: (string | number)[], outputs: [key: K, ...indices: T[]],
  ): Promise<Table<K, T>>;
} = async (
    table: string,
    locale: Lang,
    inputs: (string | number)[],
    outputs?: [key: string, ...indices: (string | number)[]],
): Promise<Table<string, string | number>> => {
  if (locale === 'cn')
    return getCnTable(table, inputs, outputs);
  else if (locale === 'ko')
    return getKoTable(table, inputs, outputs);
  throw new Error(`Invalid locale: ${locale}`);
};

export const getRawCsv = async (table: string, locale: Lang): Promise<string> => {
  let url = '';
  if (locale === 'cn')
    url = `${baseGithub}${cnGithub}${table}.csv`;
  else if (locale === 'ko')
    url = `${baseGithub}${koGithub}${table}.csv`;
  else
    throw new Error(`Invalid locale: ${locale}`);

  return await (await fetch(url)).text();
};

cleanName('_rsv_1379_-1_1_C0_0Status');
