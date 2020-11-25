import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// Sohm Al (normal)
export default {
  zoneId: ZoneId.SohmAl,
  triggers: [
    {
      id: 'Sohm Al Myath Stack',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Sohm Al Myath Spread',
      netRegex: NetRegexes.headMarker({ id: '00AE' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Sohm Al Myath Chyme',
      netRegex: NetRegexes.addedCombatant({ name: 'Chyme Of The Mountain', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Gebirgsbrei', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Chyme Des Montagnes', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'キームス・マウンテン', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '圣山之糜', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '산의 유미즙', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Chyme Add',
          de: 'Brei Add töten',
          fr: 'Tuez l\'add Chyme',
          ja: 'キームス・マウンテンを倒す',
          cn: '击杀圣山之糜',
          ko: '산의 유미즙 처치',
        },
      },
    },
    {
      id: 'Sohm Al Tioman Meteor',
      netRegex: NetRegexes.headMarker({ id: '0007' }),
      condition: Conditions.targetIsYou(),
      response: Responses.meteorOnYou(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Chyme Of The Mountain': 'Gebirgsbrei',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Chyme Of The Mountain': 'Chyme des montagnes',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Chyme Of The Mountain': 'キームス・マウンテン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Chyme Of The Mountain': '圣山之糜',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Chyme Of The Mountain': '산의 유미즙',
      },
    },
  ],
};
