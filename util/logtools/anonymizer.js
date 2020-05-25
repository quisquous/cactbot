'use strict';

// TODO: handle subfields
// TODO: add post-anonymizing `validateNames` as well

// TODO: is the first byte of ids always flags, such that "..000000" is always empty?
const emptyIds = ['E0000000', '80000000'];

const logDefinitions = require('./netlog_defs.js');
const FakeNameGenerator = require('./fake_name_generator.js');

// notifier here is a { warn: (str) => {} } object to return errors in a more structured way.

class Anonymizer {
  constructor() {
    this.logTypes = logDefinitions;
    this.nameGenerator = new FakeNameGenerator();

    // uppercase hex id -> name
    this.playerMap = {};
    // uppercase hex real player id -> uppercase hex fake player id
    this.anonMap = {};

    this.lastPlayerIdx = 0x10FF0000;

    this.fakeHash = '01234567012345670123456701234567';

    for (let id of emptyIds) {
      // Empty ids have already been anonymized (to themselves).
      this.anonMap[id] = id;
      // Empty ids have no name.
      this.playerMap[id] = '';
    }
  }

  process(line, notifier) {
    const splitLine = line.split('|');

    // Improperly closed files can leave a blank line.
    if (splitLine.length <= 1)
      return line;

    // Always replace the hash.
    if (splitLine[splitLine.length - 1].length === 32)
      splitLine[splitLine.length - 1] = this.fakeHash;
    else
      notifier.warn('missing hash ' + splitLine.length, splitLine);

    let type = this.logTypes[splitLine[0]];
    if (!type || type.isUnknown) {
      notifier.warn('unknown type', splitLine);
      return;
    }

    // Drop any lines that can't be handled.
    if (!type.canAnonymize)
      return;

    // If nothing to anonymize, we're done.
    if (!type.playerIds)
      return line;

    // Anonymize fields.
    for (let idIdx in type.playerIds) {
      idIdx = parseInt(idIdx);
      const nameIdx = type.playerIds[idIdx];

      // Check for ids that are out of range, possibly optional.
      // The last field is always the hash, so don't include that either.
      if (idIdx > splitLine.length - 2) {
        // Some ids are optional and may not exist, these are ok to skip.
        if (type.optionalFields && type.optionalFields.includes(idIdx))
          continue;

        notifier.warn('unexpected missing field ' + idIdx, splitLine);
        continue;
      }

      // TODO: keep track of uppercase/lowercase??
      let playerId = splitLine[idIdx].toUpperCase();

      // Cutscenes get added combatant messages with ids such as 'FF000006' and no name.
      const isCutsceneId = playerId.substr(0, 2) === 'FF';

      // Handle weirdly shaped ids.
      if (playerId.length !== 8 || isCutsceneId) {
        const isOptional = type.optionalFields && type.optionalFields.includes(idIdx);
        // Also, sometimes ids are '0000' or '0'.  Treat these the same as implicitly optional.
        const isZero = parseInt(playerId) === 0;
        if (isOptional || isZero || isCutsceneId) {
          // If we have an invalid player id, it is fine if it has been marked optional or is zero.
          // However, in these cases, it should have an empty name (or no name field).
          // e.g. 21|2019-09-07T10:18:11.4390000-07:00|10FF007E|X'xzzrmk Tia|01|Key Item|793E69||
          if (typeof nameIdx === 'number' && splitLine[nameIdx] !== '')
            notifier.warn('invalid id with valid name at index ' + idIdx, splitLine);
          continue;
        }

        notifier.warn('expected id field at index ' + idIdx, splitLine);
        continue;
      }

      // Ignore monsters.
      if (playerId[0] === '4')
        continue;

      // Replace the id at this index with a fake player id.
      if (!this.anonMap[playerId])
        this.anonMap[playerId] = this.addNewPlayer();
      let fakePlayerId = this.anonMap[playerId];
      if (!fakePlayerId)
        notifier.warn('internal error: missing player id', splitLine);
      if (typeof this.playerMap[fakePlayerId] === 'undefined')
        notifier.warn('internal error: missing player name ' + fakePlayerId, splitLine);
      splitLine[idIdx] = fakePlayerId;

      // Replace the corresponding name, if there's a name mapping.
      if (typeof nameIdx === 'number')
        splitLine[nameIdx] = this.playerMap[fakePlayerId];
    }

    // For unknown fields, just clear them, as they may have ids.
    if (typeof type.firstUnknownField !== 'undefined') {
      for (let idx = type.firstUnknownField; idx < splitLine.length - 1; ++idx)
        splitLine[idx] = '';
    }

    return splitLine.join('|');
  }

  addNewPlayer() {
    this.lastPlayerIdx++;
    let playerName = this.nameGenerator.makeName(this.lastPlayerIdx);
    let playerId = this.lastPlayerIdx.toString(16).toUpperCase();
    this.playerMap[playerId] = playerName;
    return playerId;
  }

  // Once a log has been anonymized, this validates fake ids don't collide with real.
  validateIds(notifier) {
    let success = true;

    // valid player ids
    let playerIds = Object.keys(this.anonMap);
    // made up anon ids
    let anonIds = Object.keys(this.playerMap);

    for (const anonId of anonIds) {
      if (emptyIds.includes(anonId))
        continue;
      if (playerIds.includes(anonId)) {
        notifier.warn('player id collision ' + anonId);
        success = false;
      }
    }

    return success;
  }

  // Once a log has been anonymized, call it with all the lines again to verify.
  validateLine(line, notifier) {
    const splitLine = line.split('|');

    let success = true;

    let playerIds = Object.keys(this.anonMap);

    for (let idx = 0; idx < splitLine.length; ++idx) {
      let field = splitLine[idx];
      if (emptyIds.includes(field))
        continue;
      if (playerIds.includes(field)) {
        notifier.warn('uncaught player id ' + field + ', idx: ' + idx, splitLine);
        success = false;
      }
    }

    return success;
  }
}

if (typeof module !== 'undefined' && module.exports)
  module.exports = Anonymizer;

