import ZoneId from '../../../../../resources/zone_id';

// TODO: failing to interrupt Mana Boost (3D8D)
// TODO: failing to pass healer debuff?
// TODO: what happens if you don't kill a meteor during four orbs?
export default {
  zoneId: ZoneId.EdensGateResurrectionSavage,
  damageWarn: {
    'E1S Eden\'s Thunder III': '44F7',
    'E1S Eden\'s Blizzard III': '44F6',
    'E1S Eden\'s Regained Blizzard III': '44FA',
    'E1S Pure Beam Trident 1': '3D83',
    'E1S Pure Beam Trident 2': '3D84',
    'E1S Paradise Lost': '3D87',
  },
  damageFail: {
    'E1S Eden\'s Flare': '3D73',
    'E1S Pure Light': '3D8A',
  },
  triggers: [
    // Things that should only hit one person.
    {
      id: 'E1S Fire/Thunder III',
      damageRegex: '44FB',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E1S Pure Beam Single',
      damageRegex: '3D81',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E1S Tank Lasers',
      // Vice Of Vanity
      damageRegex: '44F1',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E1S DPS Puddles',
      // Vice Of Apathy
      damageRegex: '44F2',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
};
