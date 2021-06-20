import Encounter from './Encounter';
import LogEventHandler from './LogEventHandler';
import NetworkLogConverter from './NetworkLogConverter';
import LogRepository from './network_log_converter/LogRepository';

const ctx: Worker = self as unknown as Worker;

ctx.addEventListener('message', (msg) => {
  const logConverter = new NetworkLogConverter();
  const localLogHandler = new LogEventHandler();
  const repo = new LogRepository();

  // Listen for LogEventHandler to dispatch fights and persist them
  localLogHandler.on('fight', (day, zoneId, zoneName, lines) => {
    const enc = new Encounter(day, zoneId, zoneName, lines);
    enc.initialize();
    if (enc.shouldPersistFight()) {
      ctx.postMessage({
        type: 'encounter',
        encounter: enc,
        name: enc.combatantTracker?.getMainCombatantName(),
      });
    }
  });

  // Convert the message manually due to memory issues with extremely large files
  const decoder = new TextDecoder('UTF-8');
  let buf: Uint8Array | undefined = new Uint8Array(msg.data);
  let nextOffset = 0;
  let lines = [];
  let lineCount = 0;
  for (let currentOffset = nextOffset;
    nextOffset < buf.length && nextOffset !== -1;
    currentOffset = nextOffset) {
    nextOffset = buf.indexOf(0x0A, nextOffset + 1);
    const line = decoder.decode(buf.slice(currentOffset, nextOffset)).trim();
    if (line.length) {
      ++lineCount;
      lines.push(line);
    }

    if (lines.length >= 1000) {
      lines = logConverter.convertLines(lines, repo);
      localLogHandler.parseLogs(lines);
      ctx.postMessage({
        type: 'progress',
        lines: lineCount,
        bytes: nextOffset,
        totalBytes: buf.length,
      });
      lines = [];
    }
  }
  if (lines.length > 0) {
    lines = logConverter.convertLines(lines, repo);
    localLogHandler.parseLogs(lines);
    lines = [];
  }
  ctx.postMessage({
    type: 'progress',
    lines: lineCount,
    bytes: buf.length,
    totalBytes: buf.length,
  });

  // Unset the buffer to free memory before passing message back to main window
  buf = undefined;

  localLogHandler.endFight();

  ctx.postMessage({
    type: 'done',
  });
});
