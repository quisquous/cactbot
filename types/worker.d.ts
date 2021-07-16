import Encounter from '../ui/raidboss/emulator/data/Encounter';

export type DoneMessage = {
  type: 'done';
};

export type EncounterMessage = {
  type: 'encounter';
  encounter: Encounter;
  name: string;
};

export type ProgressMessage = {
  type: 'progress';
  lines: number;
  bytes: number;
  totalBytes: number;
};

export type ConverterWorkerMessage = DoneMessage | EncounterMessage | ProgressMessage;
