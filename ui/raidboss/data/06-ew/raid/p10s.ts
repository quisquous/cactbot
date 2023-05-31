import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const bossNameUnicode = 'Pand\u00e6monium';

const triggerSet: TriggerSet<Data> = {
  id: 'AnabaseiosTheTenthCircleSavage',
  zoneId: ZoneId.AnabaseiosTheTenthCircleSavage,
  timelineFile: 'p10s.txt',
  triggers: [
    {
      id: 'P10S Ultima',
      type: 'StartsUsing',
      netRegex: { id: '82A5', source: bossNameUnicode, capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P10S Pandaemon\'s Holy',
      type: 'StartsUsing',
      netRegex: { id: '82A6', source: bossNameUnicode, capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'P10S Circles of Pandaemonium',
      type: 'StartsUsing',
      netRegex: { id: '82A7', source: bossNameUnicode, capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'P10S Wicked Step',
      type: 'StartsUsing',
      netRegex: { id: '8299', source: bossNameUnicode, capture: false },
      alertText: (data, _matches, output) => {
        if (data.party.isTank(data.me))
          return output.soak!();
      },
      infoText: (data, _matches, output) => {
        if (!data.party.isTank(data.me))
          return output.avoid!();
      },
      outputStrings: {
        soak: {
          en: 'Soak tower',
          de: 'Türme nehmen',
          fr: 'Prenez une tour',
        },
        avoid: {
          en: 'Avoid towers',
          de: 'Türme vermeiden',
          fr: 'Évitez les tours',
        },
      },
    },
  ],
};

export default triggerSet;
