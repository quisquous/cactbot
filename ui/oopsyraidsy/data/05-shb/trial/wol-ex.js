import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: Radiant Braver is 4EF7/4EF8(x2), shouldn't get hit by both?
// TODO: Radiant Desperado is 4EF9/4EFA, shouldn't get hit by both?
// TODO: Radiant Meteor is 4EFC, and shouldn't get hit by more than 1?
// TODO: Absolute Holy should be shared?
// TODO: intersecting brimstones?

export default {
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
  shareWarn: {
    'WOLEx Absolute Stone III': '4EEB', // protean wave imbued magic
    'WOLEx Flare Breath': '4F06', // tether from summoned bahamuts
    'WOLEx Perfect Decimation': '4F05', // smn/war phase marker
  },
  gainsEffectWarn: {
    'WOLEx Deep Freeze': '4E6', // failing Absolute Blizzard III
    'WOLEx Damage Down': '274', // failing Absolute Flash
  },
  triggers: [
    {
      id: 'WOLEx True Walking Dead',
      netRegex: NetRegexes.gainsEffect({ effectId: '8FF' }),
      delaySeconds: function(e, data, matches) {
        return parseFloat(matches.duration) - 0.5;
      },
      deathReason: function(e, data, matches) {
        return { type: 'fail', name: e.target, reason: matches.effect };
      },
    },
    {
      id: 'WOLEx Tower',
      netRegex: NetRegexes.ability({ id: '4F04', capture: false }),
      mistake: {
        type: 'fail',
        reason: {
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
      netRegex: NetRegexes.ability({ id: '4F44' }),
      mistake: function(e, data, matches) {
        return { type: 'fail', reason: matches.ability };
      },
    },
    {
      // For Berserk and Deep Darkside
      id: 'WOLEx Missed Interrupt',
      netRegex: NetRegexes.ability({ id: ['5156', '5158'] }),
      mistake: function(e, data, matches) {
        return { type: 'fail', reason: matches.ability };
      },
    },
    {
      id: 'WolEx Katon San Share',
      netRegex: NetRegexes.ability({ id: '4EFE' }),
      condition: (e) => e.type === '15',
      mistake: function(e, data, matches) {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
  ],
};
