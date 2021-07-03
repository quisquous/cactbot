export interface BaseRegExp<T extends string> extends RegExp {
  groups?: {
    [s in T]?: string;
  };
}

export type Params<T extends string> =
  Partial<Record<Exclude<T, 'timestamp' | 'capture'>, string | string[]> &
  { 'timestamp': string; 'capture': boolean }>;

export type Regex<T extends string> = BaseRegExp<Exclude<T, 'capture'>>;

type ValidStringOrArray = string | string[];

const startsUsingParams = ['timestamp', 'source', 'id', 'ability', 'target', 'capture'] as const;
const abilityParams = ['timestamp', 'source', 'sourceId', 'id', 'ability', 'targetId', 'target', 'capture'] as const;
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
const headMarkerParams = ['timestamp', 'targetId', 'target', 'id', 'capture'] as const;
const addedCombatantParams = ['timestamp', 'name', 'capture'] as const;
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
const removingCombatantParams = [
  'timestamp',
  'id',
  'name',
  'hp',
  'x',
  'y',
  'z',
  'capture',
] as const;
const gainsEffectParams = ['timestamp', 'targetId', 'target', 'effect', 'source', 'duration', 'capture'] as const;
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
const losesEffectParams = ['timestamp', 'targetId', 'target', 'effect', 'source', 'capture'] as const;
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
const tetherParams = ['timestamp', 'source', 'sourceId', 'target', 'targetId', 'id', 'capture'] as const;
const wasDefeatedParams = ['timestamp', 'target', 'source', 'capture'] as const;
const hasHPParams = ['timestamp', 'name', 'hp', 'capture'] as const;
const echoParams = ['timestamp', 'code', 'line', 'capture'] as const;
const dialogParams = ['timestamp', 'code', 'line', 'name', 'capture'] as const;
const messageParams = ['timestamp', 'code', 'line', 'capture'] as const;
const gameLogParams = ['timestamp', 'code', 'line', 'capture'] as const;
const gameNameLogParams = ['timestamp', 'code', 'name', 'line', 'capture'] as const;
const changeZoneParams = ['timestamp', 'name', 'capture'] as const;
const network6dParams = ['timestamp', 'instance', 'command', 'data0', 'data1', 'data2', 'data3', 'capture'] as const;

type StartsUsingParams = typeof startsUsingParams[number];
type AbilityParams = typeof abilityParams[number];
type AbilityFullParams = typeof abilityFullParams[number];
type HeadMarkerParams = typeof headMarkerParams[number];
type AddedCombatantParams = typeof addedCombatantParams[number];
type AddedCombatantFullParams = typeof addedCombatantFullParams[number];
type RemovingCombatantParams = typeof removingCombatantParams[number];
type GainsEffectParams = typeof gainsEffectParams[number];
type StatusEffectExplicitParams = typeof statusEffectExplicitParams[number];
type LosesEffectParams = typeof losesEffectParams[number];
type StatChangeParams = typeof statChangeParams[number];
type TetherParams = typeof tetherParams[number];
type WasDefeatedParams = typeof wasDefeatedParams[number];
type HasHPParams = typeof hasHPParams[number];
type EchoParams = typeof echoParams[number];
type DialogParams = typeof dialogParams[number];
type MessageParams = typeof messageParams[number];
type GameLogParams = typeof gameLogParams[number];
type GameNameLogParams = typeof gameNameLogParams[number];
type ChangeZoneParams = typeof changeZoneParams[number];
type Network6dParams = typeof network6dParams[number];

