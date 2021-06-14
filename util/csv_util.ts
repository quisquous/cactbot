#!/usr/bin/env ts-node-script

import { parseString } from '@fast-csv/parse';
import { Lang } from '../resources/languages';

const _BASE_GITHUB = 'https://raw.githubusercontent.com/';
const _INTL_GITHUB = 'xivapi/ffxiv-datamining/master/csv/';
const _CN_GITHUB = 'thewakingsands/ffxiv-datamining-cn/master/';
const _KO_GITHUB = 'Ra-Workspace/ffxiv-datamining-ko/master/csv/';


type Table<RowKey extends string, SubKey extends string | number> =
  Record<RowKey extends '#' ? number : string, Record<SubKey, string | undefined>>;

type GetTableFunc = {
  <T extends (string | number), K extends string>(
    contents: string, inputs: [key: K, ...indices: T[]],
  ): Promise<Table<K, T>>;
  <T extends (string | number), K extends string>(
    contents: string, inputs: (string | number)[], outputs?: [key: K, ...indices: T[]],
  ): Promise<Table<K, T>>;
};

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
export const makeMap = async (
    contents: string, inputs: (string | number)[], _outputs?: (string | number)[],
): Promise<Record<string, Record<string, string | undefined>>> => {
  const { keys, rows } = await
  new Promise<{ keys: string[]; rows: string[][] }>((resolve, reject) => {
    const rows: string[][] = [];
    parseString(contents, { skipRows: 1 })
      .on('error', (err) => reject(err))
      .on('data', (row: string[]) => rows.push(row))
      .on('end', (rowCount: number) => {
        if (rowCount === 0)
          reject(`csv reads no data`);

        const keys = rows.pop() ?? [];
        rows.pop();

        resolve({
          keys,
          rows,
        });
      });
  });

  const indices = inputs.map((input) => {
    if (typeof input === 'number')
      return input;
    return keys.indexOf(input);
  });

  const outputs = _outputs ?? inputs;

  const map = Object.fromEntries(rows.map((row) => {
    const output = Object.fromEntries(indices.map((indice) => {
      return [outputs[indice] ?? '', row[indice]];
    }));
    return [row[indices[0] ?? 0] ?? '', output];
  }));
  return map;
};

const __getRemoteTable = async (
    url: string, inputs: (string | number)[], outputs: string[] | undefined = undefined,
) => {
  const response = await fetch(url);
  const contents = await response.text();
  return await makeMap(contents, inputs, outputs);
};

export const getIntlTable: GetTableFunc = async (
    table: string, inputs: (string | number)[], outputs?: string[],
) => {
  const url = `${_BASE_GITHUB}${_INTL_GITHUB}${table}.csv`;
  return __getRemoteTable(url, inputs, outputs);
};

export const getKoTable: GetTableFunc = (
    table: string, inputs: (string | number)[], outputs?: string[],
) => {
  const url = `${_BASE_GITHUB}${_KO_GITHUB}${table}.csv`;
  return __getRemoteTable(url, inputs, outputs);
};

export const getCnTable: GetTableFunc = (
    table: string, inputs: (string | number)[], outputs?: string[],
) => {
  const url = `${_BASE_GITHUB}${_CN_GITHUB}${table}.csv`;
  return __getRemoteTable(url, inputs, outputs);
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
    url = `${_BASE_GITHUB}${_CN_GITHUB}${table}.csv`;
  else if (locale === 'ko')
    url = `${_BASE_GITHUB}${_KO_GITHUB}${table}.csv`;
  else
    throw new Error(`Invalid locale: ${locale}`);

  return await (await fetch(url)).text();
};
