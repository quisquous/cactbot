import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default {
  zoneId: ZoneId.TheBowlOfEmbers,
  timelineFile: 'ifrit-nm.txt',
  timelineTriggers: [
    {
      id: 'IfritNM Inner',
      regex: /Radiant Plume \(inner\)/,
      beforeSeconds: 3.5,
      response: Responses.getOut(),
    },
    {
      id: 'IfritNM Outer',
      regex: /Radiant Plume \(outer\)/,
      beforeSeconds: 3.5,
      response: Responses.getIn(),
    },
    {
      id: 'IfritNM Nail Add',
      regex: /Nail Add/,
      beforeSeconds: 0.5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Nail',
          de: 'infernalische Fessel zerstören',
          fr: 'Détruisez le clou',
          ja: '炎獄の楔を討つ',
          cn: '击杀火狱之楔',
          ko: '말뚝 파괴하기',
        },
      },
    },
  ],
  triggers: [
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ifrit': 'Ifrit',
      },
      'replaceText': {
        'Eruption': 'Eruption',
        'Hellfire': 'Höllenfeuer',
        'Incinerate': 'Einäschern',
        'Nail Add': 'Fessel Add',
        'Radiant Plume': 'Scheiterhaufen',
        'Vulcan Burst': 'Feuerstoß',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ifrit': 'Ifrit',
      },
      'replaceText': {
        'Eruption': 'Éruption',
        'Hellfire': 'Flammes de l\'enfer',
        'Incinerate': 'Incinération',
        'Nail Add': 'Add Clou',
        'Radiant Plume': 'Panache radiant',
        'Vulcan Burst': 'Explosion volcanique',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ifrit': 'イフリート',
      },
      'replaceText': {
        'Eruption': 'エラプション',
        'Hellfire': '地獄の火炎',
        'Incinerate': 'インシネレート',
        'Nail Add': '雑魚: 炎獄の楔',
        'Radiant Plume': '光輝の炎柱',
        'Vulcan Burst': 'バルカンバースト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ifrit': '伊弗利特',
      },
      'replaceText': {
        'Eruption': '地火喷发',
        'Hellfire': '地狱之火炎',
        'Incinerate': '烈焰焚烧',
        'Nail Add': '火狱之楔出现',
        'Radiant Plume': '光辉炎柱',
        'Vulcan Burst': '火神爆裂',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ifrit': '이프리트',
      },
      'replaceText': {
        'Eruption': '용암 분출',
        'Hellfire': '지옥의 화염',
        'Incinerate': '소각',
        'Nail Add': '말뚝 소환',
        'Radiant Plume': '광휘의 불기둥',
        'Vulcan Burst': '폭렬 난사',
      },
    },
  ],
};
