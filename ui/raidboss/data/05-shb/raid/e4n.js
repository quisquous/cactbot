'use strict';

[{
  zoneId: ZoneId.EdensGateSepulture,
  timelineFile: 'e4n.txt',
  triggers: [
    {
      id: 'E4N Voice of the Land',
      netRegex: NetRegexes.startsUsing({ id: '40F7', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '40F7', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '40F7', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '40F7', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '40F7', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '40F7', source: '타이탄', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'E4N Earthen Fury',
      netRegex: NetRegexes.startsUsing({ id: '40F8', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '40F8', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '40F8', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '40F8', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '40F8', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '40F8', source: '타이탄', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'aoe + dot',
          de: 'AoE + DoT',
          fr: 'AoE + dot',
          cn: 'AOE + dot',
          ko: '전체공격 + 도트뎀',
        },
      },
    },
    {
      id: 'E4N Stonecrusher',
      netRegex: NetRegexes.startsUsing({ id: '40F9', source: 'Titan' }),
      netRegexDe: NetRegexes.startsUsing({ id: '40F9', source: 'Titan' }),
      netRegexFr: NetRegexes.startsUsing({ id: '40F9', source: 'Titan' }),
      netRegexJa: NetRegexes.startsUsing({ id: '40F9', source: 'タイタン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '40F9', source: '泰坦' }),
      netRegexKo: NetRegexes.startsUsing({ id: '40F9', source: '타이탄' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'E4N Massive Landslide',
      netRegex: NetRegexes.startsUsing({ id: '40FA', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '40FA', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '40FA', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '40FA', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '40FA', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '40FA', source: '타이탄', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stand In Front',
          de: 'Vor ihm stehen',
          fr: 'Placez-vous devant',
          cn: '面前躲避',
          ko: '정면이 안전',
        },
      },
    },
    {
      id: 'E4N Seismic Wave',
      netRegex: NetRegexes.startsUsing({ id: '40F2', source: 'Massive Boulder', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '40F2', source: 'Riesig(?:e|er|es|en) Felsen', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '40F2', source: 'Monolithe Géant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '40F2', source: 'ジャイアントボルダー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '40F2', source: '巨大岩石', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '40F2', source: '거대 바위', capture: false }),
      delaySeconds: 6,
      suppressSeconds: 10,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hide Behind Boulder',
          de: 'Hinter Felsen verstecken',
          fr: 'Cachez-vous derrière le rocher',
          cn: '躲在石头后',
          ko: '돌 뒤에 숨기',
        },
      },
    },
    {
      id: 'E4N Geocrush',
      netRegex: NetRegexes.startsUsing({ id: '40F6', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '40F6', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '40F6', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '40F6', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '40F6', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '40F6', source: '타이탄', capture: false }),
      response: Responses.knockback('info'),
    },
    {
      id: 'E4N Fault Zone',
      netRegex: NetRegexes.startsUsing({ id: '4102', source: 'Titan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4102', source: 'Titan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4102', source: 'Titan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4102', source: 'タイタン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4102', source: '泰坦', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4102', source: '타이탄', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stand On Flank',
          de: 'Auf seiner Flanke stehen',
          fr: 'Placez-vous sur le flanc',
          cn: '两侧躲避',
          ko: '넓은쪽 옆면이 안전',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bomb Boulder': 'Bomber-Brocken',
        'Massive Boulder': 'Riesig(?:e|er|es|en) Felsen',
        'Titan': 'Titan',
      },
      'replaceText': {
        'Bomb Boulders': 'Tumulus',
        'Bury': 'Begraben',
        'Cobalt Bomb': 'Kobaltbombe',
        'Crumbling Down': 'Felsfall',
        'Earthen Armor': 'Basaltpanzer',
        'Earthen Fury': 'Gaias Zorn',
        'Earthen Gauntlets': 'Gaia-Armberge',
        'Earthen Wheels': 'Gaia-Räder',
        'Evil Earth': 'Grimm der Erde',
        'Explosion': 'Explosion',
        'Fault Zone': 'Bruchzone',
        'Geocrush': 'Kraterschlag',
        'Left/Right Landslide': 'Linker/Rechter Bergsturz',
        'Magnitude 5.0': 'Magnitude 5.0',
        'Massive Landslide': 'Gigantischer Bergsturz',
        'Seismic Wave': 'Seismische Welle',
        'Stonecrusher': 'Felsbrecher',
        'Voice Of The Land': 'Aufschrei der Erde',
        'Weight Of The Land': 'Gaias Gewicht',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bomb Boulder': 'Bombo Rocher',
        'Massive Boulder': 'Monolithe géant',
        'Titan': 'Titan',
      },
      'replaceText': {
        '\\?': ' ?',
        'Bomb Boulders': 'Bombo rocher',
        'Bury': 'Ensevelissement',
        'Cobalt Bomb': 'Bombo de cobalt',
        'Crumbling Down': 'Chute de monolithes',
        'Earthen Armor': 'Armure tellurique',
        'Earthen Fury': 'Fureur tellurique',
        'Earthen Gauntlets': 'Poing tellurique',
        'Earthen Wheels': 'Pas tellurique',
        'Evil Earth': 'Terre maléfique',
        'Explosion': 'Explosion',
        'Fault Zone': 'Faille tectonique',
        'Geocrush': 'Broie-terre',
        'Left/Right Landslide': 'Glissement senestre/dextre',
        'Magnitude 5.0': 'Magnitude 5',
        'Massive Landslide': 'Glissement apocalyptique',
        'Seismic Wave': 'Ondes sismiques',
        'Stonecrusher': 'Éruption tellurique',
        'Voice of the Land': 'Hurlement tellurique',
        'Weight of the Land': 'Poids de la terre',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bomb Boulder': 'ボムボルダー',
        'Massive Boulder': 'ジャイアントボルダー',
        'Titan': 'タイタン',
      },
      'replaceText': {
        'Bomb Boulders': 'ボムボルダー',
        'Bury': '衝撃',
        'Cobalt Bomb': 'コバルトボム',
        'Crumbling Down': '岩盤崩落',
        'Earthen Armor': '大地の鎧',
        'Earthen Fury': '大地の怒り',
        'Earthen Gauntlets': '大地の手甲',
        'Earthen Wheels': '大地の車輪',
        'Evil Earth': 'イビルアース',
        'Explosion': '爆散',
        'Fault Zone': 'フォールトゾーン',
        'Geocrush': 'ジオクラッシュ',
        'Left/Right Landslide': 'レフト/ライト・ランドスライド',
        'Magnitude 5.0': 'マグニチュード5.0',
        'Massive Landslide': 'メガ・ランドスライド',
        'Seismic Wave': 'サイズミックウェーブ',
        'Stonecrusher': 'ロッククラッシュ',
        'Voice of the Land': '大地の叫び',
        'Weight of the Land': '大地の重み',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bomb Boulder': '爆破岩石',
        'Massive Boulder': '巨大岩石',
        'Titan': '泰坦',
      },
      'replaceText': {
        'Bomb Boulders': '爆破岩石',
        'Bury': '塌方',
        'Cobalt Bomb': '钴弹',
        'Crumbling Down': '岩层崩落',
        'Earthen Armor': '大地之铠',
        'Earthen Fury': '大地之怒',
        'Earthen Gauntlets': '大地之手甲',
        'Earthen Wheels': '大地之车轮',
        'Evil Earth': '邪土',
        'Explosion': '爆炸',
        'Fault Zone': '断裂带',
        'Geocrush': '大地粉碎',
        'Left/Right Landslide': '左/右侧地裂',
        'Magnitude 5.0': '震级5.0',
        'Massive Landslide': '百万地裂',
        'Seismic Wave': '地震波',
        'Stonecrusher': '崩岩',
        'Voice of the Land': '大地之号',
        'Weight of the Land': '大地之重',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bomb Boulder': '바위폭탄',
        'Massive Boulder': '거대 바위',
        'Titan': '타이탄',
      },
      'replaceText': {
        'Bomb Boulders': '바위폭탄',
        'Bury': '충격',
        'Cobalt Bomb': '코발트 폭탄',
        'Crumbling Down': '암반 낙하',
        'Earthen Armor': '대지의 갑옷',
        'Earthen Fury': '대지의 분노',
        'Earthen Gauntlets': '대지의 완갑',
        'Earthen Wheels': '대지의 바퀴',
        'Evil Earth': '사악한 대지',
        'Explosion': '폭산',
        'Fault Zone': '단층대',
        'Geocrush': '대지 붕괴',
        'Left/Right Landslide': '좌/우측 산사태',
        'Magnitude 5.0': '진도 5.0',
        'Massive Landslide': '대규모 산사태',
        'Seismic Wave': '지진파',
        'Stonecrusher': '암석 붕괴',
        'Voice of the Land': '대지의 외침',
        'Weight of the Land': '대지의 무게',
      },
    },
  ],
}];
