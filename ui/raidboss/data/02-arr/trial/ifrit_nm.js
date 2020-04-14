'use strict';

[{
  zoneRegex: {
    en: /^The Bowl Of Embers$/,
    cn: /^伊弗利特讨伐战$/,
  },
  timelineFile: 'ifrit_nm.txt',
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
      infoText: {
        en: 'Kill Nail',
        de: 'infernalische Fessel zerstören',
        fr: 'Détruisez le clou',
        cn: '击杀火狱之楔',
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
        'Succumb': 'Succumb', // FIXME
        'Surrender': 'Surrender', // FIXME
      },
      'replaceText': {
        'inner': 'innen',
        'outer': 'außen',
        'Eruption': 'Eruption',
        'Hellfire': 'Höllenfeuer',
        'Incinerate': 'Einäschern',
        'Nail Add': 'Nail Add', // FIXME
        'Radiant Plume': 'Scheiterhaufen',
        'Vulcan Burst': 'Feuerstoß',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ifrit': 'Ifrit',
        'Succumb': 'Succumb', // FIXME
        'Surrender': 'Surrender', // FIXME
      },
      'replaceText': {
        'inner': 'intérieur',
        'outer': 'extérieur',
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
        'Succumb': 'Succumb', // FIXME
        'Surrender': 'Surrender', // FIXME
      },
      'replaceText': {
        'inner': 'inner', // FIXME
        'outer': 'outer', // FIXME
        'Eruption': 'エラプション',
        'Hellfire': '地獄の火炎',
        'Incinerate': 'インシネレート',
        'Nail Add': 'Nail Add', // FIXME
        'Radiant Plume': '光輝の炎柱',
        'Vulcan Burst': 'バルカンバースト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ifrit': '伊弗利特',
        'Succumb': 'Succumb', // FIXME
        'Surrender': 'Surrender', // FIXME
      },
      'replaceText': {
        'inner': 'inner', // FIXME
        'outer': 'outer', // FIXME
        'Eruption': '地火喷发',
        'Hellfire': '地狱之火炎',
        'Incinerate': '烈焰焚烧',
        'Nail Add': 'Nail Add', // FIXME
        'Radiant Plume': '光辉炎柱',
        'Vulcan Burst': '火神爆裂',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ifrit': '이프리트',
        'Succumb': 'Succumb', // FIXME
        'Surrender': 'Surrender', // FIXME
      },
      'replaceText': {
        'inner': 'inner', // FIXME
        'outer': 'outer', // FIXME
        'Eruption': '용암 분출',
        'Hellfire': '지옥의 화염',
        'Incinerate': '소각',
        'Nail Add': 'Nail Add', // FIXME
        'Radiant Plume': '광휘의 불기둥',
        'Vulcan Burst': '폭렬 난사',
      },
    },
  ],
}];
