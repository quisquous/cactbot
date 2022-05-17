import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.SastashaHard,
  triggers: [
    {
      id: 'Sastasha Hard Slime',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '239' }),
      condition: (data) => data.CanCleanse(),
      infoText: (data, matches, output) => output.text!({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Esuna ${player}',
          de: 'Medica ${player}',
          fr: 'Guérison sur ${player}',
          ja: '${player} にエスナ',
          cn: '驱散: ${player}',
          ko: '"${player}" 에스나',
        },
      },
    },
    {
      id: 'Sastasha Hard Tail Screw',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'BF4', source: 'Karlabos' }),
      response: Responses.stun(),
    },
  ],
};

export default triggerSet;
