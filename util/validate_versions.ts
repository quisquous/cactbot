import fs from 'fs';
import path from 'path';

const normalizePath = (file: string): string => {
  return path.relative(process.cwd(), file);
};

const packageJsonPath = 'package.json';

const assemblyInfoFiles = [
  'plugin/CactbotEventSource/Properties/AssemblyInfo.cs',
  'plugin/CactbotOverlay/Properties/AssemblyInfo.cs',
] as const;

const regexes: RegExp[] = [
  /(?<=AssemblyVersion\(").*(?=\.0"\))/m,
  /(?<=AssemblyFileVersion\(").*(?=\.0"\))/m,
];

const validate = () => {
  const packageJsonContents = fs.readFileSync(normalizePath(packageJsonPath), 'utf8');
  const packageJson = JSON.parse(packageJsonContents) as { [name: string]: unknown };
  const version = packageJson.version;
  if (typeof version !== 'string') {
    console.error('Failed to get npm version');
    process.exit(-1);
  }

  for (const file of assemblyInfoFiles) {
    const contents = fs.readFileSync(normalizePath(file), 'utf8');
    for (const regex of regexes) {
      const matches = regex.exec(contents);
      const thisVersion = matches?.[0];
      if (thisVersion === undefined) {
        console.error(`Couldn't find assembly version in ${file} with ${regex.source}`);
        process.exit(-2);
      }
      if (thisVersion !== version) {
        console.error(
          `Version mismatch in ${file} with ${regex.source}, found ${thisVersion} expected ${version}`,
        );
        process.exit(-3);
      }
    }
  }

  console.log(`Versions match: ${version}`);
  process.exit(0);
};
void validate();
