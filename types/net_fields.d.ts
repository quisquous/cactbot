import logDefinitions from '../resources/netlog_defs';

type Fields = {
  type: 0;
  timestamp: 1;
};

export type NetFields =
  & {
    [Key in keyof typeof logDefinitions]: (typeof logDefinitions[Key])['fields'];
  }
  & {
    'None': Fields;
  };

export type NetAnyFields = NetFields[keyof NetFields];
