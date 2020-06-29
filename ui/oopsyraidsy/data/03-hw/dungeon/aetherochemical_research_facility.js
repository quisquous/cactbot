'use strict';

// Aetherochemical Research Facility
[{
  zoneRegex: {
    en: /Aetherochemical Research Facility/,
    ko: /^마과학 연구소$/,
  },
  zoneId: ZoneId.TheAetherochemicalResearchFacility,
  damageWarn: {
    'Facility Grand Sword': '216', // Conal AoE, Scrambled Iron Giant trash
    'Facility Cermet Drill': '20E', // Line AoE, 6th Legion Magitek Vanguard trash
    'Magitek Slug': '10DB', // Line AoE, boss 1
    'Aetherochemical Grenado': '10E2', // Large targeted circle AoE, Magitek Turret II, boss 1
    'Magitek Spread': '10DC', // 270-degree roomwide AoE, boss 1
    'Eerie Soundwave': '1170', // Targeted circle AoE, Cultured Empusa trash, before boss 2
    'Tail Slap': '125F', // Conal AoE, Cultured Dancer trash, before boss 2
    'Calcifying Mist': '123A', // Conal AoE, Cultured Naga trash, before boss 2
    'Puncture': '1171', // Short line AoE, Cultured Empusa trash, before boss 2
    'Sideswipe': '11A7', // Conal AoE, Cultured Reptoid trash, before boss 2
    'Gust': '395', // Targeted small circle AoE, Cultured Mirrorknight trash, before boss 2
    'Marrow Drain': 'D0E', // Conal AoE, Cultured Chimera trash, before boss 2
    'Riddle Of The Sphinx': '10E4', // Targeted circle AoE, boss 2
    'Ka': '106E', // Conal AoE, boss 2
    'Rotoswipe': '11CC', // Conal AoE, Facility Dreadnought trash, before boss 3
    'Auto-cannons': '12D9', // Line AoE, Monitoring Drone trash, before boss 3
    'Death\'s Door': '4EC', // Line AoE, Cultured Shabti trash, before boss 3
    'Spellsword': '4EB', // Conal AoE, Cultured Shabti trash, before boss 3
    'End Of Days': '10FD', // Line AoE, boss 3
    'Blizzard Burst': '10FE', // Fixed circle AoEs, Igeyorhm, boss 3
    'Fire Burst': '10FF', // Fixed circle AoEs, Lahabrea, boss 3
    'Sea Of Pitch': '12DE', // Targeted persistent circle AoEs, boss 3
    'Dark Blizzard II': '10F3', // Random circle AoEs, Igeyorhm, boss 3
    'Dark Fire II': '10F8', // Random circle AoEs, Lahabrea, boss 3
    'Ancient Eruption': '1104', // Self-targeted circle AoE, boss 4
    'Entropic Flame': '1108', // Line AoEs,  boss 4
  },
  shareWarn: {
    'Facility Chthonic Hush': '10E7', // Instant tank cleave, boss 2
    'Facility Height Of Chaos': '1101', // Tank cleave, boss 4
    'Facility Ancient Circle': '1102', // Targeted donut AoEs, boss 4
  },
  triggers: [
    {
      id: 'Facility Petrifaction',
      gainsEffectRegex: gLang.kEffect.Petrification,
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
