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

  // fields: source, id, ability, target, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#15-networkability
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#16-networkaoeability
  ability: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'ability', ['source', 'id', 'ability', 'target', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 1[56]:\\y{ObjectId}:' +
      Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':';

    if (f.id || f.ability || f.target || capture)
      str += Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':';

    if (f.ability || f.target || capture)
      str += Regexes.maybeCapture(capture, 'ability', f.ability, '[^:]*?') + ':';

    if (f.target || capture)
      str += '\\y{ObjectId}:' + Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':';

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
      Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':' +
      Regexes.maybeCapture(capture, 'ability', f.ability, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flags', f.flags, '[^:]*?') + ':' +
      '.*:' +
      Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'heading', f.heading, '\\y{Float}') +
      ':.*?:?$';
    return Regexes.parse(str);
  },

  // fields: targetId, target, id, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#1b-networktargeticon-head-markers
  headMarker: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'headMarker', ['targetId', 'target', 'id', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 1B:' +
      Regexes.maybeCapture(capture, 'targetId', f.sourceId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':....:....:' +
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
      Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':' +
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
      Regexes.maybeCapture(capture, 'data0', f.data0, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'data1', f.data1, '[^:]*?') + ':' +
      // data2, 3, 4 may not exist and the line may terminate.
      Regexes.optional(Regexes.maybeCapture(capture, 'data2', f.data2, '[^:]*?') + ':') +
      Regexes.optional(Regexes.maybeCapture(capture, 'data3', f.data3, '[^:]*?') + ':') +
      Regexes.optional(Regexes.maybeCapture(capture, 'data4', f.data4, '[^:]*?') + ':');
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
      Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') +
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

  // fields: name, hp, capture
  // matches: https://github.com/quisquous/cactbot/blob/master/docs/LogGuide.md#0d-combatanthp
  hasHP: (f) => {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'hasHP', ['name', 'hp', 'capture']);
    let capture = trueIfUndefined(f.capture);
    let str = '\\y{Timestamp} 0D:' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') +
      ' HP at ' +
      Regexes.maybeCapture(capture, 'hp', f.hp, '\\d+') + '%';
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
      Name: '(?:\\p{L}\\p{M}*|\\p{N}|\\p{Z}|[-_\'])*',
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
    return new RegExp(Regexes.withUnicodeClasses(regexpString), modifiers);
  },

  /* ! This method is from https://stackoverflow.com/a/8933546
    Copyright (C) 2010-2012,2014  Marcelo Gibson de Castro Gonçalves.
    All rights reserved.

    Copying and distribution of this file, with or without modification,
    are permitted in any medium without royalty provided the copyright
    notice and this notice are preserved.  This file is offered as-is,
    without any warranty.


    Modifications:
    - Return a string if given a string, or a RegExp if given one.
    - Rename method from unicode_hack().
    - Formatting.
  */
  withUnicodeClasses: (function() {
    /* Regexps to match characters in the BMP according to their Unicode
       category.
       Extracted from running all characters (code units) against Java's
       Character.getType. Source:
       https://ideone.com/04llh4
    */
    let unicodeCategories = {
      Cn: '[\u0378\u0379\u037f-\u0383\u038b\u038d\u03a2\u0528-\u0530\u0557\u0558\u0560\u0588\u058b-\u0590\u05c8-\u05cf\u05eb-\u05ef\u05f5-\u05ff\u0604\u0605\u061c\u061d\u070e\u074b\u074c\u07b2-\u07bf\u07fb-\u07ff\u082e\u082f\u083f\u085c\u085d\u085f-\u08ff\u0978\u0980\u0984\u098d\u098e\u0991\u0992\u09a9\u09b1\u09b3-\u09b5\u09ba\u09bb\u09c5\u09c6\u09c9\u09ca\u09cf-\u09d6\u09d8-\u09db\u09de\u09e4\u09e5\u09fc-\u0a00\u0a04\u0a0b-\u0a0e\u0a11\u0a12\u0a29\u0a31\u0a34\u0a37\u0a3a\u0a3b\u0a3d\u0a43-\u0a46\u0a49\u0a4a\u0a4e-\u0a50\u0a52-\u0a58\u0a5d\u0a5f-\u0a65\u0a76-\u0a80\u0a84\u0a8e\u0a92\u0aa9\u0ab1\u0ab4\u0aba\u0abb\u0ac6\u0aca\u0ace\u0acf\u0ad1-\u0adf\u0ae4\u0ae5\u0af0\u0af2-\u0b00\u0b04\u0b0d\u0b0e\u0b11\u0b12\u0b29\u0b31\u0b34\u0b3a\u0b3b\u0b45\u0b46\u0b49\u0b4a\u0b4e-\u0b55\u0b58-\u0b5b\u0b5e\u0b64\u0b65\u0b78-\u0b81\u0b84\u0b8b-\u0b8d\u0b91\u0b96-\u0b98\u0b9b\u0b9d\u0ba0-\u0ba2\u0ba5-\u0ba7\u0bab-\u0bad\u0bba-\u0bbd\u0bc3-\u0bc5\u0bc9\u0bce\u0bcf\u0bd1-\u0bd6\u0bd8-\u0be5\u0bfb-\u0c00\u0c04\u0c0d\u0c11\u0c29\u0c34\u0c3a-\u0c3c\u0c45\u0c49\u0c4e-\u0c54\u0c57\u0c5a-\u0c5f\u0c64\u0c65\u0c70-\u0c77\u0c80\u0c81\u0c84\u0c8d\u0c91\u0ca9\u0cb4\u0cba\u0cbb\u0cc5\u0cc9\u0cce-\u0cd4\u0cd7-\u0cdd\u0cdf\u0ce4\u0ce5\u0cf0\u0cf3-\u0d01\u0d04\u0d0d\u0d11\u0d3b\u0d3c\u0d45\u0d49\u0d4f-\u0d56\u0d58-\u0d5f\u0d64\u0d65\u0d76-\u0d78\u0d80\u0d81\u0d84\u0d97-\u0d99\u0db2\u0dbc\u0dbe\u0dbf\u0dc7-\u0dc9\u0dcb-\u0dce\u0dd5\u0dd7\u0de0-\u0df1\u0df5-\u0e00\u0e3b-\u0e3e\u0e5c-\u0e80\u0e83\u0e85\u0e86\u0e89\u0e8b\u0e8c\u0e8e-\u0e93\u0e98\u0ea0\u0ea4\u0ea6\u0ea8\u0ea9\u0eac\u0eba\u0ebe\u0ebf\u0ec5\u0ec7\u0ece\u0ecf\u0eda\u0edb\u0ede-\u0eff\u0f48\u0f6d-\u0f70\u0f98\u0fbd\u0fcd\u0fdb-\u0fff\u10c6-\u10cf\u10fd-\u10ff\u1249\u124e\u124f\u1257\u1259\u125e\u125f\u1289\u128e\u128f\u12b1\u12b6\u12b7\u12bf\u12c1\u12c6\u12c7\u12d7\u1311\u1316\u1317\u135b\u135c\u137d-\u137f\u139a-\u139f\u13f5-\u13ff\u169d-\u169f\u16f1-\u16ff\u170d\u1715-\u171f\u1737-\u173f\u1754-\u175f\u176d\u1771\u1774-\u177f\u17de\u17df\u17ea-\u17ef\u17fa-\u17ff\u180f\u181a-\u181f\u1878-\u187f\u18ab-\u18af\u18f6-\u18ff\u191d-\u191f\u192c-\u192f\u193c-\u193f\u1941-\u1943\u196e\u196f\u1975-\u197f\u19ac-\u19af\u19ca-\u19cf\u19db-\u19dd\u1a1c\u1a1d\u1a5f\u1a7d\u1a7e\u1a8a-\u1a8f\u1a9a-\u1a9f\u1aae-\u1aff\u1b4c-\u1b4f\u1b7d-\u1b7f\u1bab-\u1bad\u1bba-\u1bbf\u1bf4-\u1bfb\u1c38-\u1c3a\u1c4a-\u1c4c\u1c80-\u1ccf\u1cf3-\u1cff\u1de7-\u1dfb\u1f16\u1f17\u1f1e\u1f1f\u1f46\u1f47\u1f4e\u1f4f\u1f58\u1f5a\u1f5c\u1f5e\u1f7e\u1f7f\u1fb5\u1fc5\u1fd4\u1fd5\u1fdc\u1ff0\u1ff1\u1ff5\u1fff\u2065-\u2069\u2072\u2073\u208f\u209d-\u209f\u20ba-\u20cf\u20f1-\u20ff\u218a-\u218f\u23f4-\u23ff\u2427-\u243f\u244b-\u245f\u2700\u27cb\u27cd\u2b4d-\u2b4f\u2b5a-\u2bff\u2c2f\u2c5f\u2cf2-\u2cf8\u2d26-\u2d2f\u2d66-\u2d6e\u2d71-\u2d7e\u2d97-\u2d9f\u2da7\u2daf\u2db7\u2dbf\u2dc7\u2dcf\u2dd7\u2ddf\u2e32-\u2e7f\u2e9a\u2ef4-\u2eff\u2fd6-\u2fef\u2ffc-\u2fff\u3040\u3097\u3098\u3100-\u3104\u312e-\u3130\u318f\u31bb-\u31bf\u31e4-\u31ef\u321f\u32ff\u4db6-\u4dbf\u9fcc-\u9fff\ua48d-\ua48f\ua4c7-\ua4cf\ua62c-\ua63f\ua674-\ua67b\ua698-\ua69f\ua6f8-\ua6ff\ua78f\ua792-\ua79f\ua7aa-\ua7f9\ua82c-\ua82f\ua83a-\ua83f\ua878-\ua87f\ua8c5-\ua8cd\ua8da-\ua8df\ua8fc-\ua8ff\ua954-\ua95e\ua97d-\ua97f\ua9ce\ua9da-\ua9dd\ua9e0-\ua9ff\uaa37-\uaa3f\uaa4e\uaa4f\uaa5a\uaa5b\uaa7c-\uaa7f\uaac3-\uaada\uaae0-\uab00\uab07\uab08\uab0f\uab10\uab17-\uab1f\uab27\uab2f-\uabbf\uabee\uabef\uabfa-\uabff\ud7a4-\ud7af\ud7c7-\ud7ca\ud7fc-\ud7ff\ufa2e\ufa2f\ufa6e\ufa6f\ufada-\ufaff\ufb07-\ufb12\ufb18-\ufb1c\ufb37\ufb3d\ufb3f\ufb42\ufb45\ufbc2-\ufbd2\ufd40-\ufd4f\ufd90\ufd91\ufdc8-\ufdef\ufdfe\ufdff\ufe1a-\ufe1f\ufe27-\ufe2f\ufe53\ufe67\ufe6c-\ufe6f\ufe75\ufefd\ufefe\uff00\uffbf-\uffc1\uffc8\uffc9\uffd0\uffd1\uffd8\uffd9\uffdd-\uffdf\uffe7\uffef-\ufff8\ufffe\uffff]',
      Lu: '[\u0041-\u005a\u00c0-\u00d6\u00d8-\u00de\u0100\u0102\u0104\u0106\u0108\u010a\u010c\u010e\u0110\u0112\u0114\u0116\u0118\u011a\u011c\u011e\u0120\u0122\u0124\u0126\u0128\u012a\u012c\u012e\u0130\u0132\u0134\u0136\u0139\u013b\u013d\u013f\u0141\u0143\u0145\u0147\u014a\u014c\u014e\u0150\u0152\u0154\u0156\u0158\u015a\u015c\u015e\u0160\u0162\u0164\u0166\u0168\u016a\u016c\u016e\u0170\u0172\u0174\u0176\u0178\u0179\u017b\u017d\u0181\u0182\u0184\u0186\u0187\u0189-\u018b\u018e-\u0191\u0193\u0194\u0196-\u0198\u019c\u019d\u019f\u01a0\u01a2\u01a4\u01a6\u01a7\u01a9\u01ac\u01ae\u01af\u01b1-\u01b3\u01b5\u01b7\u01b8\u01bc\u01c4\u01c7\u01ca\u01cd\u01cf\u01d1\u01d3\u01d5\u01d7\u01d9\u01db\u01de\u01e0\u01e2\u01e4\u01e6\u01e8\u01ea\u01ec\u01ee\u01f1\u01f4\u01f6-\u01f8\u01fa\u01fc\u01fe\u0200\u0202\u0204\u0206\u0208\u020a\u020c\u020e\u0210\u0212\u0214\u0216\u0218\u021a\u021c\u021e\u0220\u0222\u0224\u0226\u0228\u022a\u022c\u022e\u0230\u0232\u023a\u023b\u023d\u023e\u0241\u0243-\u0246\u0248\u024a\u024c\u024e\u0370\u0372\u0376\u0386\u0388-\u038a\u038c\u038e\u038f\u0391-\u03a1\u03a3-\u03ab\u03cf\u03d2-\u03d4\u03d8\u03da\u03dc\u03de\u03e0\u03e2\u03e4\u03e6\u03e8\u03ea\u03ec\u03ee\u03f4\u03f7\u03f9\u03fa\u03fd-\u042f\u0460\u0462\u0464\u0466\u0468\u046a\u046c\u046e\u0470\u0472\u0474\u0476\u0478\u047a\u047c\u047e\u0480\u048a\u048c\u048e\u0490\u0492\u0494\u0496\u0498\u049a\u049c\u049e\u04a0\u04a2\u04a4\u04a6\u04a8\u04aa\u04ac\u04ae\u04b0\u04b2\u04b4\u04b6\u04b8\u04ba\u04bc\u04be\u04c0\u04c1\u04c3\u04c5\u04c7\u04c9\u04cb\u04cd\u04d0\u04d2\u04d4\u04d6\u04d8\u04da\u04dc\u04de\u04e0\u04e2\u04e4\u04e6\u04e8\u04ea\u04ec\u04ee\u04f0\u04f2\u04f4\u04f6\u04f8\u04fa\u04fc\u04fe\u0500\u0502\u0504\u0506\u0508\u050a\u050c\u050e\u0510\u0512\u0514\u0516\u0518\u051a\u051c\u051e\u0520\u0522\u0524\u0526\u0531-\u0556\u10a0-\u10c5\u1e00\u1e02\u1e04\u1e06\u1e08\u1e0a\u1e0c\u1e0e\u1e10\u1e12\u1e14\u1e16\u1e18\u1e1a\u1e1c\u1e1e\u1e20\u1e22\u1e24\u1e26\u1e28\u1e2a\u1e2c\u1e2e\u1e30\u1e32\u1e34\u1e36\u1e38\u1e3a\u1e3c\u1e3e\u1e40\u1e42\u1e44\u1e46\u1e48\u1e4a\u1e4c\u1e4e\u1e50\u1e52\u1e54\u1e56\u1e58\u1e5a\u1e5c\u1e5e\u1e60\u1e62\u1e64\u1e66\u1e68\u1e6a\u1e6c\u1e6e\u1e70\u1e72\u1e74\u1e76\u1e78\u1e7a\u1e7c\u1e7e\u1e80\u1e82\u1e84\u1e86\u1e88\u1e8a\u1e8c\u1e8e\u1e90\u1e92\u1e94\u1e9e\u1ea0\u1ea2\u1ea4\u1ea6\u1ea8\u1eaa\u1eac\u1eae\u1eb0\u1eb2\u1eb4\u1eb6\u1eb8\u1eba\u1ebc\u1ebe\u1ec0\u1ec2\u1ec4\u1ec6\u1ec8\u1eca\u1ecc\u1ece\u1ed0\u1ed2\u1ed4\u1ed6\u1ed8\u1eda\u1edc\u1ede\u1ee0\u1ee2\u1ee4\u1ee6\u1ee8\u1eea\u1eec\u1eee\u1ef0\u1ef2\u1ef4\u1ef6\u1ef8\u1efa\u1efc\u1efe\u1f08-\u1f0f\u1f18-\u1f1d\u1f28-\u1f2f\u1f38-\u1f3f\u1f48-\u1f4d\u1f59\u1f5b\u1f5d\u1f5f\u1f68-\u1f6f\u1fb8-\u1fbb\u1fc8-\u1fcb\u1fd8-\u1fdb\u1fe8-\u1fec\u1ff8-\u1ffb\u2102\u2107\u210b-\u210d\u2110-\u2112\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u2130-\u2133\u213e\u213f\u2145\u2183\u2c00-\u2c2e\u2c60\u2c62-\u2c64\u2c67\u2c69\u2c6b\u2c6d-\u2c70\u2c72\u2c75\u2c7e-\u2c80\u2c82\u2c84\u2c86\u2c88\u2c8a\u2c8c\u2c8e\u2c90\u2c92\u2c94\u2c96\u2c98\u2c9a\u2c9c\u2c9e\u2ca0\u2ca2\u2ca4\u2ca6\u2ca8\u2caa\u2cac\u2cae\u2cb0\u2cb2\u2cb4\u2cb6\u2cb8\u2cba\u2cbc\u2cbe\u2cc0\u2cc2\u2cc4\u2cc6\u2cc8\u2cca\u2ccc\u2cce\u2cd0\u2cd2\u2cd4\u2cd6\u2cd8\u2cda\u2cdc\u2cde\u2ce0\u2ce2\u2ceb\u2ced\ua640\ua642\ua644\ua646\ua648\ua64a\ua64c\ua64e\ua650\ua652\ua654\ua656\ua658\ua65a\ua65c\ua65e\ua660\ua662\ua664\ua666\ua668\ua66a\ua66c\ua680\ua682\ua684\ua686\ua688\ua68a\ua68c\ua68e\ua690\ua692\ua694\ua696\ua722\ua724\ua726\ua728\ua72a\ua72c\ua72e\ua732\ua734\ua736\ua738\ua73a\ua73c\ua73e\ua740\ua742\ua744\ua746\ua748\ua74a\ua74c\ua74e\ua750\ua752\ua754\ua756\ua758\ua75a\ua75c\ua75e\ua760\ua762\ua764\ua766\ua768\ua76a\ua76c\ua76e\ua779\ua77b\ua77d\ua77e\ua780\ua782\ua784\ua786\ua78b\ua78d\ua790\ua7a0\ua7a2\ua7a4\ua7a6\ua7a8\uff21-\uff3a]',
      Ll: '[\u0061-\u007a\u00aa\u00b5\u00ba\u00df-\u00f6\u00f8-\u00ff\u0101\u0103\u0105\u0107\u0109\u010b\u010d\u010f\u0111\u0113\u0115\u0117\u0119\u011b\u011d\u011f\u0121\u0123\u0125\u0127\u0129\u012b\u012d\u012f\u0131\u0133\u0135\u0137\u0138\u013a\u013c\u013e\u0140\u0142\u0144\u0146\u0148\u0149\u014b\u014d\u014f\u0151\u0153\u0155\u0157\u0159\u015b\u015d\u015f\u0161\u0163\u0165\u0167\u0169\u016b\u016d\u016f\u0171\u0173\u0175\u0177\u017a\u017c\u017e-\u0180\u0183\u0185\u0188\u018c\u018d\u0192\u0195\u0199-\u019b\u019e\u01a1\u01a3\u01a5\u01a8\u01aa\u01ab\u01ad\u01b0\u01b4\u01b6\u01b9\u01ba\u01bd-\u01bf\u01c6\u01c9\u01cc\u01ce\u01d0\u01d2\u01d4\u01d6\u01d8\u01da\u01dc\u01dd\u01df\u01e1\u01e3\u01e5\u01e7\u01e9\u01eb\u01ed\u01ef\u01f0\u01f3\u01f5\u01f9\u01fb\u01fd\u01ff\u0201\u0203\u0205\u0207\u0209\u020b\u020d\u020f\u0211\u0213\u0215\u0217\u0219\u021b\u021d\u021f\u0221\u0223\u0225\u0227\u0229\u022b\u022d\u022f\u0231\u0233-\u0239\u023c\u023f\u0240\u0242\u0247\u0249\u024b\u024d\u024f-\u0293\u0295-\u02af\u0371\u0373\u0377\u037b-\u037d\u0390\u03ac-\u03ce\u03d0\u03d1\u03d5-\u03d7\u03d9\u03db\u03dd\u03df\u03e1\u03e3\u03e5\u03e7\u03e9\u03eb\u03ed\u03ef-\u03f3\u03f5\u03f8\u03fb\u03fc\u0430-\u045f\u0461\u0463\u0465\u0467\u0469\u046b\u046d\u046f\u0471\u0473\u0475\u0477\u0479\u047b\u047d\u047f\u0481\u048b\u048d\u048f\u0491\u0493\u0495\u0497\u0499\u049b\u049d\u049f\u04a1\u04a3\u04a5\u04a7\u04a9\u04ab\u04ad\u04af\u04b1\u04b3\u04b5\u04b7\u04b9\u04bb\u04bd\u04bf\u04c2\u04c4\u04c6\u04c8\u04ca\u04cc\u04ce\u04cf\u04d1\u04d3\u04d5\u04d7\u04d9\u04db\u04dd\u04df\u04e1\u04e3\u04e5\u04e7\u04e9\u04eb\u04ed\u04ef\u04f1\u04f3\u04f5\u04f7\u04f9\u04fb\u04fd\u04ff\u0501\u0503\u0505\u0507\u0509\u050b\u050d\u050f\u0511\u0513\u0515\u0517\u0519\u051b\u051d\u051f\u0521\u0523\u0525\u0527\u0561-\u0587\u1d00-\u1d2b\u1d62-\u1d77\u1d79-\u1d9a\u1e01\u1e03\u1e05\u1e07\u1e09\u1e0b\u1e0d\u1e0f\u1e11\u1e13\u1e15\u1e17\u1e19\u1e1b\u1e1d\u1e1f\u1e21\u1e23\u1e25\u1e27\u1e29\u1e2b\u1e2d\u1e2f\u1e31\u1e33\u1e35\u1e37\u1e39\u1e3b\u1e3d\u1e3f\u1e41\u1e43\u1e45\u1e47\u1e49\u1e4b\u1e4d\u1e4f\u1e51\u1e53\u1e55\u1e57\u1e59\u1e5b\u1e5d\u1e5f\u1e61\u1e63\u1e65\u1e67\u1e69\u1e6b\u1e6d\u1e6f\u1e71\u1e73\u1e75\u1e77\u1e79\u1e7b\u1e7d\u1e7f\u1e81\u1e83\u1e85\u1e87\u1e89\u1e8b\u1e8d\u1e8f\u1e91\u1e93\u1e95-\u1e9d\u1e9f\u1ea1\u1ea3\u1ea5\u1ea7\u1ea9\u1eab\u1ead\u1eaf\u1eb1\u1eb3\u1eb5\u1eb7\u1eb9\u1ebb\u1ebd\u1ebf\u1ec1\u1ec3\u1ec5\u1ec7\u1ec9\u1ecb\u1ecd\u1ecf\u1ed1\u1ed3\u1ed5\u1ed7\u1ed9\u1edb\u1edd\u1edf\u1ee1\u1ee3\u1ee5\u1ee7\u1ee9\u1eeb\u1eed\u1eef\u1ef1\u1ef3\u1ef5\u1ef7\u1ef9\u1efb\u1efd\u1eff-\u1f07\u1f10-\u1f15\u1f20-\u1f27\u1f30-\u1f37\u1f40-\u1f45\u1f50-\u1f57\u1f60-\u1f67\u1f70-\u1f7d\u1f80-\u1f87\u1f90-\u1f97\u1fa0-\u1fa7\u1fb0-\u1fb4\u1fb6\u1fb7\u1fbe\u1fc2-\u1fc4\u1fc6\u1fc7\u1fd0-\u1fd3\u1fd6\u1fd7\u1fe0-\u1fe7\u1ff2-\u1ff4\u1ff6\u1ff7\u210a\u210e\u210f\u2113\u212f\u2134\u2139\u213c\u213d\u2146-\u2149\u214e\u2184\u2c30-\u2c5e\u2c61\u2c65\u2c66\u2c68\u2c6a\u2c6c\u2c71\u2c73\u2c74\u2c76-\u2c7c\u2c81\u2c83\u2c85\u2c87\u2c89\u2c8b\u2c8d\u2c8f\u2c91\u2c93\u2c95\u2c97\u2c99\u2c9b\u2c9d\u2c9f\u2ca1\u2ca3\u2ca5\u2ca7\u2ca9\u2cab\u2cad\u2caf\u2cb1\u2cb3\u2cb5\u2cb7\u2cb9\u2cbb\u2cbd\u2cbf\u2cc1\u2cc3\u2cc5\u2cc7\u2cc9\u2ccb\u2ccd\u2ccf\u2cd1\u2cd3\u2cd5\u2cd7\u2cd9\u2cdb\u2cdd\u2cdf\u2ce1\u2ce3\u2ce4\u2cec\u2cee\u2d00-\u2d25\ua641\ua643\ua645\ua647\ua649\ua64b\ua64d\ua64f\ua651\ua653\ua655\ua657\ua659\ua65b\ua65d\ua65f\ua661\ua663\ua665\ua667\ua669\ua66b\ua66d\ua681\ua683\ua685\ua687\ua689\ua68b\ua68d\ua68f\ua691\ua693\ua695\ua697\ua723\ua725\ua727\ua729\ua72b\ua72d\ua72f-\ua731\ua733\ua735\ua737\ua739\ua73b\ua73d\ua73f\ua741\ua743\ua745\ua747\ua749\ua74b\ua74d\ua74f\ua751\ua753\ua755\ua757\ua759\ua75b\ua75d\ua75f\ua761\ua763\ua765\ua767\ua769\ua76b\ua76d\ua76f\ua771-\ua778\ua77a\ua77c\ua77f\ua781\ua783\ua785\ua787\ua78c\ua78e\ua791\ua7a1\ua7a3\ua7a5\ua7a7\ua7a9\ua7fa\ufb00-\ufb06\ufb13-\ufb17\uff41-\uff5a]',
      Lt: '[\u01c5\u01c8\u01cb\u01f2\u1f88-\u1f8f\u1f98-\u1f9f\u1fa8-\u1faf\u1fbc\u1fcc\u1ffc]',
      Lm: '[\u02b0-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0374\u037a\u0559\u0640\u06e5\u06e6\u07f4\u07f5\u07fa\u081a\u0824\u0828\u0971\u0e46\u0ec6\u10fc\u17d7\u1843\u1aa7\u1c78-\u1c7d\u1d2c-\u1d61\u1d78\u1d9b-\u1dbf\u2071\u207f\u2090-\u209c\u2c7d\u2d6f\u2e2f\u3005\u3031-\u3035\u303b\u309d\u309e\u30fc-\u30fe\ua015\ua4f8-\ua4fd\ua60c\ua67f\ua717-\ua71f\ua770\ua788\ua9cf\uaa70\uaadd\uff70\uff9e\uff9f]',
      Lo: '[\u01bb\u01c0-\u01c3\u0294\u05d0-\u05ea\u05f0-\u05f2\u0620-\u063f\u0641-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u0800-\u0815\u0840-\u0858\u0904-\u0939\u093d\u0950\u0958-\u0961\u0972-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e45\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0edc\u0edd\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10d0-\u10fa\u1100-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17dc\u1820-\u1842\u1844-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bc0-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c77\u1ce9-\u1cec\u1cee-\u1cf1\u2135-\u2138\u2d30-\u2d65\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3006\u303c\u3041-\u3096\u309f\u30a1-\u30fa\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcb\ua000-\ua014\ua016-\ua48c\ua4d0-\ua4f7\ua500-\ua60b\ua610-\ua61f\ua62a\ua62b\ua66e\ua6a0-\ua6e5\ua7fb-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa6f\uaa71-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb\uaadc\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff66-\uff6f\uff71-\uff9d\uffa0-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]',
      Mn: '[\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0900-\u0902\u093a\u093c\u0941-\u0948\u094d\u0951-\u0957\u0962\u0963\u0981\u09bc\u09c1-\u09c4\u09cd\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b62\u0b63\u0b82\u0bc0\u0bcd\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc6\u0ccc\u0ccd\u0ce2\u0ce3\u0d41-\u0d44\u0d4d\u0d62\u0d63\u0dca\u0dd2-\u0dd4\u0dd6\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1be6\u1be8\u1be9\u1bed\u1bef-\u1bf1\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfc-\u1dff\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\ufb1e\ufe00-\ufe0f\ufe20-\ufe26]',
      Me: '[\u0488\u0489\u20dd-\u20e0\u20e2-\u20e4\ua670-\ua672]',
      Mc: '[\u0903\u093b\u093e-\u0940\u0949-\u094c\u094e\u094f\u0982\u0983\u09be-\u09c0\u09c7\u09c8\u09cb\u09cc\u09d7\u0a03\u0a3e-\u0a40\u0a83\u0abe-\u0ac0\u0ac9\u0acb\u0acc\u0b02\u0b03\u0b3e\u0b40\u0b47\u0b48\u0b4b\u0b4c\u0b57\u0bbe\u0bbf\u0bc1\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcc\u0bd7\u0c01-\u0c03\u0c41-\u0c44\u0c82\u0c83\u0cbe\u0cc0-\u0cc4\u0cc7\u0cc8\u0cca\u0ccb\u0cd5\u0cd6\u0d02\u0d03\u0d3e-\u0d40\u0d46-\u0d48\u0d4a-\u0d4c\u0d57\u0d82\u0d83\u0dcf-\u0dd1\u0dd8-\u0ddf\u0df2\u0df3\u0f3e\u0f3f\u0f7f\u102b\u102c\u1031\u1038\u103b\u103c\u1056\u1057\u1062-\u1064\u1067-\u106d\u1083\u1084\u1087-\u108c\u108f\u109a-\u109c\u17b6\u17be-\u17c5\u17c7\u17c8\u1923-\u1926\u1929-\u192b\u1930\u1931\u1933-\u1938\u19b0-\u19c0\u19c8\u19c9\u1a19-\u1a1b\u1a55\u1a57\u1a61\u1a63\u1a64\u1a6d-\u1a72\u1b04\u1b35\u1b3b\u1b3d-\u1b41\u1b43\u1b44\u1b82\u1ba1\u1ba6\u1ba7\u1baa\u1be7\u1bea-\u1bec\u1bee\u1bf2\u1bf3\u1c24-\u1c2b\u1c34\u1c35\u1ce1\u1cf2\ua823\ua824\ua827\ua880\ua881\ua8b4-\ua8c3\ua952\ua953\ua983\ua9b4\ua9b5\ua9ba\ua9bb\ua9bd-\ua9c0\uaa2f\uaa30\uaa33\uaa34\uaa4d\uaa7b\uabe3\uabe4\uabe6\uabe7\uabe9\uabea\uabec]',
      Nd: '[\u0030-\u0039\u0660-\u0669\u06f0-\u06f9\u07c0-\u07c9\u0966-\u096f\u09e6-\u09ef\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be6-\u0bef\u0c66-\u0c6f\u0ce6-\u0cef\u0d66-\u0d6f\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29\u1040-\u1049\u1090-\u1099\u17e0-\u17e9\u1810-\u1819\u1946-\u194f\u19d0-\u19d9\u1a80-\u1a89\u1a90-\u1a99\u1b50-\u1b59\u1bb0-\u1bb9\u1c40-\u1c49\u1c50-\u1c59\ua620-\ua629\ua8d0-\ua8d9\ua900-\ua909\ua9d0-\ua9d9\uaa50-\uaa59\uabf0-\uabf9\uff10-\uff19]',
      Nl: '[\u16ee-\u16f0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303a\ua6e6-\ua6ef]',
      No: '[\u00b2\u00b3\u00b9\u00bc-\u00be\u09f4-\u09f9\u0b72-\u0b77\u0bf0-\u0bf2\u0c78-\u0c7e\u0d70-\u0d75\u0f2a-\u0f33\u1369-\u137c\u17f0-\u17f9\u19da\u2070\u2074-\u2079\u2080-\u2089\u2150-\u215f\u2189\u2460-\u249b\u24ea-\u24ff\u2776-\u2793\u2cfd\u3192-\u3195\u3220-\u3229\u3251-\u325f\u3280-\u3289\u32b1-\u32bf\ua830-\ua835]',
      Zs: '[\u0020\u00a0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000]',
      Zl: '[\u2028]',
      Zp: '[\u2029]',
      Cc: '[\u0000-\u001f\u007f-\u009f]',
      Cf: '[\u00ad\u0600-\u0603\u06dd\u070f\u17b4\u17b5\u200b-\u200f\u202a-\u202e\u2060-\u2064\u206a-\u206f\ufeff\ufff9-\ufffb]',
      Cs: '[\ud800-\udfff]',
      Co: '[\ue000-\uf8ff]',
      Ps: '[\u0028\u005b\u007b\u0f3a\u0f3c\u169b\u201a\u201e\u2045\u207d\u208d\u2329\u2768\u276a\u276c\u276e\u2770\u2772\u2774\u27c5\u27e6\u27e8\u27ea\u27ec\u27ee\u2983\u2985\u2987\u2989\u298b\u298d\u298f\u2991\u2993\u2995\u2997\u29d8\u29da\u29fc\u2e22\u2e24\u2e26\u2e28\u3008\u300a\u300c\u300e\u3010\u3014\u3016\u3018\u301a\u301d\ufd3e\ufe17\ufe35\ufe37\ufe39\ufe3b\ufe3d\ufe3f\ufe41\ufe43\ufe47\ufe59\ufe5b\ufe5d\uff08\uff3b\uff5b\uff5f\uff62]',
      Pd: '[\u002d\u058a\u05be\u1400\u1806\u2010-\u2015\u2e17\u2e1a\u301c\u3030\u30a0\ufe31\ufe32\ufe58\ufe63\uff0d]',
      Pc: '[\u005f\u203f\u2040\u2054\ufe33\ufe34\ufe4d-\ufe4f\uff3f]',
      Pe: '[\u0029\u005d\u007d\u0f3b\u0f3d\u169c\u2046\u207e\u208e\u232a\u2769\u276b\u276d\u276f\u2771\u2773\u2775\u27c6\u27e7\u27e9\u27eb\u27ed\u27ef\u2984\u2986\u2988\u298a\u298c\u298e\u2990\u2992\u2994\u2996\u2998\u29d9\u29db\u29fd\u2e23\u2e25\u2e27\u2e29\u3009\u300b\u300d\u300f\u3011\u3015\u3017\u3019\u301b\u301e\u301f\ufd3f\ufe18\ufe36\ufe38\ufe3a\ufe3c\ufe3e\ufe40\ufe42\ufe44\ufe48\ufe5a\ufe5c\ufe5e\uff09\uff3d\uff5d\uff60\uff63]',
      Sm: '[\u002b\u003c-\u003e\u007c\u007e\u00ac\u00b1\u00d7\u00f7\u03f6\u0606-\u0608\u2044\u2052\u207a-\u207c\u208a-\u208c\u2118\u2140-\u2144\u214b\u2190-\u2194\u219a\u219b\u21a0\u21a3\u21a6\u21ae\u21ce\u21cf\u21d2\u21d4\u21f4-\u22ff\u2308-\u230b\u2320\u2321\u237c\u239b-\u23b3\u23dc-\u23e1\u25b7\u25c1\u25f8-\u25ff\u266f\u27c0-\u27c4\u27c7-\u27ca\u27cc\u27ce-\u27e5\u27f0-\u27ff\u2900-\u2982\u2999-\u29d7\u29dc-\u29fb\u29fe-\u2aff\u2b30-\u2b44\u2b47-\u2b4c\ufb29\ufe62\ufe64-\ufe66\uff0b\uff1c-\uff1e\uff5c\uff5e\uffe2\uffe9-\uffec]',
      Po: '[\u0021-\u0023\u0025-\u0027\u002a\u002c\u002e\u002f\u003a\u003b\u003f\u0040\u005c\u00a1\u00b7\u00bf\u037e\u0387\u055a-\u055f\u0589\u05c0\u05c3\u05c6\u05f3\u05f4\u0609\u060a\u060c\u060d\u061b\u061e\u061f\u066a-\u066d\u06d4\u0700-\u070d\u07f7-\u07f9\u0830-\u083e\u085e\u0964\u0965\u0970\u0df4\u0e4f\u0e5a\u0e5b\u0f04-\u0f12\u0f85\u0fd0-\u0fd4\u0fd9\u0fda\u104a-\u104f\u10fb\u1361-\u1368\u166d\u166e\u16eb-\u16ed\u1735\u1736\u17d4-\u17d6\u17d8-\u17da\u1800-\u1805\u1807-\u180a\u1944\u1945\u1a1e\u1a1f\u1aa0-\u1aa6\u1aa8-\u1aad\u1b5a-\u1b60\u1bfc-\u1bff\u1c3b-\u1c3f\u1c7e\u1c7f\u1cd3\u2016\u2017\u2020-\u2027\u2030-\u2038\u203b-\u203e\u2041-\u2043\u2047-\u2051\u2053\u2055-\u205e\u2cf9-\u2cfc\u2cfe\u2cff\u2d70\u2e00\u2e01\u2e06-\u2e08\u2e0b\u2e0e-\u2e16\u2e18\u2e19\u2e1b\u2e1e\u2e1f\u2e2a-\u2e2e\u2e30\u2e31\u3001-\u3003\u303d\u30fb\ua4fe\ua4ff\ua60d-\ua60f\ua673\ua67e\ua6f2-\ua6f7\ua874-\ua877\ua8ce\ua8cf\ua8f8-\ua8fa\ua92e\ua92f\ua95f\ua9c1-\ua9cd\ua9de\ua9df\uaa5c-\uaa5f\uaade\uaadf\uabeb\ufe10-\ufe16\ufe19\ufe30\ufe45\ufe46\ufe49-\ufe4c\ufe50-\ufe52\ufe54-\ufe57\ufe5f-\ufe61\ufe68\ufe6a\ufe6b\uff01-\uff03\uff05-\uff07\uff0a\uff0c\uff0e\uff0f\uff1a\uff1b\uff1f\uff20\uff3c\uff61\uff64\uff65]',
      Sk: '[\u005e\u0060\u00a8\u00af\u00b4\u00b8\u02c2-\u02c5\u02d2-\u02df\u02e5-\u02eb\u02ed\u02ef-\u02ff\u0375\u0384\u0385\u1fbd\u1fbf-\u1fc1\u1fcd-\u1fcf\u1fdd-\u1fdf\u1fed-\u1fef\u1ffd\u1ffe\u309b\u309c\ua700-\ua716\ua720\ua721\ua789\ua78a\ufbb2-\ufbc1\uff3e\uff40\uffe3]',
      Sc: '[\u0024\u00a2-\u00a5\u060b\u09f2\u09f3\u09fb\u0af1\u0bf9\u0e3f\u17db\u20a0-\u20b9\ua838\ufdfc\ufe69\uff04\uffe0\uffe1\uffe5\uffe6]',
      Pi: '[\u00ab\u2018\u201b\u201c\u201f\u2039\u2e02\u2e04\u2e09\u2e0c\u2e1c\u2e20]',
      So: '[\u00a6\u00a7\u00a9\u00ae\u00b0\u00b6\u0482\u060e\u060f\u06de\u06e9\u06fd\u06fe\u07f6\u09fa\u0b70\u0bf3-\u0bf8\u0bfa\u0c7f\u0d79\u0f01-\u0f03\u0f13-\u0f17\u0f1a-\u0f1f\u0f34\u0f36\u0f38\u0fbe-\u0fc5\u0fc7-\u0fcc\u0fce\u0fcf\u0fd5-\u0fd8\u109e\u109f\u1360\u1390-\u1399\u1940\u19de-\u19ff\u1b61-\u1b6a\u1b74-\u1b7c\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116\u2117\u211e-\u2123\u2125\u2127\u2129\u212e\u213a\u213b\u214a\u214c\u214d\u214f\u2195-\u2199\u219c-\u219f\u21a1\u21a2\u21a4\u21a5\u21a7-\u21ad\u21af-\u21cd\u21d0\u21d1\u21d3\u21d5-\u21f3\u2300-\u2307\u230c-\u231f\u2322-\u2328\u232b-\u237b\u237d-\u239a\u23b4-\u23db\u23e2-\u23f3\u2400-\u2426\u2440-\u244a\u249c-\u24e9\u2500-\u25b6\u25b8-\u25c0\u25c2-\u25f7\u2600-\u266e\u2670-\u26ff\u2701-\u2767\u2794-\u27bf\u2800-\u28ff\u2b00-\u2b2f\u2b45\u2b46\u2b50-\u2b59\u2ce5-\u2cea\u2e80-\u2e99\u2e9b-\u2ef3\u2f00-\u2fd5\u2ff0-\u2ffb\u3004\u3012\u3013\u3020\u3036\u3037\u303e\u303f\u3190\u3191\u3196-\u319f\u31c0-\u31e3\u3200-\u321e\u322a-\u3250\u3260-\u327f\u328a-\u32b0\u32c0-\u32fe\u3300-\u33ff\u4dc0-\u4dff\ua490-\ua4c6\ua828-\ua82b\ua836\ua837\ua839\uaa77-\uaa79\ufdfd\uffe4\uffe8\uffed\uffee\ufffc\ufffd]',
      Pf: '[\u00bb\u2019\u201d\u203a\u2e03\u2e05\u2e0a\u2e0d\u2e1d\u2e21]',
    };
    /* Also supports the general category (only the first letter) */
    let firstLetters = {};
    for (let p in unicodeCategories) {
      if (firstLetters[p[0]]) {
        firstLetters[p[0]] =
            unicodeCategories[p].substring(0, unicodeCategories[p].length-1) +
            firstLetters[p[0]].substring(1);
      } else {
        firstLetters[p[0]] = unicodeCategories[p];
      }
    }
    for (let p in firstLetters)
      unicodeCategories[p] = firstLetters[p];

    /* Gets a regex written in a dialect that supports unicode categories and
       translates it to a dialect supported by JavaScript. */
    return function(regexpString) {
      let modifiers = '';
      let returnRexExp = false;
      if (regexpString instanceof RegExp) {
        modifiers = (regexpString.global ? 'g' : '') +
                    (regexpString.ignoreCase ? 'i' : '') +
                    (regexpString.multiline ? 'm' : '');
        regexpString = regexpString.source;
        returnRexExp = true;
      }
      regexpString = regexpString.replace(/\\p\{(..?)\}/g, function(match, group) {
        return unicodeCategories[group] || match;
      });
      if (!returnRexExp)
        return regexpString;
      return new RegExp(regexpString, modifiers);
    };
  })(),
};

if (typeof module !== 'undefined' && module.exports)
  module.exports = Regexes;
