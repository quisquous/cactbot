import fs from 'fs';
import path from 'path';
import { argv, exit } from 'process';
import readline from 'readline';

import glob from 'glob';

let validArgs = argv.length === 3;
let targetFolder = '';

if (validArgs) {
  const tmpTargetFolder = argv[2];
  if (tmpTargetFolder === undefined)
    validArgs = false;
  else if (!fs.existsSync(tmpTargetFolder))
    validArgs = false;
  else
    targetFolder = tmpTargetFolder ?? '';
}

if (!validArgs) {
  console.log('Invalid arguments');
  exit(1);
}

/* eslint-disable max-len */

type LineReplacer = (line: string, fileName: string) => string | undefined;

const lineReplacers: { [key: string]: LineReplacer } = {
  ability: (line) => {
    // 8.0 "Crackle Hiss" sync / 1[56]:[^:]*:Imdugud:B55:/
    const regex = /sync\s*\/ 1\[56\]:\[\^:\]\*:(?<source>[^:]*):(?<id>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `Ability { id: "$2", source: "$1" }`);
  },
  abilityNoSource: (line) => {
    // 451.8 "--sync--" sync / 1[56]:[^:]*:[^:]*:89B9:/
    const regex = /sync\s*\/ 1\[56\]:\[\^:\]\*:\[\^:\]\*:(?<id>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `Ability { id: "$1" }`);
  },
  abilityWithNonEmptyTarget: (line) => {
    // 1002.5 "--sync--" sync / 1[56]:[^:]*:Art:3956:[^:]*:[^:]*:[^:]+:/ window 1500,0
    const regex =
      /sync\s*\/ 1\[56\]:\[\^:\]\*:(?<source>[^:]*):(?<id>[^:]*):\[\^:\]\*:\[\^:\]\*:\[\^:\]\+:\//;
    if (regex.exec(line))
      return line.replace(regex, `Ability { id: "$2", source: "$1", target: "[:^]+" }`);
  },
  startsUsing: (line) => {
    // "--sync--" sync / 14:[^:]*:Imdugud:B5D:/ window 200,0
    const regex = /sync\s*\/ 14:\[\^:\]\*:(?<source>[^:]*):(?<id>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `StartsUsing { id: "$2", source: "$1" }`);
  },
  interrupt: (line) => {
    // 3154.9 "--sync--" sync / 17:[^:]*:Raiden:3878:/ window 40,0
    const regex = /sync\s*\/ 17:\[\^:\]\*:(?<source>[^:]*):(?<id>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `NetworkCancelAbility { id: "$2", source: "$1" }`);
  },
  inCombat: (line) => {
    // 0.0 "--sync--" sync / 104:[^:]*:1($|:)/ window 0,1
    const regex = /sync\s*\/ 104:\[\^:\]\*:(?<inGameCombat>\w)\(\$\|:\)\//;
    if (regex.exec(line))
      return line.replace(regex, `InCombat { inGameCombat: "$1" }`);
  },
  systemLog: (line) => {
    // 1000.0 "--sync--" sync / 29:[^:]*:7DC:[^:]*:E96/ window 1000,5
    const regex = /sync\s*\/ 29:\[\^:\]\*:(?<id>[^:]*):\[\^:\]\*:(?<param1>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `SystemLogMessage { id: "$1", param1: "$2" }`);
  },
  systemLogNoParam: (line) => {
    // 0.0 "--Reset--" sync / 29:[^:]*:7DE:/ window 100000 jump 0
    const regex = /sync\s*\/ 29:\[\^:\]\*:(?<id>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `SystemLogMessage { id: "$1" }`);
  },
  actorControlNoData: (line) => {
    // 0.0 "--Reset--" sync / 21:........:4000000F:/ window 100000 jump 0
    const regex = /sync\s*\/ 21:\.{8}:(?<command>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `ActorControl { command: "$1" }`);
  },
  actorControl: (line) => {
    // 8000.0 "--sync--" sync / 21:........:80000014:210:/ window 100000,0
    const regex = /sync\s*\/ 21:\.{8}:(?<command>[^:]*):(?<data>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `ActorControl { command: "$1", data0: "$2" }`);
  },
  gameLogWithName: (line) => {
    // 2500.0 "--sync--" sync / 00:0044:Cagnazzo:No more games!/ window 500,0
    const regex = /sync\s*\/ 00:(?<code>[^:]*):(?<name>[^:]*):(?<line>[^:]*)\//;
    const matches = regex.exec(line)?.groups;
    // Verify no empty names here.
    if (matches !== undefined && matches.name !== '')
      return line.replace(regex, `GameLog { code: "$1", name: "$2", line: "$3.*?" }`);
  },
  gameLogNoName: (line) => {
    // 1800.0 "Enrage" sync / 00:0044:[^:]*:\<blip\> Warning\. Calculations indicate/ window 1800,0
    const regex = /sync\s*\/ 00:(?<code>[^:]*):\[\^:\]\*:(?<line>[^:]*)\//;
    if (regex.exec(line))
      return line.replace(regex, `GameLog { code: "$1", line: "$2.*?" }`);
  },
  gameLogNoNameNoCode: (line) => {
    // 1100.0 "--sync--" sync / 00:[^:]*::The liquid flame gains the effect of Chiromorph/ window 100,250
    const regex = /sync\s*\/ 00:\[\^:\]\*::(?<line>[^:]*)\//;
    if (regex.exec(line))
      return line.replace(regex, `GameLog { line: "$1.*?" }`);
  },
  addedCombatant: (line) => {
    // 2189.9 "Ruins Golem x2" sync / 03:........:Ruins Golem:/
    // # 2142.7 "--sync--" sync / 03:[^:]*:Aloalo Zaratan:/ # path 03
    const regex = /sync\s*\/ 03:(?:\.{8}|\[\^:\]\*):(?<name>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `AddedCombatant { name: "$1" }`);
  },
  addedCombatantOneOff: (line) => {
    // 1.0 "--sync--" sync / 03:[^:]*:Hemitheos:00:5A:0{4}:00::12383:/ window 10,3 jump 1000.5 # Sync to P2 immediately through AddCombatant.
    const regex =
      /sync\s*\/ 03:(?:\.{8}|\[\^:\]\*):(?<name>[^:]*):(?<job>[^:]*):(?<level>[^:]*):(?<ownerId>[^:]*):(?<worldId>[^:]*)::(?<npcNameId>[^:]*):\//;
    if (regex.exec(line)) {
      return line.replace(
        regex,
        `AddedCombatant { npcNameId: "$6", name: "$1", job: "$2", level: "$3", ownerId: "$4", worldId: "$5" }`,
      );
    }
  },
  removedCombatant: (line) => {
    // 196.0 "--sync--" sync / 04:........:Liquid Hand:/ window 50,0
    const regex = /sync\s*\/ 04:\.{8}:(?<name>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `RemovedCombatant { name: "$1" }`);
  },
  nameToggle: (line) => {
    // 10033.9 "--targetable--" sync / 22:........:Queen's Knight:........:Queen's Knight:01/
    // 300.0 "--targetable--" sync /22:[^:]*:Lamebrix Strikebocks:[^:]*:Lamebrix Strikebocks:01/ window 190,10
    const regex =
      /sync\s*\/ ?22:(?:\.{8}|\[\^:\]\*):(?<name1>[^:]*):(?:\.{8}|\[\^:\]\*):(?<name2>[^:]*):(?<toggle>[^:]*)\//;
    // Deliberately ignore targetName here, as all cases are the same.
    const matches = regex.exec(line)?.groups;
    if (matches !== undefined && matches.name1 === matches.name2)
      return line.replace(regex, `NameToggle { name: "$1", toggle: "$3" }`);
  },
  mapEffect: (line) => {
    // 3062.1 "--sync--" sync / 257 101:80038CA1:00020001:09:/ window 70,70 jump 3262.1
    const regex = /sync\s*\/ 257 101:(?<instance>[^:]*):(?<flags>[^:]*):(?<location>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `MapEffect { instance: "$1", flags: "$2", location: "$3" }`);
  },
  mapEffectNoInstanceNoLocation: (line) => {
    // 12.9 "Wildlife Crossing 1" sync / 257 101:........:00020001:/ window 5,5 duration 15
    const regex = /sync\s*\/ 257 101:\.{8}:(?<flags>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `MapEffect { flags: "$1" }`);
  },
  headMarkerNoName: (line) => {
    // 503.3 "Golem Meteors" sync / 1B:........:[^:]*:....:....:0007:/ duration 11 window 505,0
    const regex = /sync\s*\/ 1B:\.{8}:\[\^:\]\*:\.{4}:\.{4}:(?<id>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `HeadMarker { id: "$1" }`);
  },
  headMarkerName: (line) => {
    // 1048.0  "--sync--" sync / 1B:........:Minotaur:....:....:0036:/ window 45,15 jump 1151.0
    const regex = /sync\s*\/ 1B:\.{8}:(?<name>[^:]*):\.{4}:\.{4}:(?<id>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `HeadMarker { id: "$2", target: "$1" }`);
  },
  gainsEffectNameOnly: (line) => {
    // 1348 "Resync" sync / 1A:[^:]*:Pyretic:/ window 20 jump 1548
    const regex = /sync\s*\/ 1A:\[\^:\]\*:(?<effect>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `GainsEffect { effect: "$1" }`);
  },
  gainsEffectWithTarget: (line) => {
    //  200 "--sync--" sync / 1A:5D1:Ultros Simulation:[^:]*:[^:]*:[^:]*:[^:]*:Guardian:/ window 2000,2000
    // 50 "--sync--" sync / 1A:5D3:Dadaluma Simulation:[^:]+:[^:]*:[^:]*:[^:]*:Guardian:/ jump 1050
    const regex =
      /sync\s*\/ 1A:(?<effectId>[^:]*):(?<effect>[^:]*):\[\^:\]\*:\[\^:\]\*:\[\^:\]\*:\[\^:\]\*:(?<target>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `GainsEffect { effectId: "$1", effect: "$2", target: "$3" }`);
  },
  wasDefeated: (line) => {
    // 6000.0 "--Reset--" sync / 19:[^:]*:Dahu:/ window 0,2000 jump 0
    const regex = /sync\s*\/ 19:\[\^:\]\*:(?<target>[^:]*):\//;
    if (regex.exec(line))
      return line.replace(regex, `WasDefeated { target: "$1" }`);
  },
  backslashEscaper: (line) => {
    // Double-escape any already escaped characters in already converted lines.
    const regex = /(?<={[^}]*(?:name|source): ")[^"]*[\\][^"]*(?=")/;
    const name = regex.exec(line)?.[0];
    if (name !== undefined) {
      const replacedName = name.replace(/(\\)/g, '\\$1');
      return line.replace(regex, replacedName);
    }
  },
  debugMissing: (line, fileName) => {
    const regex = /sync\s*\/.*\//;
    if (regex.exec(line))
      console.log(`${fileName}: unconverted line: ${line}`);
    return undefined;
  },
} as const;

