// execute this script with `npm run fetch-deps`
import crypto from 'crypto';
import { createReadStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';

import chalk from 'chalk';
import json5 from 'json5';
import JSZip from 'jszip';
import _ from 'lodash';
import fetch from 'node-fetch';
import ProxyAgent from 'proxy-agent';
import tar from 'tar-fs';

import { UnreachableCode } from '../resources/not_reached';

type Meta = {
  'url': string;
  'dest': string;
  'strip': number;
  'hash': [algorithm: string, hash: string];
}

const projectRoot = path.resolve(); // path of git repo

/* utils */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const readTextFile = async (path: string) => (await fs.readFile(path)).toString();

const isFile = async (p: string): Promise<boolean> => {
  try {
    return (await fs.stat(p)).isFile();
  } catch {
    return false;
  }
};

const isDir = async (p: string): Promise<boolean> => {
  try {
    return (await fs.stat(p)).isDirectory();
  } catch {
    return false;
  }
};


const endsWith = (s: string, suffix: Iterable<string>): boolean => {
  for (const ext of suffix) {
    if (s.endsWith(ext))
      return true;
  }
  return false;
};

const downloadFile = async (url: string, localPath: string): Promise<void> => {
  const res = await fetch(url, { agent: ProxyAgent() });
  await fs.writeFile(localPath, await res.buffer());
};

const waitStream = (stream: { on: (event: 'finish', cb: VoidFunction) => void }): Promise<void> => {
  return new Promise((resolve) => {
    stream.on('finish', resolve);
  });
};

const hash = (algorithm: string, content: string | NodeJS.ArrayBufferView): string => {
  return crypto.createHash(algorithm).update(content).digest('hex');
};


export const safeRmDir = async (path: string): Promise<void> => {
  let tries = 30;
  while (tries > 0) {
    tries--;
    try {
      await fs.rm(path, { recursive: true, force: true });
      break;
    } catch (e) {
      if (tries <= 0)
        throw e;
      await sleep(300);
    }
  }
};

const extractFile = async (dlname: string, meta: Meta): Promise<void> => {
  const dest = path.join(projectRoot, meta.dest);
  await fs.mkdir(dest, { recursive: true });

  if (meta['url'].endsWith('.zip')) {
    const zip = await JSZip.loadAsync(await fs.readFile(dlname));
    for (const [relativePath, entry] of Object.entries(zip.files)) {
      const distPath = path.join(dest, relativePath.split('/').slice(meta.strip).join('/'));
      const dir = path.dirname(distPath);
      if (entry.dir) {
        await fs.mkdir(distPath, { recursive: true });
      } else {
        if (!await isDir(dir))
          await fs.mkdir(dir, { recursive: true });
        const buffer = await zip.file(entry.name)?.async('nodebuffer');
        if (!buffer)
          throw new UnreachableCode();
        await fs.writeFile(distPath, buffer);
      }
    }
  } else if (endsWith(meta['url'], ['.tar.gz', '.tar.xz', '.tgz', '.txz', '.tar'])) {
    await waitStream(createReadStream(dlname).pipe(tar.extract(dest, { strip: meta.strip })));
  } else {
    console.log(`ERROR: ${meta['url']} has an unknown archive type!`);
    return;
  }
};

/* end utils */

export const main = async (updateHashes = false): Promise<void> => {
  console.log('=======');
  const depsPath = path.join(projectRoot, 'util/DEPS.json5');

  const deps = json5.parse<{ [depName: string]: Meta }>(await readTextFile(depsPath));
  let cache: typeof deps = {};

  const cachePath = path.join(projectRoot, 'util/DEPS.cache');
  const dlPath = path.join(projectRoot, 'util/.deps_dl');

  if (await isFile(cachePath))
    cache = json5.parse<typeof cache>(await readTextFile(cachePath));

  const oldCache = new Set(Object.keys(cache));
  const newCache = new Set(Object.keys(deps));

  const missing = new Set([...newCache].filter((v) => !oldCache.has(v)));
  const obsolete = new Set([...oldCache].filter((v) => !newCache.has(v)));
  const outdated: Set<string> = new Set();

  for (const [key, meta] of Object.entries(deps)) {
    if (!await isDir(path.join(projectRoot, meta['dest'])))
      missing.add(key);
    else if (oldCache.has(key) && cache[key]?.['hash'][1] !== meta['hash'][1])
      outdated.add(key);
  }

  if (await isDir(dlPath)) {
    console.log('Removing left overs...');
    await safeRmDir(dlPath);
  }

  await fs.mkdir(dlPath, { recursive: true });

  const hashUpdateMap: { [key: string]: string } = {};

  try {
    const tmp = new Set([...missing, ...outdated]);

    const count = tmp.size;
    if (count) {
      console.log('Fetching missing or outdated dependencies...');
      await Promise.all(Array.from(tmp, (key) => async () => {
        const meta = deps[key];
        if (_.isEmpty(meta) || !meta)
          return;
        const log = (...args: unknown[]) => console.log(chalk.red(`${key}:`), ...args);
        const baseFileName = path.basename(meta['url']).split('.', 1)[0] ?? '';
        const dlname = path.join(dlPath, baseFileName);
        const dest = path.join(projectRoot, meta['dest']);
        await downloadFile(meta['url'], dlname);
        if (_.has(meta, 'hash')) {
          log('Hashing...');
          const content = (await fs.readFile(dlname)).slice(0, 16 * 1024);
          const h = hash(meta['hash'][0], content);
          if (updateHashes) {
            hashUpdateMap[meta['hash'][1]] = h;
            meta['hash'][1] = h;
          } else if (h !== meta['hash'][1]) {
            log(`ERROR: ${key} failed the hash check.`);
            log('Expected hash: ', meta['hash'][1]);
            log(`Actual hash: ${h}`);
            return;
          }
        }
        if (await isDir(dest)) {
          console.log('Removing old files...');
          await safeRmDir(dest);
        }
        log('Extracting...');
        await extractFile(dlname, meta);
        cache[key] = meta;
      }).map((f) => f()));
    }
    if (obsolete.size) {
      console.log('Removing old dependencies...');
      const count = obsolete.size;

      const pad = (x: number) => x.toString().padStart(3, '0');
      for (const [i, key] of Array.from(obsolete.values()).entries()) {
        console.log(`[${pad(i + 1)}/${pad(count)}]: ${key}`);
        const meta = cache[key];
        if (!meta)
          break;
        const dest = path.join(projectRoot, meta['dest']);
        if (await isDir(dest))
          await safeRmDir(dest);
        _.unset(cache, key);
      }
    }

    if (!(missing.size + outdated.size + obsolete.size))
      console.log('Nothing to do.');
  } finally {
    console.log('Saving dependency cache...');
    await fs.writeFile(cachePath, JSON.stringify(cache, null, 2));

    if (hashUpdateMap) {
      console.log('Updating hashes...');
      console.log(hashUpdateMap);
      const data = await readTextFile(depsPath);

      for (const [oldCache, newCache] of Object.entries(hashUpdateMap))
        data.replace(oldCache, newCache);

      await fs.writeFile(depsPath, data);
    }
    console.log('Cleaning up...');
    await safeRmDir(dlPath);
  }
};


void main(process.argv.includes('--update-hashes'));
