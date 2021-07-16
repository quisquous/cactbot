import { Lang } from '../../resources/languages';
import UserConfig from '../../resources/user_config';
import { BaseOptions, RaidbossData } from '../../types/data';
import { Matches } from '../../types/net_matches';
import { LooseTriggerSet, TriggerAutoConfig, TriggerField, TriggerOutput } from '../../types/trigger';

// This file defines the base options that raidboss expects to see.

// Backwards compat for this old style of overriding triggers.
// TODO: we should probably deprecate and remove this.
export type PerTriggerOption = Partial<{
  TextAlert: boolean;
  SoundAlert: boolean;
  SpeechAlert: boolean;
  GroupSpeechAlert: boolean; // TODO: we should remove this
  SoundOverride: string;
  VolumeOverride: number;
  Condition: TriggerField<RaidbossData, Matches, boolean>;
  InfoText: TriggerOutput<RaidbossData, Matches>;
  AlertText: TriggerOutput<RaidbossData, Matches>;
  AlarmText: TriggerOutput<RaidbossData, Matches>;
  TTSText: TriggerOutput<RaidbossData, Matches>;
}>;

export type PerTriggerAutoConfig = { [triggerId: string]: TriggerAutoConfig };
export type PerTriggerOptions = { [triggerId: string]: PerTriggerOption };
export type DisabledTriggers = { [triggerId: string]: boolean };

type RaidbossNonConfigOptions = {
  PlayerNicks: { [gameName: string]: string };
  InfoSound: string;
  AlertSound: string;
  AlarmSound: string;
  LongSound: string;
  PullSound: string;
  AudioAllowed: boolean;
  DisabledTriggers: DisabledTriggers;
  PerTriggerAutoConfig: PerTriggerAutoConfig;
  PerTriggerOptions: PerTriggerOptions;
  Triggers: LooseTriggerSet[];
  PlayerNameOverride?: string;
  IsRemoteRaidboss: boolean;
  // Transforms text before passing it to TTS.
  TransformTts: (text: string) => string;
};

// These options are ones that are not auto-defined by raidboss_config.js.
const defaultRaidbossNonConfigOptions: RaidbossNonConfigOptions = {
  PlayerNicks: {},

  InfoSound: '../../resources/sounds/freesound/percussion_hit.ogg',
  AlertSound: '../../resources/sounds/BigWigs/Alert.ogg',
  AlarmSound: '../../resources/sounds/BigWigs/Alarm.ogg',
  LongSound: '../../resources/sounds/BigWigs/Long.ogg',
  PullSound: '../../resources/sounds/freesound/sonar.ogg',

  AudioAllowed: true,

  DisabledTriggers: {},

  PerTriggerAutoConfig: {},
  PerTriggerOptions: {},

  Triggers: [],

  IsRemoteRaidboss: false,

  TransformTts: (t) => t,
};

// TODO: figure out how to get this type from raidboss_config??
// These values are overwritten and are just here for typing.
const defaultRaidbossConfigOptions = {
  Debug: false,
  DefaultAlertOutput: 'textAndSound',
  AlertsLanguage: undefined as (Lang | undefined),
  TimelineLanguage: undefined as (Lang | undefined),
  TimelineEnabled: true,
  AlertsEnabled: true,
  ShowTimerBarsAtSeconds: 30,
  KeepExpiredTimerBarsForSeconds: 0.7,
  BarExpiresSoonSeconds: 6,
  MaxNumberOfTimerBars: 6,
  DisplayAlarmTextForSeconds: 3,
  DisplayAlertTextForSeconds: 3,
  DisplayInfoTextForSeconds: 3,
  AlarmSoundVolume: 1,
  AlertSoundVolume: 1,
  InfoSoundVolume: 1,
  LongSoundVolume: 1,
  PullSoundVolume: 1,
  cactbotWormholeStrat: false,
  cactbote8sUptimeKnockbackStrat: false,
};
type RaidbossConfigOptions = typeof defaultRaidbossConfigOptions;

export interface RaidbossOptions
  extends BaseOptions, RaidbossNonConfigOptions, RaidbossConfigOptions {}

// See user/raidboss-example.js for documentation.
const Options: RaidbossOptions = {
  ...UserConfig.getDefaultBaseOptions(),
  ...defaultRaidbossNonConfigOptions,
  ...defaultRaidbossConfigOptions,
};

export default Options;