void (async () => {
  const files = glob.sync(path.join(targetFolder, '**', '*.txt'));

  const numLinesToKeep = 3;

  type PerLine = {
    count: number;
    origLine: string[];
    newLine: string[];
  };
  const histogram: { [key: string]: PerLine } = {};

  for (const fileName of files) {
    try {
      const lineReader = readline.createInterface({
        input: fs.createReadStream(fileName),
      });
      const newFileLines: string[] = [];
      let changed = false;
      for await (const line of lineReader) {
        let lineResult = line;
        for (const [key, replacer] of Object.entries(lineReplacers)) {
          const replacedLine = replacer(lineResult, fileName);
          if (replacedLine !== undefined) {
            const perLine = histogram[key] ??= {
              count: 0,
              origLine: [],
              newLine: [],
            };
            perLine.count++;
            if (perLine.origLine.length < numLinesToKeep) {
              perLine.origLine.push(lineResult);
              perLine.newLine.push(replacedLine);
            }

            lineResult = replacedLine;
            changed = true;
          }
        }
        newFileLines.push(lineResult);
      }
      if (changed)
        fs.writeFileSync(fileName, `${newFileLines.join('\r\n')}\r\n`);
    } catch (e) {
      console.error(e);
    }
  }

  const keys = Object.keys(histogram).sort((a, b) => {
    return (histogram[b]?.count ?? 0) - (histogram[a]?.count ?? 0);
  });

  for (const key of keys) {
    const perLine = histogram[key];
    if (perLine === undefined)
      continue;
    console.log(`${key}: ${perLine.count}`);
    console.log(`\`\`\`diff`);
    for (let i = 0; i < perLine.origLine.length; ++i) {
      const origLine = perLine.origLine[i];
      const newLine = perLine.newLine[i];
      if (origLine !== undefined && newLine !== undefined) {
        console.log(`-${origLine}`);
        console.log(`+${newLine}`);
      }
    }
    console.log(`\`\`\``);
    console.log('');
  }
})();
