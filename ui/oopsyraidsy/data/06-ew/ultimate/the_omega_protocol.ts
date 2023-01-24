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
    if (actual === expected)
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
  },
  damageFail: {
    'TOP Storage Violation Obliteration': '7B06', // failing towers
  },
  shareWarn: {
    'TOP Blaster': '7B0A', // tether spread during Program Loop
    'TOP Wave Cannon Kyrios': '7B11', // headmarker line lasers after Pantokrator
  },
  shareFail: {
    'TOP Storage Violation': '7B04', // tower during Program Loop
    'TOP Guided Missile Kyrios': '7B0E', // spread damage duruing Pantokrator
  },
  triggers: [
    {
      id: 'TOP Condensed Wave Cannon Kyrios',
      // Three people *should* be in this stack, so warn if somebody doesn't make it.
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7B0F' }),
      mistake: stackMistake('warn', 3),
    },
  ],
};

export default triggerSet;
