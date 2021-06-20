import { RaidbossData as Data } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { NetAllMatches } from '../../../../../types/net_matches';

export { RaidbossData as Data } from '../../../../../types/data';

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheNavelExtreme,
  timelineFile: 'titan-ex.txt',
  timelineTriggers: [
    {
      id: 'TitanEx Mountain Buster',
      regex: /Mountain Buster/,
      beforeSeconds: 7,
      condition: (data) => data.role === 'healer' || data.role === 'tank',
      response: Responses.tankBuster(),
    },
    {
      id: 'TitanEx Mountain Buster Avoid',
      regex: /Mountain Buster/,
      beforeSeconds: 7,
      condition: (data) => data.role !== 'healer' && data.role !== 'tank',
      response: Responses.tankCleave(),
    },
    {
      id: 'TitanEx Tumult',
      regex: /Tumult/,
      beforeSeconds: 5,
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'TitanEx Gaoler Adds',
      regex: /Gaoler Adds/,
      beforeSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Gaoler Adds',
          de: 'graniten Kerkermeister Adds',
          fr: 'Adds geôlier',
          ja: '雑魚: 子タイタン',
          cn: '小土豆出现',
          ko: '화강암 감옥 쫄',
        },
      },
    },
    {
      id: 'TitanEx Double Weight',
      regex: /Weight Of The Land 1/,
      beforeSeconds: 4,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Double Weight',
          de: 'Doppeltes Gaias Gewicht',
          fr: 'Double poids',
          ja: '大地の重み2連',
          cn: '二连流沙',
          ko: '2연속 대지의 무게',
        },
      },
    },
  ],
  triggers: [
    {
      // Doesn't seem like this happens twice, but let's be safe.
      netType: 'Tether',
      id: 'TitanEx Rock Throw',
      netRegex: NetRegexes.tether({ id: '0007' }),
      suppressSeconds: 1,
      alertText: (data, matches: NetAllMatches['Tether'], output) => {
        if (matches.source === data.me || matches.target === data.me)
          return output.jailOnYou!();
      },
      infoText: (data, matches: NetAllMatches['Tether'], output) => {
        if (matches.source !== data.me && matches.target !== data.me)
          return output.jails!();
      },
      outputStrings: {
        jailOnYou: {
          en: 'Jail on YOU',
          de: 'Gefängnis auf DIR',
          fr: 'Geôle sur VOUS',
          ja: '自分にジェイル',
          cn: '石牢点名',
          ko: '돌감옥 대상자',
        },
        jails: {
          en: 'Jails',
          de: 'Gefängnis',
          fr: 'Geôles',
          ja: 'ジェイル',
          cn: '石牢',
          ko: '돌감옥',
        },
      },
    },
    {
      id: 'TitanEx Upheaval',
      // Five second cast time.
      netRegex: NetRegexes.startsUsing({ source: 'Titan', id: '5BA', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Titan', id: '5BA', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Titan', id: '5BA', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'タイタン', id: '5BA', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '泰坦', id: '5BA', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '타이탄', id: '5BA', capture: false }),
      response: Responses.knockback('info'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bomb Boulder': 'Bomber-Brocken',
        'Granite Gaoler': 'graniten(?:e|er|es|en) Kerkermeister',
        'Titan': 'Titan',
      },
      'replaceText': {
        '\\(all\\)': '(alle)',
        '\\(clock\\)': '(Uhrzeiger)',
        '\\(one side\\)': '(eine Seite)',
        '\\(row (\\\d)\\)': '(Reihe $1)',
        'Burst': 'Einschlag',
        'Bury': 'Begraben',
        'Earthen Fury': 'Gaias Zorn',
        'Gaoler Adds': 'Kerkermeister Adds',
        'Gaoler Landslide': 'Kerkermeister Bergsturz',
        'Gaoler Tumult': 'Kerkermeister Urerschütterung ',
        'Geocrush': 'Geo-Stoß',
        '(?<! )Landslide': 'Bergsturz',
        'Mountain Buster': 'Bergsprenger',
        'Rock Buster': 'Steinsprenger',
        'Rock Throw': 'Granitgefängnis',
        '(?<! )Tumult': 'Urerschütterung',
        'Upheaval': 'Urtrauma',
        'Weight Of The Land': 'Gaias Gewicht',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bomb Boulder': 'Bombo Rocher',
        'Granite Gaoler': 'Geôlier De Granite',
        'Titan': 'Titan',
      },
      'replaceText': {
        '\\(all\\)': '(tous)',
        '\\(clock\\)': '(sens horaire)',
        '\\(one side\\)': '(un côté)',
        '\\(row 1\\)': '(rangée 1)',
        '\\(row 2\\)': '(rangée 2)',
        '\\(row 3\\)': '(rangée 3)',
        'Burst': 'Explosion',
        'Bury': 'Ensevelissement',
        'Earthen Fury': 'Fureur tellurique',
        'Gaoler Adds': 'Adds geôlier',
        'Gaoler Landslide\\?': 'Geôlier glissement ?',
        'Gaoler Tumult': 'Geôlier tumulte',
        'Geocrush': 'Broie-terre',
        '(?<! )Landslide': 'Glissement de terrain',
        'Mountain Buster': 'Casse-montagnes',
        'Rock Buster': 'Casse-roc',
        'Rock Throw': 'Jeté de rocs',
        '(?<! )Tumult': 'Tumulte',
        'Upheaval': 'Bouleversement',
        'Weight Of The Land': 'Poids de la terre',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bomb Boulder': 'ボムボルダー',
        'Granite Gaoler': 'グラナイト・ジェイラー',
        'Titan': 'タイタン',
      },
      'replaceText': {
        '\\(all\\)': '(全て)',
        '\\(clock\\)': '(時針回り)',
        '\\(one side\\)': '(一側)',
        '\\(row 1\\)': '(1列)',
        '\\(row 2\\)': '(2列)',
        '\\(row 3\\)': '(3列)',
        'Burst': '大爆発',
        'Bury': '衝撃',
        'Earthen Fury': '大地の怒り',
        'Gaoler Adds': '雑魚: 子タイタン',
        'Gaoler Landslide\\?': '子タイタン: ランドスライド?',
        'Gaoler Tumult': '子タイタン: 激震',
        'Geocrush': 'ジオクラッシュ',
        '(?<! )Landslide': 'ランドスライド',
        'Mountain Buster': 'マウンテンバスター',
        'Rock Buster': 'ロックバスター',
        'Rock Throw': 'グラナイト・ジェイル',
        '(?<! )Tumult': '激震',
        'Upheaval': '大激震',
        'Weight Of The Land': '大地の重み',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bomb Boulder': '爆破岩石',
        'Granite Gaoler': '花岗石卫',
        'Titan': '泰坦',
      },
      'replaceText': {
        '\\(all\\)': '(全部)',
        '\\(clock\\)': '(顺时针)',
        '\\(one side\\)': '(一侧)',
        '\\(row 1\\)': '(第1列)',
        '\\(row 2\\)': '(第2列)',
        '\\(row 3\\)': '(第3列)',
        'Burst': '爆炸',
        'Bury': '塌方',
        'Earthen Fury': '大地之怒',
        'Gaoler Adds': '花岗石卫出现',
        'Gaoler Landslide': '花岗石卫地裂',
        'Gaoler Tumult': '花岗石卫怒震',
        'Geocrush': '大地粉碎',
        '(?<! )Landslide': '地裂',
        'Mountain Buster': '山崩',
        'Rock Buster': '碎岩',
        'Rock Throw': '花岗岩牢狱',
        '(?<! )Tumult': '怒震',
        'Upheaval': '大怒震',
        'Weight Of The Land': '大地之重',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb Boulder': '바위폭탄',
        'Granite Gaoler': '화강암 감옥',
        'Titan': '타이탄',
      },
      'replaceText': {
        '\\(all\\)': '(모두)',
        '\\(clock\\)': '(시계 방향)',
        '\\(one side\\)': '(한 방향)',
        '\\(row 1\\)': '(1열)',
        '\\(row 2\\)': '(2열)',
        '\\(row 3\\)': '(3열)',
        'Burst': '대폭발',
        'Bury': '충격',
        'Earthen Fury': '대지의 분노',
        'Geocrush': '대지 붕괴',
        '(?<! )Landslide': '산사태',
        'Mountain Buster': '산 쪼개기',
        'Rock Buster': '바위 쪼개기',
        'Rock Throw': '화강암 감옥',
        '(?<! )Tumult': '격진',
        'Upheaval': '대격진',
        'Weight Of The Land': '대지의 무게',
      },
    },
  ],
};

export default triggerSet;
