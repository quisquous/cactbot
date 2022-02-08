import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: shackles could probably be handled with more nuance than just "was it shared"
//       but this is the most common failure mode and is easy to write.

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFirstCircleSavage,
  damageWarn: {
    'P1S Gaoler\'s Flail 1': '65F6', // various gaoler's flail in/out/left/right mechanics
    'P1S Gaoler\'s Flail 2': '65F7', // etc
    'P1S Gaoler\'s Flail 3': '65F8',
    'P1S Gaoler\'s Flail 4': '65F9',
    'P1S Gaoler\'s Flail 5': '65FA',
    'P1S Gaoler\'s Flail 6': '65FB',
    'P1S Gaoler\'s Flail 7': '65FC',
    'P1S Gaoler\'s Flail 8': '65FD',
    'P1S Gaoler\'s Flail 9': '65FE',
    'P1S Gaoler\'s Flail 10': '65FF',
    'P1S Gaoler\'s Flail 11': '6600',
    'P1S Gaoler\'s Flail 12': '6601',
    'P1S Gaoler\'s Flail 13': '6DA6',
    'P1S Gaoler\'s Flail 14': '6DA7',
    'P1S Gaoler\'s Flail 15': '6DA8',
    'P1S Gaoler\'s Flail 16': '6DA9',
    'P1S Gaoler\'s Flail 17': '6DAA',
    'P1S Gaoler\'s Flail 18': '6DAB',
    'P1S Gaoler\'s Flail 19': '6DAC',
    'P1S Gaoler\'s Flail 20': '6DAD',
    'P1S Powerful Fire': '661A', // fire explosion during fire/light
    'P1S Powerful Light': '661B', // light explosion during fire/light
    'P1S Intemperate Flames': '6C75', // missed fire temperature square
    'P1S Intemperate Ice': '6C76', // missed ice temperature square
    'P1S Inevitable Flame': '6EC1', // sharing the color with the shackles of time person
    'P1S Inevitable Light': '6EC2', // sharing the color with the shackles of time person
  },
  damageFail: {
    'P1S Disastrous Spell': '6623', // the purple middle blocks during Intemperate
    'P1S Painful Flux': '6624', // standing between temperature squares
  },
  shareFail: {
    'P1S Chain Pain 1': '6627', // close/far shackles
    'P1S Chain Pain 2': '6628', // close/far shackles
  },
  soloFail: {
    'P1S True Holy': '6612', // Pitiless Flail of Grace stack marker
  },
  triggers: [
    {
      id: 'P1S Damage Down',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B5F' }),
      mistake: (_data, matches) => {
        return { type: 'damage', text: matches.effect, blame: matches.target };
      },
    },
  ],
};

export default triggerSet;
