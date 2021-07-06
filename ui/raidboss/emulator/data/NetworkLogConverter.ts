import EventBus from '../EventBus';

import LineEvent from './network_log_converter/LineEvent';
import LogRepository from './network_log_converter/LogRepository';
import ParseLine from './network_log_converter/ParseLine';

const isLineEvent = (line?: LineEvent): line is LineEvent => {
  return !!line;
};

export default class NetworkLogConverter extends EventBus {
  convertFile(data: string): LineEvent[] {
    const repo = new LogRepository();
    return this.convertLines(
        // Split data into an array of separate lines, removing any blank lines.
        data.split(NetworkLogConverter.lineSplitRegex).filter((l) => l !== ''),
        repo,
    );
  }

  convertLines(lines: string[], repo: LogRepository): LineEvent[] {
    const lineEvents = lines.map((l) => ParseLine.parse(repo, l)).filter(isLineEvent);
    // Call `convert` to convert the network line to non-network format and update indexing values
    return lineEvents.map((l, i) => {
      l.index = i;
      return l;
    });
  }

  static lineSplitRegex = /\r?\n/gm;
}
