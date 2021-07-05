import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

// O7S - Sigmascape 3.0 Savage
export default {
  zoneId: ZoneId.SigmascapeV30Savage,
  damageFail: {
    'O7S Missile': '2782',
    'O7S Chain Cannon': '278F',
  },
  damageWarn: {
    'O7S Searing Wind': '2777',
  },
  triggers: [
    {
      id: 'O7S Stoneskin',
      netRegex: NetRegexes.ability({ id: '2AB5' }),
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches.source, text: matches.ability };
      },
    },
  ],
};
