import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: Radiant Braver is 4EF7/4EF8(x2), shouldn't get hit by both?
// TODO: Radiant Desperado is 4EF9/4EFA, shouldn't get hit by both?
// TODO: Radiant Meteor is 4EFC, and shouldn't get hit by more than 1?
// TODO: Absolute Holy should be shared?
// TODO: intersecting brimstones?

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheSeatOfSacrificeExtreme,
  damageWarn: {
    'WOLEx Solemn Confiteor': '4F0C', // ground puddles
    'WOLEx Coruscant Saber In': '4EF2', // saber in
    'WOLEx Coruscant Saber Out': '4EF1', // saber out
    'WOLEx Imbued Corusance Out': '4F49', // saber out
    'WOLEx Imbued Corusance In': '4F4A', // saber in
    'WOLEx Shining Wave': '4F08', // sword triangle
    'WOLEx Cauterize': '4F07',
    'WOLEx Brimstone Earth': '4F00', // corner growing circles, growing
  },
  gainsEffectWarn: {
    'WOLEx Deep Freeze': '4E6', // failing Absolute Blizzard III
    'WOLEx Damage Down': '274', // failing Absolute Flash
  },
  shareWarn: {
    'WOLEx Absolute Stone III': '4EEB', // protean wave imbued magic
    'WOLEx Flare Breath': '4F06', // tether from summoned bahamuts
    'WOLEx Perfect Decimation': '4F05', // smn/war phase marker
  },
  soloWarn: {
    'WolEx Katon San Share': '4EFE',
  },
  triggers: [
    {
      id: 'WOLEx True Walking Dead',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8FF' }),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (_data, matches) => {
        return { type: 'fail', name: matches.target, text: matches.effect };
      },
    },
    {
      id: 'WOLEx Tower',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '4F04', capture: false }),
      mistake: {
        type: 'fail',
        text: {
          en: 'Missed Tower',
          de: 'Turm verpasst',
          fr: 'Tour manquée',
          ja: '塔を踏まなかった',
          cn: '没踩塔',
          ko: '장판 실수',
        },
      },
    },
    {
      id: 'WOLEx True Hallowed Ground',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '4F44' }),
      mistake: (_data, matches) => {
        return { type: 'fail', text: matches.ability };
      },
    },
    {
      // For Berserk and Deep Darkside
      id: 'WOLEx Missed Interrupt',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['5156', '5158'] }),
      mistake: (_data, matches) => {
        return { type: 'fail', text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
