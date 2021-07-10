import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// TODO: Dahu 5776 Spit Flame should always hit a Marchosias
// TODO: hitting phantom with ice spikes with anything but dispel?
// TODO: failing icy/fiery portent (guard and queen)
//       `18:Pyretic DoT Tick on ${name} for ${damage} damage.`
// TODO: Winds Of Fate / Weight Of Fortune?
// TODO: Turret's Tour?
// general traps: explosion: 5A71, poison trap: 5A72, mini: 5A73
// duel traps: mini: 57A1, ice: 579F, toad: 57A0
// TODO: taking mana flame without reflect
// TODO: taking Maelstrom's Bolt without lightning buff

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.DelubrumReginaeSavage,
  damageWarn: {
    'DelubrumSav Seeker Slimes Hellish Slash': '57EA', // Bozjan Soldier cleave
    'DelubrumSav Seeker Slimes Viscous Rupture': '5016', // Fully merged viscous slime aoe

    'DelubrumSav Seeker Golems Demolish': '5880', // interruptible Ruins Golem cast

    'DelubrumSav Seeker Baleful Swathe': '5AD1', // Ground aoe to either side of boss
    'DelubrumSav Seeker Baleful Blade': '5B2A', // Hide behind pillars attack
    'DelubrumSav Seeker Scorching Shackle': '5ACB', // Chains
    'DelubrumSav Seeker Mercy Fourfold 1': '5B94', // Four glowing sword half room cleaves
    'DelubrumSav Seeker Mercy Fourfold 2': '5AB9', // Four glowing sword half room cleaves
    'DelubrumSav Seeker Mercy Fourfold 3': '5ABA', // Four glowing sword half room cleaves
    'DelubrumSav Seeker Mercy Fourfold 4': '5ABB', // Four glowing sword half room cleaves
    'DelubrumSav Seeker Mercy Fourfold 5': '5ABC', // Four glowing sword half room cleaves
    'DelubrumSav Seeker Merciful Breeze': '5AC8', // Waffle criss-cross floor markers
    'DelubrumSav Seeker Baleful Comet': '5AD7', // Clone meteor dropping before charges
    'DelubrumSav Seeker Baleful Firestorm': '5AD8', // Clone charge after Baleful Comet
    'DelubrumSav Seeker Iron Rose': '5AD9', // Clone line aoes
    'DelubrumSav Seeker Iron Splitter Blue 1': '5AC1', // Blue rin g explosion
    'DelubrumSav Seeker Iron Splitter Blue 2': '5AC2', // Blue ring explosion
    'DelubrumSav Seeker Iron Splitter Blue 3': '5AC3', // Blue ring explosion
    'DelubrumSav Seeker Iron Splitter White 1': '5AC4', // White ring explosion
    'DelubrumSav Seeker Iron Splitter White 2': '5AC5', // White ring explosion
    'DelubrumSav Seeker Iron Splitter White 3': '5AC6', // White ring explosion
    'DelubrumSav Seeker Act Of Mercy': '5ACF', // cross-shaped line aoes

    'DelubrumSav Dahu Right-Sided Shockwave 1': '5770', // Right circular cleave
    'DelubrumSav Dahu Right-Sided Shockwave 2': '5772', // Right circular cleave
    'DelubrumSav Dahu Left-Sided Shockwave 1': '576F', // Left circular cleave
    'DelubrumSav Dahu Left-Sided Shockwave 2': '5771', // Left circular cleave
    'DelubrumSav Dahu Firebreathe': '5774', // Conal breath
    'DelubrumSav Dahu Firebreathe Rotating': '576C', // Conal breath, rotating
    'DelubrumSav Dahu Head Down': '5768', // line aoe charge from Marchosias add
    'DelubrumSav Dahu Hunter\'s Claw': '5769', // circular ground aoe centered on Marchosias add
    'DelubrumSav Dahu Falling Rock': '576E', // ground aoe from Reverberating Roar
    'DelubrumSav Dahu Hot Charge': '5773', // double charge

    'DelubrumSav Duel Massive Explosion': '579E', // bombs being cleared
    'DelubrumSav Duel Vicious Swipe': '5797', // circular aoe around boss
    'DelubrumSav Duel Focused Tremor 1': '578F', // square floor aoes
    'DelubrumSav Duel Focused Tremor 2': '5791', // square floor aoes
    'DelubrumSav Duel Devour': '5789', // conal aoe after withering curse
    'DelubrumSav Duel Flailing Strike 1': '578C', // initial rotating cleave
    'DelubrumSav Duel Flailing Strike 2': '578D', // rotating cleaves

    'DelubrumSav Guard Optimal Offensive Sword': '5819', // middle explosion
    'DelubrumSav Guard Optimal Offensive Shield': '581A', // middle explosion
    'DelubrumSav Guard Optimal Play Sword': '5816', // Optimal Play Sword "get out"
    'DelubrumSav Guard Optimal Play Shield': '5817', // Optimal play shield "get in"
    'DelubrumSav Guard Optimal Play Cleave': '5818', // Optimal Play cleaves for sword/shield
    'DelubrumSav Guard Unlucky Lot': '581D', // Queen's Knight orb explosion
    'DelubrumSav Guard Burn 1': '583D', // small fire adds
    'DelubrumSav Guard Burn 2': '583E', // large fire adds
    'DelubrumSav Guard Pawn Off': '583A', // Queen's Soldier Secrets Revealed tethered clone aoe
    'DelubrumSav Guard Turret\'s Tour Normal 1': '5847', // "normal mode" turrets, initial lines 1
    'DelubrumSav Guard Turret\'s Tour Normal 2': '5848', // "normal mode" turrets, initial lines 2
    'DelubrumSav Guard Turret\'s Tour Normal 3': '5849', // "normal mode" turrets, second lines
    'DelubrumSav Guard Counterplay': '58F5', // Hitting aetherial ward directional barrier

    'DelubrumSav Phantom Swirling Miasma 1': '57B8', // Initial phantom donut aoe
    'DelubrumSav Phantom Swirling Miasma 2': '57B9', // Moving phantom donut aoes
    'DelubrumSav Phantom Creeping Miasma 1': '57B4', // Initial phantom line aoe
    'DelubrumSav Phantom Creeping Miasma 2': '57B5', // Later phantom line aoe
    'DelubrumSav Phantom Lingering Miasma 1': '57B6', // Initial phantom circle aoe
    'DelubrumSav Phantom Lingering Miasma 2': '57B7', // Moving phantom circle aoe
    'DelubrumSav Phantom Vile Wave': '57BF', // phantom conal aoe

    'DelubrumSav Avowed Fury Of Bozja': '594C', // Trinity Avowed Allegiant Arsenal "out"
    'DelubrumSav Avowed Flashvane': '594B', // Trinity Avowed Allegiant Arsenal "get behind"
    'DelubrumSav Avowed Infernal Slash': '594A', // Trinity Avowed Allegiant Arsenal "get front"
    'DelubrumSav Avowed Flames Of Bozja': '5939', // 80% floor aoe before shimmering shot swords
    'DelubrumSav Avowed Gleaming Arrow': '594D', // Trinity Avatar line aoes from outside

    'DelubrumSav Lord Whack': '57D0', // cleave
    'DelubrumSav Lord Devastating Bolt 1': '57C5', // lightning rings
    'DelubrumSav Lord Devastating Bolt 2': '57C6', // lightning rings
    'DelubrumSav Lord Electrocution': '57CC', // random circle aoes
    'DelubrumSav Lord Rapid Bolts': '57C3', // dropped lightning aoes
    'DelubrumSav Lord 1111-Tonze Swing': '57D8', // very large "get out" swing
    'DelubrumSav Lord Monk Attack': '55A6', // Monk add auto-attack

    'DelubrumSav Queen Northswain\'s Glow': '59F4', // expanding lines with explosion intersections
    'DelubrumSav Queen The Means 1': '59E7', // The Queen's Beck and Call cross aoe from adds
    'DelubrumSav Queen The Means 2': '59EA', // The Queen's Beck and Call cross aoe from adds
    'DelubrumSav Queen The End 1': '59E8', // Also The Queen's Beck and Call cross aoe from adds
    'DelubrumSav Queen The End 2': '59E9', // Also The Queen's Beck and Call cross aoe from adds
    'DelubrumSav Queen Optimal Offensive Sword': '5A02', // middle explosion
    'DelubrumSav Queen Optimal Offensive Shield': '5A03', // middle explosion
    'DelubrumSav Queen Judgment Blade Left 1': '59F2', // dash across room with left cleave
    'DelubrumSav Queen Judgment Blade Left 2': '5B85', // dash across room with left cleave
    'DelubrumSav Queen Judgment Blade Right 1': '59F1', // dash across room with right cleave
    'DelubrumSav Queen Judgment Blade Right 2': '5B84', // dash across room with right cleave
    'DelubrumSav Queen Pawn Off': '5A1D', // Queen's Soldier Secrets Revealed tethered clone aoe
    'DelubrumSav Queen Optimal Play Sword': '59FF', // Optimal Play Sword "get out"
    'DelubrumSav Queen Optimal Play Shield': '5A00', // Optimal play shield "get in"
    'DelubrumSav Queen Optimal Play Cleave': '5A01', // Optimal Play cleaves for sword/shield
    'DelubrumSav Queen Turret\'s Tour Normal 1': '5A28', // "normal mode" turrets, initial lines 1
    'DelubrumSav Queen Turret\'s Tour Normal 2': '5A2A', // "normal mode" turrets, initial lines 2
    'DelubrumSav Queen Turret\'s Tour Normal 3': '5A29', // "normal mode" turrets, second lines
  },
  damageFail: {
    'DelubrumSav Avowed Heat Shock': '5927', // too much heat or failing to regulate temperature
    'DelubrumSav Avowed Cold Shock': '5928', // too much cold or failing to regulate temperature
    'DelubrumSav Queen Queen\'s Justice': '59EB', // failing to walk the right number of squares
    'DelubrumSav Queen Gunnhildr\'s Blades': '5B22', // not being in the chess blue safe square
    'DelubrumSav Queen Unlucky Lot': '55B6', // lightning orb attack
  },
  gainsEffectWarn: {
    'DelubrumSav Seeker Merciful Moon': '262', // "Petrification" from Aetherial Orb lookaway
  },
  shareWarn: {
    'DelubrumSav Seeker Phantom Baleful Onslaught': '5AD6', // solo tank cleave
    'DelubrumSav Lord Foe Splitter': '57D7', // tank cleave
  },
  triggers: [
    {
      // These ability ids can be ordered differently and "hit" people when levitating.
      id: 'DelubrumSav Guard Lots Cast',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: ['5827', '5828', '5B6C', '5B6D', '5BB6', '5BB7', '5B88', '5B89'], ...playerDamageFields }),
      condition: (_data, matches) => matches.flags.slice(-2) === '03',
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'DelubrumSav Golem Compaction',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '5746' }),
      mistake: (_data, matches) => {
        return { type: 'fail', text: `${matches.source}: ${matches.ability}` };
      },
    },
    {
      id: 'DelubrumSav Slime Sanguine Fusion',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '554D' }),
      mistake: (_data, matches) => {
        return { type: 'fail', text: `${matches.source}: ${matches.ability}` };
      },
    },
  ],
};

export default triggerSet;
