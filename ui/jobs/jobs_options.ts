import UserConfig from '../../resources/user_config';
import { BaseOptions } from '../../types/data';
import { Job } from '../../types/job';

import { BuffInfo } from './buff_tracker';

export interface JobsNonConfigOptions {
  JustBuffTracker: boolean;
  LowerOpacityOutOfCombat: boolean;
  OpacityOutOfCombat: number;
  PlayCountdownSound: boolean;
  CountdownSoundVolume: number;
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
  NotifyExpiredProcsInCombat: number;
  NotifyExpiredProcsInCombatSound: 'disabled' | 'expired' | 'threshold';
  CompactView: boolean;
  OptionAST: 'disabled' | 'onlyBar' | 'enabled';
  OptionBLM: 'disabled' | 'onlyBar' | 'enabled';
  OptionBLU: 'disabled' | 'onlyBar' | 'enabled';
  OptionBRD: 'disabled' | 'onlyBar' | 'enabled';
  OptionDNC: 'disabled' | 'onlyBar' | 'enabled';
  OptionDRG: 'disabled' | 'onlyBar' | 'enabled';
  OptionDRK: 'disabled' | 'onlyBar' | 'enabled';
  OptionGNB: 'disabled' | 'onlyBar' | 'enabled';
  OptionMCH: 'disabled' | 'onlyBar' | 'enabled';
  OptionMNK: 'disabled' | 'onlyBar' | 'enabled';
  OptionNIN: 'disabled' | 'onlyBar' | 'enabled';
  OptionPLD: 'disabled' | 'onlyBar' | 'enabled';
  OptionRDM: 'disabled' | 'onlyBar' | 'enabled';
  OptionRPR: 'disabled' | 'onlyBar' | 'enabled';
  OptionSAM: 'disabled' | 'onlyBar' | 'enabled';
  OptionSCH: 'disabled' | 'onlyBar' | 'enabled';
  OptionSGE: 'disabled' | 'onlyBar' | 'enabled';
  OptionSMN: 'disabled' | 'onlyBar' | 'enabled';
  OptionWAR: 'disabled' | 'onlyBar' | 'enabled';
  OptionWHM: 'disabled' | 'onlyBar' | 'enabled';
}

export interface JobsConfigOptions {
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

const defaultJobsNonConfigOptions: JobsNonConfigOptions = {
  JustBuffTracker: false,
  LowerOpacityOutOfCombat: true,
  OpacityOutOfCombat: 0.5,
  PlayCountdownSound: true,
  CountdownSoundVolume: 0.3,
  HideWellFedAboveSeconds: 15 * 60,
  ShowMPTickerOutOfCombat: false,
  MidHealthThresholdPercent: 0.8,
  LowHealthThresholdPercent: 0.2,
  BigBuffShowCooldownSeconds: 20,
  BigBuffIconWidth: 44,
  BigBuffIconHeight: 32,
  BigBuffBarHeight: 5,
  BigBuffTextHeight: 0,
  BigBuffBorderSize: 1,
  GpAlarmPoint: 0,
  GpAlarmSoundVolume: 0.8,
  NotifyExpiredProcsInCombat: 5,
  NotifyExpiredProcsInCombatSound: 'threshold',
  CompactView: false,
  OptionAST: 'enabled',
  OptionBLM: 'enabled',
  OptionBLU: 'enabled',
  OptionBRD: 'enabled',
  OptionDNC: 'enabled',
  OptionDRG: 'enabled',
  OptionDRK: 'enabled',
  OptionGNB: 'enabled',
  OptionMCH: 'enabled',
  OptionMNK: 'enabled',
  OptionNIN: 'enabled',
  OptionPLD: 'enabled',
  OptionRDM: 'enabled',
  OptionRPR: 'enabled',
  OptionSAM: 'enabled',
  OptionSCH: 'enabled',
  OptionSGE: 'enabled',
  OptionSMN: 'enabled',
  OptionWAR: 'enabled',
  OptionWHM: 'enabled',
};

// See user/jobs-example.js for documentation.
const defaultJobsConfigOptions: JobsConfigOptions = {
  ShowHPNumber: ['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'SCH', 'AST', 'SGE', 'BLU'],
  ShowMPNumber: ['PLD', 'DRK', 'WHM', 'SCH', 'AST', 'SGE', 'BLM', 'BLU'],

  ShowMPTicker: ['BLM'],

  MaxLevel: 80,

  PerBuffOptions: {
    // This is noisy since it's more or less permanently on you.
    // Players are unlikely to make different decisions based on this.
    standardFinish: {
      hide: true,
    },
  },

  FarThresholdOffence: 24,
  PldMediumMPThreshold: 6199,
  PldLowMPThreshold: 4399,
  DrkMediumMPThreshold: 5999,
  DrkLowMPThreshold: 2999,
  // One more fire IV and then despair.
  BlmMediumMPThreshold: 3999,
  // Should cast despair.
  BlmLowMPThreshold: 2399,
};

export interface JobsOptions extends BaseOptions, JobsConfigOptions, JobsNonConfigOptions {}

const Options: JobsOptions = {
  ...UserConfig.getDefaultBaseOptions(),
  ...defaultJobsNonConfigOptions,
  ...defaultJobsConfigOptions,
};

export default Options;
