import { NetFields, NetFieldsReverse } from '../types/net_fields';
import { NetParams } from '../types/net_props';
import { CactbotBaseRegExp } from '../types/net_trigger';

import {
  logDefinitionsVersions,
  LogDefinitionTypes,
  LogDefinitionVersions,
  ParseHelperFields,
  RepeatingFieldsDefinitions,
  RepeatingFieldsTypes,
} from './netlog_defs';
import Regexes from './regexes';

const separator = '\\|';
const matchDefault = '[^|]*';

// If NetRegexes.setFlagTranslationsNeeded is set to true, then any
// regex created that requires a translation will begin with this string
// and match the magicStringRegex.  This is maybe a bit goofy, but is
// a pretty straightforward way to mark regexes for translations.
// If issue #1306 is ever resolved, we can remove this.
const magicTranslationString = `^^`;
const magicStringRegex = /^\^\^/;

// can't simply export this, see https://github.com/quisquous/cactbot/pull/4957#discussion_r1002590589
const keysThatRequireTranslationAsConst = [
  'ability',
  'name',
  'source',
  'target',
  'line',
] as const;
export const keysThatRequireTranslation: readonly string[] = keysThatRequireTranslationAsConst;
export type KeysThatRequireTranslation = typeof keysThatRequireTranslationAsConst[number];

const defaultParams = <
  T extends LogDefinitionTypes,
  V extends LogDefinitionVersions,
>(type: T, version: V, include?: string[]): Partial<ParseHelperFields<T>> => {
  const logType = logDefinitionsVersions[version][type];
  if (include === undefined) {
    include = Object.keys(logType.fields);
    if ('repeatingFields' in logType) {
      include.push(logType.repeatingFields.label);
    }
  }

  const params: {
    [index: number]: {
      field: string;
      value?: string;
      optional: boolean;
      repeating?: boolean;
      repeatingKeys?: string[];
      sortFn?: (left: unknown, right: unknown) => number;
    };
  } = {};
  const firstOptionalField = logType.firstOptionalField;

  for (const [prop, index] of Object.entries(logType.fields)) {
    if (!include.includes(prop))
      continue;
    const param: { field: string; value?: string; optional: boolean; repeating?: boolean } = {
      field: prop,
      optional: firstOptionalField !== undefined && index >= firstOptionalField,
    };
    if (prop === 'type')
      param.value = logType.type;

    params[index] = param;
  }

  if ('repeatingFields' in logType && include.includes(logType.repeatingFields.label)) {
    params[logType.repeatingFields.startingIndex] = {
      field: logType.repeatingFields.label,
      optional: firstOptionalField !== undefined &&
        logType.repeatingFields.startingIndex >= firstOptionalField,
      repeating: true,
      repeatingKeys: [...logType.repeatingFields.names],
      sortFn: logType.repeatingFields.sortFn,
    };
  }

  return params as unknown as Partial<ParseHelperFields<T>>;
};

type RepeatingFieldsMap<
  TBase extends LogDefinitionTypes,
  TKey extends RepeatingFieldsTypes = TBase extends RepeatingFieldsTypes ? TBase : never,
> = {
  [name in RepeatingFieldsDefinitions[TKey]['repeatingFields']['names'][number]]:
    | string
    | string[];
}[];

type RepeatingFieldsMapTypeCheck<
  TBase extends LogDefinitionTypes,
  F extends keyof NetFields[TBase],
  TKey extends RepeatingFieldsTypes = TBase extends RepeatingFieldsTypes ? TBase : never,
> = F extends RepeatingFieldsDefinitions[TKey]['repeatingFields']['label']
  ? RepeatingFieldsMap<TKey> :
  never;

type RepeatingFieldsMapType<
  T extends LogDefinitionTypes,
  F extends keyof NetFields[T],
> = T extends RepeatingFieldsTypes ? RepeatingFieldsMapTypeCheck<T, F>
  : never;

type ParseHelperType<T extends LogDefinitionTypes> =
  & {
    [field in keyof NetFields[T]]?: string | string[] | RepeatingFieldsMapType<T, field>;
  }
  & { capture?: boolean };

const isRepeatingField = <
  T extends LogDefinitionTypes,
