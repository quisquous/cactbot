import ZoneId from '../../../../../resources/zone_id.js';

// Hades Normal
export default {
  zoneId: ZoneId.TheDyingGasp,
  damageWarn: {
    'Hades Bad Faith 1': '414B',
    'Hades Bad Faith 2': '414C',
    'Hades Dark Eruption': '4152',
    'Hades Shadow Spread 1': '4156',
    'Hades Shadow Spread 2': '4157',
    'Hades Broken Faith': '414E',
    'Hades Hellborn Yawp': '416F',
    'Hades Purgation': '4172',
    'Hades Shadow Stream': '415C',
    'Hades Aero': '4595',
    'Hades Echo 1': '4163',
    'Hades Echo 2': '4164',
  },
  triggers: [
    // Things that should only hit one person.
    {
      id: 'Hades Nether Blast',
      damageRegex: '4163',
      condition: function(e, data) {
        return e.type !== '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Hades Ravenous Assault',
      damageRegex: '4158',
      condition: function(e, data) {
        return e.type !== '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Hades Ancient Darkness',
      damageRegex: '4593',
      condition: function(e, data) {
        return e.type !== '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Hades Dual Strike',
      damageRegex: '4162',
      condition: function(e, data) {
        return e.type !== '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
};
