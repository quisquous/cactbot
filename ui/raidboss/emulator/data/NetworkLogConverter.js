'use strict';

class NetworkLogConverter {
  constructor(Options) {
    this.Combatants = {};
    this.Abilities = {};
    this.EnableProperCaseBug = true;

    for (let i in Options)
      this[i] = Options[i];
  }

  async convertFile(Data) {
    let ret = await this.convertLines(
        // Split Data on event|timestamp|
        Data.split(NetworkLogConverter.lineSplitRegex)
        // Remove blank lines since each actual line ends up separated by a blank line
          .filter((l) => l !== '' && l !== '\r' && l !== '\r\n'),
    );
    return ret;
  }

  async convertLines(lines) {
    this.Combatants = {};
    return lines
      .map((l) => this.ExtractData(l))
      .map((l) => this.convertLine(l));
  }

  ExtractData(line) {
    let ret = {
      networkLine: line,
      line: null,
      timestamp: null,
      lineParts: NetworkLogConverter.lineRegex.exec(line),
      lineEvent: null,
      explodedLine: null,
    };
    ret.lineEvent = zeroPad(Number(ret.lineParts.groups.Event).toString(16).toUpperCase());
    ret.explodedLine = ret.lineParts.groups.line.split('|');
    ret.timestamp = +new Date(ret.lineParts.groups.timestamp);

    if (this['Extract_' + ret.lineEvent] !== undefined)
      this['Extract_' + ret.lineEvent](ret);

    return ret;
  }

  AddCombatant(ID, Name) {
    if (ID && ID.length && this.Combatants[ID] !== undefined) {
      ID = ID.toLowerCase();
      this.Combatants[ID] = {
        Name: Name,
        Spawn: Number.MIN_SAFE_INTEGER,
        Despawn: Number.MAX_SAFE_INTEGER,
      };
      this.Combatants[ID.toUpperCase()] = this.Combatants[ID];
      if (ID === 'e0000000')
        this.Combatants[ID].Name = 'Unknown';
    }
  }

  AddAbility(ID, Name) {
    if (ID && ID.length) {
      ID = ID.toLowerCase();
      this.Abilities[ID] = Name;
      this.Abilities[ID.toUpperCase()] = Name;
    }
  }

  Extract_02(ret) {
    this.AddCombatant(ret.explodedLine[0], ret.explodedLine[1]);
  }

  Extract_03(ret) {
    this.AddCombatant(ret.explodedLine[0], ret.explodedLine[1]);
    this.Combatants[ret.explodedLine[0]].Spawn =
      Math.max(this.Combatants[ret.explodedLine[0]].Spawn, ret.timestamp);
  }

  Extract_04(ret) {
    this.AddCombatant(ret.explodedLine[0], ret.explodedLine[1]);
    this.Combatants[ret.explodedLine[0]].Despawn =
      Math.min(this.Combatants[ret.explodedLine[0]].Despawn, ret.timestamp);
  }

  Extract_14(ret) {
    this.AddCombatant(ret.explodedLine[0], ret.explodedLine[1]);
    this.AddAbility(ret.explodedLine[2], ret.explodedLine[3]);
    this.AddCombatant(ret.explodedLine[4], ret.explodedLine[5]);
  }

  Extract_18(ret) {
    this.AddCombatant(ret.explodedLine[0], ret.explodedLine[1]);
  }

  Extract_1A(ret) {
    this.AddAbility(ret.explodedLine[0], ret.explodedLine[1]);
    this.AddCombatant(ret.explodedLine[3], ret.explodedLine[4]);
    this.AddCombatant(ret.explodedLine[5], ret.explodedLine[6]);
  }

  Extract_1E(ret) {
    this.AddAbility(ret.explodedLine[0], ret.explodedLine[1]);
    this.AddCombatant(ret.explodedLine[3], ret.explodedLine[4]);
    this.AddCombatant(ret.explodedLine[5], ret.explodedLine[6]);
  }

