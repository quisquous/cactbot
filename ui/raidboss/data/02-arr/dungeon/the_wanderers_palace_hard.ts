import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheWanderersPalaceHard,
  triggers: [
    {
      id: 'Wanderer\'s Palace Hard Firespit',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C91', source: 'Slithy Zolool Ja' }),
      response: Responses.tankBuster(),
    },
    {
      // Not 100% sure if there's a better way to handle the callout
      id: 'Wanderer\'s Palace Hard Doom',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D2' }),
      alertText: (data, matches, output) => output.text!({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Heal ${player} to full',
          fr: 'Soin complet sur ${player}',
        },
      },
    },
    {
      id: 'Wanderer\'s Palace Hard Soul Douse',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C9E', source: 'Slithy Zolool Ja', capture: false }),
      response: Responses.lookAway(),
    },
  ],
};

export default triggerSet;
