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

export type Data = OopsyData;

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

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.MountOrdealsExtreme,
  damageWarn: {
    'RubicanteEx Fiery Expiation Cone': '7CEF', // Ordeal of Purgation cone
    'RubicanteEx Fiery Expiation Square': '7CF0', // Ordeal of Purgation 180 cleave
    'RubicanteEx Arch Inferno': '7CF9', // middle circle
    'RubicanteEx Inferno Devil': '7CFB', // 2x rotating circles
    'RubicanteEx Conflagration': '7CFD', // bacon line
    'RubicanteEx Ghastly Flame': '7D0D', // ground circles during add phase
    'RubicanteEx Flamerake 1': '7D19', // card/intercard spinner lines 1
    'RubicanteEx Flamerake 2': '7D1B', // card/intercard spinner lines 1
    'RubicanteEx Flamerake 3': '7D1C', // card/intercard spinner lines 2
    'RubicanteEx Flamerake 4': '7D1E', // card/intercard spinner lines 2
    'RubicanteEx Flamerake 5': '7D1D', // card/intercard spinner lines 3
    'RubicanteEx Flamerake 6': '7D1F', // card/intercard spinner lines 3
    'RubicanteEx Scalding Signal': '7D24', // out + protean
    'RubicanteEx Scalding Ring': '7D25', // in + protean
    'RubicanteEx Scalding Fleet': '7D27', // protean line aoes repeat
    'RubicanteEx Sweeping Immolation': '7D20', // 180 front cleave
  },
  shareWarn: {
    'RubicanteEx Spike of Flame': '7D02', // spread during Arch Inferno
    'RubicanteEx Ghastly Wind': '7D0B', // purple tether cone during add phase
    'RubicanteEx Inferno Spread': '7D10', // Inferno during cape phase
    'RubicanteEx Partial Immolation': '72DD', // spread during Sweeping Immolation
  },
  shareFail: {
    'RubicanteEx Shattering Heat': '7D2D', // first phase single tankbuster
    'RubicanteEx Flamesent Shattering Heat': '7D0A', // tankbusters during add phase
    'RubicanteEx Stinging Welt': '7D16', // spread during Flamespire Brand
    'RubicanteEx Flamespire Claw': '7E73', // limit cut cleaves
  },
  soloWarn: {
    'RubicanteEx Fourfold Flame': '7D03', // healer stacks during Arch Inferno
  },
  soloFail: {
    'RubicanteEx Furious Welt': '7D15', // stack during Flamespire Brand
    'RubicanteEx Total Immolation': '7D23', // stack during Sweeping Immolation
  },
  triggers: [
    {
      // partner stacks during Arch Inferno
      id: 'RubicanteEx Twinfold Flame',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7D04' }),
      mistake: stackMistake('fail', 2),
    },
  ],
};

export default triggerSet;
