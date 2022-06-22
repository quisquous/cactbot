import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// Note: some people do share the Kampeos Harma (limit cut) #1 and #4 triangle dots
//       for uptime but this is iffy to do timing-wise and seems unlikely to be
//       the sort of common strategy that "stack middle for p1 HadesEx circles" was.
//       They can turn this off in the cactbot config ui if needed.

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheSecondCircleSavage,
  damageWarn: {
    'P2S Spoken Cataract 1': '6811', // forward head and body cleave
    'P2S Spoken Cataract 2': '6812', // forward head and body cleave
    'P2S Spoken Cataract 3': '6813', // forward head and body cleave
    'P2S Spoken Cataract 4': '6817', // forward head and body cleave
    'P2S Winged Cataract 1': '6814', // backwards head and body cleave
    'P2S Winged Cataract 2': '6815', // backwards head and body cleave
    'P2S Winged Cataract 3': '6816', // backwards head and body cleave
    'P2S Winged Cataract 4': '6818', // backwards head and body cleave
    'P2S Dissociation': '682E', // head charge
    'P2S Sewage Eruption': '6831', // chasing targeted telegraphed circles
  },
  damageFail: {
    'P2S Deadly Current': '6829', // predatory avarice knockback explosion
    'P2S Greater Typhoon': '681F', // being hit by an arrow, or not hitting a partner with your arrow
  },
  gainsEffectWarn: {
    // TODO: B86 is also dropsy, but maybe standing in dropsy for longer? or the edge?
    'P2S Dropsy': 'B69', // standing in sludge
    'P2S Sustained Damage': 'B77', // being hit by an arrow charge (not yours)
  },
  shareWarn: {
    'P2S Tainted Flood': '6838', // spread markers (both the 4 people at once and 8 people at once)
  },
  shareFail: {
    'P2S Kampeos Harma Square': '6824', // square dashes #1-4
    'P2S Kampeos Harma Triangle 1': '6825', // triangle circle aoes #1-3
    'P2S Kampeos Harma Triangle 2': '6826', // triangle circle aoes #4
  },
  soloWarn: {
    'P2S Ominous Bubbling': '682B', // healer stacks after shockwave
    'P2S Coherence Line': '681A', // stack line
  },
  triggers: [
    {
      id: 'P2S Shockwave',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '682F' }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed into wall',
            de: 'Rückstoß in die Wand',
            fr: 'Poussé(e) dans le mur',
            ja: '壁へノックバック',
            cn: '击退至墙',
            ko: '벽으로 넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
