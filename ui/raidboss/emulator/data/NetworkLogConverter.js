'use strict';

class NetworkLogConverter {
  constructor(Options) {
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

    for (let i = 0; i < lines.length; ++i) {
      lines[i].convert(repo);
      lines[i].index = i;
    }
    // Sort the lines based on `${timestamp}_${index}` to handle out-of-order lines properly
    return lines.sort((l, r) => (l.timestamp + '_' + l.index).localeCompare(r.timestamp + '_' + r.index));
  }
}

NetworkLogConverter.lineSplitRegex = /(\d{1,3}\|\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\d\d\d\d\d-\d\d:\d\d\|.*?)\r?\n(?=\d{1,3}\|\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\d\d\d\d\d-\d\d:\d\d\|)/gm;
