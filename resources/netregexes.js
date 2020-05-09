'use strict';

// Differences from Regexes:
// * may have more fields
// * AddedCombatant npc id is broken up into npcNameId and npcBaseId
// * gameLog always splits name into its own field (but previously wouldn't)

const separator = '\\|';

let parseHelper = (params, funcName, fields) => {
  // Validate params's field names vs the ones in fields.
  if (typeof params === 'undefined')
    params = {};
  let validFields = [];
  for (let value of Object.values(fields)) {
    if (typeof value !== 'object')
      continue;
    validFields.push(value.field);
  }
  Regexes.validateParams(params, funcName, ['capture', ...validFields]);

  // Find the last key we care about, so we can shorten the regex if needed.
  let capture = Regexes.trueIfUndefined(params.capture);
  let fieldKeys = Object.keys(fields);
  let maxKey;
  if (capture) {
    maxKey = fieldKeys[fieldKeys.length - 1];
  } else {
    maxKey = 0;
    for (let key of fieldKeys) {
      let value = fields[key];
      if (typeof value !== 'object')
        continue;
      let fieldName = fields[key].field;
      if (fieldName in params)
        maxKey = key;
    }
  }

  // Build the regex from the fields.
  let str = '^';
  let lastKey = -1;
  for (let key in fields) {
    key = parseInt(key);
    // Fill in blanks.
    let missingFields = key - lastKey - 1;
    if (missingFields === 1)
      str += '\\y{NetField}';
    else if (missingFields > 1)
      str += '\\y{NetField}{' + missingFields + '}';
    lastKey = key;

    let value = fields[key];
    if (typeof value === 'object') {
      let fieldName = fields[key].field;
      // TODO: the field object here could also manage different defaults, if we wanted?
      str += Regexes.maybeCapture(capture, fieldName, params[fieldName], '.*?') + separator;
    } else {
      str += fields[key].toString() + separator;
    }

    // Stop if we're not capturing and don't care about future fields.
    if (key >= maxKey)
      break;
  }
  return Regexes.parse(str);
};

