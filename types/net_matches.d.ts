import { RepeatingFieldsDefinitions, RepeatingFieldsTypes } from '../resources/netlog_defs';

import { NetFields } from './net_fields';
import { TriggerTypes } from './net_trigger';

export type Matches = { [s: string]: string };
export type ToMatches<Fields> = Record<keyof Fields, string>;

export type RepeatingFieldsMatchesExtract<type extends RepeatingFieldsTypes> = {
  [
    key in RepeatingFieldsDefinitions[type]['repeatingFields']['possibleKeys'][
      number
    ] as `${RepeatingFieldsDefinitions[type]['repeatingFields']['label']}${key}`
  ]?: string;
};

export type RepeatingFieldsMatches<
  type extends TriggerTypes,
  repeatingType extends RepeatingFieldsTypes = type extends RepeatingFieldsTypes ? type : never,
> = repeatingType extends RepeatingFieldsTypes ? RepeatingFieldsMatchesExtract<repeatingType>
  : never;

export type NetMatches = {
  [type in TriggerTypes]: type extends 'None' ? Matches :
    & Matches
    & (type extends RepeatingFieldsTypes
      ? (RepeatingFieldsMatches<type> & ToMatches<NetFields[type]>)
      : ToMatches<NetFields[type]>);
};

export type NetAnyMatches = NetMatches[keyof NetMatches];
