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
      id: 'Sephirot Pillar of Mercy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '16EA', source: 'Sephirot' }),
      alertText: (_data, matches, output) => {
        // The pillars spawn in slightly randomized positions, typically
        // either in the west side, center, or east side. The X position
        // range for the arena is -20 to 20.
        //
        // TODO: Sometimes the coordinates for the Pillar of Mercy seem to be
        // wrong (an xPos of -10 for a central knockback or +12.5 for a west
        // knockback). It's unclear if this is a bug in the parser or
        // cactbot.
        const xPos = parseFloat(matches.x);

        if (xPos < -6)
          return output.west!();
        if (xPos > 6)
          return output.east!();

        return output.center!();
      },
      outputStrings: {
        west: {
          en: 'Knockback from West',
        },
        east: {
          en: 'Knockback from East',
        },
        center: {
          en: 'Knockback from Center',
        },
      },
    },
    {
      id: 'Sephirot Storm of Words Revelation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '16EC', source: 'Storm of Words', capture: false }),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Storm of Words or die',
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