// Node loading shenanigans.  'var' lets other files require() this file inside of
// Node and put NetRegexes as a global without conflicting when redefining.
/* eslint-disable no-var */
var Regexes;
var NetRegexes = {
/* eslint-enable */

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#14-networkstartscasting
  startsUsing: (params) => {
    return parseHelper(params, 'startsUsing', {
      0: '20',
      1: { field: 'timestamp' },
      2: { field: 'sourceId' },
      3: { field: 'source' },
      4: { field: 'id' },
      5: { field: 'ability' },
      6: { field: 'targetId' },
      7: { field: 'target' },
      8: { field: 'castTime' },
    });
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#15-networkability
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#16-networkaoeability
  ability: (params) => {
    return parseHelper(params, 'ability', {
      0: '2[12]',
      1: { field: 'timestamp' },
      2: { field: 'sourceId' },
      3: { field: 'source' },
      4: { field: 'id' },
      5: { field: 'ability' },
      6: { field: 'targetId' },
      7: { field: 'target' },
    });
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#15-networkability
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#16-networkaoeability
  abilityFull: (params) => {
    return parseHelper(params, 'abilityFull', {
      0: '2[12]',
      1: { field: 'timestamp' },
      2: { field: 'sourceId' },
      3: { field: 'source' },
      4: { field: 'id' },
      5: { field: 'ability' },
      6: { field: 'targetId' },
      7: { field: 'target' },
      8: { field: 'flags' },
      40: { field: 'x' },
      41: { field: 'y' },
      42: { field: 'z' },
      43: { field: 'heading' },
    });
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#1b-networktargeticon-head-markers
  headMarker: (params) => {
    return parseHelper(params, 'headMarker', {
      0: '27',
      1: { field: 'timestamp' },
      2: { field: 'targetId' },
      3: { field: 'target' },
      4: '....',
      5: '....',
      6: { field: 'id' },
    });
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#03-addcombatant
  addedCombatant: (params) => {
    return parseHelper(params, 'addedCombatant', {
      0: '03',
      1: { field: 'timestamp' },
      2: { field: 'id' },
      3: { field: 'name' },
    });
  },

  // fields: id, name, job, level, world, npcNameId, npcBaseId, hp, x, y, z, heading, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#03-addcombatant
  addedCombatantFull: (params) => {
    return parseHelper(params, 'addedCombatantFull', {
      0: '03',
      1: { field: 'timestamp' },
      2: { field: 'id' },
      3: { field: 'name' },
      4: { field: 'job' },
      5: { field: 'level' },
      8: { field: 'world' },
      9: { field: 'npcNameId' },
      10: { field: 'npcBaseId' },
      12: { field: 'hp' },
      17: { field: 'x' },
      18: { field: 'y' },
      19: { field: 'z' },
      20: { field: 'heading' },
    });
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#04-removecombatant
  removingCombatant: (params) => {
    return parseHelper(params, 'removingCombatant', {
      0: '04',
      1: { field: 'timestamp' },
      2: { field: 'id' },
      3: { field: 'name' },
      12: { field: 'hp' },
    });
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#1a-networkbuff
  gainsEffect: (params) => {
    return parseHelper(params, 'gainsEffect', {
      0: '26',
      1: { field: 'timestamp' },
      2: { field: 'effectId' },
      3: { field: 'effect' },
      4: { field: 'duration' },
      5: { field: 'sourceId' },
      6: { field: 'source' },
      7: { field: 'targetId' },
      8: { field: 'target' },
      9: { field: 'count' },
    });
  },

  // Prefer gainsEffect over this function unless you really need extra data.
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#26-networkstatuseffects
  statusEffectExplicit: (params) => {
    return parseHelper(params, 'statusEffectExplicit', {
      0: '38',
      1: { field: 'timestamp' },
      2: { field: 'targetId' },
      3: { field: 'target' },
      5: { field: 'hp' },
      6: { field: 'maxHp' },
      11: { field: 'x' },
      12: { field: 'y' },
      13: { field: 'z' },
      14: { field: 'heading' },
      15: { field: 'data0' },
      16: { field: 'data1' },
      17: { field: 'data2' },
      18: { field: 'data3' },
      19: { field: 'data4' },
    });
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#1e-networkbuffremove
  losesEffect: (params) => {
    return parseHelper(params, 'losesEffect', {
      0: '30',
      1: { field: 'timestamp' },
      2: { field: 'effectId' },
      3: { field: 'effect' },
      5: { field: 'sourceId' },
      6: { field: 'source' },
      7: { field: 'targetId' },
      8: { field: 'target' },
      9: { field: 'count' },
    });
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#23-networktether
  tether: (params) => {
    return parseHelper(params, 'tether', {
      0: '35',
      1: { field: 'timestamp' },
      2: { field: 'sourceId' },
      3: { field: 'source' },
      4: { field: 'targetId' },
      5: { field: 'target' },
      6: '....',
      7: '....',
      8: { field: 'id' },
    });
  },

  // 'target' was defeated by 'source'
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#19-networkdeath
  wasDefeated: (params) => {
    return parseHelper(params, 'tether', {
      0: '25',
      1: { field: 'timestamp' },
      2: { field: 'targetId' },
      3: { field: 'target' },
      4: { field: 'sourceId' },
      5: { field: 'source' },
    });
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#00-logline
  echo: (params) => {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(params, 'echo', ['timestamp', 'code', 'name', 'line', 'capture']);
    params.code = '0038';
    return NetRegexes.gameLog(params);
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#00-logline
  dialog: (params) => {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(params, 'dialog', ['timestamp', 'code', 'name', 'line', 'capture']);
    params.code = '0044';
    return NetRegexes.gameLog(params);
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#00-logline
  message: (params) => {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(params, 'message', ['timestamp', 'code', 'name', 'line', 'capture']);
    params.code = '0839';
    return NetRegexes.gameLog(params);
  },

  // fields: code, name, line, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#00-logline
  gameLog: (params) => {
    return parseHelper(params, 'gameLog', {
      0: '00',
      1: { field: 'timestamp' },
      2: { field: 'code' },
      3: { field: 'name' },
      4: { field: 'line' },
    });
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#00-logline
  gameNameLog: (params) => {
    // for compat with Regexes.
    return NetRegexes.gameLog(params);
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#0c-playerstats
  statChange: (params) => {
    return parseHelper(params, 'statChange', {
      0: '12',
      1: { field: 'timestamp' },
      2: { field: 'job' },
      3: { field: 'strength' },
      4: { field: 'dexterity' },
      5: { field: 'vitality' },
      6: { field: 'intelligence' },
      7: { field: 'mind' },
      8: { field: 'piety' },
      9: { field: 'attackPower' },
      10: { field: 'directHit' },
      11: { field: 'criticalHit' },
      12: { field: 'attackMagicPotency' },
      13: { field: 'healMagicPotency' },
      14: { field: 'determination' },
      15: { field: 'skillSpeed' },
      16: { field: 'spellSpeed' },
      18: { field: 'tenacity' },
    });
  },

  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#01-changezone
  changeZone: (params) => {
    return parseHelper(params, 'changeZone', {
      0: '01',
      1: { field: 'timestamp' },
      2: { field: 'id' },
      3: { field: 'name' },
    });
  },
};

if (typeof module !== 'undefined') {
  if (module.exports)
    module.exports = NetRegexes;
  Regexes = require('./regexes.js');
}
