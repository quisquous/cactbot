'use strict';

[{
  zoneId: ZoneId.TheNavelHard,
  timelineFile: 'titan-hm.txt',
  timelineTriggers: [
    {
      id: 'TitanHm Mountain Buster',
      regex: /Mountain Buster/,
      beforeSeconds: 7,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'TitanHm Mountain Buster Avoid',
      regex: /Mountain Buster/,
      beforeSeconds: 7,
      condition: function(data) {
        return data.role != 'healer' && data.role != 'tank';
      },
      response: Responses.tankCleave(),
    },
    {
      id: 'TitanHm Rock Buster',
      regex: /Rock Buster/,
      beforeSeconds: 6,
      response: Responses.tankCleave('info'),
    },
    {
      id: 'TitanHm Tumult',
      regex: /Tumult/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
  ],
  triggers: [
    {
      id: 'TitanHm Damage Down',
      netRegex: NetRegexes.gainsEffect({ effectId: '3E' }),
      condition: function(data) {
        return data.CanCleanse();
      },
      infoText: function(data, matches) {
        return {
          en: 'Cleanse ' + data.ShortName(matches.target),
          de: 'Reinige ' + data.ShortName(matches.target),
          fr: 'Guérison sur ' + data.ShortName(matches.target),
          ja: data.ShortName(matches.target) + 'にエスナ',
          cn: '康复' + data.ShortName(matches.target),
          ko: '' + data.ShortName(matches.target) + '에스나',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bomb Boulder': 'Bomber-Brocken',
        'Titan': 'Titan',
      },
      'replaceText': {
        '\\(clock\\)': '(Uhrzeiger)',
        'Burst': 'Einschlag',
        'Bury': 'Begraben',
        'Earthen Fury': 'Gaias Zorn',
        'Geocrush': 'Geo-Stoß',
        'Landslide': 'Bergsturz',
        'Mountain Buster': 'Bergsprenger',
        'Rock Buster': 'Steinsprenger',
        'Rock Throw': 'Granitgefängnis',
        'Tumult': 'Urerschütterung',
        'Weight Of The Land': 'Gaias Gewicht',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bomb Boulder': 'Bombo Rocher',
        'Titan': 'Titan',
      },
      'replaceText': {
        '\\(clock\\)': '(sens horaire)',
        '\\(diamond\\)': '(diamant)',
        '\\(line\\)': '(ligne)',
        'Burst': 'Explosion',
        'Bury': 'Ensevelissement',
        'Earthen Fury': 'Fureur tellurique',
        'Geocrush': 'Broie-terre',
        'Landslide': 'Glissement de terrain',
        'Mountain Buster': 'Casse-montagnes',
        'Rock Buster': 'Casse-roc',
        'Rock Throw': 'Jeté de rocs',
        'Tumult': 'Tumulte',
        'Weight Of The Land': 'Poids de la terre',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bomb Boulder': 'ボムボルダー',
        'Titan': 'タイタン',
      },
      'replaceText': {
        '\\(clock\\)': '(時針回り)',
        '\\(diamond\\)': '(ダイヤモンド)',
        '\\(line\\)': '(一直線)',
        'Burst': '大爆発',
        'Bury': '衝撃',
        'Earthen Fury': '大地の怒り',
        'Geocrush': 'ジオクラッシュ',
        'Landslide': 'ランドスライド',
        'Mountain Buster': 'マウンテンバスター',
        'Rock Buster': 'ロックバスター',
        'Rock Throw': 'グラナイト・ジェイル',
        'Tumult': '激震',
        'Weight Of The Land': '大地の重み',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bomb Boulder': '爆破岩石',
        'Titan': '泰坦',
      },
      'replaceText': {
        '\\(clock\\)': '(顺时针)',
        '\\(diamond\\)': '(钻石)',
        '\\(line\\)': '(直线)',
        'Burst': '爆炸',
        'Bury': '塌方',
        'Earthen Fury': '大地之怒',
        'Geocrush': '大地粉碎',
        'Landslide': '地裂',
        'Mountain Buster': '山崩',
        'Rock Buster': '碎岩',
        'Rock Throw': '花岗岩牢狱',
        'Tumult': '怒震',
        'Weight Of The Land': '大地之重',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb Boulder': '바위폭탄',
        'Titan': '타이탄',
      },
      'replaceText': {
        'Burst': '대폭발',
        'Bury': '충격',
        'Earthen Fury': '대지의 분노',
        'Geocrush': '대지 붕괴',
        'Landslide': '산사태',
        'Mountain Buster': '산 쪼개기',
        'Rock Buster': '바위 쪼개기',
        'Rock Throw': '화강암 감옥',
        'Tumult': '격진',
        'Weight Of The Land': '대지의 무게',
      },
    },
  ],
}];