  convertLine(ret) {
    if (this['convert' + ret.lineEvent] !== undefined)
      this['convert' + ret.lineEvent](ret);
    else
      this.convertGenericLine(ret);

    return ret;
  }

  getLinePrefix(timestamp, lineEvent) {
    return '[' + timeToTimeString(timestamp, true) + '] ' + lineEvent + ':';
  }

  convertGenericLine(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.lineParts.groups.line.replace(/\|/g, ':');
  }

  convert00(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[0] + ':' + ret.explodedLine[1] + ':' + ret.explodedLine.slice(2).join('|').trim();

    ret.line = ret.line.replace(/([^ ]+)( 00:[^:]{4}:):/, '$1$2');

    ret.line = NetworkLogConverter.ReplaceChatSymbols(ret.line);
  }

  convert01(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      'Changed Zone to ' + this.BugProperCase(ret.explodedLine[1]) + '.';
  }

  convert02(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      'Changed primary player to ' + ret.explodedLine[1] + '.';
  }

  convert03(ret) {
    let Job = NetworkLogConverter.jobIDToName[parseInt(ret.explodedLine[2], 16)];
    let CombatantName = ret.explodedLine[1];
    if (ret.explodedLine[6] !== '')
      CombatantName = CombatantName + '(' + ret.explodedLine[6] + ')';

    // This last part is guesswork for the area between 7 and 8.
    let UnknownValue = ret.explodedLine[7] +
      zeroPad(ret.explodedLine[8], 8 + Math.max(0, 6 - ret.explodedLine[7].length));
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[0].toUpperCase() + ':' +
      'Added new combatant ' + CombatantName +
      '.  Job: ' + Job +
      ' Level: ' + parseInt(ret.explodedLine[3], 16) +
      ' Max HP: ' + ret.explodedLine[10] +
      ' Max MP: ' + ret.explodedLine[12] +
      ' Pos: (' + ret.explodedLine[15] + ',' + ret.explodedLine[16] + ',' + ret.explodedLine[17] + ')';
    if (UnknownValue !== '00000000000000')
      ret.line = ret.line + ' (' + UnknownValue + ')';

    ret.line = ret.line + '.';
  }

  convert04(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[0].toUpperCase() + ':' +
      'Removing combatant ' + ret.explodedLine[1] +
      '.  Max HP: ' + parseInt(ret.explodedLine[10], 16) +
      '. Pos: (' + ret.explodedLine[15] + ',' + ret.explodedLine[16] + ',' + ret.explodedLine[17] + ').';
  }

  convert0C(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      'Player Stats: ' + ret.lineParts.groups.line.replace(/\|/g, ':');
  }

  convert14(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[2] + ':' +
      this.BugProperCase(ret.explodedLine[1]) + ' starts using ' + ret.explodedLine[3] +
      ' on ' + this.BugProperCase((ret.explodedLine[5].length === 0 ? 'Unknown' : ret.explodedLine[5])) + '.';
  }

  ResolveName(explodedLine, IDIndex, NameIndex, FallbackIDIndex = null, FallbackNameIndex = null) {
    let Name = explodedLine[NameIndex];

    if (FallbackIDIndex !== null) {
      if (explodedLine[IDIndex] === 'E0000000' && Name === '') {
        if (explodedLine[FallbackIDIndex].startsWith('4'))
          Name = explodedLine[FallbackNameIndex];
        else
          Name = 'Unknown';
      }
    }

    if (Name === '')
      Name = this.Combatants[explodedLine[IDIndex]].Name;

    Name = this.BugProperCase(Name);

    return Name;
  }

  convert18(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent);
    if (NetworkLogConverter.showAbilityNamesFor.includes(ret.explodedLine[3]))
      ret.line = ret.line + this.Abilities[ret.explodedLine[3]] + ' ';

