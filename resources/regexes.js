'use strict';

// Node loading shenanigans.  'var' lets other files require() this file inside of
// Node and put Regexes as a global without conflicting when redefining.
/* eslint-disable no-var */
var Regexes = {
/* eslint-enable */

  // fields: source, id, ability, target, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#14-networkstartscasting
  startsUsing: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'startsUsing', ['timestamp', 'source', 'id', 'ability', 'target', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 14:' +
      Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':';

    if (f.source || f.id || f.target || capture)
      str += Regexes.maybeCapture(capture, 'source', f.source, '.*?') + ' starts using ';

    if (f.ability || f.target || capture)
      str += Regexes.maybeCapture(capture, 'ability', f.ability, '.*?') + ' on ';

    if (f.target || capture)
      str += Regexes.maybeCapture(capture, 'target', f.target, '.*?') + '\\.';

    return Regexes.parse(str);
  },

  // fields: sourceId, source, id, ability, targetId, target, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
  ability: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'ability', ['timestamp', 'source', 'sourceId', 'id', 'ability', 'targetId', 'target', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 1[56]:' + Regexes.maybeCapture(capture, 'sourceId', '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':';

    if (f.id || f.ability || f.target || f.targetId || capture)
      str += Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':';

    if (f.ability || f.target || f.targetId || capture)
      str += Regexes.maybeCapture(capture, 'ability', f.ability, '[^:]*?') + ':';

    if (f.target || f.targetId || capture)
      str += Regexes.maybeCapture(capture, 'targetId', '\\y{ObjectId}') + ':';

    if (f.target || capture)
      str += Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':';

    return Regexes.parse(str);
  },

  // fields: sourceId, source, id, ability, targetId, target, flags, x, y, z, heading, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
  abilityFull: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'abilityFull', [
      'timestamp',
      'sourceId',
      'source',
      'id',
      'ability',
      'targetId',
      'target',
      'flags',
      'flag0',
      'flag1',
      'flag2',
      'flag3',
      'flag4',
      'flag5',
      'flag6',
      'flag7',
      'flag8',
      'flag9',
      'flag10',
      'flag11',
      'flag12',
      'flag13',
      'flag14',
      'targetHp',
      'targetMaxHp',
      'targetMp',
      'targetMaxMp',
      'targetX',
      'targetY',
      'targetZ',
      'targetHeading',
      'hp',
      'maxHp',
      'mp',
      'maxMp',
      'x',
      'y',
      'z',
      'heading',
      'capture',
    ]);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 1[56]:' +
      Regexes.maybeCapture(capture, 'sourceId', f.sourceId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':' +
      Regexes.maybeCapture(capture, 'ability', f.ability, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flags', f.flags, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag0', f.flag0, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag1', f.flag1, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag2', f.flag2, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag3', f.flag3, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag4', f.flag4, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag5', f.flag5, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag6', f.flag6, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag7', f.flag7, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag8', f.flag8, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag9', f.flag9, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag10', f.flag10, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag11', f.flag11, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag12', f.flag12, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag13', f.flag13, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'flag14', f.flag13, '[^:]*?') + ':' +
      Regexes.optional(Regexes.maybeCapture(capture, 'targetHp', f.targetHp, '\\y{Float}')) + ':' +
      Regexes.optional(Regexes.maybeCapture(capture, 'targetMaxHp', f.targetMaxHp, '\\y{Float}')) + ':' +
      Regexes.optional(Regexes.maybeCapture(capture, 'targetMp', f.targetMp, '\\y{Float}')) + ':' +
      Regexes.optional(Regexes.maybeCapture(capture, 'targetMaxMp', f.targetMaxMp, '\\y{Float}')) + ':' +
      Regexes.optional('\\y{Float}') + ':' + // Target TP
      Regexes.optional('\\y{Float}') + ':' + // Target Max TP
      Regexes.optional(Regexes.maybeCapture(capture, 'targetX', f.targetX, '\\y{Float}')) + ':' +
      Regexes.optional(Regexes.maybeCapture(capture, 'targetY', f.targetY, '\\y{Float}')) + ':' +
      Regexes.optional(Regexes.maybeCapture(capture, 'targetZ', f.targetZ, '\\y{Float}')) + ':' +
      Regexes.optional(Regexes.maybeCapture(capture, 'targetHeading', f.targetHeading, '\\y{Float}')) + ':' +
      Regexes.maybeCapture(capture, 'hp', f.hp, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'maxHp', f.maxHp, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'mp', f.mp, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'maxMp', f.maxMp, '\\y{Float}') + ':' +
      '\\y{Float}:' + // Source TP
      '\\y{Float}:' + // Source Max TP
      Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'heading', f.heading, '\\y{Float}') + ':' +
      '.*?$'; // Unknown last field
    return Regexes.parse(str);
  },

  // fields: targetId, target, id, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1b-networktargeticon-head-markers
  headMarker: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'headMarker', ['timestamp', 'targetId', 'target', 'id', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 1B:' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':....:....:' +
      Regexes.maybeCapture(capture, 'id', f.id, '....') + ':';
    return Regexes.parse(str);
  },

  // fields: name, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
  addedCombatant: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'addedCombatant', ['timestamp', 'name', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 03:\\y{ObjectId}:Added new combatant ' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.';
    return Regexes.parse(str);
  },

  // fields: id, name, hp, x, y, z, npcId, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
  addedCombatantFull: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'addedCombatantFull', [
      'timestamp',
      'id',
      'name',
      'job',
      'level',
      'hp',
      'x',
      'y',
      'z',
      'npcId',
      'capture',
    ]);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 03:' + Regexes.maybeCapture(capture, 'id', f.id, '\\y{ObjectId}') +
      ':Added new combatant ' + Regexes.maybeCapture(capture, 'name', f.name, '[^:]*?') +
      '\\. {2}Job: ' + Regexes.maybeCapture(capture, 'job', f.job, '[^:]*?') +
      ' Level: ' + Regexes.maybeCapture(capture, 'level', f.level, '[^:]*?') +
      ' Max HP: ' + Regexes.maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\.' +
      '.*?Pos: \\(' +
      Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ',' +
      Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ',' +
      Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + '\\)' +
      '(?: \\(' + Regexes.maybeCapture(capture, 'npcId', f.npcId, '.*?') + '\\))?\\.';
    return Regexes.parse(str);
  },

  // fields: id, name, hp, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#04-removecombatant
  removingCombatant: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'removingCombatant', [
      'timestamp',
      'id',
      'name',
      'hp',
      'capture',
      'x',
      'y',
      'z',
    ]);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 04:' + Regexes.maybeCapture(capture, 'id', '\\y{ObjectId}') +
      ':Removing combatant ' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.' +
      '.*?Max HP: ' + Regexes.maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\.' +
      Regexes.optional('.*?Pos: \\(' +
      Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ',' +
      Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ',' +
      Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + '\\)');
    return Regexes.parse(str);
  },

  // fields: targetId, target, effect, source, duration, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1a-networkbuff
  gainsEffect: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'gainsEffect', ['timestamp', 'targetId', 'target', 'effect', 'source', 'duration', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 1A:' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
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
  // fields: targetId, target, job, hp, maxHp, mp, maxMp, x, y, z, heading,
  //         data0, data1, data2, data3, data4
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#26-networkstatuseffects
  statusEffectExplicit: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'statusEffectExplicit', [
      'timestamp',
      'targetId',
      'target',
      'job',
      'hp',
      'maxHp',
      'mp',
      'maxMp',
      'x',
      'y',
      'z',
      'heading',
      'data0',
      'data1',
      'data2',
      'data3',
      'data4',
      'capture',
    ]);
    let capture = Regexes.trueIfUndefined(f.capture);

    let kField = '.*?:';

    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 26:' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':' +
      '[0-9A-F]{0,6}' + Regexes.maybeCapture(capture, 'job', f.job, '[0-9A-F]{0,2}') + ':' +
      Regexes.maybeCapture(capture, 'hp', f.hp, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'maxHp', f.maxHp, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'mp', f.mp, '\\y{Float}') + ':' +
      Regexes.maybeCapture(capture, 'maxMp', f.maxMp, '\\y{Float}') + ':' +
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

  // fields: targetId, target, effect, source, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1e-networkbuffremove
  losesEffect: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'losesEffect', ['timestamp', 'targetId', 'target', 'effect', 'source', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 1E:' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
      ' loses the effect of ' +
      Regexes.maybeCapture(capture, 'effect', f.effect, '.*?') +
      ' from ' +
      Regexes.maybeCapture(capture, 'source', f.source, '.*?') + '\\.';
    return Regexes.parse(str);
  },

  // fields: source, sourceId, target, targetId, id, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#23-networktether
  tether: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'tether', ['timestamp', 'source', 'sourceId', 'target', 'targetId', 'id', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 23:' +
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
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#19-networkdeath
  wasDefeated: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'wasDefeated', ['timestamp', 'target', 'source', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 19:' +
      Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
      ' was defeated by ' +
      Regexes.maybeCapture(capture, 'source', f.source, '.*?') + '\\.';
    return Regexes.parse(str);
  },

  // fields: name, hp, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0d-combatanthp
  hasHP: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'hasHP', ['timestamp', 'name', 'hp', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 0D:' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') +
      ' HP at ' +
      Regexes.maybeCapture(capture, 'hp', f.hp, '\\d+') + '%';
    return Regexes.parse(str);
  },

  // fields: code, line, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
  echo: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'echo', ['timestamp', 'code', 'line', 'capture']);
    return Regexes.gameLog({
      line: f.line,
      capture: f.capture,
      code: '0038',
    });
  },

  // fields: code, line, name, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
  dialog: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'dialog', ['timestamp', 'code', 'line', 'name', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 00:' +
      Regexes.maybeCapture(capture, 'code', '0044') + ':' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';
    return Regexes.parse(str);
  },

  // fields: code, line, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
  message: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'message', ['timestamp', 'code', 'line', 'capture']);
    return Regexes.gameLog({
      line: f.line,
      capture: f.capture,
      code: '0839',
    });
  },

  // fields: code, line, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
  gameLog: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'gameLog', ['timestamp', 'code', 'line', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 00:' +
      Regexes.maybeCapture(capture, 'code', f.code, '....') + ':' +
      Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';
    return Regexes.parse(str);
  },

  // fields: code, name, line, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
  // Some game log lines have names in them, but not all.  All network log lines for these
  // have empty fields, but these get dropped by the ACT FFXV plugin.
  gameNameLog: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'gameNameLog', ['timestamp', 'code', 'name', 'line', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 00:' +
      Regexes.maybeCapture(capture, 'code', f.code, '....') + ':' +
      Regexes.maybeCapture(capture, 'name', f.name, '[^:]*') + ':' +
      Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';
    return Regexes.parse(str);
  },

  // fields: job, strength, dexterity, vitality, intelligence, mind, piety, attackPower,
  //         directHit, criticalHit, attackMagicPotency, healMagicPotency, determination,
  //         skillSpeed, spellSpeed, tenacity, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0c-playerstats
  statChange: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'statChange', [
      'timestamp',
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
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 0C:Player Stats: ' +
      Regexes.maybeCapture(capture, 'job', f.job, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'strength', f.strength, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'dexterity', f.dexterity, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'vitality', f.vitality, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'intelligence', f.intelligence, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'mind', f.mind, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'piety', f.piety, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'attackPower', f.attackPower, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'directHit', f.directHit, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'criticalHit', f.criticalHit, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'attackMagicPotency', f.attackMagicPotency, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'healMagicPotency', f.healMagicPotency, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'determination', f.determination, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'skillSpeed', f.skillSpeed, '\\d+') + ':' +
      Regexes.maybeCapture(capture, 'spellSpeed', f.spellSpeed, '\\d+') +
      ':0:' +
      Regexes.maybeCapture(capture, 'tenacity', f.tenacity, '\\d+');
    return Regexes.parse(str);
  },

  // fields: name, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#01-changezone
  changeZone: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'statChange', ['timestamp', 'name', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 01:Changed Zone to ' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.';
    return Regexes.parse(str);
  },

  // fields: instance, command, data0, data1, data2, data3
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#21-network6d-actor-control-lines
  network6d: (f) => {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'network6d',
        ['timestamp', 'instance', 'command', 'data0', 'data1', 'data2', 'data3', 'capture']);
    let capture = Regexes.trueIfUndefined(f.capture);
    let str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 21:' +
      Regexes.maybeCapture(capture, 'instance', f.instance, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'command', f.command, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'data0', f.data0, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'data1', f.data1, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'data2', f.data2, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'data3', f.data3, '.*?') + '$';
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
    if (name.includes('>'))
      console.error('"' + name + '" contains ">".');
    if (name.includes('<'))
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
      NetTimestamp: '.{33}',
      NetField: '(?:[^|]*\\|)',
      LogType: '[0-9A-Fa-f]{2}',
      AbilityCode: '[0-9A-Fa-f]{1,8}',
      ObjectId: '[0-9A-F]{8}',
      Name: '\\S+(?: \\S+)?',
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

  // Like Regex.parse, but force global flag.
  parseGlobal: (regexpString) => {
    let regex = Regexes.parse(regexpString);
    let modifiers = 'gi';
    modifiers += (regexpString.multiline ? 'm' : '');
    return new RegExp(regex.source, modifiers);
  },

  trueIfUndefined: (value) => {
    if (typeof (value) === 'undefined')
      return true;
    return !!value;
  },

  validateParams: (f, funcName, params) => {
    if (f === null)
      return;
    if (typeof f !== 'object')
      return;
    let keys = Object.keys(f);
    for (let k = 0; k < keys.length; ++k) {
      let key = keys[k];
      if (!params.includes(key)) {
        throw new Error(`${funcName}: invalid parameter '${key}'.  ` +
            `Valid params: ${JSON.stringify(params)}`);
      }
    }
  },
};

if (typeof module !== 'undefined' && module.exports)
  module.exports = Regexes;
