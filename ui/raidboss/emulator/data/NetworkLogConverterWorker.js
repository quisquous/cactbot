import EmulatorCommon from '../EmulatorCommon.js';
import Encounter from './Encounter.js';
import LogEventHandler from './LogEventHandler.js';
import NetworkLogConverter from './NetworkLogConverter.js';
import LogRepository from './network_log_converter/LogRepository.js';

onmessage = async (msg) => {
  const logConverter = new NetworkLogConverter();
  const localLogHandler = new LogEventHandler();
  const repo = new LogRepository();

  // Listen for LogEventHandler to dispatch fights and persist them
  localLogHandler.on('fight', async (day, zoneId, zoneName, lines) => {
    const enc = new Encounter(day, zoneId, zoneName, lines);
    if (enc.shouldPersistFight()) {
      postMessage({
        type: 'encounter',
        encounter: enc,
        name: enc.combatantTracker.getMainCombatantName(),
      });
    }
  });

  // Convert the message manually due to memory issues with extremely large files
  const decoder = new TextDecoder('UTF-8');
  let buf = new Uint8Array(msg.data);
  let nextOffset = 0;
  let lines = [];
  let lineCount = 0;
  for (let currentOffset = nextOffset;
    nextOffset < buf.length && nextOffset !== -1;
    currentOffset = nextOffset) {
    nextOffset = buf.indexOf(0x0A, nextOffset + 1);
    const line = decoder.decode(buf.slice(currentOffset + 1, nextOffset)).trim();
    if (line.length) {
      ++lineCount;
      lines.push(line);
    }

    if (lines.length >= 1000) {
      lines = await logConverter.convertLines(lines, repo);
      localLogHandler.parseLogs(lines);
      postMessage({
        type: 'progress',
        lines: lineCount,
        bytes: nextOffset,
        totalBytes: buf.length,
      });
      lines = [];
    }
  }
  if (lines.length > 0) {
    lines = await logConverter.convertLines(lines, repo);
    localLogHandler.parseLogs(lines);
    lines = [];
  }
  postMessage({
    type: 'progress',
    lines: lineCount,
    bytes: buf.length,
    totalBytes: buf.length,
  });
  buf = null;

  localLogHandler.endFight();

  postMessage({
    type: 'done',
  });
};
