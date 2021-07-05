import { OopsyData } from './data';
import { NetMatches } from './net_matches';
import { CactbotBaseRegExp, TriggerTypes } from './net_trigger';
import { LocaleText, ZoneId } from './trigger';

export type OopsyMistakeType = 'pull' | 'warn' | 'fail' | 'potion' | 'death' | 'wipe';

export type OopsyMistake = {
  type: OopsyMistakeType;
  name?: string;
  // TODO: docs say blame can be an array but the code does not support that.
  blame?: string;
  text?: string | LocaleText;
  // TODO: remove fullText.
  fullText?: string | LocaleText;
};

export type OopsyDeathReason = {
  name?: string;
  reason?: string | LocaleText;
}

export type OopsyFunc<Data extends OopsyData, MatchType extends NetAnyMatches, Return> =
    (evt: never, data: Data, matches: MatchType) => Return;

export type OopsyTriggerField<Data extends OopsyData,
    MatchType extends NetAnyMatches, Return> =
  [Return] extends [void] ? OopsyFunc<Data, MatchType, void> :
  OopsyFunc<Data, MatchType, Return | undefined> | Return | undefined;

export type BaseOopsyTrigger<Data, Type extends TriggerTypes> = {
  id: string;
  condition?: OopsyTriggerField<Data, NetMatches[Type], boolean>;
  delaySeconds?: OopsyTriggerField<Data, NetMatches[Type], number>;
  suppressSeconds?: OopsyTriggerField<Data, NetMatches[Type], number>;
  deathReason?: OopsyTriggerField<Data, NetMatches[Type], OopsyDeathReason>;
  mistake?: OopsyTriggerField<Data, NetMatches[Type], OopsyMistake | OopsyMistake[]>;
  run?: OopsyTriggerField<Data, NetMatches[Type], void>;
};

type PartialOopsyTrigger<T extends TriggerTypes> = {
  type: T;
  netRegex: CactbotBaseRegExp<T>;
  netRegexDe?: CactbotBaseRegExp<T>;
  netRegexFr?: CactbotBaseRegExp<T>;
  netRegexJa?: CactbotBaseRegExp<T>;
  netRegexCn?: CactbotBaseRegExp<T>;
  netRegexKo?: CactbotBaseRegExp<T>;
};

export type OopsyTrigger<Data extends OopsyData> =
  TriggerTypes extends infer T ? T extends TriggerTypes ?
  (BaseOopsyTrigger<Data, T> & PartialOopsyTrigger<T>) : never : never;

type MistakeMap = { [mistakeId: string]: string };

export type SimpleOopsyTriggerSet = {
  zoneId: ZoneId;
  damageWarn?: MistakeMap;
  damageFail?: MistakeMap;
  gainsEffectWarn?: MistakeMap;
  gainsEffectFail?: MistakeMap;
  shareWarn?: MistakeMap;
  shareFail?: MistakeMap;
  soloWarn?: MistakeMap;
  soloFail?: MistakeMap;
}

export type OopsyTriggerSet<Data extends OopsyData> = SimpleOopsyTriggerSet & {
  triggers?: OopsyTrigger<Data>[];
}

export type LooseOopsyTrigger = Partial<
  BaseOopsyTrigger<Data, 'None'> & PartialOopsyTrigger<'None'>
>;

export type LooseOopsyTriggerSet = Exclude<Partial<OopsyTriggerSet<OopsyData>>, 'triggers'> & {
  zoneRegex?: RegExp | { [lang in Lang]?: RegExp };
  triggers?: LooseOopsyTrigger[];
}
