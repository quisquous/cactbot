import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheSixthCircleSavage,
  timelineFile: 'p6s.txt',
  triggers: [
    {
      id: 'P6S Hemitheos\'s Dark IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7860', source: 'Hegemone', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P6S Chelic Synergy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '788A', source: 'Hegemone' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P6S Synergy',
      type: 'StartsUsing',
      // There are 7889 individual starts using casts on the two tanks as well,
      // if this trigger wanted to be more complicated.
      netRegex: NetRegexes.startsUsing({ id: '7887', source: 'Hegemone', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Split Tankbusters',
          de: 'Geteilter Tankbuster',
        },
      },
    },
    {
      id: 'P6S Choros Ixou Front Back',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7883', source: 'Hegemone', capture: false }),
      response: Responses.goFrontBack(),
    },
    {
      id: 'P6S Choros Ixou Sides',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7881', source: 'Hegemone', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'P6S Dark Dome Bait',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '788B', source: 'Hegemone', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait Circles',
          de: 'Kreise ködern',
        },
      },
    },
    {
      id: 'P6S Dark Dome Move',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '788B', source: 'Hegemone', capture: false }),
      response: Responses.moveAway(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Hegemone': 'Hegemone',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Hegemone': 'Hégémone',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Hegemone': 'ヘーゲモネー',
      },
    },
  ],
};

export default triggerSet;
