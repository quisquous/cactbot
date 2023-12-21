import { NetFields, NetFieldsReverse } from '../types/net_fields';
import { NetParams } from '../types/net_props';
import { CactbotBaseRegExp } from '../types/net_trigger';

import logDefinitions, {
  logDefinitionsVersions,
  LogDefinitionTypes,
  LogDefinitionVersions,
  ParseHelperFields,
  RepeatingFieldsDefinitions,
  RepeatingFieldsTypes,
} from './netlog_defs';
import { UnreachableCode } from './not_reached';

const separator = ':';
const matchDefault = '[^:]*';
const matchWithColonsDefault = '(?:[^:]|: )*?';
const fieldsWithPotentialColons = ['effect', 'ability'];

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
      sortKeys?: boolean;
      primaryKey?: string;
      possibleKeys?: string[];
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
      sortKeys: logType.repeatingFields.sortKeys,
      primaryKey: logType.repeatingFields.primaryKey,
      possibleKeys: [...logType.repeatingFields.possibleKeys],
    };
  }

  return params as Partial<ParseHelperFields<T>>;
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
    [field in keyof NetFields[T]]?: string | readonly string[] | RepeatingFieldsMapType<T, field>;
  }
  & { capture?: boolean };

const isRepeatingField = <
  T extends LogDefinitionTypes,
