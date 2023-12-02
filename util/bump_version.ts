import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const normalizePath = (file: string): string => {
  return path.relative(process.cwd(), file);
};

const assemblyInfoFiles = [
  'plugin/CactbotEventSource/Properties/AssemblyInfo.cs',
  'plugin/CactbotOverlay/Properties/AssemblyInfo.cs',
] as const;

const packageJsonPath = 'package.json';
const packageJsonContents = fs.readFileSync(normalizePath(packageJsonPath), 'utf8');
const packageJson = JSON.parse(packageJsonContents) as { [name: string]: unknown };
const version = packageJson.version;
if (typeof version !== 'string') {
  console.error('Failed to get npm version');
  process.exit(-1);
}

const assemblyVersionRegex = /(?<=Assembly(File)?Version)\(".*"\)/gm;

const writeFiles = (version: string) => {
  for (const file of assemblyInfoFiles) {
    const contents = fs.readFileSync(normalizePath(file), 'utf8');
    const newData = contents.replace(assemblyVersionRegex, `("${version}.0")`);
    fs.writeFileSync(file, newData, 'utf8');
  }
};

const commitFiles = (version: string) => {
  spawnSync('git', ['add', '-u']);
  spawnSync('git', ['commit', '-a', '-m', `build: Bump version to ${version}`]);
};

writeFiles(version);
commitFiles(version);
