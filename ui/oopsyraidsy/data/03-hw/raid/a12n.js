import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.AlexanderTheSoulOfTheCreator,
  damageWarn: {
    'A12N Sacrament': '1AE6', // Cross Lasers
    'A12N Gravitational Anomaly': '1AEB', // Gravity Puddles
  },
  shareWarn: {
    'A12N Divine Spear': '1AE3', // Instant conal tank cleave
    'A12N Blazing Scourge': '1AE9', // Orange head marker splash damage
    'A12N Plaint Of Severity': '1AF1', // Aggravated Assault splash damage
    'A12N Communion': '1AFC', // Tether Puddles
  },
  triggers: [
    {
      id: 'A12N Assault Collect',
      netRegex: NetRegexes.gainsEffect({ effectId: '461' }),
      run: function(e, data, matches) {
        data.assault = data.assault || [];
        data.assault.push(matches.target);
      },
    },
    {
      // It is a failure for a Severity marker to stack with the Solidarity group.
      id: 'A12N Assault Failure',
      damageRegex: '1AF2',
      condition: function(e, data, matches) {
        return data.assault.includes(matches.target);
      },
      mistake: function(e, data, matches) {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: 'Didn\'t Spread!',
            fr: 'Ne s\'est pas dispersé(e) !',
            ja: '散開しなかった!',
            cn: '没有散开!',
          },
        };
      },
    },
    {
      id: 'A12N Assault Cleanup',
      netRegex: NetRegexes.gainsEffect({ effectId: '461' }),
      suppressSeconds: 5,
      delaySeconds: 20,
      run: function(e, data) {
        delete data.assault;
      },
    },
  ],
};
