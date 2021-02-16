import Regexes, { Params } from './regexes';

interface Fields {
  field: string;
  value?: string;
}

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

function parseHelper(
    params: { timestamp?: string, capture?: boolean },
    funcName: string,
    fields: { [s: string]: Fields; },
): RegExp {
  params = params ?? {};
  const validFields: string[] = [];
  for (const value of Object.values(fields)) {
    if (typeof value !== 'object')
      continue;
    validFields.push(value.field);
  }
  Regexes.validateParams(params, funcName, ['capture', ...validFields]);

  // Find the last key we care about, so we can shorten the regex if needed.
  const capture = Regexes.trueIfUndefined(params.capture as boolean);
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

  // Build the regex from the fields.
  let str = '^';
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

    if (fieldName)
      str += Regexes.maybeCapture(capture, fieldName, params[fieldName], fieldValue) + separator;
    else
      str += fieldValue + separator;


    // Stop if we're not capturing and don't care about future fields.
    if (key >= (maxKey ?? 0 as number))
      break;
  }
  return Regexes.parse(str);
}

export default class NetRegexes {
  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#14-networkstartscasting
   */
  static startsUsing(params: Params<typeof startsUsingParams[number]>): RegExp {
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
  static ability(params: Params<typeof abilityParams[number]>): RegExp {
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
  static abilityFull(params: Params<typeof abilityFullParams[number]>): RegExp {
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
  static headMarker(params: Params<typeof headMarkerParams[number]>): RegExp {
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
  static addedCombatant(params: Params<typeof addedCombatantParams[number]>): RegExp {
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
  static addedCombatantFull(params: Params<typeof addedCombatantFullParams[number]>): RegExp {
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
  static removingCombatant(params: Params<typeof removingCombatantParams[number]>): RegExp {
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
  static gainsEffect(params: Params<typeof gainsEffectParams[number]>): RegExp {
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
  static statusEffectExplicit(params: Params<typeof statusEffectExplicitParams[number]>): RegExp {
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
  static losesEffect(params: Params<typeof losesEffectParams[number]>): RegExp {
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
  static tether(params: Params<typeof tetherParams[number]>): RegExp {
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
  static wasDefeated(params: Params<typeof wasDefeatedParams[number]>): RegExp {
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
  static echo(params: Params<typeof echoParams[number]>): RegExp {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(params, 'echo', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
    params.code = '0038';
    return NetRegexes.gameLog(params);
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  static dialog(params: Params<typeof dialogParams[number]>): RegExp {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(params, 'dialog', ['type', 'timestamp', 'code', 'name', 'line', 'capture']);
    params.code = '0044';
    return NetRegexes.gameLog(params);
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#00-logline
   */
  static message(params: Params<typeof messageParams[number]>): RegExp {
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
  static gameLog(params: Params<typeof gameLogParams[number]>): RegExp {
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
  static gameNameLog(params: Params<typeof gameNameLogParams[number]>): RegExp {
    // for compat with Regexes.
    return NetRegexes.gameLog(params);
  }


  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#0c-playerstats
   */
  static statChange(params: Params<typeof statChangeParams[number]>): RegExp {
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
  static changeZone(params: Params<typeof changeZoneParams[number]>): RegExp {
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
  static network6d(params: Params<typeof network6dParams[number]>): RegExp {
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
}
