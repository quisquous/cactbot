#!/usr/bin/env node

// Helper for automating SaintCoinach -- https://github.com/ufx/SaintCoinach

import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';


const _COINACH_EXE = 'SaintCoinach.Cmd.exe';
const _DEFAULT_COINACH_PATHS = ['C:\\SaintCoinach\\', 'D:\\SaintCoinach\\'];

if (process.env['CACTBOT_DEFAULT_COINACH_PATH'])
  _DEFAULT_COINACH_PATHS.push(process.env['CACTBOT_DEFAULT_COINACH_PATH']);

const _FFXIV_EXE = path.join('game', 'ffxiv_dx11.exe');

const _DEFAULT_FFXIV_PATHS = [
  'C:\\Program Files (x86)\\SquareEnix\\FINAL FANTASY XIV - A Realm Reborn',
  'D:\\Program Files (x86)\\SquareEnix\\FINAL FANTASY XIV - A Realm Reborn',
];

if (process.env['CACTBOT_DEFAULT_FFXIV_PATH'])
  _DEFAULT_FFXIV_PATHS.push(process.env['CACTBOT_DEFAULT_FFXIV_PATH']);

class CoinachError extends Error {
  constructor(message?: string, cmd?: string, output?: string) {
    const errorMessage = `message: ${message ?? ''}
cmd: ${cmd ?? ''}
output: ${output ?? ''}
`;
    super(errorMessage);
  }
}

export class CoinachReader {
  coinachPath: string;
  ffxivPath: string;
  verbose: boolean;
  constructor(coinachPath: string | null, ffxivPath: string | null, verbose = false) {
    this.verbose = verbose;

    if (!coinachPath) {
      for (const p of _DEFAULT_COINACH_PATHS) {
        if (fs.existsSync(path.join(p, _COINACH_EXE))) {
          coinachPath = p;
          break;
        }
      }
    }

    if (!ffxivPath) {
      for (const p of _DEFAULT_FFXIV_PATHS) {
        if (fs.existsSync(path.join(p, _FFXIV_EXE))) {
          ffxivPath = p;
          break;
        }
      }
    }

    if (!coinachPath) throw new CoinachError('not found coinach');
    if (!ffxivPath) throw new CoinachError('not found ffxiv');
    this.coinachPath = coinachPath;
    this.ffxivPath = ffxivPath;

    if (!fs.existsSync(path.join(this.coinachPath, _COINACH_EXE)))
      throw new CoinachError('invalid coinach path: ' + this.coinachPath);
    if (!fs.existsSync(path.join(this.ffxivPath, _FFXIV_EXE)))
      throw new CoinachError('invalid ffxiv path: ' + this.ffxivPath);
  }

  async exd(table: string, lang: string): Promise<string[]> {
    return await this._coinachCmd('exd', table, lang);
  }
  async rawexd(table: string, lang: string): Promise<string[]> {
    return await this._coinachCmd('rawexd', table, lang);
  }
  async _coinachCmd(coinachCmd: string, table: string, lang: string): Promise<string[]> {
    const cmdList = [path.join(this.coinachPath, _COINACH_EXE)];
    const args = [this.ffxivPath, 'lang ' + lang, coinachCmd + ' ' + table];

    const cmd = [...cmdList, ...args].map((x) => `"${x}"`).join(' ');

    if (this.verbose) {
      console.log(`coinach_path: ${this.coinachPath}`);
      console.log('ffxiv_path: ' + this.ffxivPath);
      console.log('cmd: ' + cmd);
    }
    // # This will throw an exception if stuff is VERY wrong
    // # however, return code is still 0 even if all exports fail.
    // # Also, it seems to need to be run from the SaintCoinach directory.
    const output = String(promisify(exec)(cmd));
    // # Manually check output for errors.
    let m = /^([0-9])* files exported, ([0-9])* failed/m.exec(output);
    if (!m) throw new CoinachError('Unknown output', cmd, output);
    if (m[1] === '0')
      throw new CoinachError('Zero successes', cmd, output);
    if (m[2] !== '0')
      throw new CoinachError('Non-zero failures', cmd, output);

    // # Find directory that this export was written to.
    // # There's no way to control this.
    m = /^Definition version: ([0-9.]*)/m.exec(output);
    if (!m) throw new CoinachError('Unknown output', cmd, output);

    const csvFilename = path.join(
        this.coinachPath,
        m[1] ?? '',
        coinachCmd,
        `${table}.csv`,
    );

    if (this.verbose) {
      console.log(`output: \noutput`);
      console.log(`output csv: ${csvFilename}`);
    }
    // # Read the whole file immediately,
    // # as future commands with different langs will overwrite.
    const lines = String(await promisify(fs.readFile)(csvFilename, {
      flag: 'r',
      encoding: 'utf-8',
    })).split(/\r?\n/);

    if (this.verbose) console.log(`csv lines: ${lines.length}`);

    return lines;
  }
}

export class CoinachWriter {
  cactbotPath: string;
  verbose: boolean;
  constructor(cactbotPath: string | null, verbose: boolean) {
    this.verbose = verbose;

    if (!cactbotPath) cactbotPath = this._findCactbotPath();
    this.cactbotPath = cactbotPath;
    if (!fs.existsSync(this.cactbotPath))
      throw new Error(`Invalid cactboth path: ${this.cactbotPath}`);
  }
  _findCactbotPath(): string {
    return '.';
  }
  write(filename: string, scriptname: string, variable: string | null, d: unknown[]): void {
    const fullPath = path.join(this.cactbotPath, filename);

    let f = `// Auto-generated from ${scriptname}
    // DO NOT EDIT THIS FILE DIRECTLY


    export default `;

    let str = JSON.stringify(d.sort());
    // # single quote style
    str = str.replace("'", '\"')
    str = str.replace('"', "'")
    // # add trailing commas
    str = str.replace(/([0-9]|\'|]|})s*$/, '$1,');
    // # remove final trailing comma
    str = str.replace(/,$/, '');
    // # make keys integers, remove leading zeroes.
    str = str.replace(/\'0*([0-9]+)\': {/, '$1: {');
    f += str;
    f += ';\n';

    fs.writeFileSync(fullPath, f);

    if (this.verbose) console.log(`wrote: ${filename}`);
  }
}

const reader = new CoinachReader(null, null, true);
reader.exd(process.argv[2] ?? '', 'en').then((lines) => {
  new CoinachWriter(null, true).write('status.js', 'this', null, lines);
}).catch((e) => console.error(e));
