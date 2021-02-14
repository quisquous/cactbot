import EventBus from '../EventBus.js';
import LogRepository from './network_log_converter/LogRepository.js';
import ParseLine from './network_log_converter/ParseLine.js';

export default class NetworkLogConverter extends EventBus {
  async convertFile(data) {
    const repo = new LogRepository();
    const ret = await this.convertLines(
        // Split data into an array of separate lines, removing any blank lines.
        data.split(NetworkLogConverter.lineSplitRegex).filter((l) => l !== ''),
        repo,
    );
    return ret;
  }

  async convertLines(lines, repo) {
    this.Combatants = {};
    repo = repo || new LogRepository();
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
