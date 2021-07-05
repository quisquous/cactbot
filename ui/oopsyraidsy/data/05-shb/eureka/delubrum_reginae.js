import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

import { playerDamageFields } from '../../../oopsy_common';

// TODO: Dead Iron 5AB0 (earthshakers, but only if you take two?)

export default {
  zoneId: ZoneId.DelubrumReginae,
  damageWarn: {
    'Delubrum Seeker Mercy Fourfold': '5B34', // Four glowing sword half room cleaves
    'Delubrum Seeker Baleful Swathe': '5AB4', // Ground aoe to either side of boss
    'Delubrum Seeker Baleful Blade': '5B28', // Hide behind pillars attack
    'Delubrum Seeker Iron Splitter Blue 1': '5AA4', // Blue ring explosion
    'Delubrum Seeker Iron Splitter Blue 2': '5AA5', // Blue ring explosion
    'Delubrum Seeker Iron Splitter Blue 3': '5AA6', // Blue ring explosion
    'Delubrum Seeker Iron Splitter White 1': '5AA7', // White ring explosion
    'Delubrum Seeker Iron Splitter White 2': '5AA8', // White ring explosion
    'Delubrum Seeker Iron Splitter White 3': '5AA9', // White ring explosion
    'Delubrum Seeker Scorching Shackle': '5AAE', // Chain damage
    'Delubrum Seeker Merciful Breeze': '5AAB', // Waffle criss-cross floor markers
    'Delubrum Seeker Merciful Blooms': '5AAD', // Purple growing circle
    'Delubrum Dahu Right-Sided Shockwave': '5761', // Right circular cleave
    'Delubrum Dahu Left-Sided Shockwave': '5762', // Left circular cleave
    'Delubrum Dahu Firebreathe': '5765', // Conal breath
    'Delubrum Dahu Firebreathe Rotating': '575A', // Conal breath, rotating
    'Delubrum Dahu Head Down': '5756', // line aoe charge from Marchosias add
    'Delubrum Dahu Hunter\'s Claw': '5757', // circular ground aoe centered on Marchosias add
    'Delubrum Dahu Falling Rock': '575C', // ground aoe from Reverberating Roar
    'Delubrum Dahu Hot Charge': '5764', // double charge
    'Delubrum Dahu Ripper Claw': '575D', // frontal cleave
    'Delubrum Dahu Tail Swing': '575F', // tail swing ;)
    'Delubrum Guard Pawn Off': '5806', // Queen's Soldier Secrets Revealed tethered clone aoe
    'Delubrum Guard Turret\'s Tour 1': '580D', // Queen's Gunner reflective turret shot
    'Delubrum Guard Turret\'s Tour 2': '580E', // Queen's Gunner reflective turret shot
    'Delubrum Guard Turret\'s Tour 3': '580F', // Queen's Gunner reflective turret shot
    'Delubrum Guard Optimal Play Shield': '57F3', // Queen's Knight shield get under
    'Delubrum Guard Optimal Play Sword': '57F2', // Queen's Knight sword get out
    'Delubrum Guard Counterplay': '57F6', // Hitting aetherial ward directional barrier
    'Delubrum Phantom Swirling Miasma 1': '57A9', // Initial phantom donut aoe from circle
    'Delubrum Phantom Swirling Miasma 2': '57AA', // Moving phantom donut aoes from circle
    'Delubrum Phantom Creeping Miasma': '57A5', // phantom line aoe from square
    'Delubrum Phantom Vile Wave': '57B1', // phantom conal aoe
    'Delubrum Avowed Fury Of Bozja': '5973', // Trinity Avowed Allegiant Arsenal "out"
    'Delubrum Avowed Flashvane': '5972', // Trinity Avowed Allegiant Arsenal "get behind"
    'Delubrum Avowed Infernal Slash': '5971', // Trinity Avowed Allegiant Arsenal "get front"
    'Delubrum Avowed Flames Of Bozja': '5968', // 80% floor aoe before shimmering shot swords
    'Delubrum Avowed Gleaming Arrow': '5974', // Trinity Avatar line aoes from outside
    'Delubrum Queen The Means 1': '59BB', // The Queen's Beck and Call cross aoe from adds
    'Delubrum Queen The Means 2': '59BD', // The Queen's Beck and Call cross aoe from adds
    'Delubrum Queen The End 1': '59BA', // Also The Queen's Beck and Call cross aoe from adds
    'Delubrum Queen The End 2': '59BC', // Also The Queen's Beck and Call cross aoe from adds
    'Delubrum Queen Northswain\'s Glow': '59C4', // expanding lines with explosion intersections
    'Delubrum Queen Judgment Blade Left': '5B83', // dash across room with left cleave
    'Delubrum Queen Judgment Blade Right': '5B83', // dash across room with right cleave
    'Delubrum Queen Queen\'s Justice': '59BF', // failing to walk the right number of squares
    'Delubrum Queen Turret\'s Tour 1': '59E0', // reflective turret shot during Queen
    'Delubrum Queen Turret\'s Tour 2': '59E1', // reflective turret shot during Queen
    'Delubrum Queen Turret\'s Tour 3': '59E2', // reflective turret shot during Queen
    'Delubrum Queen Pawn Off': '59DA', // Secrets Revealed tethered clone aoe during Queen
    'Delubrum Queen Optimal Play Shield': '59CE', // Queen's Knight shield get under during Queen
    'Delubrum Queen Optimal Play Sword': '59CC', // Queen's Knight sword get out during Queen
  },
  damageFail: {
    'Delubrum Hidden Trap Massive Explosion': '5A6E', // explosion trap
    'Delubrum Hidden Trap Poison Trap': '5A6F', // poison trap
    'Delubrum Avowed Heat Shock': '595E', // too much heat or failing to regulate temperature
    'Delubrum Avowed Cold Shock': '595F', // too much cold or failing to regulate temperature
  },
  shareFail: {
    'Delubrum Dahu Heat Breath': '5766', // tank cleave
    'Delubrum Avowed Wrath Of Bozja': '5975', // tank cleave
  },
  gainsEffectWarn: {
    'Delubrum Seeker Merciful Moon': '262', // "Petrification" from Aetherial Orb lookaway
  },
  triggers: [
    {
      // At least during The Queen, these ability ids can be ordered differently,
      // and the first explosion "hits" everyone, although with "1B" flags.
      id: 'Delubrum Lots Cast',
      netRegex: NetRegexes.abilityFull({ id: ['565A', '565B', '57FD', '57FE', '5B86', '5B87', '59D2', '5D93'], ...playerDamageFields }),
      condition: (_e, _data, matches) => matches.flags.slice(-2) === '03',
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
  ],
};
