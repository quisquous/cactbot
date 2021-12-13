import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheAitiascope,
  timelineFile: 'the_aitiascope.txt',
  triggers: [
    {
      id: 'Aitiascope Livia Frustration',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6448', source: 'Livia the Undeterred', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aitiascope Livia Aglaea Climb NE/SW',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6442', source: 'Livia the Undeterred', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Back Right / Front Left',
        },
      },
    },
    {
      id: 'Aitiascope Livia Aglaea Climb NW/SE',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6443', source: 'Livia the Undeterred', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Back Left / Front Right',
        },
      },
    },
    {
      id: 'Aitiascope Livia Aglaea Bite',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6449', source: 'Livia the Undeterred' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Aitiascope Livia Ignis Odi',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '644D', source: 'Livia the Undeterred' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Aitiascope Rhitahtyn Tartarean Impact',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6455', source: 'Livia the Undeterred', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aitiascope Rhitahtyn Shield Skewer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6450', source: 'Livia the Undeterred', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Hide behind broken crystal',
        },
      },
    },
    {
      id: 'Aitiascope Rhitahtyn Shrapnel Shell',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6452', source: 'Livia the Undeterred', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Crosshairs',
        },
      },
    },
    {
      id: 'Aitiascope Rhitahtyn Anvil of Tartarus',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6456', source: 'Livia the Undeterred' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Aitiascope Amon Dark Forte',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6464', source: 'Amon the Undying' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Aitiascope Amon Ysayle\'s Spirit Dreams of Ice',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6C6C', source: 'Ysayle\'s Spirit', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Hide Behind Ice',
        },
      },
    },
    {
      id: 'Aitiascope Amon Entr\'acte',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6465', source: 'Amon the Undying', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Aitiascope Amon Right Firaga Forte',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6460', source: 'Amon the Undying', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'Aitiascope Amon Left Firaga Forte',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6461', source: 'Amon the Undying', capture: false }),
      response: Responses.goLeft(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Left Firaga Forte/Right Firaga Forte': 'Left/Right Firaga Forte',
      },
    },
  ],
};

export default triggerSet;
