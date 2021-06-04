import { BaseRegExp } from '../types/trigger';
import Regexes, { Params } from './regexes';

interface Fields {
  field: string;
  value?: string;
}

export type NetRegex<T extends string> = BaseRegExp<Exclude<T, 'capture'>>;

// Differences from Regexes:
// * may have more fields
// * AddedCombatant npc id is broken up into npcNameId and npcBaseId
// * gameLog always splits name into its own field (but previously wouldn't)

const separator = '\\|';
const matchDefault = '[^|]*';

const startsUsingParams = ['timestamp', 'sourceId', 'source', 'id', 'ability', 'targetId', 'target', 'castTime'] as const;
const abilityParams = ['sourceId', 'source', 'id', 'ability', 'targetId', 'target'] as const;
const abilityFullParams = ['sourceId', 'source', 'id', 'ability', 'targetId', 'target', 'flags', 'damage', 'targetCurrentHp', 'targetMaxHp', 'x', 'y', 'z', 'heading'] as const;
const headMarkerParams = ['targetId', 'target', 'id'] as const;
const addedCombatantParams = ['id', 'name'] as const;
const addedCombatantFullParams = ['id', 'name', 'job', 'level', 'ownerId', 'world', 'npcNameId', 'npcBaseId', 'currentHp', 'hp', 'x', 'y', 'z', 'heading'] as const;
const removingCombatantParams = ['id', 'name', 'hp'] as const;
const gainsEffectParams = ['effectId', 'effect', 'duration', 'sourceId', 'source', 'targetId', 'target', 'count'] as const;
const statusEffectExplicitParams = ['targetId', 'target', 'hp', 'maxHp', 'x', 'y', 'z', 'heading', 'data0', 'data1', 'data2', 'data3', 'data4'] as const;
const losesEffectParams = ['effectId', 'effect', 'sourceId', 'source', 'targetId', 'target', 'count'] as const;
const tetherParams = ['sourceId', 'source', 'targetId', 'target', 'id'] as const;
const wasDefeatedParams = ['targetId', 'target', 'sourceId', 'source'] as const;
const echoParams = ['code', 'name', 'line'] as const;
const dialogParams = ['code', 'name', 'line'] as const;
const messageParams = ['code', 'name', 'line'] as const;
const gameLogParams = ['code', 'name', 'line'] as const;
const gameNameLogParams = ['code', 'name', 'line'] as const;
const statChangeParams = ['job', 'strength', 'dexterity', 'vitality', 'intelligence', 'mind', 'piety', 'attackPower', 'directHit', 'criticalHit', 'attackMagicPotency', 'healMagicPotency', 'determination', 'skillSpeed', 'spellSpeed', 'tenacity'] as const;
const changeZoneParams = ['id', 'name'] as const;
const network6dParams = ['instance', 'command', 'data0', 'data1', 'data2', 'data3'] as const;
const nameToggleParams = ['id', 'name', 'toggle'] as const;

export type StartsUsingParams = typeof startsUsingParams[number];
export type AbilityParams = typeof abilityParams[number];
export type AbilityFullParams = typeof abilityFullParams[number];
export type HeadMarkerParams = typeof headMarkerParams[number];
export type AddedCombatantParams = typeof addedCombatantParams[number];
export type AddedCombatantFullParams = typeof addedCombatantFullParams[number];
export type RemovingCombatantParams = typeof removingCombatantParams[number];
export type GainsEffectParams = typeof gainsEffectParams[number];
export type StatusEffectExplicitParams = typeof statusEffectExplicitParams[number];
export type LosesEffectParams = typeof losesEffectParams[number];
export type TetherParams = typeof tetherParams[number];
export type WasDefeatedParams = typeof wasDefeatedParams[number];
export type EchoParams = typeof echoParams[number];
export type DialogParams = typeof dialogParams[number];
export type MessageParams = typeof messageParams[number];
export type GameLogParams = typeof gameLogParams[number];
export type GameNameLogParams = typeof gameNameLogParams[number];
export type StatChangeParams = typeof statChangeParams[number];
export type ChangeZoneParams = typeof changeZoneParams[number];
export type Network6dParams = typeof network6dParams[number];
export type NameToggleParams = typeof nameToggleParams[number];