    ret.line = ret.line + ret.explodedLine[2] + ' Tick on ' + this.ResolveName(ret.explodedLine, 0, 1) +
      ' for ' + parseInt(ret.explodedLine[4], 16) + ' damage.';
  }

  convert19(ret) {
    let Name = '';
    if (ret.explodedLine[2] !== '00')
      Name = this.ResolveName(ret.explodedLine, 2, 3);

    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      this.BugProperCase(ret.explodedLine[1]) + ' was defeated by ' +
      Name + '.';
  }

  convert1A(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[5] + ':' +
      this.BugProperCase(ret.explodedLine[6]) + ' gains the effect of ' + ret.explodedLine[1] + ' from ';

    let Name = this.ResolveName(ret.explodedLine, 3, 4, 5, 6);

    ret.line = ret.line + Name + ' for ';
    ret.line = ret.line + ret.explodedLine[2];
    ret.line = ret.line + ' Seconds.';

    let StackCount = parseInt(ret.explodedLine[7], 16);
    if (StackCount > 0 && StackCount < 20 &&
        NetworkLogConverter.showStackCountFor.includes(ret.explodedLine[0]))
      ret.line = ret.line + ' (' + StackCount + ')';
  }

  convert1E(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[5] + ':' +
      this.BugProperCase(ret.explodedLine[6]) + ' loses the effect of ' + ret.explodedLine[1] + ' from ';

    let Name = this.ResolveName(ret.explodedLine, 3, 4, 5, 6);

    ret.line = ret.line + Name + '.';

    let StackCount = parseInt(ret.explodedLine[7], 16);
    if (StackCount > 0 && StackCount < 20 &&
        NetworkLogConverter.showStackCountFor.includes(ret.explodedLine[0]))
      ret.line = ret.line + ' (' + StackCount + ')';
  }

  convert1F(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[0] + ':' + this.Combatants[ret.explodedLine[0]].Name + ':' +
      ret.explodedLine[1] + ':' + ret.explodedLine[2] + ':' +
      ret.explodedLine[3] + ':' + ret.explodedLine[4];
  }

  convert24(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      'Limit Break: ' + ret.explodedLine[0];
  }

  BugProperCase(str) {
    if (this.EnableProperCaseBug)
      return properCase(str);

    return str;
  }

  static ReplaceChatSymbols(line) {
    for (let rep of NetworkLogConverter.chatSymbolReplacements)
      line = line.replace(rep.Search, rep.Replace);

    return line;
  }

  async testConvert(baseLines, networkLines, IgnoreACTBugs = false) {
    let convertedLines = await this.convertLines(networkLines);
    let bug250Offset = 0;
    let status = {
      same: 0,
      different: 0,
      ignored: 0,
      errors: [],
      ignoreds: [],
    };
    for (let i in baseLines) {
      let convertedLine = convertedLines[(parseInt(i) + bug250Offset).toString()];
      let baseLine = baseLines[i];
      if (convertedLine.line !== baseLine) {
        if (IgnoreACTBugs) {
          let clonedCL;
          switch (convertedLine.lineEvent) {
          case '00':
            // Check for the bug with \ in log lines
            // See https://github.com/ravahn/FFXIV_ACT_Plugin/issues/250
            if (convertedLine.line.endsWith('\\')) {
              let baseLineSplit =
                baseLine.split(/(\[\d\d:\d\d:\d\d.\d\d\d\].*?(?=\[\d\d:\d\d:\d\d.\d\d\d\]))/g)
                  .filter((l) => l !== '').slice(0);
              for (let b in baseLineSplit) {
                let baseLine2 = baseLineSplit[b];
                let convertedLine2 = convertedLines[(parseInt(i) + bug250Offset).toString()];
                if (baseLine2 !== convertedLine2.line.replace(/\\/g, '')) {
                  ++status.different;
                  status.errors.push(`Base line and converted network line vary at index ${i},${bug250Offset}!
${convertedLine.networkLine}
${baseLine}
${convertedLine.line}

${JSON.stringify(convertedLine, null, 2)}`);
                } else {
                  ++status.ignored;
                  status.ignoreds.push(`Base line and converted network line vary at index ${i},${bug250Offset}!
${convertedLine.networkLine}
${baseLine}
${convertedLine.line}`);
                }
                ++bug250Offset;
              }
              --bug250Offset;
            }
            break;
          case '14':
            clonedCL = $.extend(true, {}, convertedLine);
            clonedCL.explodedLine[1] = this.Combatants[clonedCL.explodedLine[0]].Name;
            this.convert14(clonedCL);
            if (clonedCL.line === baseLine) {
              ++status.ignored;
              status.ignoreds.push(`Base line and converted network line vary at index ${i},${bug250Offset}!
${convertedLine.networkLine}
${baseLine}
${convertedLine.line}`);
              break;
            }
            clonedCL.explodedLine[5] = this.Combatants[clonedCL.explodedLine[4]].Name;
            this.convert14(clonedCL);
            if (clonedCL.line === baseLine) {
              ++status.ignored;
              status.ignoreds.push(`Base line and converted network line vary at index ${i},${bug250Offset}!
${convertedLine.networkLine}
${baseLine}
${convertedLine.line}`);
              break;
            }
            clonedCL = $.extend(true, {}, convertedLine);
            clonedCL.explodedLine[5] = this.Combatants[clonedCL.explodedLine[4]].Name;
            this.convert14(clonedCL);
            if (clonedCL.line === baseLine) {
              ++status.ignored;
              status.ignoreds.push(`Base line and converted network line vary at index ${i},${bug250Offset}!
${convertedLine.networkLine}
${baseLine}
${convertedLine.line}`);
              break;
            }
            ++status.different;
            status.errors.push(`Base line and converted network line vary at index ${i},${bug250Offset}!
${convertedLine.networkLine}
${baseLine}
${convertedLine.line}

${JSON.stringify(convertedLine, null, 2)}`);
            break;
          case '19':
            if (!this.testConvertCheck19(i, bug250Offset, baseLine, convertedLine, status)) {
              ++status.different;
              status.errors.push(`Base line and converted network line vary at index ${i},${bug250Offset}!
${convertedLine.networkLine}
${baseLine}
${convertedLine.line}

${JSON.stringify(convertedLine, null, 2)}`);
            }
            break;
          case '1A':
          case '1E':
            if (!this.testConvertCheck1A1E(i, bug250Offset, baseLine, convertedLine, status)) {
              ++status.different;
              status.errors.push(`Base line and converted network line vary at index ${i},${bug250Offset}!
${convertedLine.networkLine}
${baseLine}
${convertedLine.line}

${JSON.stringify(convertedLine, null, 2)}`);
            }
            break;
          default:
            ++status.different;
            status.errors.push(`Base line and converted network line vary at index ${i},${bug250Offset}!
${convertedLine.networkLine}
${baseLine}
${convertedLine.line}

${JSON.stringify(convertedLine, null, 2)}`);
            break;
          }
        } else {
          ++status.different;
          status.errors.push(`Base line and converted network line vary at index ${i},${bug250Offset}!
${convertedLine.networkLine}
${baseLine}
${convertedLine.line}

${JSON.stringify(convertedLine, null, 2)}`);
        }
      } else {
        ++status.same;
      }
      delete baseLines[i];
      delete convertedLines[(parseInt(i) + bug250Offset).toString()];
    }

    return status;
  }

  testConvertCheck19(i, bug250Offset, base, converted, status) {
    return this.testConvertCheckStringUtil(i, bug250Offset, base, converted, status, 'test19StringFixes');
  }

  testConvertCheck1A1E(i, bug250Offset, base, converted, status) {
    return this.testConvertCheckStringUtil(i, bug250Offset, base, converted, status, 'test1A1EStringFixes');
  }

  testConvertCheckStringUtil(i, bug250Offset, base, converted, status, checkSet, checks = []) {
    let line = converted.line;
    for (let c in checks)
      line = line.replace(checks[c].S, checks[c].R);

    if (line === base) {
      ++status.ignored;
      status.ignoreds.push(`Base line and converted network line vary at index ${i},${bug250Offset}!
${converted.networkLine}
${base}
${converted.line}
Applied text fixes:
${JSON.stringify(checks, null, 2)}`);
      return true;
    }
    for (let checkIndex in NetworkLogConverter[checkSet]) {
      let check = NetworkLogConverter[checkSet][checkIndex];
      if (checks.includes(check))
        continue;

      let newChecks = checks.slice(0);
      newChecks.push(check);
      if (this.testConvertCheckStringUtil(i, bug250Offset,
          base, converted, status, checkSet, newChecks))
        return true;
    }
    return false;
  }
}

