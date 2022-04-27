import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.HalataliHard,
  triggers: [
    {
      id: 'Hataliti Hard Demon Eye',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '833', source: 'Catoblepas', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Use the Orb',
          fr: 'Utilisez l\'Orb',
        },
      },
    },
    {
      id: 'Hataliti Hard Standstill',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '84F', source: 'Mumuepo the Beholden', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Use the Nail',
          fr: 'Utilisez L\'Epine',
        },
      },
    },
  ],
};

export default triggerSet;
