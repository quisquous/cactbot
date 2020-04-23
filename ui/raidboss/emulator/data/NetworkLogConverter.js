class NetworkLogConverter {
  static LineRegex = /^(?<Event>\d+)\|(?<Timestamp>[^|]+)\|(?<Line>.*)\|(?<Hash>[^|]+)$/i;

  static UncheckedLines = [
    '01', '02',
    '11', '12',
    '29',
    '35',
    '249', '250', '251', '253',
  ];

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

  async ConvertLines(Lines) {
    this.Combatants = {};
    return Lines
      .map((l) => this.ExtractData(l))
      .map((l) => this.ConvertLine(l));
  }

  ExtractData(Line) {
    let ret = {
      NetworkLine: Line,
      Line: null,
      Timestamp: null,
      LineParts: NetworkLogConverter.LineRegex.exec(Line),
      LineEvent: null,
      ExplodedLine: null,
    };
    ret.LineEvent = zeroPad(Number(ret.LineParts.groups.Event).toString(16).toUpperCase());
    ret.ExplodedLine = ret.LineParts.groups.Line.split('|');
    ret.Timestamp = +new Date(ret.LineParts.groups.Timestamp);

    if (this['Extract_' + ret.LineEvent] !== undefined) {
      this['Extract_' + ret.LineEvent](ret);
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
    this.AddCombatant(ret.ExplodedLine[0], ret.ExplodedLine[1]);
  }

  Extract_03(ret) {
    this.AddCombatant(ret.ExplodedLine[0], ret.ExplodedLine[1]);
    this.Combatants[ret.ExplodedLine[0]].Spawn = Math.max(this.Combatants[ret.ExplodedLine[0]].Spawn, ret.Timestamp);
  }

  Extract_04(ret) {
    this.AddCombatant(ret.ExplodedLine[0], ret.ExplodedLine[1]);
    this.Combatants[ret.ExplodedLine[0]].Despawn = Math.min(this.Combatants[ret.ExplodedLine[0]].Despawn, ret.Timestamp);
  }

  Extract_14(ret) {
    this.AddCombatant(ret.ExplodedLine[0], ret.ExplodedLine[1]);
    this.AddAbility(ret.ExplodedLine[2], ret.ExplodedLine[3]);
    this.AddCombatant(ret.ExplodedLine[4], ret.ExplodedLine[5]);
  }

  Extract_18(ret) {
    this.AddCombatant(ret.ExplodedLine[0], ret.ExplodedLine[1]);
  }

  Extract_1A(ret) {
    this.AddAbility(ret.ExplodedLine[0], ret.ExplodedLine[1]);
    this.AddCombatant(ret.ExplodedLine[3], ret.ExplodedLine[4]);
    this.AddCombatant(ret.ExplodedLine[5], ret.ExplodedLine[6]);
  }

  Extract_1E(ret) {
    this.AddAbility(ret.ExplodedLine[0], ret.ExplodedLine[1]);
    this.AddCombatant(ret.ExplodedLine[3], ret.ExplodedLine[4]);
    this.AddCombatant(ret.ExplodedLine[5], ret.ExplodedLine[6]);
  }

  ConvertLine(ret) {
    if (this['Convert_' + ret.LineEvent] !== undefined) {
      this['Convert_' + ret.LineEvent](ret);
    } else {
      this.ConvertGenericLine(ret);
    }
    return ret;
  }

  GetLinePrefix(Timestamp, LineEvent) {
    return '[' + timeToTimeString(Timestamp, true) + '] ' + LineEvent + ':';
  }

  ConvertGenericLine(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      ret.LineParts.groups.Line.replace(/\|/g, ':');
  }

  Convert_00(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      ret.ExplodedLine[0] + ':' + ret.ExplodedLine[1] + ':' + ret.ExplodedLine.slice(2).join('|').trim();

    ret.Line = ret.Line.replace(/([^ ]+)( 00:[^:]{4}:):/, '$1$2');

    ret.Line = NetworkLogConverter.ReplaceChatSymbols(ret.Line);
  }

  Convert_01(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      'Changed Zone to ' + this.BugProperCase(ret.ExplodedLine[1]) + '.';
  }

  Convert_02(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      'Changed primary player to ' + ret.ExplodedLine[1] + '.';
  }

  Convert_03(ret) {
    let Job = NetworkLogConverter.JobIDToName[parseInt(ret.ExplodedLine[2], 16)];
    let CombatantName = ret.ExplodedLine[1];
    if (ret.ExplodedLine[6] !== '') {
      CombatantName = CombatantName + '(' + ret.ExplodedLine[6] + ')';
    }
    // This last part is guesswork for the area between 7 and 8.
    let UnknownValue = ret.ExplodedLine[7] + zeroPad(ret.ExplodedLine[8], 8 + Math.max(0, 6 - ret.ExplodedLine[7].length));
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      ret.ExplodedLine[0].toUpperCase() + ':' +
      'Added new combatant ' + CombatantName +
      '.  Job: ' + Job +
      ' Level: ' + parseInt(ret.ExplodedLine[3], 16) +
      ' Max HP: ' + ret.ExplodedLine[10] +
      ' Max MP: ' + ret.ExplodedLine[12] +
      ' Pos: (' + ret.ExplodedLine[15] + ',' + ret.ExplodedLine[16] + ',' + ret.ExplodedLine[17] + ')';
    if (UnknownValue !== '00000000000000') {
      ret.Line = ret.Line + ' (' + UnknownValue + ')';
    }
    ret.Line = ret.Line + '.';
  }

  Convert_04(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      ret.ExplodedLine[0].toUpperCase() + ':' +
      'Removing combatant ' + ret.ExplodedLine[1] +
      '.  Max HP: ' + parseInt(ret.ExplodedLine[10], 16) +
      '. Pos: (' + ret.ExplodedLine[15] + ',' + ret.ExplodedLine[16] + ',' + ret.ExplodedLine[17] + ').';
  }

  Convert_0C(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      'Player Stats: ' + ret.LineParts.groups.Line.replace(/\|/g, ':');
  }

  Convert_14(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      ret.ExplodedLine[2] + ':' +
      this.BugProperCase(ret.ExplodedLine[1]) + ' starts using ' + ret.ExplodedLine[3] +
      ' on ' + this.BugProperCase((ret.ExplodedLine[5].length === 0 ? 'Unknown' : ret.ExplodedLine[5])) + '.';
  }

  ResolveName(ExplodedLine, IDIndex, NameIndex, FallbackIDIndex = null, FallbackNameIndex = null) {
    let Name = ExplodedLine[NameIndex];

    if (FallbackIDIndex !== null) {
      if (ExplodedLine[IDIndex] === 'E0000000' && Name === '') {
        if (ExplodedLine[FallbackIDIndex].startsWith('4')) {
          Name = ExplodedLine[FallbackNameIndex];
        } else {
          Name = 'Unknown';
        }
      }
    }

    if (Name === '') {
      Name = this.Combatants[ExplodedLine[IDIndex]].Name;
    }

    Name = this.BugProperCase(Name);

    return Name;
  }

  Convert_18(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent);
    if (NetworkLogConverter.ShowAbilityNamesFor.includes(ret.ExplodedLine[3])) {
      ret.Line = ret.Line + this.Abilities[ret.ExplodedLine[3]] + ' ';
    }
    ret.Line = ret.Line + ret.ExplodedLine[2] + ' Tick on ' + this.ResolveName(ret.ExplodedLine, 0, 1) +
      ' for ' + parseInt(ret.ExplodedLine[4], 16) + ' damage.';
  }

  Convert_19(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      this.BugProperCase(ret.ExplodedLine[1]) + ' was defeated by ' +
      this.ResolveName(ret.ExplodedLine, 2, 3) + '.';

  }

  Convert_1A(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      ret.ExplodedLine[5] + ':' +
      this.BugProperCase(ret.ExplodedLine[6]) + ' gains the effect of ' + ret.ExplodedLine[1] + ' from ';

    let Name = this.ResolveName(ret.ExplodedLine, 3, 4, 5, 6);

    ret.Line = ret.Line + Name + ' for ';
    ret.Line = ret.Line + ret.ExplodedLine[2];
    ret.Line = ret.Line + ' Seconds.';

    let StackCount = parseInt(ret.ExplodedLine[7], 16);
    if (StackCount > 0 && StackCount < 20 && NetworkLogConverter.ShowStackCountFor.includes(ret.ExplodedLine[0])) {
      ret.Line = ret.Line + ' (' + StackCount + ')';
    }
  }

  Convert_1E(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      ret.ExplodedLine[5] + ':' +
      this.BugProperCase(ret.ExplodedLine[6]) + ' loses the effect of ' + ret.ExplodedLine[1] + ' from ';

    let Name = this.ResolveName(ret.ExplodedLine, 3, 4, 5, 6);

    ret.Line = ret.Line + Name + '.';

    let StackCount = parseInt(ret.ExplodedLine[7], 16);
    if (StackCount > 0 && StackCount < 20 && NetworkLogConverter.ShowStackCountFor.includes(ret.ExplodedLine[0])) {
      ret.Line = ret.Line + ' (' + StackCount + ')';
    }
  }

  Convert_1F(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      ret.ExplodedLine[0] + ':' + this.Combatants[ret.ExplodedLine[0]].Name + ':' +
      ret.ExplodedLine[1] + ':' + ret.ExplodedLine[2] + ':' +
      ret.ExplodedLine[3] + ':' + ret.ExplodedLine[4];
  }

  Convert_24(ret) {
    ret.Line = this.GetLinePrefix(ret.Timestamp, ret.LineEvent) +
      'Limit Break: ' + ret.ExplodedLine[0];
  }

  BugProperCase(str) {
    if (this.EnableProperCaseBug) {
      return properCase(str);
    }
    return str;
  }

  static ReplaceChatSymbols(Line) {
    for (let i in NetworkLogConverter.ChatSymbolReplacements) {
      Line = Line.replace(NetworkLogConverter.ChatSymbolReplacements[i].Search, NetworkLogConverter.ChatSymbolReplacements[i].Replace);
    }
    return Line;
  }

  async TestConvert(BaseLines, NetworkLines, IgnoreACTBugs = false) {
    let ConvertedLines = await this.ConvertLines(NetworkLines);
    let Bug_250_Offset = 0;
    let Status = {
      Same: 0,
      Different: 0,
      Ignored: 0,
      Errors: [],
      Warnings: [],
      Ignoreds: [],
    };
    for (let i in BaseLines) {
      let CL = ConvertedLines[(parseInt(i) + Bug_250_Offset).toString()];
      let BL = BaseLines[i];
      CL === undefined && console.log(i, Bug_250_Offset, (parseInt(i) + Bug_250_Offset).toString(), Status);
      if (CL.Line !== BL) {
        if (IgnoreACTBugs) {
          let ClonedCL;
          switch (CL.LineEvent) {
            case '00':
              if (CL.Line.endsWith('\\')) {
                let BLSplit = BL.split(/(\[\d\d:\d\d:\d\d.\d\d\d\].*?(?=\[\d\d:\d\d:\d\d.\d\d\d\]))/g).filter(l => l !== '').slice(0);
                for (let b in BLSplit) {
                  let BL2 = BLSplit[b];
                  let CL2 = ConvertedLines[(parseInt(i) + Bug_250_Offset).toString()];
                  if (BL2 !== CL2.Line.replace(/\\/g, '')) {
                    ++Status.Different;
                    Status.Errors.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.NetworkLine}\n${BL}\n${CL.Line}\n\n${JSON.stringify(CL, null, 2)}`);
                  } else {
                    ++Status.Ignored;
                    Status.Ignoreds.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.NetworkLine}\n${BL}\n${CL.Line}`);
                  }
                  ++Bug_250_Offset;
                }
                --Bug_250_Offset;
              }
              break;
            case '14':
              ClonedCL = $.extend(true, {}, CL);
              ClonedCL.ExplodedLine[1] = this.Combatants[ClonedCL.ExplodedLine[0]].Name;
              this.Convert_14(ClonedCL);
              if (ClonedCL.Line === BL) {
                ++Status.Ignored;
                Status.Ignoreds.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.NetworkLine}\n${BL}\n${CL.Line}`);
                break;
              }
              ClonedCL.ExplodedLine[5] = this.Combatants[ClonedCL.ExplodedLine[4]].Name;
              this.Convert_14(ClonedCL);
              if (ClonedCL.Line === BL) {
                ++Status.Ignored;
                Status.Ignoreds.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.NetworkLine}\n${BL}\n${CL.Line}`);
                break;
              }
              ClonedCL = $.extend(true, {}, CL);
              ClonedCL.ExplodedLine[5] = this.Combatants[ClonedCL.ExplodedLine[4]].Name;
              this.Convert_14(ClonedCL);
              if (ClonedCL.Line === BL) {
                ++Status.Ignored;
                Status.Ignoreds.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.NetworkLine}\n${BL}\n${CL.Line}`);
                break;
              }
              ++Status.Different;
              Status.Errors.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.NetworkLine}\n${BL}\n${CL.Line}\n\n${JSON.stringify(CL, null, 2)}`);
              break;
            case '19':
              if (!this.TestConvert_Check_19(i, Bug_250_Offset, BL, CL, Status)) {
                ++Status.Different;
                Status.Errors.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.NetworkLine}\n${BL}\n${CL.Line}\n\n${JSON.stringify(CL, null, 2)}`);
              }
              break;
            case '1A':
            case '1E':
              if (!this.TestConvert_Check_1A_1E(i, Bug_250_Offset, BL, CL, Status)) {
                ++Status.Different;
                Status.Errors.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.NetworkLine}\n${BL}\n${CL.Line}\n\n${JSON.stringify(CL, null, 2)}`);
              }
              break;
            default:
              ++Status.Different;
              Status.Errors.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.NetworkLine}\n${BL}\n${CL.Line}\n\n${JSON.stringify(CL, null, 2)}`);
              break;
          }
        } else {
          ++Status.Different;
          Status.Errors.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!\n${CL.NetworkLine}\n${BL}\n${CL.Line}\n\n${JSON.stringify(CL, null, 2)}`);
        }
      } else {
        ++Status.Same;
      }
      delete BaseLines[i];
      delete ConvertedLines[(parseInt(i) + Bug_250_Offset).toString()];
    }

    return Status;
  }

  TestConvert_Check_19(i, Bug_250_Offset, BL, CL, Status) {
    return this.TestConvert_Check_StringUtil(i, Bug_250_Offset, BL, CL, Status, 'Test_19_StringFixes');
  }

  TestConvert_Check_StringUtil(i, Bug_250_Offset, BL, CL, Status, CheckSet, Checks = []) {
    let Line = CL.Line;
    for (let c in Checks) {
      Line = Line.replace(Checks[c].S, Checks[c].R);
    }
    if (Line === BL) {
      ++Status.Ignored;
      Status.Ignoreds.push(`Base line and converted network line vary at index ${i},${Bug_250_Offset}!
${CL.NetworkLine}
${BL}
${CL.Line}
Applied text fixes:
${JSON.stringify(Checks, null, 2)}`);
      return true;
    }
    for (let a in NetworkLogConverter[CheckSet]) {
      let aO = NetworkLogConverter[CheckSet][a];
      if (Checks.includes(aO)) {
        continue;
      }
      let NewChecks = Checks.slice(0);
      NewChecks.push(aO);
      if (this.TestConvert_Check_StringUtil(i, Bug_250_Offset, BL, CL, Status, CheckSet, NewChecks)) {
        return true;
      }
    }
    return false;
  }

  TestConvert_Check_1A_1E(i, Bug_250_Offset, BL, CL, Status, Checks = []) {
    return this.TestConvert_Check_StringUtil(i, Bug_250_Offset, BL, CL, Status, 'Test_1A_1E_StringFixes');
  }
}