NetworkLogConverter.lineRegex = /^(?<Event>\d+)\|(?<timestamp>[^|]+)\|(?<line>.*)\|(?<Hash>[^|]+)$/i;
NetworkLogConverter.lineSplitRegex = /(\d{1,3}\|\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\d\d\d\d\d-\d\d:\d\d\|.*?)\r?\n(?=\d{1,3}\|\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\d\d\d\d\d-\d\d:\d\d\|)/gm;

NetworkLogConverter.showAbilityNamesFor = [
  '4C4', // Excognition
  '35D', // Wildfire
  '1F5', // Doton
  '2ED', // Salted Earth
  '4B5', // Flamethrower
  '2E3', // Asylum
  '777', // Asylum
  '798', // Sacred Soil
  '4C7', // Fey Union
  '742', // Nascent Glint
];

NetworkLogConverter.showStackCountFor = [
  '130', // Aetherflow
  '196', // Vulnerability Down
  '15e', // Vulnerability Down
  '2ca', // Vulnerability Up
  '1f9', // Damage Up
  '4d7', // Embolden
  '511', // Embolden
];

NetworkLogConverter.jobIDToName = {
  0: 'N/A',
  1: 'Gla',
  2: 'Pgl',
  3: 'Mrd',
  4: 'Lnc',
  5: 'Arc',
  6: 'Cnj',
  7: 'Thm',
  8: 'Crp',
  9: 'Bsm',
  10: 'Arm',
  11: 'Gsm',
  12: 'Ltw',
  13: 'Wvr',
  14: 'Alc',
  15: 'Cul',
  16: 'Min',
  17: 'Btn',
  18: 'Fsh',
  19: 'Pld',
  20: 'Mnk',
  21: 'War',
  22: 'Drg',
  23: 'Brd',
  24: 'Whm',
  25: 'Blm',
  26: 'Acn',
  27: 'Smn',
  28: 'Sch',
  29: 'Rog',
  30: 'Nin',
  31: 'Mch',
  32: 'Drk',
  33: 'Ast',
  34: 'Sam',
  35: 'Rdm',
  36: 'Blu',
  37: 'Gnb',
  38: 'Dnc',
};

