import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.TheNavel,
  timelineFile: 'titan-nm.txt',
  timelineTriggers: [
    {
      // Early Callout for Tank Cleave
      id: 'TitanNm Rock Buster',
      regex: /Rock Buster/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
    {
      id: 'TitanNm Tumult',
      netRegex: NetRegexes.ability({ id: '282', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '282', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '282', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '282', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '282', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '282', source: '타이탄', capture: false }),
      condition: Conditions.caresAboutAOE(),
      suppressSeconds: 2,
      response: Responses.aoe(),
    },
    {
      // Gaol callout for both yourself and others
      id: 'TitanNm Gaols',
      netRegex: NetRegexes.gainsEffect({ effectId: '124' }),
      alertText: (data, matches, output) => {
        if (matches.target !== data.me)
          return output.breakGaolOn({ player: data.ShortName(matches.target) });

        return output.gaolOnYou();
      },
      outputStrings: {
        breakGaolOn: {
          en: 'Break Gaol on ${player}',
          de: 'Zerstöre das Gefängnis von ${player}',
          ja: '${player}にジェイル',
          cn: '石牢点${player}',
          ko: '${player} 돌감옥 해제',
        },
        gaolOnYou: {
          en: 'Gaol on YOU',
          de: 'Gefängnis auf DIR',
          ja: '自分にジェイル',
          cn: '石牢点名',
          ko: '돌감옥 대상자',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Earthen Fury': 'Gaias Zorn',
        'Titan': 'Titan',
      },
      'replaceText': {
        'Earthen Fury': 'Gaias Zorn',
        'Geocrush': 'Geo-Stoß',
        'Landslide': 'Bergsturz',
        'Rock Buster': 'Steinsprenger',
        'Rock Throw': 'Granitgefängnis',
        'Tumult': 'Urerschütterung',
        'Weight Of The Land': 'Gaias Gewicht',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Earthen Fury': 'Fureur tellurique',
        'Titan': 'Titan',
      },
      'replaceText': {
        'Earthen Fury': 'Fureur tellurique',
        'Geocrush': 'Broie-terre',
        'Landslide': 'Glissement de terrain',
        'Rock Buster': 'Casse-roc',
        'Rock Throw': 'Jeté de rocs',
        'Tumult': 'Tumulte',
        'Weight Of The Land': 'Poids de la terre',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Earthen Fury': '大地の怒り',
        'Titan': 'タイタン',
      },
      'replaceText': {
        'Earthen Fury': '大地の怒り',
        'Geocrush': 'ジオクラッシュ',
        'Landslide': 'ランドスライド',
        'Rock Buster': 'ロックバスター',
        'Rock Throw': 'グラナイト・ジェイル',
        'Tumult': '激震',
        'Weight Of The Land': '大地の重み',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Earthen Fury': '大地之怒',
        'Titan': '泰坦',
      },
      'replaceText': {
        'Earthen Fury': '大地之怒',
        'Geocrush': '大地粉碎',
        'Landslide': '地裂',
        'Rock Buster': '碎岩',
        'Rock Throw': '花岗岩牢狱',
        'Tumult': '怒震',
        'Weight Of The Land': '大地之重',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Earthen Fury': '대지의 분노',
        'Titan': '타이탄',
      },
      'replaceText': {
        'Earthen Fury': '대지의 분노',
        'Geocrush': '대지 붕괴',
        'Landslide': '산사태',
        'Rock Buster': '바위 쪼개기',
        'Rock Throw': '화강암 감옥',
        'Tumult': '격진',
        'Weight Of The Land': '대지의 무게',
      },
    },
  ],
};
