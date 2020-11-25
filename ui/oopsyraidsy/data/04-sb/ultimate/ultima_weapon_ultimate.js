import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

// Ultima Weapon Ultimate
export default {
  zoneId: ZoneId.TheWeaponsRefrainUltimate,
  damageWarn: {
    'UWU Searing Wind': '2B5C',
    'UWU Eruption': '2B5A',
    'UWU Weight': '2B65',
    'UWU Landslide1': '2B70',
    'UWU Landslide2': '2B71',
  },
  damageFail: {
    'UWU Great Whirlwind': '2B41',
    'UWU Slipstream': '2B53',
    'UWU Wicked Wheel': '2B4E',
    'UWU Wicked Tornado': '2B4F',
  },
  triggers: [
    {
      id: 'UWU Windburn',
      netRegex: NetRegexes.gainsEffect({ effectId: 'EB' }),
      // TODO: implement suppressSeconds <_<
      suppressSeconds: 2,
      mistake: function(e, data, matches) {
        return { type: 'warn', blame: e.target, text: e.effect };
      },
    },
    {
      // Featherlance explosion.  It seems like the person who pops it is the
      // first person listed damage-wise, so they are likely the culprit.
      id: 'UWU Featherlance',
      damageRegex: '2B43',
      collectSeconds: 0.5,
      // TODO: implement suppress
      suppressSeconds: 5,
      mistake: function(e) {
        return { type: 'fail', blame: e[0].targetName, text: e[0].attackerName };
      },
    },
  ],
};
