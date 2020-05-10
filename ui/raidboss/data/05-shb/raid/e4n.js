'use strict';

[{
  zoneRegex: {
    en: /^Eden's Gate: Sepulture$/,
    cn: /^伊甸希望乐园 \(觉醒之章4\)$/,
    ko: /^희망의 낙원 에덴: 각성편 \(4\)$/,
  },
  timelineFile: 'e4n.txt',
  triggers: [
    {
      id: 'E4N Voice of the Land',
      regex: Regexes.startsUsing({ id: '40F7', source: 'Titan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '40F7', source: 'Titan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '40F7', source: 'Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '40F7', source: 'タイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '40F7', source: '泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '40F7', source: '타이탄', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'E4N Earthen Fury',
      regex: Regexes.startsUsing({ id: '40F8', source: 'Titan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '40F8', source: 'Titan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '40F8', source: 'Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '40F8', source: 'タイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '40F8', source: '泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '40F8', source: '타이탄', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe + dot',
        de: 'AoE + DoT',
        fr: 'AoE + dot',
        cn: 'AOE + dot',
        ko: '전체공격 + 도트뎀',
      },
    },
    {
      id: 'E4N Stonecrusher',
      regex: Regexes.startsUsing({ id: '40F9', source: 'Titan' }),
      regexDe: Regexes.startsUsing({ id: '40F9', source: 'Titan' }),
      regexFr: Regexes.startsUsing({ id: '40F9', source: 'Titan' }),
      regexJa: Regexes.startsUsing({ id: '40F9', source: 'タイタン' }),
      regexCn: Regexes.startsUsing({ id: '40F9', source: '泰坦' }),
      regexKo: Regexes.startsUsing({ id: '40F9', source: '타이탄' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'E4N Massive Landslide',
      regex: Regexes.startsUsing({ id: '40FA', source: 'Titan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '40FA', source: 'Titan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '40FA', source: 'Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '40FA', source: 'タイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '40FA', source: '泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '40FA', source: '타이탄', capture: false }),
      alertText: {
        en: 'Stand In Front',
        de: 'Vor ihm stehen',
        fr: 'Placez-vous devant',
        cn: '面前躲避',
        ko: '정면이 안전',
      },
    },
    {
      id: 'E4N Seismic Wave',
      regex: Regexes.startsUsing({ id: '40F2', source: 'Massive Boulder', capture: false }),
      regexDe: Regexes.startsUsing({ id: '40F2', source: 'Riesig(?:e|er|es|en) Felsen', capture: false }),
      regexFr: Regexes.startsUsing({ id: '40F2', source: 'Monolithe Géant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '40F2', source: 'ジャイアントボルダー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '40F2', source: '巨大岩石', capture: false }),
      regexKo: Regexes.startsUsing({ id: '40F2', source: '거대 바위', capture: false }),
      delaySeconds: 6,
      suppressSeconds: 10,
      infoText: {
        en: 'Hide Behind Boulder',
        de: 'Hinter Felsen verstecken',
        fr: 'Cachez-vous derrière le rocher',
        cn: '躲在石头后',
        ko: '돌 뒤에 숨기',
      },
    },
    {
      id: 'E4N Geocrush',
      regex: Regexes.startsUsing({ id: '40F6', source: 'Titan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '40F6', source: 'Titan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '40F6', source: 'Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '40F6', source: 'タイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '40F6', source: '泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '40F6', source: '타이탄', capture: false }),
      response: Responses.knockback('info'),
    },
    {
      id: 'E4N Fault Zone',
      regex: Regexes.startsUsing({ id: '4102', source: 'Titan', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4102', source: 'Titan', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4102', source: 'Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4102', source: 'タイタン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4102', source: '泰坦', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4102', source: '타이탄', capture: false }),
      alertText: {
        en: 'Stand On Flank',
        de: 'Auf seiner Flanke stehen',
        fr: 'Placez-vous sur le flanc',
        cn: '两侧躲避',
        ko: '넓은쪽 옆면이 안전',
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
        'Aftershock': 'Nachbeben',
        'Bomb Boulders': 'Tumulus',
        'Bury': 'Begraben',
        'Cobalt Bomb': 'Kobaltbombe',
        'Crumbling Down': 'Felsfall',
        'Earthen Armor': 'Gaia-Panzer',
        'Earthen Fury': 'Gaias Zorn',
        'Earthen Gauntlets': 'Gaia-Armberge',
        'Earthen Wheels': 'Gaia-Räder',
        'Evil Earth': 'Grimm der Erde',
        'Explosion': 'Explosion',
        'Fault Line': 'Bruchlinie',
        'Fault Zone': 'Bruchzone',
        'Geocrush': 'Kraterschlag',
        '(?<! )Landslide': 'Bergsturz',
        'Left/Right Landslide': 'Linker/Rechter Bergsturz',
        'Leftward Landslide': 'Linker Bergsturz',
        'Magnitude 5.0': 'Magnitude 5.0',
        'Massive Landslide': 'Gigantischer Bergsturz',
        'Rightward Landslide': 'Rechter Bergsturz',
        'Seismic Wave': 'Seismische Welle',
        'Stonecrusher': 'Felsbrecher',
        'Voice Of The Land': 'Aufschrei der Erde',
        'Weight Of The Land': 'Gaias Gewicht',
      },
      '~effectNames': {
        'Brink of Death': 'Sterbenselend',
        'Filthy': 'Dreck',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
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
        'Aftershock': 'Répercussion',
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
        'Fault Line': 'Ligne de faille',
        'Fault Zone': 'Faille tectonique',
        'Geocrush': 'Broie-terre',
        '(?<! )Landslide': 'Glissement de terrain',
        'Left/Right Landslide': 'Glissement senestre/dextre',
        'Leftward Landslide': 'Glissement senestre',
        'Magnitude 5.0': 'Magnitude 5',
        'Massive Landslide': 'Glissement apocalyptique',
        'Rightward Landslide': 'Glissement dextre',
        'Seismic Wave': 'Ondes sismiques',
        'Stonecrusher': 'Éruption tellurique',
        'Voice of the Land': 'Hurlement tellurique',
        'Weight of the Land': 'Poids de la terre',
      },
      '~effectNames': {
        'Brink of Death': 'Mourant',
        'Filthy': 'Embourbement',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Bomb Boulder': 'ボムボルダー',
        'Massive Boulder': 'ジャイアントボルダー',
        'Titan': 'タイタン',
      },
      'replaceText': {
        'Aftershock': '余波',
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
        'Fault Line': 'フォールトライン',
        'Fault Zone': 'フォールトゾーン',
        'Geocrush': 'ジオクラッシュ',
        '(?<! )Landslide': 'ランドスライド',
        'Left/Right Landslide': 'レフト/ライト・ランドスライド',
        'Leftward Landslide': 'レフト・ランドスライド',
        'Magnitude 5.0': 'マグニチュード5.0',
        'Massive Landslide': 'メガ・ランドスライド',
        'Rightward Landslide': 'ライト・ランドスライド',
        'Seismic Wave': 'サイズミックウェーブ',
        'Stonecrusher': 'ロッククラッシュ',
        'Voice of the Land': '大地の叫び',
        'Weight of the Land': '大地の重み',
      },
      '~effectNames': {
        'Brink of Death': '衰弱［強］',
        'Dropsy': '水毒',
        'Filthy': '汚泥',
        'Physical Vulnerability Up': '被物理ダメージ増加',
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
        'Aftershock': '余波',
        'Bomb Boulders': '爆破岩石',
        'Bury': '塌方',
        'Cobalt Bomb': '钴弹',
        'Crumbling Down': '岩层崩落',
        'Earthen Armor': '大地之铠',
        'Earthen Fury': '大地之怒',
        'Earthen Gauntlets': '大地之手甲',
        'Earthen Wheels': '大地之车轮',
        'Evil Earth': '邪土',
        'Explosion': '大引爆',
        'Fault Line': '断层线',
        'Fault Zone': '断裂带',
        'Geocrush': '大地粉碎',
        '(?<! )Landslide': '地裂',
        'Left/Right Landslide': '左/右侧地裂',
        'Leftward Landslide': '左侧地裂',
        'Magnitude 5.0': '震级5.0',
        'Massive Landslide': '百万地裂',
        'Rightward Landslide': '右侧地裂',
        'Seismic Wave': '地震波',
        'Stonecrusher': '崩岩',
        'Voice [oO]f [tT]he Land': '大地之号',
        'Weight [oO]f [tT]he Land': '大地之重',
      },
      '~effectNames': {
        'Brink of Death': '濒死',
        'Dropsy': '水毒',
        'Filthy': '污泥',
        'Physical Vulnerability Up': '物理受伤加重',
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
        'Aftershock': '여파',
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
        'Fault Line': '단층선',
        'Fault Zone': '단층대',
        'Geocrush': '대지 붕괴',
        '(?<! )Landslide': '산사태',
        'Left/Right Landslide': '좌/우측 산사태',
        'Leftward Landslide': '좌측 산사태',
        'Magnitude 5.0': '진도 5.0',
        'Massive Landslide': '대규모 산사태',
        'Rightward Landslide': '우측 산사태',
        'Seismic Wave': '지진파',
        'Stonecrusher': '암석 붕괴',
        'Voice [oO]f [tT]he Land': '대지의 외침',
        'Weight [oO]f [tT]he Land': '대지의 무게',
      },
      '~effectNames': {
        'Brink of Death': '쇠약강',
        'Dropsy': '물독',
        'Filthy': '진흙탕',
        'Physical Vulnerability Up': '받는 물리 피해량 증가',
      },
    },
  ],
}];
