import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AlzadaalsLegacy,
  timelineFile: 'alzadaals_legacy.txt',
  triggers: [
    {
      id: 'Alzadaal Big Wave',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F60', source: 'Ambujam', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Alzadaal Tentacle Dig',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6F55', '6559'], source: 'Ambujam', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid tentacle explosions',
        },
      },
    },
    {
      id: 'Alzadaal Fountain',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '731A', source: 'Ambujam', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Dodge 3 to 1',
        },
      },
    },
    {
      id: 'Alzadaal Diffusion Ray',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F1E', source: 'Armored Chariot', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Alzadaal Rail Cannon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F1F', source: 'Armored Chariot' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Alzadaal Articulated Bits',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F19', source: 'Armored Chariot', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid bit lasers',
        },
      },
    },
    {
      id: 'Alzadaal Graviton Cannon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7373', source: 'Armored Chariot' }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4,
      response: Responses.spread(),
    },
    {
      id: 'Alzadaal Billowing Bolts',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F70', source: 'Kapikulu', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Alzadaal Spin Out',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F63', source: 'Kapikulu', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Steer away from spikes',
        },
      },
    },
    {
      id: 'Alzadaal Power Serge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F6A', source: 'Kapikulu', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid tethered color',
        },
      },
    },
    {
      id: 'Alzadaal Magnitude Opus',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00A1' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Alzadaal Rotary Gale',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0060', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'Alzadaal Crewel Slice',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6F72', source: 'Kapikulu' }),
      response: Responses.tankBuster(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceSync': {
        'Corrosive Venom/Toxic Shower': 'Venom/Shower',
        'Corrosive Fountain/Toxic Fountain': 'Fountain',
        'Magnitude Opus/Rotary Gale': 'Opus/Gale',
      },
    },
  ],
};

export default triggerSet;
