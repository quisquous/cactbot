import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.Euphrosyne,
  damageWarn: {
    'Euphrosyne Nophica Spring Flowers': '7C10', // "out" from The Giving Land
    'Euphrosyne Nophica Summer Shade': '7C0F', // "in" from The Giving Land
    'Euphrosyne Nophica Reaper\'s Gale': '7C0E', // waffles
    'Euphrosyne Nophica Landwaker': '7C1C', // circles paired with waffles
    'Euphrosyne Nophica Sowing Circle 1': '7C14', // initial exaflares
    'Euphrosyne Nophica Sowing Circle 2': '7C15', // ongoing exaflares

    'Euphrosyne Gigantoad Labored Leap': '7D31', // centered circle
    'Euphrosyne Gigantoad Rush': '7D32', // targeted line
    'Euphrosyne Werewood Ovation': '7D33', // frontal narrow line

    'Euphrosyne Ktenos Rock Throw': '7D3A', // targeted circle
    'Euphrosyne Behemoth Touchdown': '7D34', // large circle
    'Euphrosyne Behemoth Trounce': '7D36', // frontal conal

    'Euphrosyne Althyk Mythril Greataxe': '7A46', // large conal
    'Euphrosyne Nymeia Hydrorythmos 1': '7A40', // initial water lines
    'Euphrosyne Nymeia Hydrorythmos 2': '7A41', // ongoing water lines

    'Euphrosyne Dhruva Aetherial Blizzard': '7D3F', // frontal line
    'Euphrosyne Colossus Frozen Perimeter': '7D3D', // centered donut
    'Euphrosyne Colossus Inner Bladestorm': '7D3E', // centered circle

    'Euphrosyne Halone Tetrapagos Hailstorm': '7D4E', // tetrapagos circle
    'Euphrosyne Halone Tetrapagos Swirl': '7D4F', // tetrapagos donut
    'Euphrosyne Halone Tetrapagos Rightrime': '7D50', // tetrapagos right cleave
    'Euphrosyne Halone Tetrapagos Leftrime': '7D51', // tetrapagos left cleave
    'Euphrosyne Halone Thousandfold Thrust 1': '7D57', // initial 180 cleave
    'Euphrosyne Halone Thousandfold Thrust 2': '7D58', // ongoing 180 cleave
    'Euphrosyne Halone Lochos 1': '7D5B', // initial lochos 180 cleave
    'Euphrosyne Halone Lochos 2': '7D5C', // initial lochos 180 cleave
    'Euphrosyne Halone Will of the Fury 1': '7D5E', // expanding ring
    'Euphrosyne Halone Will of the Fury 2': '7D5F', // expanding ring
    'Euphrosyne Halone Will of the Fury 3': '7D60', // expanding ring
    'Euphrosyne Halone Will of the Fury 4': '7D61', // expanding ring
    'Euphrosyne Halone Will of the Fury 5': '7D62', // expanding ring
    'Euphrosyne Halone Glacial Spear Niphas': '7D69', // centered circle on spears
    'Euphrosyne Halone Glacial Spear Cheimon 1': '7D6C', // initial rotating lines
    'Euphrosyne Halone Glacial Spear Cheimon 2': '7D6D', // ongoing rotating lines

    'Euphrosyne Menphina First Blush': '7BBC', // getting hit by the Full Bright moon
    'Euphrosyne Menphina Midnight Frost 1': '7BCD', // 180 cleave
    'Euphrosyne Menphina Midnight Frost 2': '7BDD', // 180 cleave
    'Euphrosyne Menphina Midnight Frost 3': '7BD1', // 180 cleave
    'Euphrosyne Menphina Midnight Frost 4': '7BD2', // 180 cleave
    // FIXME: this id is the same as Midnight Frost 2 above, is it correct or one of them incorrect?
    // 'Euphrosyne Menphina Midnight Frost 5': '7BDD', // 180 cleave
    'Euphrosyne Menphina Midnight Frost 6': '7BDE', // 180 cleave
    'Euphrosyne Menphina Midnight Frost 7': '7BEA', // 180 cleave
    'Euphrosyne Menphina Midnight Frost 8': '7BEB', // 180 cleave
    'Euphrosyne Menphina Lover\'s Bridge': '7BBD', // getting hit by Full Bright moon (4x)
    'Euphrosyne Menphina Silver Mirror': '7BF6', // 3x sets of ground aoes on everyone
    'Euphrosyne Menphina Moonset': '7BC9', // 3x large circle jumps
    'Euphrosyne Menphina Winter Halo 1': '7BC7', // donut
    'Euphrosyne Menphina Winter Halo 2': '7BEC', // donut during Playful Orbit
    'Euphrosyne Menphina Winter Halo 3': '7BDF', // donut in second phase, not in Playful Orbit?
    'Euphrosyne Menphina Ice Sprite Ancient Blizzard': '8066', // long conal during add phase
    'Euphrosyne Menphina Waxing Claw 1': '7BE0', // 180 cleave from dog
    'Euphrosyne Menphina Waxing Claw 2': '7BE1', // 180 cleave from dog
  },
  gainsEffectWarn: {
    'Euphrosyne Halone Deep Freeze': '4E6', // getting hit by Will of the Fury
  },
  shareWarn: {
    'Euphrosyne Nymeia Hydroptosis': '7A45', // spread
    'Euphrosyne Halone Ice Dart': '7D66', // spread during add phase
    'Euphrosyne Menphina Keen Boonbeam': '7BF4', // spread during add phase
  },
  shareFail: {
    'Euphrosyne Nophica Heavens\' Earth': '7C23', // tankbuster
    'Euphrosyne Ktenos Sweeping Gouge': '7D39', // tankbuster (does this cleave??)
    'Euphrosyne Colossuus Rapid Sever': '7D3C', // tankbuster (does this cleave??)
    'Euphrosyne Halone Spears Three': '7D78', // tankbuster
    'Euphrosyne Menphina Lunar Kiss': '7BF9', // laser tankbuster
  },
  triggers: [
    {
      // These do no damage if you are standing in the correct shield.
      id: 'Euphrosyne Nophica Blossoms',
      type: 'Ability',
      // 7C20 = Blueblossoms
      // 7C21 = Giltblossoms
      netRegex: NetRegexes.ability({ id: ['7C20', '7C21'], ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
    {
      // No damage if on a purple fissure.
      id: 'Euphrosyne Althyk Inexorable Pull',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7A43', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
    {
      // No damage if looking towards/away.
      id: 'Euphrosyne Althyk Spinner\'s Wheel Arcane Attraction',
      type: 'Ability',
      // 7A54 = Spinner's Wheel damage for Arcane Attraction
      // 7A55 = Spinner's Wheel damage for Attraction Reversed
      netRegex: NetRegexes.ability({ id: ['7A54', '7A55'], ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
    {
      id: 'Euphrosyne Nymeia Hydrostasis',
      type: 'Ability',
      // 7A3B = 1, 7A3C = 2, 7A3D = 3, 7A3E = 3 renumbered to 1
      netRegex: NetRegexes.ability({ id: ['7A3B', '7A3C', '7A3D', '7A3E'] }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'Renversé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
