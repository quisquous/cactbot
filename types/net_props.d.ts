import { NetAllFields } from './net_fields';


type Params<T extends string> =
    Partial<Record<Exclude<T, 'timestamp' | 'capture'>, string | string[]> &
    { 'timestamp': string; 'capture': boolean }>;

export type NetAllProps = {
  [type in keyof NetAllFields]: keyof NetAllFields[type];
};

export type NetAllParams = {
  [type in keyof NetAllProps]: Params<NetAllProps[type]>;
};
