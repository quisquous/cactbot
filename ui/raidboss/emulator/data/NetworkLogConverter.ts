import EventBus from '../EventBus';
import LineEvent from './network_log_converter/LineEvent';
import { LogRepository } from './network_log_converter/LogRepository';
import ParseLine from './network_log_converter/ParseLine';

export default class NetworkLogConverter extends EventBus {
  convertFile(data: string): LineEvent[] {
    const repo = new LogRepository();
    return this.convertLines(
        // Split data into an array of separate lines, removing any blank lines.
        data.split(NetworkLogConverter.lineSplitRegex).filter((l) => l !== ''),
        repo,
    );
  }

  convertLines(lines: (string | LineEvent)[], repo: LogRepository): LineEvent[] {
    repo = repo || new LogRepository();
    // This is a bit ugly but we can't keep the original lines array values around
    // due to memory issues
    // Convert from string to LineEvent
    lines =
      (
        (lines as string[])
          .map((l) => ParseLine.parse(repo, l)) as (LineEvent | boolean)[])
        .filter((l) => l) as LineEvent[];

    // Call `convert` to convert the network line to non-network format and update indexing values
    lines = (lines as LineEvent[])
      .map((l, i) => {
        l.convert(repo);
        l.index = i;
        return l;
      });

    // Sort the lines based on `${timestamp}_${index}` to handle out-of-order lines properly
    return (lines as LineEvent[])
      .sort((l, r) => (`${l.timestamp}_${l.index}`).localeCompare(`${r.timestamp}_${r.index}`));
  }

  static lineSplitRegex = /\r?\n/gm;
}
