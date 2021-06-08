// execute this script with `npm run fetch-deps`
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { promisify } from 'util';
import { exec as _exec } from 'child_process';

import _ from 'lodash';
import tar from 'tar-fs';
import JSZip from 'jszip';
import json5 from 'json5';


type Meta = {
  'url': string;
  'dest': string;
  'strip': number;
  'hash': [string, string];
}

const projectRoot = path.resolve(); // path of git repo

const exec = promisify(_exec);

const isFile = (p: string): boolean => {
  if (!fs.existsSync(p))
    return false;
  return fs.statSync(p).isFile();
};

const isDir = (p: string): boolean => {
  if (!fs.existsSync(p))
    return false;
  return fs.statSync(p).isDirectory();
};

const pad = (x: number) => x.toString().padStart(3, '0');

const endsWith = (s: string, suffix: Iterable<string>): boolean => {
  for (const ext of suffix) {
    if (s.endsWith(ext))
      return true;
  }
  return false;
};

const sleep = (time: number): void => {
  const stop = new Date().getTime();
  while (new Date().getTime() < stop + time)
    ;

  return;
};

export const safeRmDir = (path: string): void => {
  let tries = 30;
  while (tries > 0) {
    tries--;
    try {
      fs.rmdirSync(path, { recursive: true });
      break;
    } catch (e) {
      if (tries <= 0)
        throw e;
      sleep(0.3);
    }
  }
};

export const main = async (updateHashes = false): Promise<void> => {
  const depsPath = path.join(projectRoot, 'util/DEPS.json5');

  const deps: Record<string, Meta> = json5.parse(fs.readFileSync(depsPath).toString());

  let cache: Record<string, Meta> = {};
  const cachePath = path.join(projectRoot, 'util/DEPS.cache');
  const dlPath = path.join(projectRoot, 'util/.deps_dl');

  if (isFile(cachePath))
    cache = JSON.parse(fs.readFileSync(cachePath).toString()) as Record<string, Meta>;

  const oldCache = new Set(Object.keys(cache));
  const newCache = new Set(Object.keys(deps));

  const missing = new Set([...newCache].filter((v) => !oldCache.has(v)));
  const obsolete = new Set([...oldCache].filter((v) => !newCache.has(v)));
  const outdated: Set<string> = new Set();

  for (const [key, meta] of Object.entries(deps)) {
    if (!isDir(path.join(projectRoot, meta['dest'])))
      missing.add(key);
    else if (
      ('hash' in meta) &&
      (key in oldCache) &&
      _.isEqual(_.get(cache, [key, 'hash'], [null, null]), meta['hash'][1])
    )
      outdated.add(key);
  }

  if (isDir(dlPath)) {
    console.log('Removing left overs...');
    safeRmDir(dlPath);
  }

  fs.mkdirSync(dlPath, { recursive: true });

  const repMap: Record<string, string> = {};

  try {
    const tmp = new Set([...missing, ...outdated]);

    const count = tmp.size;
    if (count) {
      console.log('Fetching missing or outdated dependencies...');

      for (const key of Array.from(tmp.values())) {
        const i = Array.from(tmp.values()).indexOf(key);
        // for (const [i, key] of enumerate(missing | outdated)) {
        console.log(`[${pad(i + 1)}/${pad(count)}]: ${key}`);
        const meta = deps[key];
        if (_.isEmpty(meta) || !meta)
          continue;
        const baseFileName = path.basename(meta['url']).split('.', 1)[0];
        if (!baseFileName)
          // this value won't be null, not TypeScript require this
          return;
        const dlname = path.join(dlPath, baseFileName);
        const dest = path.join(projectRoot, meta['dest']);
        // TODO: replace with http client in nodejs
        await exec(`curl -Lo ${dlname} ${meta['url']}`);
        if (_.has(meta, 'hash')) {
          console.log('Hashing...');
          const content = fs.readFileSync(dlname).slice(0, 16 * 1024);
          const h = hash(meta['hash'][0], content);
          if (updateHashes) {
            repMap[meta['hash'][1]] = h;
            meta['hash'][1] = h;
          } else if (h !== meta['hash'][1]) {
            console.log(`ERROR: ${key} failed the hash check.`);
            console.log('Expected hash: ', meta['hash'][1]);
            console.log(`Actual hash: ${h}`);
            break;
          }
        }
        if (isDir(dest)) {
          console.log('Removing old files...');
          safeRmDir(dest);
        }
        console.log('Extracting...');

        await extractFile(dlname, meta);

        cache[key] = meta;
      }
    }
    if (obsolete.size) {
      console.log('Removing old dependencies...');
      const count = obsolete.size;

      Array.from(obsolete.values()).forEach((key, i) => {
        console.log(`[${pad(i + 1)}/${pad(count)}]: ${key}`);
        const meta = cache[key] as Meta;
        const dest = path.join(projectRoot, meta['dest']);
        if (isDir(dest))
          safeRmDir(dest);
        _.unset(cache, key);
      });
    }

    if (!(missing.size + outdated.size + obsolete.size))
      console.log('Nothing to do.');
  } finally {
    console.log('Saving dependency cache...');
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));

    if (repMap) {
      console.log('Updating hashes...');
      console.log(repMap);
      const data = fs.readFileSync(depsPath).toString();

      for (const [old, pyNew] of Object.entries(repMap))
        data.replace(old, pyNew);

      fs.writeFileSync(depsPath, data);
    }
    console.log('Cleaning up...');
    safeRmDir(dlPath);
  }
};

const extractFile = async (dlname: string, meta: Meta): Promise<void> => {
  const dest = path.join(projectRoot, meta.dest);
  fs.mkdirSync(dest, { recursive: true });

  if (meta['url'].endsWith('.zip')) {
    const zip = await JSZip.loadAsync(fs.readFileSync(dlname));
    for (const [relativePath, entry] of Object.entries(zip.files)) {
      const distPath = path.join(dest, relativePath.split('/').slice(meta.strip).join('/'));
      const dir = path.dirname(distPath);
      if (entry.dir) {
        fs.mkdirSync(distPath, { recursive: true });
      } else {
        if (!isDir(dir))
          fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(distPath, await zip.file(entry.name)?.async('nodebuffer'));
      }
    }
  } else if (endsWith(meta['url'], ['.tar.gz', '.tar.xz', '.tgz', '.txz', '.tar'])) {
    await waitStream(fs.createReadStream(dlname)
      .pipe(tar.extract(dest, { strip: meta.strip })));
  } else {
    console.log(`ERROR: ${meta['url']} has an unknown archive type!`);
    return;
  }
};

const waitStream = (stream: { on: (event: 'finish', cb: VoidFunction) => void }): Promise<void> => {
  return new Promise((resolve) => {
    stream.on('finish', () => {
      resolve();
    });
  });
};

const hash = (algorithm: string, content: string | NodeJS.ArrayBufferView): string => {
  return crypto.createHash(algorithm).update(content).digest('hex');
};

void main(process.argv.includes('--update-hashes'));
