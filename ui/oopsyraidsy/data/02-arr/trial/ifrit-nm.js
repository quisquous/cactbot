import ZoneId from '../../../../../resources/zone_id';

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
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'IfritNm Eruption',
      damageRegex: '2DD',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
};
