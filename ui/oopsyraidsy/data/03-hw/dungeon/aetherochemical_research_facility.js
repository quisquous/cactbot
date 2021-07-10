import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

// Aetherochemical Research Facility
export default {
  zoneId: ZoneId.TheAetherochemicalResearchFacility,
  damageWarn: {
    'ARF Grand Sword': '216', // Conal AoE, Scrambled Iron Giant trash
    'ARF Cermet Drill': '20E', // Line AoE, 6th Legion Magitek Vanguard trash
    'ARF Magitek Slug': '10DB', // Line AoE, boss 1
    'ARF Aetherochemical Grenado': '10E2', // Large targeted circle AoE, Magitek Turret II, boss 1
    'ARF Magitek Spread': '10DC', // 270-degree roomwide AoE, boss 1
    'ARF Eerie Soundwave': '1170', // Targeted circle AoE, Cultured Empusa trash, before boss 2
    'ARF Tail Slap': '125F', // Conal AoE, Cultured Dancer trash, before boss 2
    'ARF Calcifying Mist': '123A', // Conal AoE, Cultured Naga trash, before boss 2
    'ARF Puncture': '1171', // Short line AoE, Cultured Empusa trash, before boss 2
    'ARF Sideswipe': '11A7', // Conal AoE, Cultured Reptoid trash, before boss 2
    'ARF Gust': '395', // Targeted small circle AoE, Cultured Mirrorknight trash, before boss 2
    'ARF Marrow Drain': 'D0E', // Conal AoE, Cultured Chimera trash, before boss 2
    'ARF Riddle Of The Sphinx': '10E4', // Targeted circle AoE, boss 2
    'ARF Ka': '106E', // Conal AoE, boss 2
    'ARF Rotoswipe': '11CC', // Conal AoE, Facility Dreadnought trash, before boss 3
    'ARF Auto-cannons': '12D9', // Line AoE, Monitoring Drone trash, before boss 3
    'ARF Death\'s Door': '4EC', // Line AoE, Cultured Shabti trash, before boss 3
    'ARF Spellsword': '4EB', // Conal AoE, Cultured Shabti trash, before boss 3
    'ARF End Of Days': '10FD', // Line AoE, boss 3
    'ARF Blizzard Burst': '10FE', // Fixed circle AoEs, Igeyorhm, boss 3
    'ARF Fire Burst': '10FF', // Fixed circle AoEs, Lahabrea, boss 3
    'ARF Sea Of Pitch': '12DE', // Targeted persistent circle AoEs, boss 3
    'ARF Dark Blizzard II': '10F3', // Random circle AoEs, Igeyorhm, boss 3
    'ARF Dark Fire II': '10F8', // Random circle AoEs, Lahabrea, boss 3
    'ARF Ancient Eruption': '1104', // Self-targeted circle AoE, boss 4
    'ARF Entropic Flame': '1108', // Line AoEs,  boss 4
  },
  shareWarn: {
    'ARF Chthonic Hush': '10E7', // Instant tank cleave, boss 2
    'ARF Height Of Chaos': '1101', // Tank cleave, boss 4
    'ARF Ancient Circle': '1102', // Targeted donut AoEs, boss 4
  },
  triggers: [
    {
      id: 'ARF Petrifaction',
      netRegex: NetRegexes.gainsEffect({ effectId: '01' }),
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
  ],
};
