class NetworkLogConverter {
  static lineRegex = /^(?<Event>\d+)\|(?<timestamp>[^|]+)\|(?<line>.*)\|(?<Hash>[^|]+)$/i;

  static ShowAbilityNamesFor = [
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

  static ShowStackCountFor = [
    '130', // Aetherflow
    '196', // Vulnerability Down
    '15e', // Vulnerability Down
    '2ca', // Vulnerability Up
    '1f9', // Damage Up
    '4d7', // Embolden
    '511', // Embolden
  ];

  static JobIDToName = {
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

  static PetNames = ["Emerald Carbuncle", "Topaz Carbuncle", "Ifrit-Egi", "Titan-Egi", "Garuda-Egi", "Eos", "Selene", "Rook Autoturret", "Bishop Autoturret", "Demi-Bahamut", "Demi-Phoenix", "Seraph", "Moonstone Carbuncle", "Esteem", "Automaton Queen", "Bunshin", "Demi-Phoenix", "Seraph", "Bunshin"];

  static ChatSymbolReplacements = [
    {
      Search: /:\uE06F/g,
      Replace: ':⇒',
      Type: 'Symbol'
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

  static Test_00_StringFixes = [
    {
      T: `Apparently colons are the new pipes`,
      S: /\|/g,
      R: ':',
    }
  ];

  static Test_19_StringFixes = [
    {
      T: `Source name missing`,
      S: /was defeated by .*\.$/,
      R: 'was defeated by Unknown.',
    }
  ];

  static Test_1A_1E_StringFixes = [
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

  Combatants = {};
  Abilities = {};

  EnableProperCaseBug = true;

  constructor(Options) {
    for (let i in Options) {
      this[i] = Options[i];
    }
  }

  async convertFile(Data) {
    let ret = await this.convertLines(
      // Split Data on event|timestamp|
      Data.split(/(\d{1,3}\|\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\d\d\d\d\d-\d\d:\d\d\|.*?)\r?\n(?=\d{1,3}\|\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\d\d\d\d\d-\d\d:\d\d\|)/gm)
      // Remove blank lines since each actual line ends up separated by a blank line
        .filter((l) => l !== '' && l !== "\r" && l !== "\r\n")
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

    if (this['Extract_' + ret.lineEvent] !== undefined) {
      this['Extract_' + ret.lineEvent](ret);
    }

    return ret;
  }

  AddCombatant(ID, Name) {
    if (ID && ID.length && !this.Combatants.hasOwnProperty(ID)) {
      ID = ID.toLowerCase();
      this.Combatants[ID] = {
        Name: Name,
        Spawn: Number.MIN_SAFE_INTEGER,
        Despawn: Number.MAX_SAFE_INTEGER,
      };
      this.Combatants[ID.toUpperCase()] = this.Combatants[ID];
      if (ID === 'e0000000') {
        this.Combatants[ID].Name = 'Unknown';
      }
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
    this.Combatants[ret.explodedLine[0]].Spawn = Math.max(this.Combatants[ret.explodedLine[0]].Spawn, ret.timestamp);
  }

  Extract_04(ret) {
    this.AddCombatant(ret.explodedLine[0], ret.explodedLine[1]);
    this.Combatants[ret.explodedLine[0]].Despawn = Math.min(this.Combatants[ret.explodedLine[0]].Despawn, ret.timestamp);
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
    if (this['Convert_' + ret.lineEvent] !== undefined) {
      this['Convert_' + ret.lineEvent](ret);
    } else {
      this.convertGenericLine(ret);
    }
    return ret;
  }

  getLinePrefix(timestamp, lineEvent) {
    return '[' + timeToTimeString(timestamp, true) + '] ' + lineEvent + ':';
  }

  convertGenericLine(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.lineParts.groups.line.replace(/\|/g, ':');
  }

  Convert_00(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[0] + ':' + ret.explodedLine[1] + ':' + ret.explodedLine.slice(2).join('|').trim();

    ret.line = ret.line.replace(/([^ ]+)( 00:[^:]{4}:):/, '$1$2');

    ret.line = NetworkLogConverter.ReplaceChatSymbols(ret.line);
  }

  Convert_01(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      'Changed Zone to ' + this.BugProperCase(ret.explodedLine[1]) + '.';
  }

  Convert_02(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      'Changed primary player to ' + ret.explodedLine[1] + '.';
  }

  Convert_03(ret) {
    let Job = NetworkLogConverter.JobIDToName[parseInt(ret.explodedLine[2], 16)];
    let CombatantName = ret.explodedLine[1];
    if (ret.explodedLine[6] !== '') {
      CombatantName = CombatantName + '(' + ret.explodedLine[6] + ')';
    }
    // This last part is guesswork for the area between 7 and 8.
    let UnknownValue = ret.explodedLine[7] + zeroPad(ret.explodedLine[8], 8 + Math.max(0, 6 - ret.explodedLine[7].length));
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[0].toUpperCase() + ':' +
      'Added new combatant ' + CombatantName +
      '.  Job: ' + Job +
      ' Level: ' + parseInt(ret.explodedLine[3], 16) +
      ' Max HP: ' + ret.explodedLine[10] +
      ' Max MP: ' + ret.explodedLine[12] +
      ' Pos: (' + ret.explodedLine[15] + ',' + ret.explodedLine[16] + ',' + ret.explodedLine[17] + ')';
    if (UnknownValue !== '00000000000000') {
      ret.line = ret.line + ' (' + UnknownValue + ')';
    }
    ret.line = ret.line + '.';
  }

  Convert_04(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[0].toUpperCase() + ':' +
      'Removing combatant ' + ret.explodedLine[1] +
      '.  Max HP: ' + parseInt(ret.explodedLine[10], 16) +
      '. Pos: (' + ret.explodedLine[15] + ',' + ret.explodedLine[16] + ',' + ret.explodedLine[17] + ').';
  }

  Convert_0C(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      'Player Stats: ' + ret.lineParts.groups.line.replace(/\|/g, ':');
  }

  Convert_14(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[2] + ':' +
      this.BugProperCase(ret.explodedLine[1]) + ' starts using ' + ret.explodedLine[3] +
      ' on ' + this.BugProperCase((ret.explodedLine[5].length === 0 ? 'Unknown' : ret.explodedLine[5])) + '.';
  }

  ResolveName(explodedLine, IDIndex, NameIndex, FallbackIDIndex = null, FallbackNameIndex = null) {
    let Name = explodedLine[NameIndex];

    if (FallbackIDIndex !== null) {
      if (explodedLine[IDIndex] === 'E0000000' && Name === '') {
        if (explodedLine[FallbackIDIndex].startsWith('4')) {
          Name = explodedLine[FallbackNameIndex];
        } else {
          Name = 'Unknown';
        }
      }
    }

    if (Name === '') {
      Name = this.Combatants[explodedLine[IDIndex]].Name;
    }

    Name = this.BugProperCase(Name);

    return Name;
  }

  Convert_18(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent);
    if (NetworkLogConverter.ShowAbilityNamesFor.includes(ret.explodedLine[3])) {
      ret.line = ret.line + this.Abilities[ret.explodedLine[3]] + ' ';
    }
    ret.line = ret.line + ret.explodedLine[2] + ' Tick on ' + this.ResolveName(ret.explodedLine, 0, 1) +
      ' for ' + parseInt(ret.explodedLine[4], 16) + ' damage.';
  }

  Convert_19(ret) {
    let Name;
    if(ret.explodedLine[2] === '00') {
      Name = '';
    } else {
      Name = this.ResolveName(ret.explodedLine, 2, 3);
    }

    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      this.BugProperCase(ret.explodedLine[1]) + ' was defeated by ' +
      Name + '.';

  }

  Convert_1A(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[5] + ':' +
      this.BugProperCase(ret.explodedLine[6]) + ' gains the effect of ' + ret.explodedLine[1] + ' from ';

    let Name = this.ResolveName(ret.explodedLine, 3, 4, 5, 6);

    ret.line = ret.line + Name + ' for ';
    ret.line = ret.line + ret.explodedLine[2];
    ret.line = ret.line + ' Seconds.';

    let StackCount = parseInt(ret.explodedLine[7], 16);
    if (StackCount > 0 && StackCount < 20 && NetworkLogConverter.ShowStackCountFor.includes(ret.explodedLine[0])) {
      ret.line = ret.line + ' (' + StackCount + ')';
    }
  }

  Convert_1E(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[5] + ':' +
      this.BugProperCase(ret.explodedLine[6]) + ' loses the effect of ' + ret.explodedLine[1] + ' from ';

    let Name = this.ResolveName(ret.explodedLine, 3, 4, 5, 6);

    ret.line = ret.line + Name + '.';

    let StackCount = parseInt(ret.explodedLine[7], 16);
    if (StackCount > 0 && StackCount < 20 && NetworkLogConverter.ShowStackCountFor.includes(ret.explodedLine[0])) {
      ret.line = ret.line + ' (' + StackCount + ')';
    }
  }

  Convert_1F(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      ret.explodedLine[0] + ':' + this.Combatants[ret.explodedLine[0]].Name + ':' +
      ret.explodedLine[1] + ':' + ret.explodedLine[2] + ':' +
      ret.explodedLine[3] + ':' + ret.explodedLine[4];
  }

  Convert_24(ret) {
    ret.line = this.getLinePrefix(ret.timestamp, ret.lineEvent) +
      'Limit Break: ' + ret.explodedLine[0];
  }

  BugProperCase(str) {
    if (this.EnableProperCaseBug) {
      return properCase(str);
    }
    return str;
  }

  static ReplaceChatSymbols(line) {
    for (let i in NetworkLogConverter.ChatSymbolReplacements) {
      line = line.replace(NetworkLogConverter.ChatSymbolReplacements[i].Search, NetworkLogConverter.ChatSymbolReplacements[i].Replace);
    }
    return line;
  }

  async TestConvert(baseLines, networkLines, IgnoreACTBugs = false) {
    let convertedLines = await this.convertLines(networkLines);
    let Bug_250_Offset = 0;
    let Status = {
      Same: 0,
      Different: 0,
      Ignored: 0,
      Errors: [],
      Warnings: [],
      Ignoreds: [],
    };
    for (let i in baseLines) {
      let CL = convertedLines[(parseInt(i) + Bug_250_Offset).toString()];
      let BL = baseLines[i];
      CL === undefined && console.log(i, Bug_250_Offset, (parseInt(i) + Bug_250_Offset).toString(), Status);
      if (CL.line !== BL) {
        if (IgnoreACTBugs) {
          let ClonedCL;
          switch (CL.lineEvent) {
            case '00':
              if (CL.line.endsWith('\\')) {
                let BLSplit = BL.split(/(\[\d\d:\d\d:\d\d.\d\d\d\].*?(?=\[\d\d:\d\d:\d\d.\d\d\d\]))/g).filter(l => l !== '').slice(0);
                for (let b in BLSplit) {
                  let BL2 = BLSplit[b];
                  let CL2 = convertedLines[(parseInt(i) + Bug_250_Offset).toString()];
                  if (BL2 !== CL2.line.replace(/\\/g, '')) {
                    ++Status.Different;
                    Status.Errors.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.networkLine}\n${BL}\n${CL.line}\n\n${JSON.stringify(CL, null, 2)}`);
                  } else {
                    ++Status.Ignored;
                    Status.Ignoreds.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.networkLine}\n${BL}\n${CL.line}`);
                  }
                  ++Bug_250_Offset;
                }
                --Bug_250_Offset;
              }
              break;
            case '14':
              ClonedCL = $.extend(true, {}, CL);
              ClonedCL.explodedLine[1] = this.Combatants[ClonedCL.explodedLine[0]].Name;
              this.Convert_14(ClonedCL);
              if (ClonedCL.line === BL) {
                ++Status.Ignored;
                Status.Ignoreds.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.networkLine}\n${BL}\n${CL.line}`);
                break;
              }
              ClonedCL.explodedLine[5] = this.Combatants[ClonedCL.explodedLine[4]].Name;
              this.Convert_14(ClonedCL);
              if (ClonedCL.line === BL) {
                ++Status.Ignored;
                Status.Ignoreds.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.networkLine}\n${BL}\n${CL.line}`);
                break;
              }
              ClonedCL = $.extend(true, {}, CL);
              ClonedCL.explodedLine[5] = this.Combatants[ClonedCL.explodedLine[4]].Name;
              this.Convert_14(ClonedCL);
              if (ClonedCL.line === BL) {
                ++Status.Ignored;
                Status.Ignoreds.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.networkLine}\n${BL}\n${CL.line}`);
                break;
              }
              ++Status.Different;
              Status.Errors.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.networkLine}\n${BL}\n${CL.line}\n\n${JSON.stringify(CL, null, 2)}`);
              break;
            case '19':
              if (!this.TestConvert_Check_19(i, Bug_250_Offset, BL, CL, Status)) {
                ++Status.Different;
                Status.Errors.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.networkLine}\n${BL}\n${CL.line}\n\n${JSON.stringify(CL, null, 2)}`);
              }
              break;
            case '1A':
            case '1E':
              if (!this.TestConvert_Check_1A_1E(i, Bug_250_Offset, BL, CL, Status)) {
                ++Status.Different;
                Status.Errors.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.networkLine}\n${BL}\n${CL.line}\n\n${JSON.stringify(CL, null, 2)}`);
              }
              break;
            default:
              ++Status.Different;
              Status.Errors.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.networkLine}\n${BL}\n${CL.line}\n\n${JSON.stringify(CL, null, 2)}`);
              break;
          }
        } else {
          ++Status.Different;
          Status.Errors.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.networkLine}\n${BL}\n${CL.line}\n\n${JSON.stringify(CL, null, 2)}`);
        }
      } else {
        ++Status.Same;
      }
      delete baseLines[i];
      delete convertedLines[(parseInt(i) + Bug_250_Offset).toString()];
    }

    return Status;
  }

  TestConvert_Check_19(i, Bug_250_Offset, Base, Converted, Status) {
    return this.TestConvert_Check_StringUtil(i, Bug_250_Offset, Base, Converted, Status, 'Test_19_StringFixes');
  }

  TestConvert_Check_1A_1E(i, Bug_250_Offset, Base, Converted, Status) {
    return this.TestConvert_Check_StringUtil(i, Bug_250_Offset, Base, Converted, Status, 'Test_1A_1E_StringFixes');
  }

  TestConvert_Check_StringUtil(i, Bug_250_Offset, Base, Converted, Status, CheckSet, Checks = []) {
    let line = Converted.line;
    for (let c in Checks) {
      line = line.replace(Checks[c].S, Checks[c].R);
    }
    if (line === Base) {
      ++Status.Ignored;
      Status.Ignoreds.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!
${Converted.networkLine}
${Base}
${Converted.line}
Applied text fixes:
${JSON.stringify(Checks, null, 2)}`);
      return true;
    }
    for (let CheckIndex in NetworkLogConverter[CheckSet]) {
      let Check = NetworkLogConverter[CheckSet][CheckIndex];
      if (Checks.includes(Check)) {
        continue;
      }
      let NewChecks = Checks.slice(0);
      NewChecks.push(Check);
      if (this.TestConvert_Check_StringUtil(i, Bug_250_Offset, Base, Converted, Status, CheckSet, NewChecks)) {
        return true;
      }
    }
    return false;
  }
}