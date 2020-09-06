'use strict';

class NetworkLogConverter {
  constructor(Options) {
    this.EnableProperCaseBug = true;

    for (let i in Options)
      this[i] = Options[i];
  }

  async convertFile(data) {
    let ret = await this.convertLines(
        // Split data into an array of separate lines, removing any blank lines.
        data.split(NetworkLogConverter.lineSplitRegex).filter((l) => l !== ''),
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

NetworkLogConverter.lineSplitRegex = /\r?\n/gm;
