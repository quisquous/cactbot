//import Conditions from '../../../../../resources/conditions';
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
      netRegex: NetRegexes.startsUsing({ id: 'C91', source: 'Slithy Zolool Ja'}),
      netRegexDe: NetRegexes.startsUsing({ id: 'C91'}),
      netRegexFr: NetRegexes.startsUsing({ id: 'C91'}),
      netRegexJa: NetRegexes.startsUsing({ id: 'C91'}),
      response: Responses.tankBuster(),
    },
    {
      // Not 100% sure if there's a better way to handle the callout
      id: 'Wanderer\'s Palace Hard Doom',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D2' }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        en: 'Doom on ${player} : Heal',
        de: '',
        fr: 'Doom sur ${player} : Soin complet',
        ja: '',
        cn: '',
        ko: '',
      },
    },
    {
      id: 'Wanderer\'s Palace Hard Soul Douse',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C9E', source: 'Slithy Zolool Ja'}),
      netRegexDe: NetRegexes.startsUsing({ id: 'C9E'}),
      netRegexFr: NetRegexes.startsUsing({ id: 'C9E'}),
      netRegexJa: NetRegexes.startsUsing({ id: 'C9E'}),
      response: Responses.lookAway(),
    },
  ],
};

export default triggerSet;