>(
  repeating: boolean | undefined,
  value: string | string[] | RepeatingFieldsMap<T> | undefined,
): value is RepeatingFieldsMap<T> => {
  if (repeating !== true)
    return false;
  if (!Array.isArray(value))
    return false;
  for (const e of value) {
    if (typeof e !== 'object')
      return false;
  }
  return true;
};

const parseHelper = <T extends LogDefinitionTypes>(
  params: ParseHelperType<T> | undefined,
  funcName: string,
  fields: Partial<ParseHelperFields<T>>,
): CactbotBaseRegExp<T> => {
  params = params ?? {};
  const validFields: string[] = [];

  for (const index in fields) {
    const field = fields[index];
    if (field)
      validFields.push(field.field);
  }

  Regexes.validateParams(params, funcName, ['capture', ...validFields]);

  // Find the last key we care about, so we can shorten the regex if needed.
  const capture = Regexes.trueIfUndefined(params.capture);
  const fieldKeys = Object.keys(fields).sort((a, b) => parseInt(a) - parseInt(b));
  let maxKeyStr: string;
  if (capture) {
    const keys: Extract<keyof NetFieldsReverse[T], string>[] = [];
    for (const key in fields)
      keys.push(key);
    let tmpKey = keys.pop();
    if (tmpKey === undefined) {
      maxKeyStr = fieldKeys[fieldKeys.length - 1] ?? '0';
    } else {
      while (
        fields[tmpKey]?.optional &&
        !((fields[tmpKey]?.field ?? '') in params)
      )
        tmpKey = keys.pop();
      maxKeyStr = tmpKey ?? '0';
    }
  } else {
    maxKeyStr = '0';
    for (const key in fields) {
      const value = fields[key] ?? {};
      if (typeof value !== 'object')
        continue;
      const fieldName = fields[key]?.field;
      if (fieldName !== undefined && fieldName in params)
        maxKeyStr = key;
    }
  }
  const maxKey = parseInt(maxKeyStr);

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
  for (const keyStr in fields) {
    const key = parseInt(keyStr);
    // Fill in blanks.
    const missingFields = key - lastKey - 1;
    if (missingFields === 1)
      str += '\\y{NetField}';
    else if (missingFields > 1)
      str += `\\y{NetField}{${missingFields}}`;
    lastKey = key;

    const value = fields[keyStr];
    if (typeof value !== 'object')
      throw new Error(`${funcName}: invalid value: ${JSON.stringify(value)}`);

    const fieldName = value.field;
    const defaultFieldValue = value.value?.toString() ?? matchDefault;
    const fieldValue = params[fieldName];

    if (isRepeatingField(fields[keyStr]?.repeating, fieldValue)) {
      let repeatingArray: RepeatingFieldsMap<T> = fieldValue;
      const origRepeatingArray = repeatingArray;

      const sortFn = fields[keyStr]?.sortFn;
      // Allow sorting if needed
      if (sortFn)
        repeatingArray = [...repeatingArray].sort(sortFn);

      repeatingArray.forEach((rep) => {
        let fieldRegex = '';
        // Rather than looping over the keys defined on the object,
        // loop over the base type def's keys. This enforces the correct order.
        fields[keyStr]?.repeatingKeys?.forEach((key) => {
          if (!(key in rep)) {
            // If we don't have a value for this key, insert a placeholder
            fieldRegex += '\\y{NetField}';
            return;
          }
          // This is an ugly cast. There's probably a better way of narrowing this type but
          // tsc doesn't like the dozen or so variations I've tried.
          const val = rep[key as keyof typeof rep];
          if (typeof val !== 'string') {
            if (!Array.isArray(val))
              return;
            if (val.length < 0)
              return;
            if (val.some((v) => typeof v !== 'string'))
              return;
          }
          fieldRegex += Regexes.maybeCapture(
            capture,
            // All capturing groups have their index appended
            key + origRepeatingArray.indexOf(rep).toString(),
            val,
            defaultFieldValue,
          ) +
            separator;
        });

        if (fieldRegex.length > 0) {
          // Prepend a match for any number of fields before matching this one.
          // TODO: Should we scope this as the following instead?
          // This would match sets of repeating fields instead of any number of fields.
          // `(?:\\y{NetField}(${fields[keyStr]?.repeatingKeys?.length}))*`
          str += `\\y{NetField}*?` + fieldRegex;
        }
      });
    } else if (fields[keyStr]?.repeating) {
      // If this is a repeating field but the actual value is empty or otherwise invalid,
      // don't process further. We can't use `continue` in the above block because that
      // would skip the early-out break at the end of the loop.
    } else {
      if (fieldName !== undefined) {
        str += Regexes.maybeCapture(
          // more accurate type instead of `as` cast
          // maybe this function needs a refactoring
          capture,
          fieldName,
          fieldValue,
          defaultFieldValue,
        ) +
          separator;
      } else {
        str += defaultFieldValue + separator;
      }
    }

    // Stop if we're not capturing and don't care about future fields.
    if (key >= maxKey)
      break;
  }
  return Regexes.parse(str) as CactbotBaseRegExp<T>;
};

