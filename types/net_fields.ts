import { LogDefinitions, LogDefinitionTypes } from '../resources/netlog_defs';

// This type helper reverses the keys and values of a given type, e.g this:
// {1: 'a'}
// becomes this:
// {a: 1}
type Reverse<T extends { [f: string]: number }> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? K : never;
  }[keyof T];
};

export type NetFields = {
  [type in LogDefinitionTypes]: LogDefinitions[type]['fields'];
};

export type NetFieldsReverse = {
  [type in LogDefinitionTypes]: Reverse<LogDefinitions[type]['fields']>;
};

export type NetAnyFields = NetFields[keyof NetFields];