NetworkLogConverter.chatSymbolReplacements = [
  {
    Search: /:\uE06F/g,
    Replace: ':⇒',
    Type: 'Symbol',
  },
  {
    Search: / \uE0BB\uE05C/g,
    Replace: ' ',
    Type: 'Positive Effect',
  },
  {
    Search: / \uE0BB\uE05B/g,
    Replace: ' ',
    Type: 'Negative Effect',
  },
];

NetworkLogConverter.test00StringFixes = [
  {
    T: `Apparently colons are the new pipes`,
    S: /\|/g,
    R: ':',
  },
];

NetworkLogConverter.test19StringFixes = [
  {
    T: `Source name missing`,
    S: /was defeated by .*\.$/,
    R: 'was defeated by Unknown.',
  },
];

NetworkLogConverter.test1A1EStringFixes = [
  {
    T: `Target name missing`,
    S: /:(?:[^: ]+ )+?(gains|loses)/,
    R: ':$1',
  },
  {
    T: `Source name missing for 1A`,
    S: /from (?:[^ ]+ )+?for /,
    R: 'from  for ',
  },
  {
    T: `Source name missing for 1E`,
    S: /(loses the effect of.*)from(?: [^ ]+)+?\.((?: \(\d+\))?)$/,
    R: '$1from .$2',
  },
  {
    T: `No stack count`,
    S: / \(\d+\)$/,
    R: '',
  },
  {
    T: `Infinite duration`,
    S: / for 0.00 Seconds/,
    R: ' for 9999.00 Seconds',
  },
];
