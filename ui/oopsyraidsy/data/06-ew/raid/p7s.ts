import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: Condensed Aero II (7838) could be immuned and solo'd, so ignored
// TODO: tower failure?

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheSeventhCircleSavage,
  damageWarn: {
    'P7S Blades of Attis 1': '782F', // exaflares, initial
    'P7S Blades of Attis 2': '7830', // exaflares, ongoing
    'P7S Immature Io Static Moon': '7812', // behemoth on platform, circle aoe
    'P7S Immature Stymphalide Stymphalian Strike': '7815', // bird line aoe
    'P7S Bough of Attis Close': '7822', // bough hit north (from 7821 cast)
    'P7S Bough of Attis Arrow': '7825', // left/right arrow (from 7823 cast)
    'P7S Bough of Attis Far': '7827', // bough hit south (from 7826 cast)
    'P7S Roots of Attis': '780F', // platform destruction
    'P7S Immature Minotaur Bullish Swipe': '7819', // baited minotaur cleaves (from 7818 cast)
    'P7S Hemitheos\'s Glare': '782A', // chasing aoe
  },
  damageFail: {
    'P7S Hemitheos\'s Tornado': '781F', // Inviolate Purgation delayed spread
    'P7S Hemitheos\'s Glare III': '7820', // Inviolate Purgation delayed stack
  },
  shareWarn: {
    'P7S Hemitheos\'s Aero III': '781B', // role-based spread
    'P7S Immature Io Static Path': '7814', // tether line aoe
    'P7S Immature Minotaur Bullish Slash': '7817', // tether conal
  },
  shareFail: {
    'P7S Dispersed Aero II': '7837', // spread tankbuster
  },
  soloWarn: {
    'P7S Hemitheos\'s Holy III 1': '781C', // role-based stack
    'P7S Hemitheos\'s Holy III 2': '783B', // stack after knockback before towers
    'P7S Condensed Aero II': '7838', // shared tankbuster
  },
  triggers: [
    {
      id: 'P7S Knockback',
      type: 'Ability',
      // 7A0B Hemitheos's Aero IV
      // 7816 Immature Symphalide Bronze Bellows
      netRegex: NetRegexes.ability({ id: ['7816', '7A0B'] }),
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
