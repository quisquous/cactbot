import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import {
  OopsyFunc,
  OopsyMistake,
  OopsyMistakeType,
  OopsyTriggerSet,
} from '../../../../../types/oopsy';
import { LocaleText } from '../../../../../types/trigger';
import { GetShareMistakeText, GetSoloMistakeText } from '../../../oopsy_common';

// TODO: 7B04 Storage Violation, taking tower but only if you have Looper and wrong number
// TODO: 7B10 Diffuse Wave Cannon Kyrios being shared if not invulning?
// TODO: call out who missed their Program Loop tower
// TODO: call out who was missing in the Condensed Wave Cannon stack

// TODO: we probably could use an oopsy utility library (and Data should be `any` here).
const stackMistake = (
  type: OopsyMistakeType,
  expected: number,
  abilityText?: LocaleText,
): OopsyFunc<Data, NetMatches['Ability'], OopsyMistake | undefined> => {
  return (_data, matches) => {
    const actual = parseFloat(matches.targetCount);
    if (actual === expected || actual === 0)
      return;
    const ability = abilityText ?? matches.ability;
    const text = actual === 1 ? GetSoloMistakeText(ability) : GetShareMistakeText(ability, actual);
    return { type: type, blame: matches.target, text: text };
  };
};

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheOmegaProtocolUltimate,
  damageWarn: {
    'TOP Flame Thrower 1': '7B0D', // initial Flame Thrower during Pantokrator
    'TOP Flame Thrower 2': '7E70', // ongoing Flame Thrower during Pantokrator
    'TOP Ballistic Impact': '7B0C', // ground puddles during Pantokrator
    'TOP Beyond Strength': '7B25', // Omega-M donut during Party Synergy
    'TOP Efficient Bladework': '7B26', // Omega-M centered circle during Party Synergy
    'TOP Superliminal Steel 1': '7B3E', // Omega-F hot wing during Party Synergy
    'TOP Superliminal Steel 2': '7B3F', // Omega-F hot wing during Party Synergy
    'TOP Optimized Blizzard III': '7B2D', // Omega-F cross during Party Synergy
    'TOP Optical Laser': '7B21', // Optical Unit eye laser during Party Synergy
    'TOP Optimized Sagittarius Arrow': '7B33', // line aoe during Limitless Synergy
    'TOP Optimized Bladedance 1': '7B36', // Omega-M tankbuster conal (not tether target 7F75) during Limitless Synergy
    'TOP Optimized Bladedance 2': '7B37', // Omega-F tankbuster conal (not tether target 7F75) during Limitless Synergy
    'TOP Wave Repeater 1': '7B4F', // inner ring during p3 transition
    'TOP Wave Repeater 2': '7B50', // second ring during p3 transition
    'TOP Wave Repeater 3': '7B51', // third ring during p3 transition
    'TOP Wave Repeater 4': '7B52', // outer ring during p3 transition
    'TOP Colossal Blow': '7B4E', // Right/Left Arm Unit big centered circle during p3 transition
  },
  damageFail: {
    'TOP Storage Violation Obliteration': '7B06', // failing towers
  },
  shareWarn: {
    'TOP Blaster': '7B0A', // tether spread during Program Loop
    'TOP Wave Cannon Kyrios': '7B11', // headmarker line lasers after Pantokrator
    'TOP Optimized Fire III': '7B2F', // spread during Party Synergy
    'TOP Sniper Cannon': '7B53', // spread during p3 transition
  },
  shareFail: {
    'TOP Guided Missile Kyrios': '7B0E', // spread damage duruing Pantokrator
    'TOP Solar Ray 1': '7E6A', // tankbuster during M/F
    'TOP Solar Ray 2': '7E6B', // tankbuster during M/F
    'TOP Beyond Defense': '7B28', // spread with knockback during Limitless Synergy
  },
  soloWarn: {
    'TOP Pile Pitch': '7B29', // stack after Beyond Defense during Limitless Synergy
  },
  triggers: [
    {
      id: 'TOP Condensed Wave Cannon Kyrios',
      // Three people *should* be in this stack, so warn if somebody doesn't make it.
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B0F' }),
      mistake: stackMistake('warn', 3),
    },
    {
      id: 'TOP High-powered Sniper Cannon',
      // Wroth Flames-esque two person stack during p3 transition
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B54' }),
      mistake: stackMistake('warn', 2),
    },
  ],
};

export default triggerSet;
