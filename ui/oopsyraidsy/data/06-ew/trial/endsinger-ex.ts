import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: failing to break Grips of Despair chains

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladEndsingersAria,
  damageWarn: {
    'EndsingerEx Rubistellar Collision 1': '6FFA', // red planet collision
    'EndsingerEx Rubistellar Collision 2': '7003', // Fatalism red planet collision
    'EndsingerEx Elenchos Middle': '7022', // side lasers
    'EndsingerEx Elenchos Sides': '7021', // side lasers
    'EndsingerEx Diairesis 1': '6FFC', // middle head conal cleave during initial planets
    'EndsingerEx Diairesis 2': '7006', // middle head conal cleave during Twinsong's Aporrhoia
    'EndsingerEx Diairesis 3': '7011', // middle head conal cleave during Twinsong's Aporrhoia + Theological Fatalism
    'EndsingerEx Necrotic Fluid 1': '7009', // Twinsong's Aporrhoia circle
    'EndsingerEx Necrotic Fluid 2': '700F', // Twinsong's Aporrhoia + Theological Fatalism circle
    'EndsingerEx Wave of Nausea 1': '700A', // Twinsong's Aporrhoia head donut
    'EndsingerEx Wave of Nausea 2': '7010', // Twinsong's Aporrhoia + Theological Fatalism head donut
    'EndsingerEx Wave of Nausea 3': '7013', // Despair Unforgotten donut
    'EndsingerEx Wave of Nausea 4': '7017', // Despair Unforgotten + Theological Fatalism donut
    'EndsingerEx Endsong': '701C', // Endsong's Aporrhoia big head circles from rings
  },
  damageFail: {
    'EndsingerEx Massive Explosion': '702B', // missing a tower
  },
  shareWarn: {
    'EndsingerEx Befoulment 1': '7014', // Despair Unforgotten spread
    'EndsingerEx Befoulment 2': '7018', // Despair Unforgotten + Theological Fatalism spread
  },
  shareFail: {
    'EndsingerEx Hubris': '702D ', // tankbuster
  },
  triggers: [
    {
      id: 'Endsinger Galaxias',
      type: 'Ability',
      // 6FFB = Azure Star Caerustellar Collision knockback
      // 7005 = Fatalism Azure Star Caerustellar Collision knockback
      netRegex: NetRegexes.ability({ id: ['6FFB', '7005'] }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'Renversé(e)',
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
