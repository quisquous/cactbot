import ContentType from '../../resources/content_type';
import ZoneId from '../../resources/zone_id';
import ZoneInfo from '../../resources/zone_info';

import { abilityNameMap } from './ability_name_map';

const defaultOopsyConfigOptions = {
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

  AbilityIdNameMap: abilityNameMap,
};

export default defaultOopsyConfigOptions;
