import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: how to call out Astral Flow rotations? Behemoths can be adjacent/catty corner
// TODO: Esoteric Ray has only one id for starting mid / starting sides (maybe startsUsing pos?)
// TODO: Exoterikos has differentiating ids, but need to know where (maybe startsUsing pos?)
// TODO: Astral Eclipse star patterns? Are they fixed?
// TODO: in the last phase, is the Exoterikos always Sect during Triple Esoteric Ray?
// TODO: heal to full for Kokytos

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheDarkInside,
  timelineFile: 'zodiark.txt',
  triggers: [
    {
      id: 'Zodiark Ania',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B62', source: 'Zodiark' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Zodiark Algedon NE',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67D1', source: 'Zodiark', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      // Warn about knockback just as a precaution in case players don't make it.
      // Also, technically NE/SW is safe, but having all players run together is better.
      outputStrings: {
        text: {
          en: 'Go NE (knockback)',
        },
      },
    },
    {
      id: 'Zodiark Algedon NW',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '67D2', source: 'Zodiark', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go NW (knockback)',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Esoteric Dyad/Esoteric Sect': 'Esoteric Dyad/Sect',
      },
    },
  ],
};

export default triggerSet;
