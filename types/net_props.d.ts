import { NetFields } from './net_fields';

type Params<T extends string> =
    Partial<Record<Exclude<T, 'timestamp' | 'capture'>, string | string[]> &
    { 'timestamp': string; 'capture': boolean }>;

export type NetProps = {
  [type in keyof NetFields]: keyof NetFields[type];
};

export type NetParams = {
  [type in keyof NetProps]: Params<NetProps[type]>;
};
