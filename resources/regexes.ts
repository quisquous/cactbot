export type Params<T extends string> =
  Partial<Record<T, string | string[]> &
  { 'timestamp': string, 'capture': boolean }>;

namespace Regexes {

  const startsUsingParams = ['source', 'id', 'ability', 'target'] as const;
  /**
   * fields: source, id, ability, target, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#14-networkstartscasting
   */
  export function startsUsing(f: Params<typeof startsUsingParams[number]>): RegExp {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'startsUsing', startsUsingParams);
    const capture = trueIfUndefined(f.capture);
    let str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 14:' +
      maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':';

    if (f.source || f.id || f.target || capture)
      str += maybeCapture(capture, 'source', f.source, '.*?') + ' starts using ';

    if (f.ability || f.target || capture)
      str += maybeCapture(capture, 'ability', f.ability, '.*?') + ' on ';

    if (f.target || capture)
      str += maybeCapture(capture, 'target', f.target, '.*?') + '\\.';

    return parse(str);
  }

  const abilityParams = ['source', 'sourceId', 'id', 'ability', 'targetId', 'target'] as const;
  /**
   * fields: sourceId, source, id, ability, targetId, target, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
   */
  export function ability(f: Params<typeof abilityParams[number]>): RegExp {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'ability', abilityParams);
    const capture = trueIfUndefined(f.capture);
    let str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 1[56]:' + maybeCapture(capture, 'sourceId', '\\y{ObjectId}') + ':' +
      maybeCapture(capture, 'source', f.source, '[^:]*?') + ':';

    if (f.id || f.ability || f.target || f.targetId || capture)
      str += maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':';

    if (f.ability || f.target || f.targetId || capture)
      str += maybeCapture(capture, 'ability', f.ability, '[^:]*?') + ':';

    if (f.target || f.targetId || capture)
      str += maybeCapture(capture, 'targetId', '\\y{ObjectId}') + ':';

    if (f.target || capture)
      str += maybeCapture(capture, 'target', f.target, '[^:]*?') + ':';

    return parse(str);
  }

  const abilityFullParams = [
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
  ] as const;
  /**
   * fields: sourceId, source, id, ability, targetId, target, flags, x, y, z, heading, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
   */
  export function abilityFull(f: Params<typeof abilityFullParams[number]>): RegExp {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'abilityFull', abilityFullParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 1[56]:' +
      maybeCapture(capture, 'sourceId', f.sourceId, '\\y{ObjectId}') + ':' +
      maybeCapture(capture, 'source', f.source, '[^:]*?') + ':' +
      maybeCapture(capture, 'id', f.id, '\\y{AbilityCode}') + ':' +
      maybeCapture(capture, 'ability', f.ability, '[^:]*?') + ':' +
      maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      maybeCapture(capture, 'target', f.target, '[^:]*?') + ':' +
      maybeCapture(capture, 'flags', f.flags, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag0', f.flag0, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag1', f.flag1, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag2', f.flag2, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag3', f.flag3, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag4', f.flag4, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag5', f.flag5, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag6', f.flag6, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag7', f.flag7, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag8', f.flag8, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag9', f.flag9, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag10', f.flag10, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag11', f.flag11, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag12', f.flag12, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag13', f.flag13, '[^:]*?') + ':' +
      maybeCapture(capture, 'flag14', f.flag13, '[^:]*?') + ':' +
      optional(maybeCapture(capture, 'targetHp', f.targetHp, '\\y{Float}')) + ':' +
      optional(maybeCapture(capture, 'targetMaxHp', f.targetMaxHp, '\\y{Float}')) + ':' +
      optional(maybeCapture(capture, 'targetMp', f.targetMp, '\\y{Float}')) + ':' +
      optional(maybeCapture(capture, 'targetMaxMp', f.targetMaxMp, '\\y{Float}')) + ':' +
      optional('\\y{Float}') + ':' + // Target TP
      optional('\\y{Float}') + ':' + // Target Max TP
      optional(maybeCapture(capture, 'targetX', f.targetX, '\\y{Float}')) + ':' +
      optional(maybeCapture(capture, 'targetY', f.targetY, '\\y{Float}')) + ':' +
      optional(maybeCapture(capture, 'targetZ', f.targetZ, '\\y{Float}')) + ':' +
      optional(maybeCapture(capture, 'targetHeading', f.targetHeading, '\\y{Float}')) + ':' +
      maybeCapture(capture, 'hp', f.hp, '\\y{Float}') + ':' +
      maybeCapture(capture, 'maxHp', f.maxHp, '\\y{Float}') + ':' +
      maybeCapture(capture, 'mp', f.mp, '\\y{Float}') + ':' +
      maybeCapture(capture, 'maxMp', f.maxMp, '\\y{Float}') + ':' +
      '\\y{Float}:' + // Source TP
      '\\y{Float}:' + // Source Max TP
      maybeCapture(capture, 'x', f.x, '\\y{Float}') + ':' +
      maybeCapture(capture, 'y', f.y, '\\y{Float}') + ':' +
      maybeCapture(capture, 'z', f.z, '\\y{Float}') + ':' +
      maybeCapture(capture, 'heading', f.heading, '\\y{Float}') + ':' +
      '.*?$'; // Unknown last field
    return parse(str);
  }

  const headMarkerParams = ['targetId', 'target', 'id'] as const;
  /**
   * fields: targetId, target, id, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1b-networktargeticon-head-markers
   */
  export function headMarker(f: Params<typeof headMarkerParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'headMarker', headMarkerParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 1B:' +
      maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      maybeCapture(capture, 'target', f.target, '[^:]*?') + ':....:....:' +
      maybeCapture(capture, 'id', f.id, '....') + ':';
    return parse(str);
  }

  const addedCombatantParams = ['name'] as const;
  // fields: name, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
  export function addedCombatant(f: Params<typeof addedCombatantParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'addedCombatant', addedCombatantParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 03:\\y{ObjectId}:Added new combatant ' +
      maybeCapture(capture, 'name', f.name, '.*?') + '\\.';
    return parse(str);
  }
