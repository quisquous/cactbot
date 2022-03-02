import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ContainmentBayS1T7,
  triggers: [
    {
      id: 'Sephirot Fiendish Rage',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0048' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Sephirot Ratzon',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0046' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Sephirot Ain',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '16DD', source: 'Sephirot', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'Sephirot Earth Shaker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: Conditions.targetIsYou(),
      response: Responses.earthshaker(),
    },
    {
      // The coordinates for skill are inconsistent and can't be used to
      // reliably determine the position of the knockback.
      id: 'Sephirot Pillar of Mercy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '16EA', source: 'Sephirot', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'Sephirot Storm of Words Revelation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '16EC', source: 'Storm of Words', capture: false }),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Storm of Words or die',
          fr: 'Tuez Tempête de mots ou mourrez',
        },
      },
    },
    {
      id: 'Sephirot Malkuth',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '16EB', source: 'Sephirot', capture: false }),
      response: Responses.knockback(),
    },
  ],
};

export default triggerSet;
