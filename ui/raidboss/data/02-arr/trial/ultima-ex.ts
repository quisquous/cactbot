import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladUltimasBane,
  timelineFile: 'ultima-ex.txt',
  timelineTriggers: [
    {
      // Early Callout for Tank Cleave
      id: 'Ultima EX Homing Lasers',
      regex: /Homing Lasers/,
      beforeSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Off-tank cleave',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'Ultima EX Tank Purge',
      netRegex: NetRegexes.startsUsing({ id: '5EA', source: 'The Ultima Weapon', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      // At 5 stacks of Aetheroplasm, the target begins taking massive damage.
      id: 'Ultima EX Viscous Aetheroplasm',
      netRegex: NetRegexes.gainsEffect({ effectId: '171', count: '04' }),
      response: Responses.tankBusterSwap(),
    },
  ],
};

export default triggerSet;
