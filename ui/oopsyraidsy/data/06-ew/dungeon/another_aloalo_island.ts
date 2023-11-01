import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: people who missed their 8AC2 Burst tower

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnotherAloaloIsland,
  damageWarn: {
    // Trash 1
    'AAI Twister': '8BC0', // Twister tornados
    'AAI Kiwakin Tail Screw': '8BB8', // baited circle
    'AAI Snipper Bubble Shower': '8BB9', // front conal
    'AAI Snipper Crab Dribble': '8BBA', // fast back conal after Bubble Shower
    'AAI Ray Hydrocannon': '8BBD', // line aoe
    'AAI Ray Expulsion': '8BBF', // "get out"
    'AAI Ray Electric Whorl': '8BBE', // "get in"

    // Ketuduke
    'AAI Spring Crystal Saturate 1': '8AAB', // orb circle
    'AAI Spring Crystal Saturate 2': '8AAC', // rupee line laser
    'AAI Sphere Shatter': '8ABC', // moving arches
    'AAI Receding Twintides': '8ACC', // initial out during out->in
    'AAI Near Tide': '8ACD', // second out during in->out with 8ACE Encroaching Twintides
    'AAI Encroaching Twintides': '8ACE', // initial in during in->out
    'AAI Far Tide': '8ACF', // second in during out->in with 8ACC Receding Twintides
    'AAI Hydrobomb': '8AD1', // 3x puddles duruing 8ABD Blowing Bubbles
  },
  damageFail: {
    'AAI Big Burst': '8AC3', // tower failure damage
  },
  shareWarn: {
    'AAI Hydrobullet': '8ABA', // spread debuffs
  },
  soloWarn: {
    'AAI Hydrofall': '8AB7', // partner stack debuffs
    'AAI Snipper Water III': '8C64', // Snipper stack marker
  },
  triggers: [
    {
      // Getting knocked into a wall from the Angry Seas knockback
      id: 'AAI Angry Seas Wall',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '8AC1' }),
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
            ko: '넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
