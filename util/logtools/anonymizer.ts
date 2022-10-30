import logDefinitions, { LogDefinition } from '../../resources/netlog_defs';
import { UnreachableCode } from '../../resources/not_reached';

import FakeNameGenerator from './fake_name_generator';
import { Notifier } from './notifier';

// TODO: is the first byte of ids always flags, such that "..000000" is always empty?
const emptyIds = ['E0000000', '80000000'];

export default class Anonymizer {
  private logTypes: { [type: string]: LogDefinition } = {};

  private nameGenerator = new FakeNameGenerator();

  // uppercase hex id -> name
  private playerMap: { [id: string]: string } = {};
  // uppercase hex real player id -> uppercase hex fake player id
  private anonMap: { [id: string]: string } = {};

  // About 20% of any log is hashes, so just clear instead of faking.
  private fakeHash = '';

  private lastPlayerIdx = 0x10FF0000;

  constructor() {
    // Remap logDefinitions from log type (instead of name) to definition.
    for (const def of Object.values(logDefinitions))
      this.logTypes[def.type] = def;

    for (const id of emptyIds) {
      // Empty ids have already been anonymized (to themselves).
      this.anonMap[id] = id;
      // Empty ids have no name.
      this.playerMap[id] = '';
    }
  }

  public process(line: string, notifier: Notifier): string | undefined {
    const splitLine = line.split('|');

    // Improperly closed files can leave a blank line.
    const typeField = splitLine[0];
    if (typeField === undefined || splitLine.length <= 1)
      return line;

    // Always replace the hash.
    if (splitLine[splitLine.length - 1]?.length === 16)
      splitLine[splitLine.length - 1] = this.fakeHash;
    else
      notifier.warn(`missing hash ${splitLine.length}`, splitLine);

    const type = this.logTypes[typeField];
    if (type === undefined || type.isUnknown) {
      notifier.warn('unknown type', splitLine);
      return;
    }

    // Check subfields first before canAnonymize.
    // Subfields override the main type, if present.
    let canAnonymizeSubField = false;
    if (type.subFields) {
      for (const subFieldName in type.subFields) {
        // Find field idx.
        let fieldIdx = -1;
        for (const fieldName in type.fields) {
          if (fieldName === subFieldName) {
            const idx = type.fields[fieldName];
            if (idx === undefined)
              throw new UnreachableCode();
            fieldIdx = idx;
            break;
          }
        }
        if (fieldIdx === -1) {
          notifier.warn('internal error: invalid subfield: ' + subFieldName, splitLine);
          return;
        }
        const value = splitLine[fieldIdx];
        if (value === undefined) {
          notifier.warn('internal error: missing subfield: ' + subFieldName, splitLine);
          return;
        }
        const subValues = type.subFields[subFieldName];

        // Unhandled values inherit the field's value.
        const subType = subValues?.[value];
        if (subType !== undefined) {
          canAnonymizeSubField = subType.canAnonymize;
          if (!canAnonymizeSubField)
            return;
        }
      }
    }

    // Drop any lines that can't be handled.
    if (!canAnonymizeSubField && !type.canAnonymize)
      return;

    // If nothing to anonymize, we're done.
    const playerIds = type.playerIds;
    if (playerIds === undefined)
      return splitLine.join('|');

    // Anonymize fields.
    for (const [idIdxStr, nameIdx] of Object.entries(playerIds)) {
      const idIdx = parseInt(idIdxStr);

      const isOptional = type.firstOptionalField !== undefined && idIdx >= type.firstOptionalField;

      // Check for ids that are out of range, possibly optional.
      // The last field is always the hash, so don't include that either.
      if (idIdx > splitLine.length - 2) {
        // Some ids are optional and may not exist, these are ok to skip.
        if (isOptional)
          continue;

        notifier.warn(`unexpected missing field ${idIdx}`, splitLine);
        continue;
      }

      // TODO: keep track of uppercase/lowercase??
      const field = splitLine[idIdx];
      if (field === undefined)
        throw new UnreachableCode();
      const playerId = field.toUpperCase();

      // Cutscenes get added combatant messages with ids such as 'FF000006' and no name.
      const isCutsceneId = playerId.startsWith('FF');

      // Handle weirdly shaped ids.
      if (playerId.length !== 8 || isCutsceneId) {
        // Also, sometimes ids are '0000' or '0'.  Treat these the same as implicitly optional.
        const isZero = parseInt(playerId) === 0;
        if (isOptional || isZero || isCutsceneId) {
          // If we have an invalid player id, it is fine if it has been marked optional or is zero.
          // However, in these cases, it should have an empty name (or no name field).
          // e.g. 21|2019-09-07T10:18:11.4390000-07:00|10FF007E|X'xzzrmk Tia|01|Key Item|793E69||
          if (typeof nameIdx === 'number' && splitLine[nameIdx] !== '')
            notifier.warn(`invalid id with valid name at index ${idIdx}`, splitLine);
          continue;
        }

        notifier.warn(`expected id field at index ${idIdx}`, splitLine);
        continue;
      }

      // Ignore monsters.
      if (playerId[0] === '4')
        continue;

      // Replace the id at this index with a fake player id.
      if (this.anonMap[playerId] === undefined)
        this.anonMap[playerId] = this.addNewPlayer();
      const fakePlayerId = this.anonMap[playerId];
      if (fakePlayerId === undefined) {
        notifier.warn('internal error: missing player id', splitLine);
        continue;
      }

      splitLine[idIdx] = fakePlayerId;

      // Replace the corresponding name, if there's a name mapping.
      if (typeof nameIdx === 'number') {
        const fakePlayerName = this.playerMap[fakePlayerId];
        if (fakePlayerName === undefined) {
          notifier.warn(`internal error: missing player name ${fakePlayerId}`, splitLine);
          continue;
        }
        splitLine[nameIdx] = fakePlayerName;
      }
    }

    // For unknown fields, just clear them, as they may have ids.
    if (typeof type.firstUnknownField !== 'undefined') {
      for (let idx = type.firstUnknownField; idx < splitLine.length - 1; ++idx)
        splitLine[idx] = '';
    }

    return splitLine.join('|');
  }

  private addNewPlayer(): string {
    this.lastPlayerIdx++;
    const playerName = this.nameGenerator.makeName(this.lastPlayerIdx);
    const playerId = this.lastPlayerIdx.toString(16).toUpperCase();
    this.playerMap[playerId] = playerName;
    return playerId;
  }

  // Once a log has been anonymized, this validates fake ids don't collide with real.
  validateIds(notifier: Notifier): boolean {
    let success = true;

    // valid player ids
    const playerIds = Object.keys(this.anonMap);
    // made up anon ids
    const anonIds = Object.keys(this.playerMap);

    for (const anonId of anonIds) {
      if (emptyIds.includes(anonId))
        continue;
      if (playerIds.includes(anonId)) {
        notifier.warn(`player id collision ${anonId}`);
        success = false;
      }
    }

    return success;
  }

  // Once a log has been anonymized, call it with all the lines again to verify.
  validateLine(line: string, notifier: Notifier): boolean {
    const splitLine = line.split('|');

    let success = true;

    const playerIds = Object.keys(this.anonMap);

    splitLine.forEach((field, idx) => {
      if (emptyIds.includes(field))
        return;
      if (playerIds.includes(field)) {
        notifier.warn(`uncaught player id ${field}, idx: ${idx}`, splitLine);
        success = false;
      }
    });

    return success;
  }
}
