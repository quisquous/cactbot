import ZoneId from '../../../../../resources/zone_id.js';

// Ifrit Story Mode
export default {
  zoneId: ZoneId.TheBowlOfEmbers,
  damageWarn: {
    'IfritNm Radiant Plume': '2DE',
  },
  triggers: [
    // Things that should only hit one person.
    {
      id: 'IfritNm Incinerate',
      damageRegex: '1C5',
      condition: function(e, data) {
        return e.type !== '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'IfritNm Eruption',
      damageRegex: '2DD',
      condition: function(e, data) {
        return e.type !== '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
};
