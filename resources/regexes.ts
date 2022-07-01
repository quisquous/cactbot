import { NetFieldsReverse } from '../types/net_fields';
import { NetParams } from '../types/net_props';
import { CactbotBaseRegExp } from '../types/net_trigger';

import logDefinitions, {
  logDefinitionsVersions,
  LogDefinitionTypes,
  LogDefinitionVersions,
  ParseHelperFields,
} from './netlog_defs';

const separator = ':';
const matchDefault = '[^:]*';
const matchWithColonsDefault = '(?:[^:]|: )*?';
const fieldsWithPotentialColons = ['effect', 'ability'];

const defaultParams = <
  T extends LogDefinitionTypes,
  V extends LogDefinitionVersions,
>(type: T, version: V, include?: string[]): Partial<ParseHelperFields<T>> => {
  include ??= Object.keys(logDefinitionsVersions[version][type].fields);
  const params: { [index: number]: { field: string; value?: string; optional: boolean } } = {};
  const firstOptionalField = logDefinitionsVersions[version][type].firstOptionalField;

  for (const [prop, index] of Object.entries(logDefinitionsVersions[version][type].fields)) {
    if (!include.includes(prop))
      continue;
    const param: { field: string; value?: string; optional: boolean } = {
      field: prop,
      optional: firstOptionalField !== undefined && index >= firstOptionalField,
    };
    if (prop === 'type')
      param.value = logDefinitionsVersions[version][type].type;

    params[index] = param;
  }

  return params as unknown as Partial<ParseHelperFields<T>>;
};

type ParseHelperType<T extends LogDefinitionTypes> =
  & {
    [field in Extract<keyof NetFieldsReverse[T], string>]?: string;
  }
  & { capture?: boolean };

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
  const hexCode = defKey !== 'Ability'
    ? `00${parseInt(logDefinitions[defKey].type).toString(16)}`.slice(-2).toUpperCase()
    : abilityHexCode;

  let str = '';
  if (capture)
    str += `(?<timestamp>\\y{Timestamp}) ${prefix} (?<type>${hexCode})`;
  else
    str += `\\y{Timestamp} ${prefix} ${hexCode}`;

  let lastKey = 1;
  for (const keyStr in fields) {
    const fieldName = fields[keyStr]?.field;

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

    const value = fields[keyStr];
    if (typeof value !== 'object')
      throw new Error(`${defKey}: invalid value: ${JSON.stringify(value)}`);

    const fieldDefault = fieldName !== undefined && fieldsWithPotentialColons.includes(fieldName)
      ? matchWithColonsDefault
      : matchDefault;
    const fieldValue = fields[keyStr]?.value?.toString() ?? fieldDefault;

    if (fieldName !== undefined) {
      str += Regexes.maybeCapture(
        // more accurate type instead of `as` cast
        // maybe this function needs a refactoring
        capture,
        fieldName,
        params[fieldName],
        fieldValue,
      );
    } else {
      str += fieldValue;
    }

    // Stop if we're not capturing and don't care about future fields.
    if (key >= maxKey)
      break;
  }

  str += '(?:$|:)';

  return Regexes.parse(str) as CactbotBaseRegExp<T>;
};

