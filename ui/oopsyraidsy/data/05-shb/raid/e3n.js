import ZoneId from '../../../../../resources/zone_id';

export default {
  zoneId: ZoneId.EdensGateInundation,
  damageWarn: {
    'E3N Monster Wave 1': '3FCA',
    'E3N Monster Wave 2': '3FE9',
    'E3N Maelstrom': '3FD9',
    'E3N Swirling Tsunami': '3FD5',
  },
  damageFail: {
    'E3N Temporary Current 1': '3FCE',
    'E3N Temporary Current 2': '3FCD',
    'E3N Spinning Dive': '3FDB',
  },
  triggers: [
    {
      id: 'E3N Rip Current',
      damageRegex: '3FC7',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
};
