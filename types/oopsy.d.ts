import { Lang } from '../resources/languages';

import { OopsyData } from './data';
import { NetAnyMatches, NetMatches } from './net_matches';
import { CactbotBaseRegExp, TriggerTypes } from './net_trigger';
import { LocaleText, ZoneId } from './trigger';

export type OopsyMistakeType = 'pull' | 'warn' | 'fail' | 'potion' | 'death' | 'wipe' | 'damage' | 'heal' | 'good';

export type OopsyField = boolean | number | string |
  OopsyMistake | OopsyMistake[] | OopsyDeathReason | void;

export type OopsyMistake = {
  type: OopsyMistakeType;
  name?: string;
  // TODO: docs say blame can be an array but the code does not support that.
  blame?: string;
  text: string | LocaleText;
}

export type OopsyDeathReason = {
  name: string;
  text: string | LocaleText;
}

export type OopsyFunc<Data extends OopsyData, MatchType extends NetAnyMatches, Return> =
    (data: Data, matches: MatchType) => Return;

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

type OopsyTriggerRegex<T extends TriggerTypes> = {
  type: T;
  netRegex: CactbotBaseRegExp<T>;
  netRegexDe?: CactbotBaseRegExp<T>;
  netRegexFr?: CactbotBaseRegExp<T>;
  netRegexJa?: CactbotBaseRegExp<T>;
  netRegexCn?: CactbotBaseRegExp<T>;
  netRegexKo?: CactbotBaseRegExp<T>;
};

export type OopsyTriggerGeneric<Data, T> = BaseOopsyTrigger<Data, T> & OopsyTriggerRegex<T>;

export type OopsyTrigger<Data extends OopsyData> =
  (TriggerTypes extends infer T ? T extends TriggerTypes ?
    OopsyTriggerGeneric<Data, T> : never : never) | {
    // Triggers that want to show up in the UI but are implemented internally.
    id: string;
    };

type MistakeMap = { [mistakeId: string]: string };

type SimpleOopsyTriggerSet = {
  zoneId: ZoneId | ZoneId[];
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
  BaseOopsyTrigger<OopsyData, 'None'> & OopsyTriggerRegex<'None'>
>;

export type LooseOopsyTriggerSet = Exclude<Partial<OopsyTriggerSet<OopsyData>>, 'triggers'> & {
  zoneRegex?: RegExp | { [lang in Lang]?: RegExp };
  triggers?: LooseOopsyTrigger[];
}