export default class Regexes {
  static logVersion: LogDefinitionVersions = 'latest';

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-20-0x14-networkstartscasting
   */
  static startsUsing(params?: NetParams['StartsUsing']): CactbotBaseRegExp<'StartsUsing'> {
    return parseHelper(params, 'StartsUsing', defaultParams('StartsUsing', Regexes.logVersion));
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-21-0x15-networkability
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-22-0x16-networkaoeability
   */
  static ability(params?: NetParams['Ability']): CactbotBaseRegExp<'Ability'> {
    return parseHelper(params, 'Ability', defaultParams('Ability', Regexes.logVersion));
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
    return parseHelper(params, 'HeadMarker', defaultParams('HeadMarker', Regexes.logVersion));
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-03-0x03-addcombatant
   */
  static addedCombatant(params?: NetParams['AddedCombatant']): CactbotBaseRegExp<'AddedCombatant'> {
    return parseHelper(
      params,
      'AddedCombatant',
      defaultParams('AddedCombatant', Regexes.logVersion, [
        'type',
        'timestamp',
        'id',
        'name',
      ]),
    );
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-03-0x03-addcombatant
   */
  static addedCombatantFull(
    params?: NetParams['AddedCombatant'],
  ): CactbotBaseRegExp<'AddedCombatant'> {
    return parseHelper(
      params,
      'AddedCombatant',
      defaultParams('AddedCombatant', Regexes.logVersion),
    );
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-04-0x04-removecombatant
   */
  static removingCombatant(
    params?: NetParams['RemovedCombatant'],
  ): CactbotBaseRegExp<'RemovedCombatant'> {
    return parseHelper(
      params,
      'RemovedCombatant',
      defaultParams('RemovedCombatant', Regexes.logVersion),
    );
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-26-0x1a-networkbuff
   */
  static gainsEffect(params?: NetParams['GainsEffect']): CactbotBaseRegExp<'GainsEffect'> {
    return parseHelper(params, 'GainsEffect', defaultParams('GainsEffect', Regexes.logVersion));
  }

  /**
   * Prefer gainsEffect over this function unless you really need extra data.
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-38-0x26-networkstatuseffects
   */
  static statusEffectExplicit(
    params?: NetParams['StatusEffect'],
  ): CactbotBaseRegExp<'StatusEffect'> {
    return parseHelper(params, 'StatusEffect', defaultParams('StatusEffect', Regexes.logVersion));
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-30-0x1e-networkbuffremove
   */
  static losesEffect(params?: NetParams['LosesEffect']): CactbotBaseRegExp<'LosesEffect'> {
    return parseHelper(params, 'LosesEffect', defaultParams('LosesEffect', Regexes.logVersion));
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-35-0x23-networktether
   */
  static tether(params?: NetParams['Tether']): CactbotBaseRegExp<'Tether'> {
    return parseHelper(params, 'Tether', defaultParams('Tether', Regexes.logVersion));
  }

  /**
   * 'target' was defeated by 'source'
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-25-0x19-networkdeath
   */
  static wasDefeated(params?: NetParams['WasDefeated']): CactbotBaseRegExp<'WasDefeated'> {
    return parseHelper(params, 'WasDefeated', defaultParams('WasDefeated', Regexes.logVersion));
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
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
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
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
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
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
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static gameLog(params?: NetParams['GameLog']): CactbotBaseRegExp<'GameLog'> {
    return parseHelper(params, 'GameLog', defaultParams('GameLog', Regexes.logVersion));
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-00-0x00-logline
   */
  static gameNameLog(params?: NetParams['GameLog']): CactbotBaseRegExp<'GameLog'> {
    // Backwards compatability.
    return Regexes.gameLog(params);
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-12-0x0c-playerstats
   */
  static statChange(params?: NetParams['PlayerStats']): CactbotBaseRegExp<'PlayerStats'> {
    return parseHelper(params, 'PlayerStats', defaultParams('PlayerStats', Regexes.logVersion));
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-01-0x01-changezone
   */
  static changeZone(params?: NetParams['ChangeZone']): CactbotBaseRegExp<'ChangeZone'> {
    return parseHelper(params, 'ChangeZone', defaultParams('ChangeZone', Regexes.logVersion));
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-33-0x21-network6d-actor-control
   */
  static network6d(params?: NetParams['ActorControl']): CactbotBaseRegExp<'ActorControl'> {
    return parseHelper(params, 'ActorControl', defaultParams('ActorControl', Regexes.logVersion));
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-34-0x22-networknametoggle
   */
  static nameToggle(params?: NetParams['NameToggle']): CactbotBaseRegExp<'NameToggle'> {
    return parseHelper(params, 'NameToggle', defaultParams('NameToggle', Regexes.logVersion));
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-40-0x28-map
   */
  static map(params?: NetParams['Map']): CactbotBaseRegExp<'Map'> {
    return parseHelper(params, 'Map', defaultParams('Map', Regexes.logVersion));
  }

  /**
   * matches: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md#line-41-0x29-systemlogmessage
   */
  static systemLogMessage(
    params?: NetParams['SystemLogMessage'],
  ): CactbotBaseRegExp<'SystemLogMessage'> {
    return parseHelper(
      params,
      'SystemLogMessage',
      defaultParams('SystemLogMessage', Regexes.logVersion),
    );
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
  static anyOf(...args: (string | string[] | RegExp)[]): string {
    const anyOfArray = (array: (string | RegExp)[]): string => {
      const [elem] = array;
      if (elem !== undefined && array.length === 1)
        return `${elem instanceof RegExp ? elem.source : elem}`;
      return `(?:${array.map((elem) => elem instanceof RegExp ? elem.source : elem).join('|')})`;
    };
    let array: (string | RegExp)[] = [];
    if (args.length === 1) {
      if (Array.isArray(args[0]))
        array = args[0];
      else if (args[0] !== undefined)
        array = [args[0]];
      else
        array = [];
    } else {
      // TODO: more accurate type instead of `as` cast
      array = args as string[];
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
