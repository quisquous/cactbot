import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Arch-Eta Tail Swipe rear cleave

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.Elpis,
  triggers: [
    {
      id: 'Hunt Arch-Eta Energy Wave',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A55', source: 'Arch-Eta', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Arch-Eta Sonic Howl',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A88', source: 'Arch-Eta', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Arch-Eta Fanged Lunge',
      type: 'Ability',
      // Before Heavy Stomp (6A87) cast.
      netRegex: NetRegexes.ability({ id: '6A8A', source: 'Arch-Eta', capture: false }),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from jump',
        },
      },
    },
    {
      id: 'Hunt Fan Ail Cyclone Wing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AF4', source: 'Fan Ail', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Fan Ail Plummet',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AF2', source: 'Fan Ail', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Fan Ail Divebomb',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AED', source: 'Fan Ail' }),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.divebombOnYou!();
        return output.divebombMarker!();
      },
      outputStrings: {
        divebombOnYou: {
          en: 'Divebomb on YOU',
        },
        divebombMarker: {
          en: 'Away from Divebomb Marker',
        },
      },
    },
  ],
};

export default triggerSet;
