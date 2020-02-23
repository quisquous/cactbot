'use strict';

[{
  zoneRegex: /^The Navel \(Extreme\)$/,
  timelineFile: 'titan_ex.txt',
  timelineTriggers: [
    {
      id: 'TitanEx Mountain Buster',
      regex: /Mountain Buster/,
      beforeSeconds: 7,
      alertText: function(data) {
        if (data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'Tankbuster',
            de: 'Tankbuster',
            fr: 'Tankbuster',
          };
        }
      },
      infoText: function(data) {
        if (data.role != 'healer' && data.role != 'tank') {
          return {
            en: 'Tank Cleave',
            fr: 'Cleave sur le tank',
          };
        }
      },
    },
    {
      id: 'TitanEx Tumult',
      regex: /Tumult/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégats de zone',
      },
    },
    {
      id: 'TitanEx Gaoler Adds',
      regex: /Gaoler Adds/,
      beforeSeconds: 1,
      infoText: {
        en: 'Gaoler Adds',
        fr: 'Adds geôlier',
      },
    },
    {
      id: 'TitanEx Double Weight',
      regex: /Weight Of The Land 1/,
      beforeSeconds: 4,
      infoText: {
        en: 'Double Weight',
        fr: 'Double poids',
      },
    },
  ],
  triggers: [
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
        '(all)': '(alle)',
        '(clock)': '(Uhrzeiger)',
        '(one side)': '(eine Seite)',
        'Burst': 'Einschlag',
        'Bury': 'Begraben',
        'Earthen Fury': 'Gaias Zorn',
        'Gaoler Adds': 'Gaoler Adds', // FIXME
        'Gaoler Landslide': 'Gaoler Landslide', // FIXME
        'Gaoler Tumult': 'Gaoler Tumult', // FIXME
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
        'Bomb Boulder': 'bombo rocher',
        'Granite Gaoler': 'Geôlier de granite',
        'Titan': 'Titan',
      },
      'replaceText': {
        '(all)': '(tous)',
        '(clock)': '(horloge)',
        '(one side)': '(un côté)',
        'Burst': 'Explosion',
        'Bury': 'Ensevelissement',
        'Earthen Fury': 'Fureur tellurique',
        'Gaoler Adds': 'Adds geôlier',
        'Gaoler Landslide': 'Geôlier glissement',
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
        '(all)': '(all)', // FIXME
        '(clock)': '(clock)', // FIXME
        '(one side)': '(one side)', // FIXME
        'Burst': '大爆発',
        'Bury': '衝撃',
        'Earthen Fury': '大地の怒り',
        'Gaoler Adds': 'Gaoler Adds', // FIXME
        'Gaoler Landslide': 'Gaoler Landslide', // FIXME
        'Gaoler Tumult': 'Gaoler Tumult', // FIXME
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
        '(all)': '(all)', // FIXME
        '(clock)': '(clock)', // FIXME
        '(one side)': '(one side)', // FIXME
        'Burst': '爆炸',
        'Bury': '塌方',
        'Earthen Fury': '大地之怒',
        'Gaoler Adds': 'Gaoler Adds', // FIXME
        'Gaoler Landslide': 'Gaoler Landslide', // FIXME
        'Gaoler Tumult': 'Gaoler Tumult', // FIXME
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
      'replaceSync': {
        'Bomb Boulder': '바위폭탄',
        'Granite Gaoler': '화강암 감옥',
        'Titan': '타이탄',
      },
      'replaceText': {
        '(all)': '(all)', // FIXME
        '(clock)': '(clock)', // FIXME
        '(one side)': '(one side)', // FIXME
        'Burst': '대폭발',
        'Bury': '충격',
        'Earthen Fury': '대지의 분노',
        'Gaoler Adds': 'Gaoler Adds', // FIXME
        'Gaoler Landslide': 'Gaoler Landslide', // FIXME
        'Gaoler Tumult': 'Gaoler Tumult', // FIXME
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
}];
