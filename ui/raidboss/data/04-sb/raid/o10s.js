'use strict';

// TODO: fix tail end (seemed to not work??)
// TODO: add phase tracking (so death from above/below can tell you to swap or not)
// TODO: add swap callout after exaflares
// TODO: debuff tracking for when you lose the barrier to remind you to run?
// TODO: ice head markers
// TODO: stack head markers

// O10S - Alphascape 2.0 Savage
[{
  zoneRegex: {
    en: /^Alphascape V2.0 \(Savage\)$/,
    cn: /^欧米茄零式时空狭缝 \(阿尔法幻境2\)$/,
    ko: /^차원의 틈 오메가: 알파편\(영웅\) \(2\)$/,
  },
  zoneId: ZoneId.AlphascapeV20Savage,
  timelineFile: 'o10s.txt',
  triggers: [
    {
      id: 'O10S Tail End',
      netRegex: NetRegexes.startsUsing({ id: '31AA', source: 'Midgardsormr' }),
      netRegexDe: NetRegexes.startsUsing({ id: '31AA', source: 'Midgardsormr' }),
      netRegexFr: NetRegexes.startsUsing({ id: '31AA', source: 'Midgardsormr' }),
      netRegexJa: NetRegexes.startsUsing({ id: '31AA', source: 'ミドガルズオルム' }),
      netRegexCn: NetRegexes.startsUsing({ id: '31AA', source: '尘世幻龙' }),
      netRegexKo: NetRegexes.startsUsing({ id: '31AA', source: '미드가르드오름' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'O10S Fire Marker',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Fire Marker on YOU',
            de: 'Feuer Marker auf DIR',
            fr: 'Feu sur VOUS',
            ja: 'マーカー on YOU',
            cn: '火点名',
            ko: '불징 대상자',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target)
          return 'Fire on ' + data.ShortName(matches.target);
      },
    },
    {
      id: 'O10S Death From Below',
      netRegex: NetRegexes.headMarker({ id: '008F' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Death From Below',
        de: 'Tod von unten',
        fr: 'Désastre terrestre',
        cn: '地之灾厄',
        ko: '디버프 확인',
      },
    },
    {
      id: 'O10S Death From Above',
      netRegex: NetRegexes.headMarker({ id: '008E' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Death From Above',
        de: 'Tod von oben',
        fr: 'Désastre Céleste',
        cn: '天之灾厄',
        ko: '디버프 확인',
      },
    },
    {
      // Spin Table
      // 31AC + 31AE = 31B2 (horiz + horiz = out)
      // 31AC + 31B0 = 31B4 (horiz + vert = in)
      // 31AD + 31AE = 31B3 (vert + horiz = x)
      // 31AD + 31B0 = 31B5 (vert + vert = +)
      id: 'O10S Spin Cleanup',
      // 16 if it doesn't hit anybody, 15 if it does.
      // Also, some log lines are inconsistent here and don't always list
      // Midgardsormr's name and are sometimes blank.
      netRegex: NetRegexes.ability({ id: '31B[2345]', source: ['Midgardsormr', ''], capture: false }),
      netRegexDe: NetRegexes.ability({ id: '31B[2345]', source: ['Midgardsormr', ''], capture: false }),
      netRegexFr: NetRegexes.ability({ id: '31B[2345]', source: ['Midgardsormr', ''], capture: false }),
      netRegexJa: NetRegexes.ability({ id: '31B[2345]', source: ['ミドガルズオルム', ''], capture: false }),
      netRegexCn: NetRegexes.ability({ id: '31B[2345]', source: ['尘世幻龙', ''], capture: false }),
      netRegexKo: NetRegexes.ability({ id: '31B[2345]', source: ['미드가르드오름', ''], capture: false }),
      run: function(data) {
        delete data.lastSpinWasHorizontal;
      },
    },
    {
      id: 'O10S Horizontal Spin 1',
      netRegex: NetRegexes.ability({ id: '31AC', source: 'Midgardsormr', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '31AC', source: 'Midgardsormr', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '31AC', source: 'Midgardsormr', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '31AC', source: 'ミドガルズオルム', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '31AC', source: '尘世幻龙', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '31AC', source: '미드가르드오름', capture: false }),
      infoText: {
        en: 'Next Spin: In or Out',
        de: 'Nächste Drehung: Rein oder Raus',
        fr: 'Tour suivant : Dedans/Dehors',
        ja: '中か外',
        cn: '下一转：靠近或远离',
        ko: '안쪽 / 바깥쪽',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = true;
      },
    },
    {
      id: 'O10S Vertical Spin 1',
      netRegex: NetRegexes.ability({ id: '31AD', source: 'Midgardsormr', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '31AD', source: 'Midgardsormr', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '31AD', source: 'Midgardsormr', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '31AD', source: 'ミドガルズオルム', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '31AD', source: '尘世幻龙', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '31AD', source: '미드가르드오름', capture: false }),
      infoText: {
        en: 'Next Spin: Cardinals or Corners',
        de: 'Nächste Drehung: Kanten oder Ecken',
        fr: 'Tour suivant : Cardinaux ou Coins',
        ja: '角かマーカー',
        cn: '下一转：靠边火角落',
        ko: '십자 / 대각선',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = false;
      },
    },
    {
      id: 'O10S Horizontal Spin 2',
      netRegex: NetRegexes.ability({ id: '31AE', source: 'Midgardsormr', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '31AE', source: 'Midgardsormr', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '31AE', source: 'Midgardsormr', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '31AE', source: 'ミドガルズオルム', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '31AE', source: '尘世幻龙', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '31AE', source: '미드가르드오름', capture: false }),
      condition: function(data) {
        return data.lastSpinWasHorizontal !== undefined;
      },
      alertText: function(data) {
        if (data.lastSpinWasHorizontal) {
          return {
            en: 'Get Out',
            de: 'Raus da',
            fr: 'Sortez !',
            ja: '外へ',
            cn: '远离',
            ko: '밖으로',
          };
        }
        return {
          en: 'Go To Cardinals',
          de: 'An die Kanten',
          fr: 'Allez sur les cardinaux',
          ja: 'マーカーへ',
          cn: '靠边',
          ko: '십자 산개',
        };
      },
    },
    {
      id: 'O10S Vertical Spin 2',
      netRegex: NetRegexes.ability({ id: '31B0', source: 'Midgardsormr', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '31B0', source: 'Midgardsormr', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '31B0', source: 'Midgardsormr', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '31B0', source: 'ミドガルズオルム', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '31B0', source: '尘世幻龙', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '31B0', source: '미드가르드오름', capture: false }),
      condition: function(data) {
        return data.lastSpinWasHorizontal !== undefined;
      },
      alertText: function(data) {
        if (data.lastSpinWasHorizontal) {
          return {
            en: 'Get In',
            de: 'Rein da',
            fr: 'Sous le boss !',
            ja: '中へ',
            cn: '靠近',
            ko: '안으로',
          };
        }
        return {
          en: 'Go To Corners',
          de: 'In die Ecken',
          fr: 'Allez dans les coins',
          ja: '角へ',
          cn: '角落',
          ko: '구석 산개',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ancient Dragon': 'antik(?:e|er|es|en) Drache',
        'Midgardsormr': 'Midgardsormr',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Cardinals': 'Kanten',
        'Cauterize': 'Kauterisieren',
        'Corners': 'Ecken',
        'Crimson Breath': 'Purpurschwingen',
        'Dry Ice': 'Trockeneis',
        'Earth Shaker': 'Erdstoß',
        'Exaflare': 'Exaflare',
        'Flame Blast': 'Flammenhölle',
        'Flip': 'Rolle',
        'Frost Breath': 'Frostiger Atem',
        'Horrid Roar': 'Entsetzliches Brüllen',
        'Hot Tail': 'Schwelender Schweif',
        'In/Out': 'Rein/Raus',
        '(?<!\/)Out': 'Raus',
        'Northern Cross': 'Kreuz des Nordens',
        'Position': 'Position',
        'Protostar': 'Protostern',
        'Shaker/Thunder': 'Erdstoß/Blitz',
        'Signal': 'Signal',
        'Spin': 'Drehung',
        'Tail End': 'Schweifspitze',
        'Thunderstorm': 'Gewitter',
        'Time Immemorial': 'Urknall',
        'Touchdown': 'Himmelssturz',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Ancient Dragon': 'dragon ancien',
        'Midgardsormr': 'Midgardsormr',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Cardinals': 'Cardinaux',
        'Cauterize': 'Cautérisation',
        'Corners': 'Coins',
        'Crimson Breath': 'Souffle écarlate',
        'Dry Ice': 'Poussière glaçante',
        'Earth Shaker': 'Secousse',
        'Exaflare': 'ExaBrasier',
        'Flame Blast': 'Fournaise',
        'Flip': 'Tour vertical',
        'Frost Breath': 'Souffle glacé',
        'Horrid Roar': 'Rugissement horrible',
        'Hot Tail': 'Queue calorifique',
        'In/Out': 'Dedans/Dehors',
        '(?<!\/)Out': 'Dehors',
        'Northern Cross': 'Croix du nord',
        'Protostar': 'Proto-étoile',
        'Shaker/Thunder': 'Secousse/Tempête',
        'Spin': 'Tour horizontal',
        'Tail End': 'Pointe de queue',
        'Thunderstorm': 'Tempête de foudre',
        'Time Immemorial': 'Big bang',
        'Touchdown': 'Atterrissage',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Ancient Dragon': 'エンシェントドラゴン',
        'Midgardsormr': 'ミドガルズオルム',
      },
      'replaceText': {
        'Akh Morn': 'アク・モーン',
        'Akh Rhai': 'アク・ラーイ',
        'Cauterize': 'カータライズ',
        'Crimson Breath': 'クリムゾンブレス',
        'Dry Ice': 'フリージングダスト',
        'Earth Shaker': 'アースシェイカー',
        'Exaflare': 'エクサフレア',
        'Flame Blast': 'フレイムブラスト',
        'Frost Breath': 'フロストブレス',
        'Horrid Roar': 'ホリッドロア',
        'Hot Tail': 'ヒートテイル',
        'Northern Cross': 'ノーザンクロス',
        'Protostar': 'プロトスター',
        'Spin': 'ぶん回す',
        'Tail End': 'テイルエンド',
        'Thunderstorm': 'サンダーストーム',
        'Time Immemorial': '天地開闢',
        'Touchdown': 'タッチダウン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ancient Dragon': '远古之龙',
        'Midgardsormr': '尘世幻龙',
      },
      'replaceText': {
        'ready': '准备',
        'Akh Morn': '死亡轮回',
        'Akh Rhai': '天光轮回',
        'Cardinals': '边',
        'Cauterize': '低温俯冲',
        'Corners': '角',
        'Crimson Breath': '深红吐息',
        'Dry Ice': '冰尘',
        'Earth Shaker': '大地摇动',
        'Exaflare': '百京核爆',
        'Flame Blast': '烈焰十字爆',
        'Flip': '竖转',
        'Frost Breath': '寒霜吐息',
        'Horrid Roar': '恐惧咆哮',
        'Hot Tail': '燃烧之尾',
        'In/Out': '靠近/远离',
        '(?<!\/)Out': '远离',
        'Northern Cross': '北十字星',
        'Position': '站位',
        'Protostar': '原恒星',
        'Shaker/Thunder': '大地摇动/闪雷风暴',
        'Signal': '信号',
        'Spin': '回转',
        'Tail End': '煞尾',
        'Thunderstorm': '闪雷风暴',
        'Time Immemorial': '开天辟地',
        'Touchdown': '空降',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Midgardsormr': '미드가르드오름',
        'Ancient Dragon': '고룡',
      },
      'replaceText': {
        ' ready': ' 준비 완료',
        'Akh Morn': '아크 몬',
        'Akh Rhai': '아크 라이',
        'Cardinals': '맵 측면',
        'Cauterize': '인두질',
        'Corners': '구석',
        'Crimson Breath': '진홍빛 숨결',
        'Dry Ice': '지면 동결',
        'Earth Shaker': '요동치는 대지',
        'Exaflare': '엑사플레어',
        'Flame Blast': '화염 작렬',
        'Flip': '앞회전',
        'Frost Breath': '서리 숨결',
        'Horrid Roar': '소름끼치는 포효',
        'Hot Tail': '뜨거운 꼬리',
        'In/Out': '안/밖',
        '(?<!\/)Out': '밖',
        'Northern Cross': '북십자성',
        'Position': '위치',
        'Protostar': '원시별',
        'Shaker/Thunder': '어스/번개',
        'Signal': '신호',
        'Spin': '마구 돌리기',
        'Tail End': '꼬리 쓸기',
        'Thunderstorm': '번개 폭풍',
        'Time Immemorial': '천지개벽',
        'Touchdown': '착지',
      },
    },
  ],
}];