export const buildRegex = <T extends keyof NetParams>(
  type: T,
  params?: ParseHelperType<T>,
): CactbotBaseRegExp<T> => {
  return parseHelper(params, type, defaultParams(type, NetRegexes.logVersion));
};

export default class NetRegexes {
  static logVersion: LogDefinitionVersions = 'latest';

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
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-20-0x14-networkstartscasting
   */
  static startsUsing(params?: NetParams['StartsUsing']): CactbotBaseRegExp<'StartsUsing'> {
    return buildRegex('StartsUsing', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-21-0x15-networkability
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-22-0x16-networkaoeability
   */
  static ability(params?: NetParams['Ability']): CactbotBaseRegExp<'Ability'> {
    return parseHelper(params, 'Ability', {
      ...defaultParams('Ability', NetRegexes.logVersion),
      // Override type
      0: { field: 'type', value: '2[12]', optional: false },
    });
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-21-0x15-networkability
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-22-0x16-networkaoeability
   *
   * @deprecated Use `ability` instead
   */
  static abilityFull(params?: NetParams['Ability']): CactbotBaseRegExp<'Ability'> {
    return this.ability(params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-27-0x1b-networktargeticon-head-marker
   */
  static headMarker(params?: NetParams['HeadMarker']): CactbotBaseRegExp<'HeadMarker'> {
    return buildRegex('HeadMarker', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-03-0x03-addcombatant
   */
  static addedCombatant(params?: NetParams['AddedCombatant']): CactbotBaseRegExp<'AddedCombatant'> {
    return parseHelper(
      params,
      'AddedCombatant',
      defaultParams('AddedCombatant', NetRegexes.logVersion),
    );
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-03-0x03-addcombatant
   * @deprecated Use `addedCombatant` instead
   */
  static addedCombatantFull(
    params?: NetParams['AddedCombatant'],
  ): CactbotBaseRegExp<'AddedCombatant'> {
    return NetRegexes.addedCombatant(params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-04-0x04-removecombatant
   */
  static removingCombatant(
    params?: NetParams['RemovedCombatant'],
  ): CactbotBaseRegExp<'RemovedCombatant'> {
    return buildRegex('RemovedCombatant', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-26-0x1a-networkbuff
   */
  static gainsEffect(params?: NetParams['GainsEffect']): CactbotBaseRegExp<'GainsEffect'> {
    return buildRegex('GainsEffect', params);
  }

  /**
   * Prefer gainsEffect over this function unless you really need extra data.
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-38-0x26-networkstatuseffects
   */
  static statusEffectExplicit(
    params?: NetParams['StatusEffect'],
  ): CactbotBaseRegExp<'StatusEffect'> {
    return buildRegex('StatusEffect', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-30-0x1e-networkbuffremove
   */
  static losesEffect(params?: NetParams['LosesEffect']): CactbotBaseRegExp<'LosesEffect'> {
    return buildRegex('LosesEffect', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-35-0x23-networktether
   */
  static tether(params?: NetParams['Tether']): CactbotBaseRegExp<'Tether'> {
    return buildRegex('Tether', params);
  }

  /**
   * 'target' was defeated by 'source'
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-25-0x19-networkdeath
   */
  static wasDefeated(params?: NetParams['WasDefeated']): CactbotBaseRegExp<'WasDefeated'> {
    return buildRegex('WasDefeated', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-24-0x18-networkdot
   */
  static networkDoT(params?: NetParams['NetworkDoT']): CactbotBaseRegExp<'NetworkDoT'> {
    return buildRegex('NetworkDoT', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static echo(params?: Omit<NetParams['GameLog'], 'code'>): CactbotBaseRegExp<'GameLog'> {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(
      params,
      'Echo',
      ['type', 'timestamp', 'code', 'name', 'line', 'capture'],
    );

    return NetRegexes.gameLog({ ...params, code: '0038' });
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static dialog(params?: Omit<NetParams['GameLog'], 'code'>): CactbotBaseRegExp<'GameLog'> {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(
      params,
      'Dialog',
      ['type', 'timestamp', 'code', 'name', 'line', 'capture'],
    );

    return NetRegexes.gameLog({ ...params, code: '0044' });
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static message(params?: Omit<NetParams['GameLog'], 'code'>): CactbotBaseRegExp<'GameLog'> {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(
      params,
      'Message',
      ['type', 'timestamp', 'code', 'name', 'line', 'capture'],
    );

    return NetRegexes.gameLog({ ...params, code: '0839' });
  }

  /**
   * fields: code, name, line, capture
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static gameLog(params?: NetParams['GameLog']): CactbotBaseRegExp<'GameLog'> {
    return buildRegex('GameLog', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static gameNameLog(params?: NetParams['GameLog']): CactbotBaseRegExp<'GameLog'> {
    // Backwards compatability.
    return NetRegexes.gameLog(params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-12-0x0c-playerstats
   */
  static statChange(params?: NetParams['PlayerStats']): CactbotBaseRegExp<'PlayerStats'> {
    return buildRegex('PlayerStats', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-01-0x01-changezone
   */
  static changeZone(params?: NetParams['ChangeZone']): CactbotBaseRegExp<'ChangeZone'> {
    return buildRegex('ChangeZone', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-33-0x21-network6d-actor-control
   */
  static network6d(params?: NetParams['ActorControl']): CactbotBaseRegExp<'ActorControl'> {
    return buildRegex('ActorControl', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-34-0x22-networknametoggle
   */
  static nameToggle(params?: NetParams['NameToggle']): CactbotBaseRegExp<'NameToggle'> {
    return buildRegex('NameToggle', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-40-0x28-map
   */
  static map(params?: NetParams['Map']): CactbotBaseRegExp<'Map'> {
    return buildRegex('Map', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-41-0x29-systemlogmessage
   */
  static systemLogMessage(
    params?: NetParams['SystemLogMessage'],
  ): CactbotBaseRegExp<'SystemLogMessage'> {
    return buildRegex('SystemLogMessage', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-257-0x101-mapeffect
   */
  static mapEffect(params?: NetParams['MapEffect']): CactbotBaseRegExp<'MapEffect'> {
    return buildRegex('MapEffect', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-258-0x102-fatedirector
   */
  static fateDirector(params?: NetParams['FateDirector']): CactbotBaseRegExp<'FateDirector'> {
    return buildRegex('FateDirector', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-259-0x103-cedirector
   */
  static ceDirector(params?: NetParams['CEDirector']): CactbotBaseRegExp<'CEDirector'> {
    return buildRegex('CEDirector', params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-261-0x105-combatantmemory
   */
  static combatantMemory(
    params?: NetParams['CombatantMemory'],
  ): CactbotBaseRegExp<'CombatantMemory'> {
    return buildRegex('CombatantMemory', params);
  }
}

export const commonNetRegex = {
  // TODO(6.2): remove 40000010 after everybody is on 6.2.
  // TODO: or maybe keep around for playing old log files??
  wipe: NetRegexes.network6d({ command: ['40000010', '4000000F'] }),
  cactbotWipeEcho: NetRegexes.echo({ line: 'cactbot wipe.*?' }),
  userWipeEcho: NetRegexes.echo({ line: 'end' }),
} as const;

export const buildNetRegexForTrigger = <T extends keyof NetParams>(
  type: T,
  params?: NetParams[T],
): CactbotBaseRegExp<T> => {
  if (type === 'Ability')
    // ts can't narrow T to `Ability` here, need casting.
    return NetRegexes.ability(params) as CactbotBaseRegExp<T>;

  return buildRegex<T>(type, params);
};
