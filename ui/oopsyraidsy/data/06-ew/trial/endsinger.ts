import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheFinalDay,
  damageWarn: {
    'Endsinger Stellar Collision 1': '662E', // planet collision
    'Endsinger Stellar Collision 2': '663B', // planet collision
    'Endsinger Elenchos Middle': '6644', // middle laser
    'Endsinger Elenchos Sides': '6643', // side lasers
    'Endsinger Elenchos Heads': '663E', // head lasers
    'Endsinger Feather of Despair Pharmakon': '664C', // feather circles after Death's Embrace
    'Endsinger Epigonoi': '664C', // circles after Ekstasis that spawn heads with puddles
    'Endsinger Misery': '6648', // black puddles
    'Endsinger Interstellar': '67FB', // large line dive (with spread during)
    'Endsinger Kakodaimon Crash': '6657', // planets being tossed during midphase
    'Endsinger Dead Star': '5E4E', // targeted circles during final phase
  },
  shareWarn: {
    'EndSinger Death\'s Embrace': '6649', // purple protean triangles
    'Endsinger Nemesis': '664E', // spread during Interstellar
  },
  shareFail: {
    'Endsinger Hubris': '6653', // tankbuster
  },
  triggers: [
    {
      id: 'Endsinger Galaxias',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6C6A' }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