const addedCombatantFullParams = [
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
] as const;
  /**
   * fields: id, name, hp, x, y, z, npcId, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
   */
  export function addedCombatantFull(f: Params<typeof addedCombatantFullParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'addedCombatantFull', addedCombatantFullParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 03:' + maybeCapture(capture, 'id', f.id, '\\y{ObjectId}') +
      ':Added new combatant ' + maybeCapture(capture, 'name', f.name, '[^:]*?') +
      '\\. {2}Job: ' + maybeCapture(capture, 'job', f.job, '[^:]*?') +
      ' Level: ' + maybeCapture(capture, 'level', f.level, '[^:]*?') +
      ' Max HP: ' + maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\.' +
      '.*?Pos: \\(' +
      maybeCapture(capture, 'x', f.x, '\\y{Float}') + ',' +
      maybeCapture(capture, 'y', f.y, '\\y{Float}') + ',' +
      maybeCapture(capture, 'z', f.z, '\\y{Float}') + '\\)' +
      '(?: \\(' + maybeCapture(capture, 'npcId', f.npcId, '.*?') + '\\))?\\.';
    return parse(str);
  }
  const removingCombatantParams = [
      'timestamp',
      'id',
      'name',
      'hp',
      'capture',
      'x',
      'y',
      'z',
  ] as const;
  /**
   * fields: id, name, hp, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#04-removecombatant
   */
  export function removingCombatant(f: Params<typeof removingCombatantParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'removingCombatant', removingCombatantParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 04:' + maybeCapture(capture, 'id', '\\y{ObjectId}') +
      ':Removing combatant ' +
      maybeCapture(capture, 'name', f.name, '.*?') + '\\.' +
      '.*?Max HP: ' + maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\.' +
      optional('.*?Pos: \\(' +
      maybeCapture(capture, 'x', f.x, '\\y{Float}') + ',' +
      maybeCapture(capture, 'y', f.y, '\\y{Float}') + ',' +
      maybeCapture(capture, 'z', f.z, '\\y{Float}') + '\\)');
    return parse(str);
  }

  const gainsEffectParams = ['targetId', 'target', 'effect', 'source', 'duration'] as const;
  // fields: targetId, target, effect, source, duration, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1a-networkbuff
  export function gainsEffect(f: Params<typeof gainsEffectParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'gainsEffect', gainsEffectParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 1A:' +
      maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      maybeCapture(capture, 'target', f.target, '.*?') +
      ' gains the effect of ' +
      maybeCapture(capture, 'effect', f.effect, '.*?') +
      ' from ' +
      maybeCapture(capture, 'source', f.source, '.*?') +
      ' for ' +
      maybeCapture(capture, 'duration', f.duration, '\\y{Float}') +
      ' Seconds\\.';
    return parse(str);
  }

  const statusEffectExplicitParams = [
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
  ] as const;
  /**
   * Prefer gainsEffect over this function unless you really need extra data.
   * fields: targetId, target, job, hp, maxHp, mp, maxMp, x, y, z, heading,
   *         data0, data1, data2, data3, data4
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#26-networkstatuseffects
   */
  export function statusEffectExplicit(f: Params<typeof statusEffectExplicitParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'statusEffectExplicit', statusEffectExplicitParams);
    const capture = trueIfUndefined(f.capture);

    const kField = '.*?:';

    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 26:' +
      maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      maybeCapture(capture, 'target', f.target, '[^:]*?') + ':' +
      '[0-9A-F]{0,6}' + maybeCapture(capture, 'job', f.job, '[0-9A-F]{0,2}') + ':' +
      maybeCapture(capture, 'hp', f.hp, '\\y{Float}') + ':' +
      maybeCapture(capture, 'maxHp', f.maxHp, '\\y{Float}') + ':' +
      maybeCapture(capture, 'mp', f.mp, '\\y{Float}') + ':' +
      maybeCapture(capture, 'maxMp', f.maxMp, '\\y{Float}') + ':' +
      kField + // tp lol
      kField + // max tp extra lol
      // x, y, z heading may be blank
      optional(maybeCapture(capture, 'x', f.x, '\\y{Float}')) + ':' +
      optional(maybeCapture(capture, 'y', f.y, '\\y{Float}')) + ':' +
      optional(maybeCapture(capture, 'z', f.z, '\\y{Float}')) + ':' +
      optional(maybeCapture(capture, 'heading', f.heading, '\\y{Float}')) + ':' +
      maybeCapture(capture, 'data0', f.data0, '[^:]*?') + ':' +
      maybeCapture(capture, 'data1', f.data1, '[^:]*?') + ':' +
      // data2, 3, 4 may not exist and the line may terminate.
      optional(maybeCapture(capture, 'data2', f.data2, '[^:]*?') + ':') +
      optional(maybeCapture(capture, 'data3', f.data3, '[^:]*?') + ':') +
      optional(maybeCapture(capture, 'data4', f.data4, '[^:]*?') + ':');
    return parse(str);
  }

  const losesEffectParams = ['targetId', 'target', 'effect', 'source'] as const;
  /**
   * fields: targetId, target, effect, source, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1e-networkbuffremove
   */
  export function losesEffect(f: Params<typeof losesEffectParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'losesEffect', losesEffectParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 1E:' +
      maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      maybeCapture(capture, 'target', f.target, '.*?') +
      ' loses the effect of ' +
      maybeCapture(capture, 'effect', f.effect, '.*?') +
      ' from ' +
      maybeCapture(capture, 'source', f.source, '.*?') + '\\.';
    return parse(str);
  }

  const tetherParams = ['source', 'sourceId', 'target', 'targetId', 'id'] as const;
  /**
   * fields: source, sourceId, target, targetId, id, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#23-networktether
   */
  export function tether(f: Params<typeof tetherParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'tether', tetherParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 23:' +
      maybeCapture(capture, 'sourceId', f.sourceId, '\\y{ObjectId}') + ':' +
      maybeCapture(capture, 'source', f.source, '[^:]*?') + ':' +
      maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      maybeCapture(capture, 'target', f.target, '[^:]*?') +
      ':....:....:' +
      maybeCapture(capture, 'id', f.id, '....') + ':';
    return parse(str);
  }

  const wasDefeatedParams = ['target', 'source'] as const;
  /**
   * 'target' was defeated by 'source'
   * fields: target, source, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#19-networkdeath
   */
  export function wasDefeated(f: Params<typeof wasDefeatedParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'wasDefeated', wasDefeatedParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 19:' +
      maybeCapture(capture, 'target', f.target, '.*?') +
      ' was defeated by ' +
      maybeCapture(capture, 'source', f.source, '.*?') + '\\.';
    return parse(str);
  }

  const hasHPParams = ['name', 'hp'] as const;
  /**
   * fields: name, hp, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0d-combatanthp
   */
  export function hasHP(f: Params<typeof hasHPParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'hasHP', hasHPParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 0D:' +
      maybeCapture(capture, 'name', f.name, '.*?') +
      ' HP at ' +
      maybeCapture(capture, 'hp', f.hp, '\\d+') + '%';
    return parse(str);
  }

  const echoParams = ['code', 'line'] as const;
  /**
   * fields: code, line, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  export function echo(f: Params<typeof echoParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'echo', echoParams);
    return gameLog({
      line: f.line,
      capture: f.capture,
      code: '0038',
    });
  }

  const dialogParams = ['code', 'line', 'name'] as const;
  /**
   * fields: code, line, name, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  export function dialog(f: Params<typeof dialogParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'dialog', dialogParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 00:' +
      maybeCapture(capture, 'code', '0044') + ':' +
      maybeCapture(capture, 'name', f.name, '.*?') + ':' +
      maybeCapture(capture, 'line', f.line, '.*') + '$';
    return parse(str);
  }

  const messageParams = ['code', 'line'] as const;
  /**
   * fields: code, line, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  export function message(f: Params<typeof messageParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'message', messageParams);
    return gameLog({
      line: f.line,
      capture: f.capture,
      code: '0839',
    });
  }

  const gameLogParams = ['code', 'line'] as const;
  /**
   * fields: code, line, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  export function gameLog(f: Params<typeof gameLogParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'gameLog', gameLogParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 00:' +
      maybeCapture(capture, 'code', f.code, '....') + ':' +
      maybeCapture(capture, 'line', f.line, '.*') + '$';
    return parse(str);
  }

  const gameNameLogParams = ['code', 'name', 'line'] as const;
  /**
   * fields: code, name, line, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   * Some game log lines have names in them, but not all.  All network log lines for these
   * have empty fields, but these get dropped by the ACT FFXV plugin.
   */
  export function gameNameLog(f: Params<typeof gameNameLogParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'gameNameLog', gameNameLogParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 00:' +
      maybeCapture(capture, 'code', f.code, '....') + ':' +
      maybeCapture(capture, 'name', f.name, '[^:]*') + ':' +
      maybeCapture(capture, 'line', f.line, '.*') + '$';
    return parse(str);
  }

