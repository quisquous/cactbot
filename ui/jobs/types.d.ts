import { BaseOptions } from '../../types/data';
import { Job } from '../../types/job';
import { BuffInfo } from './buff_tracker';

export interface NonConfigOptions extends BaseOptions {
  JustBuffTracker: boolean;
  LowerOpacityOutOfCombat: boolean;
  OpacityOutOfCombat: number;
  PlayCountdownSound: boolean;
  HideWellFedAboveSeconds: number;
  ShowMPTickerOutOfCombat: boolean;
  MidHealthThresholdPercent: number;
  LowHealthThresholdPercent: number;
  BigBuffShowCooldownSeconds: number;
  BigBuffIconWidth: number;
  BigBuffIconHeight: number;
  BigBuffBarHeight: number;
  BigBuffTextHeight: number;
  BigBuffBorderSize: number;
  GpAlarmPoint: number;
  GpAlarmSoundVolume: number;
}

export interface ConfigOptions {
  ShowHPNumber: Job[];
  ShowMPNumber: Job[];
  ShowMPTicker: Job[];

  MaxLevel: number;

  PerBuffOptions: {
    [s: string]: Partial<BuffInfo>;
  };

  FarThresholdOffence: number;
  PldMediumMPThreshold: number;
  PldLowMPThreshold: number;
  DrkMediumMPThreshold: number;
  DrkLowMPThreshold: number;
  /**  One more fire IV and then despair. */
  BlmMediumMPThreshold: number;
  /** Should cast despair. */
  BlmLowMPThreshold: number;
}

export type JobsOptions = NonConfigOptions & ConfigOptions;

export type JobFunc = (id: string, matches: Matches) => void;
