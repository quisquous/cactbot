import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default defineTriggerSet({
  zoneId: ZoneId.Labyrinthos,
  triggers: [
    {
      id: 'Hunt Hulder Lay of Mislaid Memory',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69C1', source: 'Hulder', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.awayFromFront('info'),
    },
    {
      id: 'Hunt Hulder Tempestuous Wrath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69C3', source: 'Hulder', capture: false }),
      condition: (data) => data.inCombat,
      infoText: (_data, _matches, output) => output.followCharge!(),
      outputStrings: {
        followCharge: {
          en: 'Follow charge',
          de: 'Folge dem Ansturm',
          fr: 'Suivez la charge',
          ja: 'ボス従う',
          cn: '跟随冲锋',
          ko: '돌진 따라가기',
        },
      },
    },
    {
      id: 'Hunt Hulder Rotting Elegy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69C4', source: 'Hulder', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getUnder('alert'),
    },
    {
      id: 'Hunt Hulder Storm of Color',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69C6', source: 'Hulder' }),
      condition: (data) => data.inCombat,
      // Not a cleave.
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Hulder Ode to Lost Love',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69C5', source: 'Hulder', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Storsie Fang\'s End',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE1', source: 'Storsie' }),
      condition: (data) => data.inCombat,
      // Not a cleave.
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Storsie Earth Aspect',
      type: 'Ability',
      // Before Earth Auger (6AE0).
      netRegex: NetRegexes.ability({ id: '6ADA', source: 'Storsie', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Storsie Wind Aspect',
      type: 'Ability',
      // Before Whorlstorm (6ADE).
      netRegex: NetRegexes.ability({ id: '6ADB', source: 'Storsie', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getIn(),
    },
    {
      id: 'Hunt Storsie Lightning Aspect',
      type: 'Ability',
      // Before Defibrillate (6ADF).
      netRegex: NetRegexes.ability({ id: '6ADC', source: 'Storsie', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Hulder': 'Hulder',
        'Storsie': 'Storsie',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Hulder': 'huldre',
        'Storsie': 'Storsie',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Hulder': 'フルドラ',
        'Storsie': 'ストーシー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Hulder': '胡睹',
        'Storsie': '斯图希',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Hulder': '훌드라',
        'Storsie': '스토르시에',
      },
    },
  ],
});
