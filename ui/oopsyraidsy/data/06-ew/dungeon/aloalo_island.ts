import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyMistakeType, OopsyTrigger, OopsyTriggerSet } from '../../../../../types/oopsy';
import { LocaleText } from '../../../../../types/trigger';
import { playerDamageFields } from '../../../oopsy_common';

const nonzeroDamageMistake = (
  triggerId: string,
  abilityId: string | string[],
  type: OopsyMistakeType,
): OopsyTrigger<OopsyData> => {
  return {
    id: triggerId,
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: abilityId, ...playerDamageFields }),
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
      return {
        type: type,
        blame: matches.target,
        reportId: matches.targetId,
        text: matches.ability,
      };
    },
  };
};

const renameMistake = (
  triggerId: string,
  abilityId: string | string[],
  type: OopsyMistakeType,
  text: LocaleText,
): OopsyTrigger<OopsyData> => {
  return {
    id: triggerId,
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: abilityId, ...playerDamageFields }),
    condition: (data, matches) => data.DamageFromMatches(matches) > 0,
    mistake: (_data, matches) => {
      return {
        type: type,
        blame: matches.target,
        reportId: matches.targetId,
        text: text,
      };
    },
  };
};

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AloaloIsland,
  damageWarn: {
    // Trash (left)
    'Aloalo Uragnite Palsynyxis': '8853', // small front conal
    'Aloalo Anala Flame Dance': '8CF1', // targeted circle
    'Aloalo Snipper Bubble Shower': '8856', // front conal
    'Aloalo Kiwakin Tail Screw': '8CF0', // targeted circle (not a 1 hp mechanic)
    'Aloalo Ray Hydrocannon': '885B', // line
    'Aloalo Biast Electrify': '8CF2', // targeted circle
    'Aloalo Ogrebon Flouder': '885A', // line
    'Aloalo Zaratan Sewer Water': '8859', // front 180 cleave

    // Trash (middle)
    'Aloalo Worm Poison Breath': '8864', // front conal
    'Aloalo Gigantoad Languid Lap': '8865', // large front conal
    'Aloalo Monstera Sweet Nectar 1': '8866', // front conal
    'Aloalo Monstera Sweet Nectar 2': '8867', // back left conal
    'Aloalo Monstera Sweet Nectar 3': '8868', // back right conal
    'Aloalo Islekeeper Isle Drop': '886D', // targeted circle
    'Aloalo Bird Feathercut': '886E', // line
    'Aloalo Susena Rock Throw': '8CEE', // targeted circle
    'Aloalo Wood Golem Ovation': '886A', // line

    // Trash (right)
    'Aloalo Deadly Coconut Nut Lob': '885C', // targeted circle
    'Aloalo Asvattha Bad Breath': '885D', // wide front conal
    'Aloalo Baritine Croc Flatten': '885E', // small front conal
    'Aloalo Gobbue Moldy Phlegm': '8860', // targeted circle
    'Aloalo Boar Infusion': '8861', // line aoe

    // Quaqua (common)
    'Aloalo Quaqua Ravaging Axe': '8B8A', // circle damage from Arcane Armaments axe
    'Aloalo Quaqua Ringing Quoits': '8B8B', // donut damage from Arcane Armaments ring
    'Aloalo Quaqua Violet Storm': '8B95', // large late telegraph front conal
    'Aloalo Quaqua Rout 1': '8B91', // initial charge
    'Aloalo Quaqua Rout 2': '8B92', // followup 3 charges

    // Quaqua (left)
    'Aloalo Quaqua Scalding Waves 1': '8B97', // initial fire lines
    'Aloalo Quaqua Scalding Waves 2': '8B98', // bouncing fire lines
    'Aloalo Quaqua Cloud to Ground 1': '8B9C', // initial hit of Drake exaflares
    'Aloalo Quaqua Cloud to Ground 2': '8B9D', // followup hits of Drake exaflares

    // Quaqua (middle)
    'Aloalo Quaqua Elemental Impact': '8BA0', // initial water spear circles
    'Aloalo Quaqua Flowing Lance 1': '8BA1', // initial water spear cross
    'Aloalo Quaqua Flowing Lance 2': '8BA2', // initial water spear cross
    'Aloalo Quaqua Flowing Lance 3': '8CD1', // followup rotating water spear crosses

    // Quaqua (right)
    'Aloalo Quaqua Fell Forces': '8BA5', // being too close to Aetheric Charge purple orb
    'Aloalo Quaqua Fell Confluence': '8D17', // purple orb enrage damage from not cleansing it

    // Ketuduke
    'Aloalo Ketuduke Saturate Orb 1': '8A7C', // Spring Crystal orb circle (no bubbles)
    'Aloalo Ketuduke Saturate Orb 2': '8A7D', // Spring Crystal orb circle (w/Bubble Net)
    'Aloalo Ketuduke Saturate Orb 3': '8A7E', // Spring Crystal rupee line laser (no bubbles)
    'Aloalo Ketuduke Saturate Orb 4': '8A7F', // Spring Crystal rupee line laser (w/Bubble Net)
    'Aloalo Ketuduke Sphere Shatter': '8A87', // damage from moving arches
    'Aloalo Ketuduke Riptide': '8A89', // stepping in Airy Bubble
    'Aloalo Ketuduke Receding Twintides': '8A9D', // initial out during out->in
    'Aloalo Ketuduke Near Tide': '8A9E', // second out during in->out
    'Aloalo Ketuduke Encroaching Twintides': '8A9F', // initial in during in->out
    'Aloalo Ketuduke Far Tide': '8AA0', // second in during out->in
    'Aloalo Ketuduke Hydrobomb': '8AA2', // 3x puddles
    'Aloalo Ketuduke Hundred Lashing': '8A97', // 180 cleave from Zaratan add

    // Lala
    'Aloalo Lala Arcane Blight': '8873', // 270 degree cleave
    'Aloalo Lala Bright Pulse 1': '8878', // initial blue square
    'Aloalo Lala Bright Pulse 2': '8879', // followup blue square
    'Aloalo Lala Rolling Spout 1': '8881', // initial Kapokapo donut
    'Aloalo Lala Rolling Spout 2': '8A6B', // Kapokapo donut during Arcane Plot
    'Aloalo Lala Aero II 1': '8885', // Golem line
    'Aloalo Lala Aero II 2': '8A6D', // Golem line during Arcane Plot
    'Aloalo Lala Volcanic Coordinates': '8D2D', // targeted circle puddle

    // Statice
    'Aloalo Statice Hidden Mine': '892D', // stepping on the hidden mine
    'Aloalo Statice 4-tonze Weight': '8932', // Heavy Weight circles during Balloon knockback
    'Aloalo Statice Trigger Happy': '892C', // limit cut dart board (filled pie slice)
    'Aloalo Statice Fire Spread 1': '8934', // initial fire bars
    'Aloalo Statice Fire Spread 2': '8935', // initial fire bars
    'Aloalo Statice Fire Spread 3': '89F6', // rotating fire bars
    'Aloalo Statice Fire Spread 4': '89F7', // rotating fire bars
    'Aloalo Statice Surprising Missile Burst': '8941', // hitting Present Box's Surprising Missile
    'Aloalo Statice Faerie Ring': '893F', // Surprising Staff donut attack
    'Aloalo Statice Faerie Road': '8940', // Surprising Staff line attack
    'Aloalo Statice Treasure Box Burst': '8937', // fake Treasure Box explosion
    'Aloalo Statice Meteor': '893A', // red Pinwheel slice
    'Aloalo Statice Sledgemagic': '893B', // yellow Pinwheel slice
    'Aloalo Statice Hunks of Junk': '893C', // blue Pinwheel slice

    // Loquloqui
    'Aloalo Loquloqui Land Wave': '87BD', // 180 cleave damage
    'Aloalo Loquloqui Rush 1': '87C0', // normal bird narrow line
    'Aloalo Loquloqui Rush 2': '87C1', // glowing bird wide line
    'Aloalo Loquloqui Turnabout 1': '87C2', // normal lizard small circle
    'Aloalo Loquloqui Turnabout 2': '87C3', // glowing lizard large circle
    'Aloalo Loquloqui Pliant Petals': '87C6', // plant tether circles
    'Aloalo Loquloqui Brilliant Blossoms': '87C8', // flower square exploding
    'Aloalo Loquloqui Islebloom Light': '87CD', // ground puddles during knockback
  },
  gainsEffectWarn: {
    // C05 = 9999 duration, C06 = 15s duration
    'Aloalo Bleed': 'C05', // standing outside Quaqua or in Lala blue squares or outside Loquloqui
    // C03 = 9999 duration, C04 = 15s duration
    'Aloalo Dropsy': 'C03', // standing outside Ketuduke
    // BF9 = 9999 duration, BFA = 15s duration
    'Aloalo Burns': 'BF9', // standing outside Lala
    // C09 = 9999 duration, C0A = 15s duration
    'Aloalo Toxicosis': 'C09', // standing in Quaqua middle poison circles
  },
  triggers: [
    // Path 04: not being in bubble for Ogrebon
    nonzeroDamageMistake('Aloalo Quaqua Shock', '8A9A', 'warn'),
    // Right path: look away from statues
    nonzeroDamageMistake('Aloalo Quaqua Arcane Intervention', '8BAE', 'warn'),
    {
      id: 'Aloalo Lala Targeted Light',
      type: 'HeadMarker',
      // 01F7 = green check
      // 01F8 = red X
      netRegex: NetRegexes.headMarker({ id: '01F8' }),
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: {
            // Corresponds to 0x8CDC ability
            en: 'Targeted Light',
          },
        };
      },
    },
    renameMistake('Aloalo Statice Fair Flight', '89F5', 'warn', {
      // Corresponds to 0x8946 ability
      en: 'Fair Flight',
    }),
  ],
};

export default triggerSet;
