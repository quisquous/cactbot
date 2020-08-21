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
    let repo = new LogRepository();
    let i = 0;
    lines = lines.map((l) => ParseLine.parse(repo, l)).filter((l) => l);

    lines.forEach((l) => {
      l.convert(repo);
      l.index = i;
    });
    // Sort the lines based on `${timestamp}_${index}` to handle out-of-order lines properly
    return lines.sort((l, r) => (l.timestamp + '_' + l.index).localeCompare(r.timestamp + '_' + r.index));
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
            clonedCL = EmulatorCommon.cloneData(convertedLine, []);
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
            clonedCL = EmulatorCommon.cloneData(convertedLine, []);
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

NetworkLogConverter.lineSplitRegex = /(\d{1,3}\|\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\d\d\d\d\d-\d\d:\d\d\|.*?)\r?\n(?=\d{1,3}\|\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\d\d\d\d\d-\d\d:\d\d\|)/gm;

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
