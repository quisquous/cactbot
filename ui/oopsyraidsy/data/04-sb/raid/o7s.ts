import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: missing many abilities here

// O7S - Sigmascape 3.0 Savage
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.SigmascapeV30Savage,
  damageWarn: {
    'O7S Searing Wind': '2777',
  },
  damageFail: {
    'O7S Missile': '2782',
    'O7S Chain Cannon': '278F',
  },
  triggers: [
    {
      id: 'O7S Stoneskin',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '2AB5' }),
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.source, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