// If NetRegexes.setFlagTranslationsNeeded is set to true, then any
// regex created that requires a translation will begin with this string
// and match the magicStringRegex.  This is maybe a bit goofy, but is
// a pretty straightforward way to mark regexes for translations.
// If issue #1306 is ever resolved, we can remove this.
const magicTranslationString = `^^`;
const magicStringRegex = /^\^\^/;
const keysThatRequireTranslation = [
  'ability',
  'name',
  'source',
  'target',
  'line',
];

const parseHelper = (
    params: { timestamp?: string; capture?: boolean } | undefined,
    funcName: string,
    fields: { [s: string]: Fields },
): RegExp => {
  params = params ?? {};
  const validFields: string[] = [];
  for (const value of Object.values(fields)) {
    if (typeof value !== 'object')
      continue;
    validFields.push(value.field);
  }
  Regexes.validateParams(params, funcName, ['capture', ...validFields]);

  // Find the last key we care about, so we can shorten the regex if needed.
  const capture = Regexes.trueIfUndefined(params.capture);
  const fieldKeys = Object.keys(fields);
  let maxKey;
  if (capture) {
    maxKey = fieldKeys[fieldKeys.length - 1];
  } else {
    maxKey = 0;
    for (const key of fieldKeys) {
      const value = fields[key] ?? {};
      if (typeof value !== 'object')
        continue;
      const fieldName = fields[key]?.field;
      if (fieldName && fieldName in params)
        maxKey = key;
    }
  }

  // For testing, it's useful to know if this is a regex that requires
  // translation.  We test this by seeing if there are any specified
  // fields, and if so, inserting a magic string that we can detect.
  // This lets us differentiate between "regex that should be translated"
  // e.g. a regex with `target` specified, and "regex that shouldn't"
  // e.g. a gains effect with just effectId specified.
  const transParams = Object.keys(params).filter((k) => keysThatRequireTranslation.includes(k));
  const needsTranslations = NetRegexes.flagTranslationsNeeded && transParams.length > 0;

  // Build the regex from the fields.
  let str = needsTranslations ? magicTranslationString : '^';
  let lastKey = -1;
  for (const _key in fields) {
    const key = parseInt(_key);
    // Fill in blanks.
    const missingFields = key - lastKey - 1;
    if (missingFields === 1)
      str += '\\y{NetField}';
    else if (missingFields > 1)
      str += `\\y{NetField}{${missingFields}}`;
    lastKey = key;

    const value = fields[key];
    if (typeof value !== 'object')
      throw new Error(`${funcName}: invalid value: ${JSON.stringify(value)}`);

    const fieldName = fields[key]?.field;
    const fieldValue = fields[key]?.value?.toString() ?? matchDefault;

    if (fieldName) {
      str += Regexes.maybeCapture(
          // more accurate type instead of `as` cast
          // maybe this function needs a refactoring
          capture, fieldName, (params as { [s: string]: string })[fieldName], fieldValue) +
        separator;
    } else {
      str += fieldValue + separator;
    }


    // Stop if we're not capturing and don't care about future fields.
    if (key >= (maxKey ?? 0 as number))
      break;
  }
  return Regexes.parse(str);
};