>(
  repeating: boolean | undefined,
  value: string | readonly string[] | RepeatingFieldsMap<T> | undefined,
): value is RepeatingFieldsMap<T> => {
  if (repeating !== true)
    return false;
  // Allow excluding the field to match for extraction
  if (value === undefined)
    return true;
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
  defKey: T,
  fields: Partial<ParseHelperFields<T>>,
): CactbotBaseRegExp<T> => {
  params = params ?? {};
  const validFields: string[] = [];

  for (const index in fields) {
    const field = fields[index];
    if (field)
      validFields.push(field.field);
  }

  Regexes.validateParams(params, defKey, ['capture', ...validFields]);

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

  // Special case for Ability to handle aoe and non-aoe.
  const abilityMessageType =
    `(?:${logDefinitions.Ability.messageType}|${logDefinitions.NetworkAOEAbility.messageType})`;
  const abilityHexCode = '(?:15|16)';

  // Build the regex from the fields.
  const prefix = defKey !== 'Ability' ? logDefinitions[defKey].messageType : abilityMessageType;

  // Hex codes are a minimum of two characters.  Abilities are special because
  // they need to support both 0x15 and 0x16.
  const typeAsHex = parseInt(logDefinitions[defKey].type).toString(16).toUpperCase();
  const defaultHexCode = typeAsHex.length < 2 ? `00${typeAsHex}`.slice(-2) : typeAsHex;
  const hexCode = defKey !== 'Ability' ? defaultHexCode : abilityHexCode;

  let str = '';
  if (capture)
    str += `(?<timestamp>\\y{Timestamp}) ${prefix} (?<type>${hexCode})`;
  else
    str += `\\y{Timestamp} ${prefix} ${hexCode}`;

  let lastKey = 1;
  for (const keyStr in fields) {
    const parseField = fields[keyStr];
    if (parseField === undefined)
      continue;
    const fieldName = parseField.field;

    // Regex handles these manually above in the `str` initialization.
    if (fieldName === 'timestamp' || fieldName === 'type')
      continue;

    const key = parseInt(keyStr);
    // Fill in blanks.
    const missingFields = key - lastKey - 1;
    if (missingFields === 1)
      str += `${separator}${matchDefault}`;
    else if (missingFields > 1)
      str += `(?:${separator}${matchDefault}){${missingFields}}`;
    lastKey = key;

    str += separator;

    if (typeof parseField !== 'object')
      throw new Error(`${defKey}: invalid value: ${JSON.stringify(parseField)}`);

    const fieldDefault = fieldName !== undefined && fieldsWithPotentialColons.includes(fieldName)
      ? matchWithColonsDefault
      : matchDefault;
    const defaultFieldValue = parseField.value?.toString() ?? fieldDefault;
    const fieldValue = params[fieldName];

    if (isRepeatingField(fields[keyStr]?.repeating, fieldValue)) {
      const repeatingFieldsSeparator = '(?:$|:)';
      let repeatingArray: RepeatingFieldsMap<T> | undefined = fieldValue;

      const sortKeys = fields[keyStr]?.sortKeys;
      const primaryKey = fields[keyStr]?.primaryKey;
      const possibleKeys = fields[keyStr]?.possibleKeys;

      // primaryKey is required if this is a repeating field per typedef in netlog_defs.ts
      // Same with possibleKeys
      if (primaryKey === undefined || possibleKeys === undefined)
        throw new UnreachableCode();

      // Allow sorting if needed
      if (sortKeys) {
        // Also sort our valid keys list
        possibleKeys.sort((left, right) => left.toLowerCase().localeCompare(right.toLowerCase()));
        if (repeatingArray !== undefined) {
          repeatingArray = [...repeatingArray].sort(
            (left: Record<string, unknown>, right: Record<string, unknown>): number => {
              // We check the validity of left/right because they're user-supplied
              if (typeof left !== 'object' || left[primaryKey] === undefined) {
                console.warn('Invalid argument passed to trigger:', left);
                return 0;
              }
              const leftValue = left[primaryKey];
              if (typeof leftValue !== 'string' || !possibleKeys?.includes(leftValue)) {
                console.warn('Invalid argument passed to trigger:', left);
                return 0;
              }
              if (typeof right !== 'object' || right[primaryKey] === undefined) {
                console.warn('Invalid argument passed to trigger:', right);
                return 0;
              }
              const rightValue = right[primaryKey];
              if (typeof rightValue !== 'string' || !possibleKeys?.includes(rightValue)) {
                console.warn('Invalid argument passed to trigger:', right);
                return 0;
              }
              return leftValue.toLowerCase().localeCompare(rightValue.toLowerCase());
            },
          );
        }
      }

      const anonReps: { [name: string]: string | string[] }[] | undefined = repeatingArray;
      // Loop over our possible keys
      // Build a regex that can match any possible key with required values substituted in
      possibleKeys.forEach((possibleKey) => {
        const rep = anonReps?.find((rep) => primaryKey in rep && rep[primaryKey] === possibleKey);

        let fieldRegex = '';
        // Rather than looping over the keys defined on the object,
        // loop over the base type def's keys. This enforces the correct order.
        fields[keyStr]?.repeatingKeys?.forEach((key) => {
          let val = rep?.[key];
          if (rep === undefined || !(key in rep)) {
            // If we don't have a value for this key
            // insert a placeholder, unless it's the primary key
            if (key === primaryKey)
              val = possibleKey;
            else
              val = matchDefault;
          }
          if (typeof val !== 'string') {
            if (!Array.isArray(val))
              val = matchDefault;
            else if (val.length < 1)
              val = matchDefault;
            else if (val.some((v) => typeof v !== 'string'))
              val = matchDefault;
          }
          fieldRegex += Regexes.maybeCapture(
            key === primaryKey ? false : capture,
            // All capturing groups are `fieldName` + `possibleKey`, e.g. `pairIsCasting1`
            fieldName + possibleKey,
            val,
            defaultFieldValue,
          ) +
            repeatingFieldsSeparator;
        });

        if (fieldRegex.length > 0) {
          str += `(?:${fieldRegex})${rep !== undefined ? '' : '?'}`;
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
        );
      } else {
        str += fieldValue;
      }
    }

    // Stop if we're not capturing and don't care about future fields.
    if (key >= maxKey)
      break;
  }

  str += '(?:$|:)';

  return Regexes.parse(str) as CactbotBaseRegExp<T>;
};

export const buildRegex = <T extends keyof NetParams>(
  type: T,
  params?: ParseHelperType<T>,
): CactbotBaseRegExp<T> => {
  return parseHelper(params, type, defaultParams(type, Regexes.logVersion));
};

export default class Regexes {
  static logVersion: LogDefinitionVersions = 'latest';

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-20-0x14-networkstartscasting
   */
  static startsUsing(params?: NetParams['StartsUsing']): CactbotBaseRegExp<'StartsUsing'> {
    return buildRegex('StartsUsing', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-21-0x15-networkability
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-22-0x16-networkaoeability
   */
  static ability(params?: NetParams['Ability']): CactbotBaseRegExp<'Ability'> {
    return buildRegex('Ability', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-21-0x15-networkability
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-22-0x16-networkaoeability
   *
   * @deprecated Use `ability` instead
   */
  static abilityFull(params?: NetParams['Ability']): CactbotBaseRegExp<'Ability'> {
    return this.ability(params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-27-0x1b-networktargeticon-head-marker
   */
  static headMarker(params?: NetParams['HeadMarker']): CactbotBaseRegExp<'HeadMarker'> {
    return buildRegex('HeadMarker', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-03-0x03-addcombatant
   */
  static addedCombatant(params?: NetParams['AddedCombatant']): CactbotBaseRegExp<'AddedCombatant'> {
    return buildRegex('AddedCombatant', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-03-0x03-addcombatant
   */
  static addedCombatantFull(
    params?: NetParams['AddedCombatant'],
  ): CactbotBaseRegExp<'AddedCombatant'> {
    return this.addedCombatant(params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-04-0x04-removecombatant
   */
  static removingCombatant(
    params?: NetParams['RemovedCombatant'],
  ): CactbotBaseRegExp<'RemovedCombatant'> {
    return buildRegex('RemovedCombatant', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-26-0x1a-networkbuff
   */
  static gainsEffect(params?: NetParams['GainsEffect']): CactbotBaseRegExp<'GainsEffect'> {
    return buildRegex('GainsEffect', params);
  }

  /**
   * Prefer gainsEffect over this function unless you really need extra data.
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-38-0x26-networkstatuseffects
   */
  static statusEffectExplicit(
    params?: NetParams['StatusEffect'],
  ): CactbotBaseRegExp<'StatusEffect'> {
    return buildRegex('StatusEffect', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-30-0x1e-networkbuffremove
   */
  static losesEffect(params?: NetParams['LosesEffect']): CactbotBaseRegExp<'LosesEffect'> {
    return buildRegex('LosesEffect', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-35-0x23-networktether
   */
  static tether(params?: NetParams['Tether']): CactbotBaseRegExp<'Tether'> {
    return buildRegex('Tether', params);
  }

  /**
   * 'target' was defeated by 'source'
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-25-0x19-networkdeath
   */
  static wasDefeated(params?: NetParams['WasDefeated']): CactbotBaseRegExp<'WasDefeated'> {
    return buildRegex('WasDefeated', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-24-0x18-networkdot
   */
  static networkDoT(params?: NetParams['NetworkDoT']): CactbotBaseRegExp<'NetworkDoT'> {
    return buildRegex('NetworkDoT', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static echo(params?: NetParams['GameLog']): CactbotBaseRegExp<'GameLog'> {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(
      params,
      'echo',
      ['type', 'timestamp', 'code', 'name', 'line', 'capture'],
    );
    params.code = '0038';
    return Regexes.gameLog(params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static dialog(params?: NetParams['GameLog']): CactbotBaseRegExp<'GameLog'> {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(
      params,
      'dialog',
      ['type', 'timestamp', 'code', 'name', 'line', 'capture'],
    );
    params.code = '0044';
    return Regexes.gameLog(params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static message(params?: NetParams['GameLog']): CactbotBaseRegExp<'GameLog'> {
    if (typeof params === 'undefined')
      params = {};
    Regexes.validateParams(
      params,
      'message',
      ['type', 'timestamp', 'code', 'name', 'line', 'capture'],
    );
    params.code = '0839';
    return Regexes.gameLog(params);
  }

  /**
   * fields: code, name, line, capture
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static gameLog(params?: NetParams['GameLog']): CactbotBaseRegExp<'GameLog'> {
    return buildRegex('GameLog', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static gameNameLog(params?: NetParams['GameLog']): CactbotBaseRegExp<'GameLog'> {
    // Backwards compatability.
    return Regexes.gameLog(params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-12-0x0c-playerstats
   */
  static statChange(params?: NetParams['PlayerStats']): CactbotBaseRegExp<'PlayerStats'> {
    return buildRegex('PlayerStats', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-01-0x01-changezone
   */
  static changeZone(params?: NetParams['ChangeZone']): CactbotBaseRegExp<'ChangeZone'> {
    return buildRegex('ChangeZone', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-33-0x21-network6d-actor-control
   */
  static network6d(params?: NetParams['ActorControl']): CactbotBaseRegExp<'ActorControl'> {
    return buildRegex('ActorControl', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-34-0x22-networknametoggle
   */
  static nameToggle(params?: NetParams['NameToggle']): CactbotBaseRegExp<'NameToggle'> {
    return buildRegex('NameToggle', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-40-0x28-map
   */
  static map(params?: NetParams['Map']): CactbotBaseRegExp<'Map'> {
    return buildRegex('Map', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-41-0x29-systemlogmessage
   */
  static systemLogMessage(
    params?: NetParams['SystemLogMessage'],
  ): CactbotBaseRegExp<'SystemLogMessage'> {
    return buildRegex('SystemLogMessage', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-257-0x101-mapeffect
   */
  static mapEffect(params?: NetParams['MapEffect']): CactbotBaseRegExp<'MapEffect'> {
    return buildRegex('MapEffect', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-261-0x105-combatantmemory
   */
  static combatantMemory(
    params?: NetParams['CombatantMemory'],
  ): CactbotBaseRegExp<'CombatantMemory'> {
    return buildRegex('CombatantMemory', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-263-0x107-startsusingextra
   */
  static startsUsingExtra(
    params?: NetParams['StartsUsingExtra'],
  ): CactbotBaseRegExp<'StartsUsingExtra'> {
    return buildRegex('StartsUsingExtra', params);
  }

  /**
   * matches: https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#line-264-0x108-abilityextra
   */
  static abilityExtra(
    params?: NetParams['AbilityExtra'],
  ): CactbotBaseRegExp<'AbilityExtra'> {
    return buildRegex('AbilityExtra', params);
  }

  /**
   * Helper function for building named capture group
   */
  static maybeCapture(
    capture: boolean,
    name: string,
    value: string | readonly string[] | undefined,
    defaultValue?: string,
  ): string {
    if (value === undefined)
      value = defaultValue ?? matchDefault;
    value = Regexes.anyOf(value);
    return capture ? Regexes.namedCapture(name, value) : value;
  }

  static optional(str: string): string {
    return `(?:${str})?`;
  }

  // Creates a named regex capture group named |name| for the match |value|.
  static namedCapture(name: string, value: string): string {
    if (name.includes('>'))
      console.error(`"${name}" contains ">".`);
    if (name.includes('<'))
      console.error(`"${name}" contains ">".`);

    return `(?<${name}>${value})`;
  }

  /**
   * Convenience for turning multiple args into a unioned regular expression.
   * anyOf(x, y, z) or anyOf([x, y, z]) do the same thing, and return (?:x|y|z).
   * anyOf(x) or anyOf(x) on its own simplifies to just x.
   * args may be strings or RegExp, although any additional markers to RegExp
   * like /insensitive/i are dropped.
   */
  static anyOf(...args: (string | readonly string[] | RegExp)[]): string {
    const anyOfArray = (array: readonly (string | RegExp)[]): string => {
      const [elem] = array;
      if (elem !== undefined && array.length === 1)
        return `${elem instanceof RegExp ? elem.source : elem}`;
      return `(?:${array.map((elem) => elem instanceof RegExp ? elem.source : elem).join('|')})`;
    };
    let array: readonly (string | RegExp)[] = [];
    const [firstArg] = args;
    if (args.length === 1) {
      if (typeof firstArg === 'string' || firstArg instanceof RegExp)
        array = [firstArg];
      else if (Array.isArray(firstArg))
        array = firstArg;
      else
        array = [];
    } else {
      // TODO: more accurate type instead of `as` cast
      array = args as readonly string[];
    }
    return anyOfArray(array);
  }

  static parse(regexpString: RegExp | string | CactbotBaseRegExp<'None'>): RegExp {
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
      modifiers += regexpString.multiline ? 'm' : '';
    return new RegExp(regex.source, modifiers);
  }

  static trueIfUndefined(value?: boolean): boolean {
    if (typeof value === 'undefined')
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
    for (const key of keys) {
      if (!params.includes(key)) {
        throw new Error(
          `${funcName}: invalid parameter '${key}'.  ` +
            `Valid params: ${JSON.stringify(params)}`,
        );
      }
    }
  }
}
