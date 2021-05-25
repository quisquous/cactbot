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
    let lineEvents = lines.map((l) => ParseLine.parse(repo, l)).filter(isLineEvent);
    // Call `convert` to convert the network line to non-network format and update indexing values
    lineEvents = lineEvents.map((l, i) => {
      l.index = i;
      return l;
    });
    // Sort the lines based on `${timestamp}_${index}` to handle out-of-order lines properly
    // @TODO: Remove this once underlying CombatantTracker update issues are resolved
    return lineEvents.sort((l, r) => (`${l.timestamp}_${l.index}`).localeCompare(`${r.timestamp}_${r.index}`));
  }

  static lineSplitRegex = /\r?\n/gm;
}