export default class NetRegexes {
  static flagTranslationsNeeded = false;
  static setFlagTranslationsNeeded(value: boolean): void {
    NetRegexes.flagTranslationsNeeded = value;
  }
  static doesNetRegexNeedTranslation(regex: RegExp | string): boolean {
    // Need to `setFlagTranslationsNeeded` before calling this function.
    console.assert(NetRegexes.flagTranslationsNeeded);
    const str = typeof regex === 'string' ? regex : regex.source;
    return !!magicStringRegex.exec(str);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#14-networkstartscasting
   */
  static startsUsing(params?: Params<StartsUsingParams>): NetRegex<StartsUsingParams> {
    return parseHelper(params, 'startsUsing', {
      0: { field: 'type', value: '20' },
      1: { field: 'timestamp' },
      2: { field: 'sourceId' },
      3: { field: 'source' },
      4: { field: 'id' },
      5: { field: 'ability' },
      6: { field: 'targetId' },
      7: { field: 'target' },
      8: { field: 'castTime' },
    });
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
   */
  static ability(params?: Params<AbilityParams>): NetRegex<AbilityParams> {
    return parseHelper(params, 'ability', {
      0: { field: 'type', value: '2[12]' },
      1: { field: 'timestamp' },
      2: { field: 'sourceId' },
      3: { field: 'source' },
      4: { field: 'id' },
      5: { field: 'ability' },
      6: { field: 'targetId' },
      7: { field: 'target' },
    });
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#15-networkability
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#16-networkaoeability
   */
  static abilityFull(params?: Params<AbilityFullParams>): NetRegex<AbilityFullParams> {
    return parseHelper(params, 'abilityFull', {
      0: { field: 'type', value: '2[12]' },
      1: { field: 'timestamp' },
      2: { field: 'sourceId' },
      3: { field: 'source' },
      4: { field: 'id' },
      5: { field: 'ability' },
      6: { field: 'targetId' },
      7: { field: 'target' },
      8: { field: 'flags' },
      9: { field: 'damage' },
      24: { field: 'targetCurrentHp' },
      25: { field: 'targetMaxHp' },
      40: { field: 'x' },
      41: { field: 'y' },
      42: { field: 'z' },
      43: { field: 'heading' },
    });
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1b-networktargeticon-head-markers
   */
  static headMarker(params?: Params<HeadMarkerParams>): NetRegex<HeadMarkerParams> {
    return parseHelper(params, 'headMarker', {
      0: { field: 'type', value: '27' },
      1: { field: 'timestamp' },
      2: { field: 'targetId' },
      3: { field: 'target' },
      6: { field: 'id' },
    });
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
   */
  static addedCombatant(params?: Params<AddedCombatantParams>): NetRegex<AddedCombatantParams> {
    return parseHelper(params, 'addedCombatant', {
      0: { field: 'type', value: '03' },
      1: { field: 'timestamp' },
      2: { field: 'id' },
      3: { field: 'name' },
    });
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#03-addcombatant
   */
  static addedCombatantFull(
      params?: Params<AddedCombatantFullParams>,
  ): NetRegex<AddedCombatantFullParams> {
    return parseHelper(params, 'addedCombatantFull', {
      0: { field: 'type', value: '03' },
      1: { field: 'timestamp' },
      2: { field: 'id' },
      3: { field: 'name' },
      4: { field: 'job' },
      5: { field: 'level' },
      6: { field: 'ownerId' },
      8: { field: 'world' },
      9: { field: 'npcNameId' },
      10: { field: 'npcBaseId' },
      11: { field: 'currentHp' },
      12: { field: 'hp' },
      17: { field: 'x' },
      18: { field: 'y' },
      19: { field: 'z' },
      20: { field: 'heading' },
    });
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#04-removecombatant
   */
  static removingCombatant(
      params?: Params<RemovingCombatantParams>,
  ): NetRegex<RemovingCombatantParams> {
    return parseHelper(params, 'removingCombatant', {
      0: { field: 'type', value: '04' },
      1: { field: 'timestamp' },
      2: { field: 'id' },
      3: { field: 'name' },
      12: { field: 'hp' },
    });
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1a-networkbuff
   */
  static gainsEffect(params?: Params<GainsEffectParams>): NetRegex<GainsEffectParams> {
    return parseHelper(params, 'gainsEffect', {
      0: { field: 'type', value: '26' },
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
  }


  /**
   * Prefer gainsEffect over this function unless you really need extra data.
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#26-networkstatuseffects
   */
  static statusEffectExplicit(
      params?: Params<StatusEffectExplicitParams>,
  ): NetRegex<StatusEffectExplicitParams> {
    return parseHelper(params, 'statusEffectExplicit', {
      0: { field: 'type', value: '38' },
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
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#1e-networkbuffremove
   */
  static losesEffect(params?: Params<LosesEffectParams>): NetRegex<LosesEffectParams> {
    return parseHelper(params, 'losesEffect', {
      0: { field: 'type', value: '30' },
      1: { field: 'timestamp' },
      2: { field: 'effectId' },
      3: { field: 'effect' },
      5: { field: 'sourceId' },
      6: { field: 'source' },
      7: { field: 'targetId' },
      8: { field: 'target' },
      9: { field: 'count' },
    });
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#23-networktether
   */
  static tether(params?: Params<TetherParams>): NetRegex<TetherParams> {
    return parseHelper(params, 'tether', {
      0: { field: 'type', value: '35' },
      1: { field: 'timestamp' },
      2: { field: 'sourceId' },
      3: { field: 'source' },
      4: { field: 'targetId' },
      5: { field: 'target' },
      8: { field: 'id' },
    });
  }


  /**
   * 'target' was defeated by 'source'
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#19-networkdeath
   */
  static wasDefeated(params?: Params<WasDefeatedParams>): NetRegex<WasDefeatedParams> {
    return parseHelper(params, 'wasDefeated', {
      0: { field: 'type', value: '25' },
      1: { field: 'timestamp' },
      2: { field: 'targetId' },
      3: { field: 'target' },
      4: { field: 'sourceId' },
      5: { field: 'source' },
    });
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  static echo(params?: Params<EchoParams>): NetRegex<EchoParams> {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(params, 'echo', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
    params.code = '0038';
    return NetRegexes.gameLog(params);
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  static dialog(params?: Params<DialogParams>): NetRegex<DialogParams> {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(params, 'dialog', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
    params.code = '0044';
    return NetRegexes.gameLog(params);
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  static message(params?: Params<MessageParams>): NetRegex<MessageParams> {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(params, 'message', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
    params.code = '0839';
    return NetRegexes.gameLog(params);
  }


  /**
   * fields: code, name, line, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  static gameLog(params?: Params<GameLogParams>): NetRegex<GameLogParams> {
    return parseHelper(params, 'gameLog', {
      0: { field: 'type', value: '00' },
      1: { field: 'timestamp' },
      2: { field: 'code' },
      3: { field: 'name' },
      4: { field: 'line' },
    });
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  static gameNameLog(params?: Params<GameNameLogParams>): NetRegex<GameNameLogParams> {
    // for compat with Regexes.
    return NetRegexes.gameLog(params);
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0c-playerstats
   */
  static statChange(params?: Params<StatChangeParams>): NetRegex<StatChangeParams> {
    return parseHelper(params, 'statChange', {
      0: { field: 'type', value: '12' },
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
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#01-changezone
   */
  static changeZone(params?: Params<ChangeZoneParams>): NetRegex<ChangeZoneParams> {
    return parseHelper(params, 'changeZone', {
      0: { field: 'type', value: '01' },
      1: { field: 'timestamp' },
      2: { field: 'id' },
      3: { field: 'name' },
    });
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#21-network6d-actor-control-lines
   */
  static network6d(params?: Params<Network6dParams>): NetRegex<Network6dParams> {
    return parseHelper(params, 'network6d', {
      0: { field: 'type', value: '33' },
      1: { field: 'timestamp' },
      2: { field: 'instance' },
      3: { field: 'command' },
      4: { field: 'data0' },
      5: { field: 'data1' },
      6: { field: 'data2' },
      7: { field: 'data3' },
    });
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#22-networknametoggle
   */
  static nameToggle(params?: Params<NameToggleParams>): NetRegex<NameToggleParams> {
    return parseHelper(params, 'nameToggle', {
      0: { field: 'type', value: '34' },
      1: { field: 'timestamp' },
      2: { field: 'id' },
      3: { field: 'name' },
      6: { field: 'toggle' },
    });
  }
}