const statChangeParams = [
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
] as const;
  /**
   * fields: job, strength, dexterity, vitality, intelligence, mind, piety, attackPower,
   *         directHit, criticalHit, attackMagicPotency, healMagicPotency, determination,
   *         skillSpeed, spellSpeed, tenacity, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0c-playerstats
   */
  export function statChange(f: Params<typeof statChangeParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'statChange', statChangeParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 0C:Player Stats: ' +
      maybeCapture(capture, 'job', f.job, '\\d+') + ':' +
      maybeCapture(capture, 'strength', f.strength, '\\d+') + ':' +
      maybeCapture(capture, 'dexterity', f.dexterity, '\\d+') + ':' +
      maybeCapture(capture, 'vitality', f.vitality, '\\d+') + ':' +
      maybeCapture(capture, 'intelligence', f.intelligence, '\\d+') + ':' +
      maybeCapture(capture, 'mind', f.mind, '\\d+') + ':' +
      maybeCapture(capture, 'piety', f.piety, '\\d+') + ':' +
      maybeCapture(capture, 'attackPower', f.attackPower, '\\d+') + ':' +
      maybeCapture(capture, 'directHit', f.directHit, '\\d+') + ':' +
      maybeCapture(capture, 'criticalHit', f.criticalHit, '\\d+') + ':' +
      maybeCapture(capture, 'attackMagicPotency', f.attackMagicPotency, '\\d+') + ':' +
      maybeCapture(capture, 'healMagicPotency', f.healMagicPotency, '\\d+') + ':' +
      maybeCapture(capture, 'determination', f.determination, '\\d+') + ':' +
      maybeCapture(capture, 'skillSpeed', f.skillSpeed, '\\d+') + ':' +
      maybeCapture(capture, 'spellSpeed', f.spellSpeed, '\\d+') +
      ':0:' +
      maybeCapture(capture, 'tenacity', f.tenacity, '\\d+');
    return parse(str);
  }

  const changeZoneParams = ['name'] as const;
  /**
   * fields: name, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#01-changezone
   */
  export function changeZone(f: Params<typeof changeZoneParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'statChange', statChangeParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 01:Changed Zone to ' +
      maybeCapture(capture, 'name', f.name, '.*?') + '\\.';
    return parse(str);
  }

  const network6dParams = ['instance', 'command', 'data0', 'data1', 'data2', 'data3'] as const;
  /**
   * fields: instance, command, data0, data1, data2, data3
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#21-network6d-actor-control-lines
   */
  export function network6d(f: Params<typeof network6dParams[number]>) {
    if (typeof f === 'undefined')
      f = {};
    validateParams(f, 'network6d', network6dParams);
    const capture = trueIfUndefined(f.capture);
    const str = maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 21:' +
      maybeCapture(capture, 'instance', f.instance, '.*?') + ':' +
      maybeCapture(capture, 'command', f.command, '.*?') + ':' +
      maybeCapture(capture, 'data0', f.data0, '.*?') + ':' +
      maybeCapture(capture, 'data1', f.data1, '.*?') + ':' +
      maybeCapture(capture, 'data2', f.data2, '.*?') + ':' +
      maybeCapture(capture, 'data3', f.data3, '.*?') + '$';
    return parse(str);
  }

  type ValidStringOrArray = string | string[];
  /**
   * Helper function for building named capture group
   */
  export function maybeCapture(
      capture: boolean,
      name: string,
      value: string | string[] | undefined,
      defaultValue?: string,
  ): string {
    if (!value)
      value = defaultValue;
    value = anyOf(value as ValidStringOrArray);
    return capture ? namedCapture(name, value) : value;
  }

  export function optional(str: string): string {
    return `(?:${str})?`;
  }

  // Creates a named regex capture group named |name| for the match |value|.
  export function namedCapture(name: string, value: string): string {
    if (name.includes('>'))
      console.error('"' + name + '" contains ">".');
    if (name.includes('<'))
      console.error('"' + name + '" contains ">".');

    return '(?<' + name + '>' + value + ')';
  }

  /**
   * Convenience for turning multiple args into a unioned regular expression.
   * anyOf(x, y, z) or anyOf([x, y, z]) do the same thing, and return (?:x|y|z).
   * anyOf(x) or anyOf(x) on its own simplifies to just x.
   * args may be strings or RegExp, although any additional markers to RegExp
   * like /insensitive/i are dropped.
   */
  export function anyOf(...args: (string|string[]|RegExp)[]): string {
    let array: (string|RegExp)[];
    if (args.length === 1) {
      if (!Array.isArray(args[0]))
        return args[0] instanceof RegExp ? args[0].source : args[0];
      array = args[0];
    } else {
      array = args as (string|RegExp)[];
    }

    return `(?:${array.map((elem) => elem instanceof RegExp ? elem.source : elem).join('|')})`;
  }

  export function parse(regexpString: RegExp | string): RegExp {
    const kCactbotCategories = {
      Timestamp: '^.{14}',
      NetTimestamp: '.{33}',
      NetField: '(?:[^|]*\\|)',
      LogType: '[0-9A-Fa-f]{2}',
      AbilityCode: '[0-9A-Fa-f]{1,8}',
      ObjectId: '[0-9A-F]{8}',
      // Matches any character name (including empty strings which the FFXIV
      // ACT plugin can generate when unknown).
      Name: '(?:[^\\s:|]+(?: [^\\s:|]+)?|)',
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
    regexpString = regexpString.replace(/\\y\{(.*?)\}/g, (match, group) => {
      return kCactbotCategories[group as keyof typeof kCactbotCategories] || match;
    });
    return new RegExp(regexpString, modifiers);
  }

  // Like Regex.parse, but force global flag.
  export function parseGlobal(regexpString: RegExp) {
    const regex = parse(regexpString);
    let modifiers = 'gi';
    modifiers += (regexpString.multiline ? 'm' : '');
    return new RegExp(regex.source, modifiers);
  }

  export function trueIfUndefined(value?: boolean) {
    if (typeof (value) === 'undefined')
      return true;
    return !!value;
  }

  export function validateParams(
    f: Readonly<{ [s: string]: boolean | string | string[] | undefined }>,
    funcName: string,
    params: Readonly<string[]>
  ) {
    if (f === null)
      return;
    if (typeof f !== 'object')
      return;
    const keys = Object.keys(f);
    for (let k = 0; k < keys.length; ++k) {
      const key = keys[k];
      if (!params.includes(key)) {
        throw new Error(`${funcName}: invalid parameter '${key}'.  ` +
            `Valid params: ${JSON.stringify(params)}`);
      }
    }
  }
}

export default Regexes;
