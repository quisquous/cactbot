'use strict';

let trueIfUndefined = (value) => {
  if (typeof(value) === 'undefined')
    return true;
  return !!value;
};

let validateParams = (f, funcName, params) => {
  if (f === null)
    return;
  if (typeof f !== 'object')
    return;
  let keys = Object.keys(f);
  for (let k = 0; k < keys.length; ++k) {
    let key = keys[k];
    if (params.indexOf(key) < 0) {
      throw new Error(`${funcName}: invalid parameter '${key}'.  ` +
          `Valid params: ${JSON.stringify(params)}`);
    }
  }
};

// Node loading shenanigans.  'var' lets other files require() this file inside of
// Node and put Regexes as a global without conflicting when redefining.
/* eslint-disable no-var */
var Regexes = {
/* eslint-enable */

  // fields: source, id, ability, target, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#14-networkstartscasting
  startsUsing: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'startsUsing', ['source', 'id', 'ability', 'target', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 14:' +
      Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':';

    if (f.source || f.id || f.target || capture)
      str += Regexes.maybeCapture(capture, 'source', f.source, '.*?') + ' starts using ';

    if (f.ability || f.target || capture)
      str += Regexes.maybeCapture(capture, 'ability', f.ability, '.*?') + ' on ';

    if (f.target || capture)
      str += Regexes.maybeCapture(capture, 'target', f.target, '.*?') + '\\.';

    return Regexes.parse(str);
  },

  // fields: source, id, ability, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#15-networkability
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#16-networkaoeability
  ability: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'ability', ['source', 'id', 'ability', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 1[56]:\\y{ObjectId}:' +
      Regexes.maybeCapture(capture, 'source', f.source, '.*?') + ':';

    if (f.id || f.ability || capture)
      str += Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':';

    if (f.ability || capture)
      str += Regexes.maybeCapture(capture, 'ability', f.ability, '.*?') + ':';

    return Regexes.parse(str);
  },

  // fields: sourceId, source, id, ability, targetId, target, flags, x, y, z, heading, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#15-networkability
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#16-networkaoeability
  abilityFull: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'abilityFull', [
      'sourceId',
      'source',
      'id',
      'ability',
      'targetId',
      'target',
      'flags',
      'x',
      'y',
      'z',
      'heading',
      'capture',
    ]);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 1[56]:' +
      Regexes.maybeCapture(capture, 'sourceId', f.sourceId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'source', f.source, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':' +
      Regexes.maybeCapture(capture, 'ability', f.ability, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'flags', f.flags, '.*?') + ':' +
      '.*:' +
      Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'heading', f.heading, '\\y{Float}') +
      ':.*?:?$';
    return Regexes.parse(str);
  },

  // fields: target, id, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#1b-networktargeticon-head-markers
  headMarker: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'headMarker', ['target', 'id', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 1B:\\y{ObjectId}:' +
      Regexes.maybeCapture(capture, 'target', f.target, '.*?') + ':....:....:' +
      Regexes.maybeCapture(capture, 'id', f.id, '....') + ':';
    return Regexes.parse(str);
  },

  // fields: name, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#03-addcombatant
  addedCombatant: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'addedCombatant', ['name', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 03:\\y{ObjectId}:Added new combatant ' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.';
    return Regexes.parse(str);
  },

  // fields: id, name, hp, x, y, z, npcId, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#03-addcombatant
  addedCombatantFull: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'addedCombatantFull', ['id', 'name', 'hp', 'x', 'y', 'z', 'npcId', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 03:' + Regexes.maybeCapture(capture, 'id', f.id, '\\y{ObjectId}') +
      ':Added new combatant ' + Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.' +
      '.*?Max HP: ' +
      Regexes.maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\.' +
      '.*?Pos: \\(' +
      Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ',' +
      Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ',' +
      Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + '\\)' +
      '(?: \\(' + Regexes.maybeCapture(capture, 'npcId', f.npcId, '.*?') + '\\))?\\.';
    return Regexes.parse(str);
  },

  // fields: name, hp, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#04-removecombatant
  removingCombatant: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'removingCombatant', ['name', 'hp', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 04:\\y{ObjectId}:Removing combatant ' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.' +
      '.*?Max HP: ' + Regexes.maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\.';
    return Regexes.parse(str);
  },

  // fields: target, effect, source, duration, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#1a-networkbuff
  gainsEffect: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'gainsEffect', ['target', 'effect', 'source', 'duration', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 1A:\\y{ObjectId}:' +
      Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
      ' gains the effect of ' +
      Regexes.maybeCapture(capture, 'effect', f.effect, '.*?') +
      ' from ' +
      Regexes.maybeCapture(capture, 'source', f.source, '.*?') +
      ' for ' +
      Regexes.maybeCapture(capture, 'duration', f.duration, '\\y{Float}') +
      ' Seconds\\.';
    return Regexes.parse(str);
  },

  // Prefer gainsEffect over this function unless you really need extra data.
  // fields: targetId, target, x, y, z, heading, data0, data1, data2, data3
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#26-networkstatuseffects
  statusEffectExplicit: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'statusEffectExplicit', [
      'targetId',
      'target',
      'hp',
      'maxHp',
      'x',
      'y',
      'z',
      'heading',
      'data0',
      'data1',
      'data2',
      'data3',
      'data4',
      'data5',
      'capture',
    ]);
    let capture = trueIfUndefined(f.capture);

    let kField = '.*?:';

    let str = '\\y{Timestamp} 26:' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '.*?') + ':' +
      kField + // jobs
      Regexes.maybeCapture(capture, 'hp', f.hp, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'maxHp', f.maxHp, '\\y{Float}') + ':' +
      kField + // mp
      kField + // max mp
      kField + // tp lol
      kField + // max tp extra lol
      // x, y, z heading may be blank
      Regexes.optional(Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}')) + ':' +
      Regexes.optional(Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}')) + ':' +
      Regexes.optional(Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}')) + ':' +
      Regexes.optional(Regexes.maybeCapture(capture, 'heading', f.heading, '\\y{Float}')) + ':' +
      Regexes.maybeCapture(capture, 'data0', f.data0, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'data1', f.data1, '.*?') + ':' +
      // data2, 3, 4 may not exist and the line may terminate.
      Regexes.optional(Regexes.maybeCapture(capture, 'data2', f.data2, '.*?') + ':') +
      Regexes.optional(Regexes.maybeCapture(capture, 'data3', f.data3, '.*?') + ':') +
      Regexes.optional(Regexes.maybeCapture(capture, 'data4', f.data4, '.*?') + ':');
    return Regexes.parse(str);
  },

  // fields: target, effect, source, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#1e-networkbuffremove
  losesEffect: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'losesEffect', ['target', 'effect', 'source', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 1E:\\y{ObjectId}:' +
      Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
      ' loses the effect of ' +
      Regexes.maybeCapture(capture, 'effect', f.effect, '.*?') +
      ' from ' +
      Regexes.maybeCapture(capture, 'source', f.source, '.*?') + '\\.';
    return Regexes.parse(str);
  },

  // fields: source, sourceId, target, targetId, id, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#23-networktether
  tether: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'tether', ['source', 'sourceId', 'target', 'targetId', 'id', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 23:' +
      Regexes.maybeCapture(capture, 'sourceId', f.sourceId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'source', f.source, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
      ':....:....:' +
      Regexes.maybeCapture(capture, 'id', f.id, '....') + ':';
    return Regexes.parse(str);
  },

  // 'target' was defeated by 'source'
  // fields: target, source, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#19-networkdeath
  wasDefeated: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'wasDefeated', ['target', 'source', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 19:' +
      Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
      ' was defeated by ' +
      Regexes.maybeCapture(capture, 'source', f.source, '.*?') + '\\.';
    return Regexes.parse(str);
  },

  // fields: code, line, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#00-logline
  echo: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'echo', ['code', 'line', 'capture']);
    return Regexes.gameLog({
      line: f.line,
      capture: f.capture,
      code: '0038',
    });
  },

  // fields: code, line, name, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#00-logline
  dialog: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'dialog', ['code', 'line', 'name', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 00:' +
      Regexes.maybeCapture(capture, 'code', '0044') + ':' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'line', f.line, '.*');
    return Regexes.parse(str);
  },

  // fields: code, line, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#00-logline
  message: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'message', ['code', 'line', 'capture']);
    return Regexes.gameLog({
      line: f.line,
      capture: f.capture,
      code: '0839',
    });
  },

  // fields: code, line, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#00-logline
  gameLog: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'gameLog', ['code', 'line', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 00:' +
      Regexes.maybeCapture(capture, 'code', f.code, '....') + ':' +
      Regexes.maybeCapture(capture, 'line', f.line, '.*');
    return Regexes.parse(str);
  },

  // fields: job, strength, dexterity, vitality, intelligence, mind, piety, attackPower,
  //         directHit, criticalHit, attackMagicPotency, healMagicPotency, determination,
  //         skillSpeed, spellSpeed, tenacity, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#0c-playerstats
  statChange: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'statChange', [
      'job',
      'strength',
      'dexterity',
      'vitality',
      'intelligence',
      'mind',
      'piety',
      'attackPower',
      'directHit',
      'criticalHit',
      'attackMagicPotency',
      'healMagicPotency',
      'determination',
      'skillSpeed',
      'spellSpeed',
      'tenacity',
      'capture',
    ]);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 0C:Player Stats: ' +
      Regexes.maybeCapture(capture, 'job', f.job, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'strength', f.strength, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'dexterity', f.dexterity, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'vitality', f.vitality, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'intelligence', f.intelligence, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'mind', f.mind, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'piety', f.piety, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'attackPower', f.attack_power, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'directHit', f.direct_hit, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'criticalHit', f.critical_hit, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'attackMagicPotency', f.attack_magic_potency, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'healMagicPotency', f.heal_magic_potency, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'determination', f.determination, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'skillSpeed', f.skill_speed, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'spellSpeed', f.spell_speed, '\\d+') +
      ':0:' +
      Regexes.maybeCapture(capture, 'tenacity', f.tenacity, '\\d+');
    return Regexes.parse(str);
  },

  // Helper function for building named capture group regexes.
  maybeCapture: (capture, name, value, defaultValue) => {
    if (!value)
      value = defaultValue;
    value = Regexes.anyOf(value);
    return capture ? Regexes.namedCapture(name, value) : value;
  },

  optional: (str) => {
    return `(?:${str})?`;
  },

  // Creates a named regex capture group named |name| for the match |value|.
  namedCapture: (name, value) => {
    if (name.indexOf('>') >= 0)
      console.error('"' + name + '" contains ">".');
    if (name.indexOf('<') >= 0)
      console.error('"' + name + '" contains ">".');

    return '(?<' + name + '>' + value + ')';
  },

  // Convenience for turning multiple args into a unioned regular expression.
  // anyOf(x, y, z) or anyOf([x, y, z]) do the same thing, and return (?:x|y|z).
  // anyOf(x) or anyOf(x) on its own simplifies to just x.
  // args may be strings or RegExp, although any additional markers to RegExp
  // like /insensitive/i are dropped.
  anyOf: function() {
    let array;
    if (arguments.length == 1) {
      if (!Array.isArray(arguments[0]))
        return arguments[0];
      array = arguments[0];
    } else {
      array = arguments;
    }

    let str = '(?:' + (array[0] instanceof RegExp ? array[0].source : array[0]);
    for (let i = 1; i < array.length; ++i)
      str += '|' + (array[i] instanceof RegExp ? array[i].source : array[i]);
    str += ')';
    return str;
  },

  parse: (regexpString) => {
    let kCactbotCategories = {
      Timestamp: '^.{14}',
      LogType: '[0-9A-Fa-f]{2}',
      AbilityCode: '[0-9A-Fa-f]{1,4}',
      ObjectId: '[0-9A-F]{8}',
      Name: '.*?',
      // Floats can have comma as separator in FFXIV plugin output: https://github.com/ravahn/FFXIV_ACT_Plugin/issues/137
      Float: '-?[0-9]+(?:[.,][0-9]+)?(?:E-?[0-9]+)?',
    };

    // All regexes in cactbot are case insensitive.
    // This avoids headaches as things like `Vice and Vanity` turns into
    // `Vice And Vanity`, especially for French and German.  It appears to
    // have a ~20% regex parsing overhead, but at least they work.
    let modifiers = 'i';
    if (regexpString instanceof RegExp) {
      modifiers += (regexpString.global ? 'g' : '') +
                   (regexpString.multiline ? 'm' : '');
      regexpString = regexpString.source;
    }
    regexpString = regexpString.replace(/\\y\{(.*?)\}/g, function(match, group) {
      return kCactbotCategories[group] || match;
    });
    return new RegExp(regexpString, modifiers);
  },
};

if (typeof module !== 'undefined' && module.exports)
  module.exports = Regexes;
