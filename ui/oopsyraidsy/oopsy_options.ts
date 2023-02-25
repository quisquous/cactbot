import ContentType from '../../resources/content_type';
import UserConfig from '../../resources/user_config';
import ZoneId from '../../resources/zone_id';
import { BaseOptions } from '../../types/data';
import { LooseOopsyTriggerSet } from '../../types/oopsy';
import { ZoneIdType } from '../../types/trigger';

export type DisabledTriggers = { [triggerId: string]: boolean };
export type TriggerAutoConfig = { enabled: boolean };
export type PerTriggerAutoConfig = { [triggerId: string]: TriggerAutoConfig };

type OopsyNonConfigOptions = {
  Triggers: LooseOopsyTriggerSet[];
  PlayerNicks: { [gameName: string]: string };
  DisabledTriggers: DisabledTriggers;
  // TODO: should content_type export what type it is?
  IgnoreContentTypes: number[];
  IgnoreZoneIds: ZoneIdType[];
  PerTriggerAutoConfig: PerTriggerAutoConfig;
};

const defaultOopsyNonConfigOptions: OopsyNonConfigOptions = {
  Triggers: [],
  PlayerNicks: {},
  DisabledTriggers: {},
  IgnoreContentTypes: [
    ContentType.Pvp,
    ContentType.Eureka,
  ],
  IgnoreZoneIds: [
    // Bozja zones have an (unnamed) content type of 29 which also applies
    // to Delubrum Reginae (which we want oopsy on).  So, ignore by zone.
    ZoneId.TheBozjanSouthernFront,
    ZoneId.Zadnor,
  ],

  PerTriggerAutoConfig: {},
};

// TODO: figure out how to get this type from oopsyraidsy_config??
// These values are overwritten and are just here for typing.

export type DeathReportSide = 'left' | 'right' | 'disabled';

type OopsyConfigOptions = {
  NumLiveListItemsInCombat: number;
  MinimumTimeForPullMistake: number;
  TimeToShowDeathReportMs: number;
  DeathReportSide: DeathReportSide;
};

const defaultOopsyConfigOptions: OopsyConfigOptions = {
  NumLiveListItemsInCombat: 5,
  MinimumTimeForPullMistake: 0.4,
  TimeToShowDeathReportMs: 4000,
  DeathReportSide: 'left',
};

export interface OopsyOptions extends BaseOptions, OopsyNonConfigOptions, OopsyConfigOptions {}

// See user/raidboss-example.js for documentation.
const Options: OopsyOptions = {
  ...UserConfig.getDefaultBaseOptions(),
  ...defaultOopsyNonConfigOptions,
  ...defaultOopsyConfigOptions,
};

export default Options;