export default class Regexes {
  /**
   * fields: source, id, ability, target, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#14-networkstartscasting
   */
  static startsUsing(f?: Params<StartsUsingParams>): Regex<StartsUsingParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'startsUsing', startsUsingParams);
    const capture = Regexes.trueIfUndefined(f.capture);
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
  }

  /**
   * fields: sourceId, source, id, ability, targetId, target, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
   */
  static ability(f?: Params<AbilityParams>): Regex<AbilityParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'ability', abilityParams);
    const capture = Regexes.trueIfUndefined(f.capture);
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
  }

  /**
   * fields: sourceId, source, id, ability, targetId, target, flags, x, y, z, heading, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
   */
  static abilityFull(f?: Params<AbilityFullParams>): Regex<AbilityFullParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'abilityFull', abilityFullParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
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
  }


  /**
   * fields: targetId, target, id, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1b-networktargeticon-head-markers
   */
  static headMarker(f?: Params<HeadMarkerParams>): Regex<HeadMarkerParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'headMarker', headMarkerParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 1B:' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') + ':....:....:' +
      Regexes.maybeCapture(capture, 'id', f.id, '....') + ':';
    return Regexes.parse(str);
  }

  // fields: name, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
  static addedCombatant(f?: Params<AddedCombatantParams>): Regex<AddedCombatantParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'addedCombatant', addedCombatantParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 03:\\y{ObjectId}:Added new combatant ' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.';
    return Regexes.parse(str);
  }

  /**
   * fields: id, name, hp, x, y, z, npcId, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
   */
  static addedCombatantFull(
      f?: Params<AddedCombatantFullParams>,
  ): Regex<AddedCombatantFullParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'addedCombatantFull', addedCombatantFullParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
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
  }

  /**
   * fields: id, name, hp, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#04-removecombatant
   */
  static removingCombatant(f?: Params<RemovingCombatantParams>): Regex<RemovingCombatantParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'removingCombatant', removingCombatantParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 04:' + Regexes.maybeCapture(capture, 'id', '\\y{ObjectId}') +
      ':Removing combatant ' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.' +
      '.*?Max HP: ' + Regexes.maybeCapture(capture, 'hp', f.hp, '[0-9]+') + '\.' +
      Regexes.optional('.*?Pos: \\(' +
      Regexes.maybeCapture(capture, 'x', f.x, '\\y{Float}') + ',' +
      Regexes.maybeCapture(capture, 'y', f.y, '\\y{Float}') + ',' +
      Regexes.maybeCapture(capture, 'z', f.z, '\\y{Float}') + '\\)');
    return Regexes.parse(str);
  }


  // fields: targetId, target, effect, source, duration, capture
  // matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1a-networkbuff
  static gainsEffect(f?: Params<GainsEffectParams>): Regex<GainsEffectParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'gainsEffect', gainsEffectParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
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
  }

  /**
   * Prefer gainsEffect over this function unless you really need extra data.
   * fields: targetId, target, job, hp, maxHp, mp, maxMp, x, y, z, heading,
   *         data0, data1, data2, data3, data4
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#26-networkstatuseffects
   */
  static statusEffectExplicit(
      f?: Params<StatusEffectExplicitParams>,
  ): Regex<StatusEffectExplicitParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'statusEffectExplicit', statusEffectExplicitParams);
    const capture = Regexes.trueIfUndefined(f.capture);

    const kField = '.*?:';

    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
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
  }


  /**
   * fields: targetId, target, effect, source, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1e-networkbuffremove
   */
  static losesEffect(f?: Params<LosesEffectParams>): Regex<LosesEffectParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'losesEffect', losesEffectParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 1E:' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
      ' loses the effect of ' +
      Regexes.maybeCapture(capture, 'effect', f.effect, '.*?') +
      ' from ' +
      Regexes.maybeCapture(capture, 'source', f.source, '.*?') + '\\.';
    return Regexes.parse(str);
  }


  /**
   * fields: source, sourceId, target, targetId, id, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#23-networktether
   */
  static tether(f?: Params<TetherParams>): Regex<TetherParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'tether', tetherParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 23:' +
      Regexes.maybeCapture(capture, 'sourceId', f.sourceId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'source', f.source, '[^:]*?') + ':' +
      Regexes.maybeCapture(capture, 'targetId', f.targetId, '\\y{ObjectId}') + ':' +
      Regexes.maybeCapture(capture, 'target', f.target, '[^:]*?') +
      ':....:....:' +
      Regexes.maybeCapture(capture, 'id', f.id, '....') + ':';
    return Regexes.parse(str);
  }


  /**
   * 'target' was defeated by 'source'
   * fields: target, source, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#19-networkdeath
   */
  static wasDefeated(f?: Params<WasDefeatedParams>): Regex<WasDefeatedParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'wasDefeated', wasDefeatedParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 19:' +
      Regexes.maybeCapture(capture, 'target', f.target, '.*?') +
      ' was defeated by ' +
      Regexes.maybeCapture(capture, 'source', f.source, '.*?') + '\\.';
    return Regexes.parse(str);
  }


  /**
   * fields: name, hp, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0d-combatanthp
   */
  static hasHP(f?: Params<HasHPParams>): Regex<HasHPParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'hasHP', hasHPParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 0D:' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') +
      ' HP at ' +
      Regexes.maybeCapture(capture, 'hp', f.hp, '\\d+') + '%';
    return Regexes.parse(str);
  }


  /**
   * fields: code, line, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  static echo(f?: Params<EchoParams>): Regex<EchoParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'echo', echoParams);
    return Regexes.gameLog({
      line: f.line,
      capture: f.capture,
      code: '0038',
    });
  }


  /**
   * fields: code, line, name, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  static dialog(f?: Params<DialogParams>): Regex<DialogParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'dialog', dialogParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 00:' +
      Regexes.maybeCapture(capture, 'code', '0044') + ':' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';
    return Regexes.parse(str);
  }


  /**
   * fields: code, line, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  static message(f?: Params<MessageParams>): Regex<MessageParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'message', messageParams);
    return Regexes.gameLog({
      line: f.line,
      capture: f.capture,
      code: '0839',
    });
  }

  /**
   * fields: code, line, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  static gameLog(f?: Params<GameLogParams>): Regex<GameLogParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'gameLog', gameLogParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 00:' +
      Regexes.maybeCapture(capture, 'code', f.code, '....') + ':' +
      Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';
    return Regexes.parse(str);
  }


  /**
   * fields: code, name, line, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   * Some game log lines have names in them, but not all.  All network log lines for these
   * have empty fields, but these get dropped by the ACT FFXV plugin.
   */
  static gameNameLog(f?: Params<GameNameLogParams>): Regex<GameNameLogParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'gameNameLog', gameNameLogParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 00:' +
      Regexes.maybeCapture(capture, 'code', f.code, '....') + ':' +
      Regexes.maybeCapture(capture, 'name', f.name, '[^:]*') + ':' +
      Regexes.maybeCapture(capture, 'line', f.line, '.*') + '$';
    return Regexes.parse(str);
  }

  /**
   * fields: job, strength, dexterity, vitality, intelligence, mind, piety, attackPower,
   *         directHit, criticalHit, attackMagicPotency, healMagicPotency, determination,
   *         skillSpeed, spellSpeed, tenacity, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0c-playerstats
   */
  static statChange(f?: Params<StatChangeParams>): Regex<StatChangeParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'statChange', statChangeParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
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
  }


  /**
   * fields: name, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#01-changezone
   */
  static changeZone(f?: Params<ChangeZoneParams>): Regex<ChangeZoneParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'changeZone', changeZoneParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 01:Changed Zone to ' +
      Regexes.maybeCapture(capture, 'name', f.name, '.*?') + '\\.';
    return Regexes.parse(str);
  }


  /**
   * fields: instance, command, data0, data1, data2, data3
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#21-network6d-actor-control-lines
   */
  static network6d(f?: Params<Network6dParams>): Regex<Network6dParams> {
    if (typeof f === 'undefined')
      f = {};
    Regexes.validateParams(f, 'network6d', network6dParams);
    const capture = Regexes.trueIfUndefined(f.capture);
    const str = Regexes.maybeCapture(capture, 'timestamp', '\\y{Timestamp}') +
      ' 21:' +
      Regexes.maybeCapture(capture, 'instance', f.instance, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'command', f.command, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'data0', f.data0, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'data1', f.data1, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'data2', f.data2, '.*?') + ':' +
      Regexes.maybeCapture(capture, 'data3', f.data3, '.*?') + '$';
    return Regexes.parse(str);
  }

  /**
   * Helper function for building named capture group
   */
  static maybeCapture(
      capture: boolean,
      name: string,
      value: string | string[] | undefined,
      defaultValue?: string,
  ): string {
    if (!value)
      value = defaultValue;
    value = Regexes.anyOf(value as ValidStringOrArray);
    return capture ? Regexes.namedCapture(name, value) : value;
  }

  static optional(str: string): string {
    return `(?:${str})?`;
  }

  // Creates a named regex capture group named |name| for the match |value|.
  static namedCapture(name: string, value: string): string {
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
  static anyOf(...args: (string|string[]|RegExp)[]): string {
    const anyOfArray = (array: (string|RegExp)[]): string => {
      return `(?:${array.map((elem) => elem instanceof RegExp ? elem.source : elem).join('|')})`;
    };
    let array: (string|RegExp)[] = [];
    if (args.length === 1) {
      if (Array.isArray(args[0]))
        array = args[0];
      else if (args[0])
        array = [args[0]];
      else
        array = [];
    } else {
      // TODO: more accurate type instead of `as` cast
      array = args as string[];
    }
    return anyOfArray(array);
  }

  static parse(regexpString: RegExp | string): RegExp {
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

  // Like Regex.Regexes.parse, but force global flag.
  static parseGlobal(regexpString: RegExp | string): RegExp {
    const regex = Regexes.parse(regexpString);
    let modifiers = 'gi';
    if (regexpString instanceof RegExp)
      modifiers += (regexpString.multiline ? 'm' : '');
    return new RegExp(regex.source, modifiers);
  }

  static trueIfUndefined(value?: boolean): boolean {
    if (typeof (value) === 'undefined')
      return true;
    return !!value;
  }

  static validateParams(
      f: Readonly<{ [s: string]: unknown }>,
      funcName: string,
      params: Readonly<string[]>,
  ): void {
    if (f === null)
      return;
    if (typeof f !== 'object')
      return;
    const keys = Object.keys(f);
    for (let k = 0; k < keys.length; ++k) {
      const key = keys[k];
      if (key && !params.includes(key)) {
        throw new Error(`${funcName}: invalid parameter '${key}'.  ` +
            `Valid params: ${JSON.stringify(params)}`);
      }
    }
  }
}
