import fs from 'fs';
import readline from 'readline';
import { execSync } from 'child_process';

const manifestFile = 'ui/raidboss/data/raidboss_manifest.txt';

const netRegexToType = {
  startsUsing: 'StartsUsing',
  ability: 'Ability',
  abilityFull: 'Ability',
  headMarker: 'HeadMarker',
  addedCombatant: 'AddedCombatant',
  addedCombatantFull: 'AddedCombatant',
  removingCombatant: 'RemovingCombatant',
  gainsEffect: 'GainsEffect',
  statusEffectExplicit: 'StatusEffectExplicit',
  losesEffect: 'LosesEffect',
  tether: 'Tether',
  wasDefeated: 'WasDefeated',
  echo: 'GameLog',
  dialog: 'GameLog',
  message: 'GameLog',
  gameLog: 'GameLog',
  gameNameLog: 'GameLog',
  statChange: 'StatChange',
  changeZone: 'ChangeZone',
  network6d: 'Network6d',
  nameToggle: 'NameToggle',
};

const updateFile = (file) => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(file),
  });

  const lines = [];
  let buffer = [];

  let seenZone = false;
  let seenInterface = false;
  let seenBlankLineAfterImport = false;
  let seenStartTriggers = false;
  let seenEndTriggers = false;
  let seenFinal = false;
  let inTrigger = false;

  const flushBuffer = () => {
    lines.push(...buffer);
    buffer = [];
  };

  const replaceOutput = (line) => {
    return line.replace(/(output\.\w*)\(/g, '$1!(');
  };

  lineReader.on('line', (line) => {
    if (!seenZone) {
      buffer.push(line);
      if (/^import ZoneId from/.exec(line)) {
        seenZone = true;
        buffer.push(`import { RaidbossData } from '../../../../../types/data';`);
        buffer.push(`import { TriggerSet } from '../../../../../types/trigger';`);
      }
      return;
    }

    if (!seenBlankLineAfterImport) {
      buffer.push(line);
      if (/^\s*$/.exec(line)) {
        seenBlankLineAfterImport = true;
        buffer.push(`// export type Data = RaidbossData;`);
        buffer.push(`export interface Data extends RaidbossData {`);
        buffer.push(`  playerMap?: { [name: string]: boolean };`);
        buffer.push(`  something?: boolean;`);
        buffer.push(`}`);
        buffer.push(``);
      }
      return;
    }

    if (!seenInterface) {
      if (/^export default {/.exec(line)) {
        seenInterface = true;
        buffer.push(`const triggerSet: TriggerSet<Data> = {`);
      } else {
        buffer.push(line);
      }
      return;
    }

    if (!seenFinal) {
      if (/^};/.exec(line)) {
        buffer.push(line);
        buffer.push('');
        buffer.push('export default triggerSet;');
        seenFinal = true;
        return;
      }
    }

    if (!seenStartTriggers) {
      // timeline triggers too
      buffer.push(replaceOutput(line));
      if (/^ {2}triggers: \[/.exec(line))
        seenStartTriggers = true;
      return;
    }

    if (!seenEndTriggers) {
      if (/^ {2}\],/.exec(line)) {
        seenEndTriggers = true;
        buffer.push(line);
        return;
      }

      if (!inTrigger) {
        buffer.push(line);
        if (/^ {6}id:/.exec(line)) {
          inTrigger = true;
          flushBuffer();
          return;
        }
        return;
      }

      if (/ {6}regex:/.exec(line)) {
        console.error(`busted: ${line}`);
        process.exit(-1);
      }

      buffer.push(replaceOutput(line));

      if (/^ {4}},/.exec(line)) {
        inTrigger = false;

        for (const triggerLine of buffer) {
          const m = triggerLine.match(/NetRegexes\.(\w*)\(/);
          if (m) {
            const type = netRegexToType[m[1]];
            if (!type) {
              console.error(`busted: ${triggerLine}`);
              process.exit(-1);
            }
            lines.push(`      type: '${type}',`);
            break;
          }
        }
        flushBuffer();
      }

      return;
    }

    if (!seenFinal) {
      buffer.push(line);
      return;
    }

    buffer.push(line);
  }).on('close', () => {
    flushBuffer();
    lines.push('');

    fs.writeFileSync(file, lines.join('\r\n'));
  });
};

const updateManifest = (jsFile, tsFile, manifestFile) => {
  const manifestText = fs.readFileSync(manifestFile).toString();
  const prefix = 'ui/raidboss/data/';
  const replaced = manifestText.replace(jsFile.replace(prefix, ''), tsFile.replace(prefix, ''));
  fs.writeFileSync(manifestFile, replaced);
};

const run = async (jsFile) => {
  const tsFile = jsFile.replace(/.js$/, '.ts');
  execSync(`git mv ${jsFile} ${tsFile}`);
  updateFile(tsFile);
  updateManifest(jsFile, tsFile, manifestFile);
};

run(process.argv[2]);
