import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.KtisisHyperboreia,
  damageWarn: {
    'Alzadaal Alzadaal\'s Qutrub Whirling Slash': '703E', // Circle AoE, before boss 1
    'Alzadaal Alzadaal\'s Qutrub Leaping Cleave': '7040', // Circle AoE, before boss 1
    'Alzadaal Alzadaal\'s Asvattha Bad Breath': '7041', // Conal AoE, before boss 1

    'Alzadaal Ambujam Toxin Shower': '65FC', // Large AoE circles, boss 1
    'Alzadaal Abujam Corrosive Venom': '71E6', // Large AoE circles, boss 1
    'Alzadaal Ambujam Toxic Fountain': '731B', // Red AoE circles, boss 1
    'Alzadaal Ambujam Corrosive Fountain': '7374', // Blue AoE  circles, boss 1

    'Alzadaal Bounty Rockfin Aqua Spear': '704C', // Rectangle cleave AoE, before boss 2
    'Alzadaal Alzadaal\'s Rampart Pulse Laser': '7041', // Rectangle AoE, before boss 2
    'Alzadaal Bounty Uragnite Palsynixys': '7043', // Frontal cone AoE, before boss 2
    'Alzadaal Bounty Ruszor Aqua BLast': '7044', // Large frontal cone AoE, before boss 2
    'Alzadaal Shallows Ogrebon Flounder': '7046', // Rectangle AoE, before boss 2
    'Alzadaal Bounty Vepar Screwdriver': '7047', // Small frontal cone AoE, before boss 2
    'Alzadaal Bounty Clawtrap Alzadaal XIV Water III': '704F', // Frontal cone AoE, before boss 2

    'Alzadaal Armored Chariot Assault Cannon 1': '6F1C', // Primary cannon fire, boss 2
    'Alzadaal Armored Chariot Assault Cannon 2': '6F1D', // Primary cannon fire, boss 2
    'Alzadaal Armored Chariot Cannon Reflection': '6F27', // Secondary cannon fire, boss 2

    'Alzadaal Alzadaal\'s Acrolith Earthshatter': '7051', // Centered circle AoE, after boss 2
    'Alzadaal Alzadaal\'s Guardian Dominion Slash': '7052', // Large frontal cone AoE, after boss 2
    'Alzadaal Mystic Weapon Smite of Rage': '7053', // Line AoE, after boss 2
    'Alzadaal Mystic Weapon Whirl of Rage': '7054', // Centered circle AoE, after boss 2
    'Alzadaal Alzadaal\'s  Mimic Deathtrap': '7055', // Centered circle AoE, after boss 2

    'Alzadaal Kapikulu Basting Blade': '6F68', // Large Rectangle AoE, boss 3
    'Alzadaal Kapikulu Mana Explosion': '6F6B', // Power Serge explosion circles, boss 3
  },
  gainsEffectWarn: {
    'Alzadaal Kapikulu Stab Wound': 'BF6', // Spike traps, boss 3
  },
  shareWarn: {
    'Alzadaal Armored Chariot Graviton Cannon': '7373', // Large spread circles, boss 2
    'Alzadaal Kapikulu Rotary Gale': '6F6D', // Spread circles, boss 3
  },
  soloWarn: {
    'Alzadaal Kapikulu Magnitude Opus': '6F6F', // Standard stack marker, boss 3
  },
};

export default triggerSet;
