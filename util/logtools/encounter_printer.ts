import { Console } from 'console';
import { Transform } from 'stream';

import DTFuncs from '../../resources/datetime';

import { EncounterCollector, TLFuncs } from './encounter_tools';

const fixedTable = (data: { [index: number]: { [index: string]: string } }): void => {
  // Original console output interception and rewriting technique by Brickshot
  // See https://stackoverflow.com/a/69874540
  const ts = new Transform({
    transform(chunk, _enc, cb) {
      cb(null, chunk);
    },
  });
  const logger = new Console({ stdout: ts });
  logger.table(data);
  const tsRead = ts.read() as Buffer;
  let result = '';
  for (const row of tsRead.toString().split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, '┌');
    r = r.replace(/^├─*┼/, '├');
    r = r.replace(/│[^│]*/, '');
    r = r.replace(/^└─*┴/, '└');
    // console.table emits a pipe character with identifier u2502,
    // rather than the standard u7C.
    // If we naively just do /['"](\s+\|/ and aren't explicit about it,
    // there's too much chance one of the consuming applications will get it wrong.
    r = r.replace(/['"](\s+\u2502)/g, ' $1');
    r = r.replace(/(\u2502\s+)['"]/g, '$1 ');
    result += `${r}\n`;
  }
  console.log(result);
};

export const printCollectedZones = (collector: EncounterCollector): void => {
  let idx = 1;
  const outputRows: { [index: number]: { [index: string]: string } } = {};
  for (const zone of collector.zones) {
    const zoneName = zone.zoneName ?? 'Unknown_Zone';
    let tzOffset = 0;
    if (zone.startLine !== undefined)
      tzOffset = TLFuncs.getTZOffsetFromLogLine(zone.startLine);

    let dateStr = 'Unknown_Date';
    let timeStr = 'Unknown_Time';
    if (zone.startTime !== undefined) {
      dateStr = DTFuncs.dateObjectToDateString(zone.startTime, tzOffset);
      timeStr = DTFuncs.dateObjectToTimeString(zone.startTime, tzOffset);
    }
    const duration = TLFuncs.durationFromDates(zone.startTime, zone.endTime);

    const row = {
      'Index': idx.toString(),
      'Start Date': dateStr,
      'Start Time': timeStr,
      'Duration': duration,
      'Zone Name': zoneName,
    };
    outputRows[idx] = row;
    idx++;
  }

  if (Object.keys(outputRows).length === 0)
    return;
  fixedTable(outputRows);
};

export const printCollectedFights = (collector: EncounterCollector): void => {
  let idx = 1;
  const outputRows: { [index: number]: { [index: string]: string } } = {};
  let seenSeal = false;
  for (const fight of collector.fights) {
    let tzOffset = 0;
    if (fight.startLine !== undefined)
      tzOffset = TLFuncs.getTZOffsetFromLogLine(fight.startLine);

    let startDate = 'Unknown_Date';
    let startTime = 'Unknown_Time';
    if (fight.startTime !== undefined) {
      startDate = DTFuncs.dateObjectToDateString(fight.startTime, tzOffset);
      startTime = DTFuncs.dateObjectToTimeString(fight.startTime, tzOffset);
    }
    const fightDuration = TLFuncs.durationFromDates(fight.startTime, fight.endTime) ??
      'Unknown Duration';
    let fightName = 'Unknown Encounter';
    if (fight.sealName)
      fightName = fight.sealName;
    else if (fight.fightName)
      fightName = fight.fightName;

    if (!seenSeal && fight.sealName)
      seenSeal = true;
    else if (seenSeal && !fight.sealName)
      seenSeal = false;

    const row = {
      'Index': idx.toString(),
      'Start Date': startDate,
      'Start Time': startTime,
      'Duration': fightDuration,
      'Zone Name': fight.zoneName ?? 'Unknown Zone',
      'Encounter Name': fightName,
      'End Type': fight.endType ?? 'Unknown End Type',
    };
    outputRows[idx] = row;
    idx++;
  }

  if (Object.keys(outputRows).length === 0)
    return;

  fixedTable(outputRows);
};
