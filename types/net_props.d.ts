import {
  LogDefinitionTypes,
  RepeatingFieldsDefintions,
  RepeatingFieldsTypes,
} from '../resources/netlog_defs';

import { NetFields } from './net_fields';

type ArrayIndexes<T extends readonly unknown[]> = Exclude<Partial<T>['length'], T['length']>;

type RepeatingFieldsExtract<
  TKey extends RepeatingFieldsTypes,
> = {
  // This syntax is a bit weird to make typescript compiler happy
  [
    label in RepeatingFieldsDefintions[TKey]['repeatingFields'][
      'label'
    ] as `${RepeatingFieldsDefintions[TKey]['repeatingFields']['label']}`
  ]?: {
    [name in RepeatingFieldsDefintions[TKey]['repeatingFields']['names'][number]]:
      | string
      | string[];
  }[];
};

type RepeatingFieldsParams<
  type extends LogDefinitionTypes,
  repeatingType extends RepeatingFieldsTypes = type extends RepeatingFieldsTypes ? type : never,
> = repeatingType extends RepeatingFieldsTypes ? RepeatingFieldsExtract<repeatingType>
  : never;

type Params<T extends string> = Partial<
  & Record<Exclude<T, 'timestamp' | 'capture'>, string | string[]>
  & { 'timestamp': string; 'capture': boolean }
>;

type RepeatingFieldsParamsExtract<
  type extends LogDefinitionTypes,
> = type extends RepeatingFieldsTypes ? RepeatingFieldsParams<type> & Params<NetProps[type]> :
  never;

export type NetProps = {
  [type in keyof NetFields]: keyof NetFields[type];
};

export type NetParams = {
  [type in keyof NetProps]: RepeatingFieldsParamsExtract<type> | Params<NetProps[type]>;
};
