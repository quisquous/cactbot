import EmulatorCommon from '../EmulatorCommon';
import Encounter from './Encounter';
import LogEventHandler from './LogEventHandler';
import NetworkLogConverter from './NetworkLogConverter';
import LogRepository from './network_log_converter/LogRepository';

const getClassPropertyDescriptors = (obj) => {
  if (obj && obj !== Object.prototype) {
    const proto = Object.getPrototypeOf(obj);
    return {
      ...getClassPropertyDescriptors(proto),
      ...Object.getOwnPropertyDescriptors(obj),
    };
  }
  return null;
};

onmessage = async (msg) => {
  const logConverter = new NetworkLogConverter();
  const localLogHandler = new LogEventHandler();
  const repo = new LogRepository();

  // Listen for LogEventHandler to dispatch fights and persist them
  localLogHandler.on('fight', async (day, zoneId, zoneName, lines) => {
    const enc = new Encounter(day, zoneId, zoneName, lines);
    if (enc.shouldPersistFight()) {
      // Due to using getters on LineEvent classes, we need to manually convert these over
      const baseEnc = EmulatorCommon.cloneData(enc);
      baseEnc.logLines = enc.logLines.map((l) => {
        const ret = Object.assign({}, l);
        // Get all getters on the line class and add them to the cloned object
        const props = getClassPropertyDescriptors(l);
        for (const prop in props) {
          if (props[prop].get)
            ret[prop] = l[prop];
        }
        return ret;
      });
      postMessage({
        type: 'encounter',
        encounter: baseEnc,
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
    const line = decoder.decode(buf.slice(currentOffset, nextOffset)).trim();
    if (line.length) {
      ++lineCount;
      lines.push(line);
    }

    if (lines.length >= 1000) {
      lines = logConverter.convertLines(lines, repo);
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
    lines = logConverter.convertLines(lines, repo);
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
