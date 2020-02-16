'use strict';

// O10N - Alphascape 2.0
[{
  zoneRegex: /^Alphascape \(V2\.0\)$/,
  timelineFile: 'o10n.txt',
  triggers: [
    {
      // Spin Table
      // 31C7 + 31C9 = 31CD (horiz + horiz = out)
      // 31C7 + 31CB = 31CF (horiz + vert = in)
      // 31C8 + 31CB = 31D0 (vert + vert = +)
      id: 'O10N Spin Cleanup',
      regex: Regexes.ability({ id: '31C[78]', source: 'Midgardsormr', capture: false }),
      regexDe: Regexes.ability({ id: '31C[78]', source: 'Midgardsormr', capture: false }),
      regexFr: Regexes.ability({ id: '31C[78]', source: 'Midgardsormr', capture: false }),
      regexJa: Regexes.ability({ id: '31C[78]', source: 'ミドガルズオルム', capture: false }),
      regexCn: Regexes.ability({ id: '31C[78]', source: '尘世幻龙', capture: false }),
      regexKo: Regexes.ability({ id: '31C[78]', source: '미드가르드오름', capture: false }),
      delaySeconds: 10,
      run: function(data) {
        delete data.lastSpinWasHorizontal;
      },
    },
    {
      id: 'O10N Horizontal Spin 1',
      regex: Regexes.ability({ id: '31C7', source: 'Midgardsormr', capture: false }),
      regexDe: Regexes.ability({ id: '31C7', source: 'Midgardsormr', capture: false }),
      regexFr: Regexes.ability({ id: '31C7', source: 'Midgardsormr', capture: false }),
      regexJa: Regexes.ability({ id: '31C7', source: 'ミドガルズオルム', capture: false }),
      regexCn: Regexes.ability({ id: '31C7', source: '尘世幻龙', capture: false }),
      regexKo: Regexes.ability({ id: '31C7', source: '미드가르드오름', capture: false }),
      infoText: {
        en: 'Next Spin: In or Out',
        de: 'Nächste Drehung: Rein oder raus',
        fr: 'Tour suivant : Dedans/Dehors',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = true;
      },
    },
    {
      id: 'O10N Vertical Spin 1',
      regex: Regexes.ability({ id: '31C8', source: 'Midgardsormr', capture: false }),
      regexDe: Regexes.ability({ id: '31C8', source: 'Midgardsormr', capture: false }),
      regexFr: Regexes.ability({ id: '31C8', source: 'Midgardsormr', capture: false }),
      regexJa: Regexes.ability({ id: '31C8', source: 'ミドガルズオルム', capture: false }),
      regexCn: Regexes.ability({ id: '31C8', source: '尘世幻龙', capture: false }),
      regexKo: Regexes.ability({ id: '31C8', source: '미드가르드오름', capture: false }),
      infoText: {
        en: 'Next Spin: Corners',
        de: 'Nächste Drehung: Ecken',
        fr: 'Tour suivant : Plus',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = false;
      },
    },
    {
      id: 'O10N Horizontal Spin 2',
      regex: Regexes.ability({ id: '31C9', source: 'Midgardsormr', capture: false }),
      regexDe: Regexes.ability({ id: '31C9', source: 'Midgardsormr', capture: false }),
      regexFr: Regexes.ability({ id: '31C9', source: 'Midgardsormr', capture: false }),
      regexJa: Regexes.ability({ id: '31C9', source: 'ミドガルズオルム', capture: false }),
      regexCn: Regexes.ability({ id: '31C9', source: '尘世幻龙', capture: false }),
      regexKo: Regexes.ability({ id: '31C9', source: '미드가르드오름', capture: false }),
      condition: function(data) {
        return data.lastSpinWasHorizontal !== undefined;
      },
      alertText: function(data) {
        if (data.lastSpinWasHorizontal) {
          return {
            en: 'Get Out',
            de: 'Raus da',
            fr: 'Sortez',
          };
        }
        // This shouldn't happen.
        return {
          en: 'Go To Cardinals',
          de: 'Geh zu den Kanten',
          fr: 'Allez sur les points cardinaux',
        };
      },
    },
    {
      id: 'O10N Vertical Spin 2',
      regex: Regexes.ability({ id: '31CB', source: 'Midgardsormr', capture: false }),
      regexDe: Regexes.ability({ id: '31CB', source: 'Midgardsormr', capture: false }),
      regexFr: Regexes.ability({ id: '31CB', source: 'Midgardsormr', capture: false }),
      regexJa: Regexes.ability({ id: '31CB', source: 'ミドガルズオルム', capture: false }),
      regexCn: Regexes.ability({ id: '31CB', source: '尘世幻龙', capture: false }),
      regexKo: Regexes.ability({ id: '31CB', source: '미드가르드오름', capture: false }),
      condition: function(data) {
        return data.lastSpinWasHorizontal !== undefined;
      },
      alertText: function(data) {
        if (data.lastSpinWasHorizontal) {
          return {
            en: 'Get In',
            de: 'Rein da',
            fr: 'Allez sous le boss',
          };
        }
        return {
          en: 'Go To Corners',
          de: 'In die Ecken',
          fr: 'Allez dans les coins',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ancient Dragon': 'antik(?:e|er|es|en) Drache',
        'Immortal Key': 'unsterblich(?:e|er|es|en) Schlüssel',
        'Midgardsormr': 'Midgardsormr',
      },
      'replaceText': {
        'ready': 'ready', // FIXME
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Azure Wings': 'Azurschwingen',
        'Bloodied Maw': 'Blutiger Schlund',
        'Cardinals': 'Kanten',
        'Cauterize': 'Kauterisieren',
        'Coil': 'Angriff',
        'Corners': 'Ecken',
        'Crimson Breath': 'Purpurschwingen',
        'Crimson Wings': 'Purpurschwingen',
        'Dark Wave': 'Dunkle Welle',
        'Dry Ice': 'Trockeneis',
        'Earth Shaker': 'Erdstoß',
        'Enrage': 'Finalangriff',
        'Exaflare': 'Exaflare',
        'Flame Blast': 'Flammenhölle',
        'Flip': 'Rolle',
        'Frost Breath': 'Frostiger Atem',
        'Horrid Roar': 'Entsetzliches Brüllen',
        'Hot Tail': 'Schwelender Schweif',
        '(?<!\\w)In(?!/)': 'In', // FIXME
        'In/Out': 'Rein/Raus',
        '(?<!/)Out': 'Raus',
        'Northern Cross': 'Kreuz des Nordens',
        'Position': 'Position',
        'Protostar': 'Protostern',
        'Rime Wreath': 'Frostkalter Reif',
        'Shaker/Thunder': 'Erdstoß/Blitz',
        'Signal': 'Signal',
        'Spin': 'Drehung',
        'Stygian Maw': 'Stygischer Schlund',
        'Tail End': 'Schweifspitze',
        'Thunderstorm': 'Gewitter',
        'Time Immemorial': 'Urknall',
        'Touchdown': 'Himmelssturz',
        'attack': 'Attacke',
      },
      '~effectNames': {
        'Arcane Bulwark': 'Magische Barriere',
        'Crumbling Bulwark': 'Zerstörung der magischen Barriere',
        'Death from Above': 'Strafe des Himmels',
        'Death from Below': 'Strafe der Erde',
        'Defenseless': 'Magische Barriere blockiert',
        'Landborne': 'Kraft der Erde',
        'Skyborne': 'Kraft des Himmels',
        'Thin Ice': 'Glatteis',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ancient Dragon': 'dragon ancien',
        'Immortal Key': 'clef immortelle',
        'Midgardsormr': 'Midgardsormr',
      },
      'replaceText': {
        'ready': 'prêt',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Azure Wings': 'Ailes azur',
        'Bloodied Maw': 'Gueule ensanglantée',
        'Cardinals': 'Cardinaux',
        'Cauterize': 'Cautérisation',
        'Coil': 'Charge',
        'Corners': 'Coins',
        'Crimson Breath': 'Souffle écarlate',
        'Crimson Wings': 'Ailes pourpres',
        'Dark Wave': 'Vague de ténèbres',
        'Dry Ice': 'Poussière glaçante',
        'Earth Shaker': 'Secousse',
        'Enrage': 'Enrage',
        'Exaflare': 'ExaBrasier',
        'Flame Blast': 'Fournaise',
        'Flip': 'Tour vertical',
        'Frost Breath': 'Souffle glacé',
        'Horrid Roar': 'Rugissement horrible',
        'Hot Tail': 'Queue calorifique',
        '(?<!\\w)In(?!/)': 'In', // FIXME
        'In/Out': 'Dedans/Dehors',
        '(?<!/)Out': 'Dehors',
        'Northern Cross': 'Croix du nord',
        'Position': 'Position', // FIXME
        'Protostar': 'Proto-étoile',
        'Rime Wreath': 'Enveloppe de givre',
        'Shaker/Thunder': 'Secousse/Tempête',
        'Signal': 'Signal', // FIXME
        'Spin': 'Tour horizontal',
        'Stygian Maw': 'Gueule ténébreuse',
        'Tail End': 'Pointe de queue',
        'Thunderstorm': 'Tempête de foudre',
        'Time Immemorial': 'Big bang',
        'Touchdown': 'Atterrissage',
        'attack': 'Attaque',
      },
      '~effectNames': {
        'Arcane Bulwark': 'Barrière magique',
        'Crumbling Bulwark': 'Barrière magique détériorée',
        'Death from Above': 'Désastre céleste',
        'Death from Below': 'Désastre terrestre',
        'Defenseless': 'Barrière magique bloquée',
        'Landborne': 'Force terrestre',
        'Skyborne': 'Force céleste',
        'Thin Ice': 'Verglas',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ancient Dragon': 'エンシェントドラゴン',
        'Immortal Key': '竜の楔',
        'Midgardsormr': 'ミドガルズオルム',
      },
      'replaceText': {
        'ready': 'ready', // FIXME
        '--targetable--': '--targetable--',
        '--untargetable--': '--untargetable--',
        'Akh Morn': 'アク・モーン',
        'Akh Rhai': 'アク・ラーイ',
        'Azure Wings': '蒼翼の焔',
        'Bloodied Maw': '紅牙の焔',
        'Cardinals': 'Cardinals', // FIXME
        'Cauterize': 'カータライズ',
        'Coil': 'Coil', // FIXME
        'Corners': 'Corners', // FIXME
        'Crimson Breath': 'クリムゾンブレス',
        'Crimson Wings': '紅翼の焔',
        'Dark Wave': 'ダークウェーブ',
        'Dry Ice': 'フリージングダスト',
        'Earth Shaker': 'アースシェイカー',
        'Enrage': 'Enrage',
        'Exaflare': 'エクサフレア',
        'Flame Blast': 'フレイムブラスト',
        'Flip': 'Flip', // FIXME
        'Frost Breath': 'フロストブレス',
        'Horrid Roar': 'ホリッドロア',
        'Hot Tail': 'ヒートテイル',
        '(?<!\\w)In(?!/)': 'In', // FIXME
        'In/Out': 'In/Out', // FIXME
        '(?<!/)Out': 'Out', // FIXME
        'Northern Cross': 'ノーザンクロス',
        'Position': 'Position', // FIXME
        'Protostar': 'プロトスター',
        'Rime Wreath': 'ライムリリース',
        'Shaker/Thunder': 'Shaker/Thunder', // FIXME
        'Signal': 'Signal', // FIXME
        'Spin': 'ぶん回す',
        'Stygian Maw': '黒牙の焔',
        'Tail End': 'テイルエンド',
        'Thunderstorm': 'サンダーストーム',
        'Time Immemorial': '天地開闢',
        'Touchdown': 'タッチダウン',
        'attack': '攻撃',
      },
      '~effectNames': {
        'Arcane Bulwark': '魔法障壁',
        'Crumbling Bulwark': '魔法障壁：崩壊',
        'Death from Above': '天の災厄',
        'Death from Below': '地の災厄',
        'Defenseless': '魔法障壁：展開不可',
        'Landborne': '地の力',
        'Skyborne': '天の力',
        'Thin Ice': '氷床',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ancient Dragon': '远古之龙',
        'Immortal Key': '龙之楔',
        'Midgardsormr': '尘世幻龙',
      },
      'replaceText': {
        'ready': 'ready', // FIXME
        '--targetable--': '--targetable--', // FIXME
        '--untargetable--': '--untargetable--', // FIXME
        'Akh Morn': '死亡轮回',
        'Akh Rhai': '天光轮回',
        'Azure Wings': '苍翼之焰',
        'Bloodied Maw': '红牙之焰',
        'Cardinals': 'Cardinals', // FIXME
        'Cauterize': '低温俯冲',
        'Coil': 'Coil', // FIXME
        'Corners': 'Corners', // FIXME
        'Crimson Breath': '深红吐息',
        'Crimson Wings': '红翼之焰',
        'Dark Wave': '黑暗波动',
        'Dry Ice': '冰尘',
        'Earth Shaker': '大地摇动',
        'Enrage': 'Enrage', // FIXME
        'Exaflare': '百京核爆',
        'Flame Blast': '烈焰十字爆',
        'Flip': 'Flip', // FIXME
        'Frost Breath': '寒霜吐息',
        'Horrid Roar': '恐惧咆哮',
        'Hot Tail': '燃烧之尾',
        '(?<!\\w)In(?!/)': 'In', // FIXME
        'In/Out': 'In/Out', // FIXME
        '(?<!/)Out': 'Out', // FIXME
        'Northern Cross': '北十字星',
        'Position': 'Position', // FIXME
        'Protostar': '原恒星',
        'Rime Wreath': '白霜环绕',
        'Shaker/Thunder': 'Shaker/Thunder', // FIXME
        'Signal': 'Signal', // FIXME
        'Spin': '回转',
        'Stygian Maw': '黑牙之焰',
        'Tail End': '煞尾',
        'Thunderstorm': '闪雷风暴',
        'Time Immemorial': '开天辟地',
        'Touchdown': '空降',
        'attack': '攻击',
      },
      '~effectNames': {
        'Arcane Bulwark': '魔法障壁',
        'Crumbling Bulwark': '魔法障壁：崩坏',
        'Death from Above': '天之灾厄',
        'Death from Below': '地之灾厄',
        'Defenseless': '魔法障壁：无法展开',
        'Landborne': '地之力',
        'Skyborne': '天之力',
        'Thin Ice': '冰面',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ancient Dragon': '고룡',
        'Immortal Key': '용의 말뚝',
        'Midgardsormr': '미드가르드오름',
      },
      'replaceText': {
        'ready': 'ready', // FIXME
        '--targetable--': '--targetable--', // FIXME
        '--untargetable--': '--untargetable--', // FIXME
        'Akh Morn': '아크 몬',
        'Akh Rhai': '아크 라이',
        'Azure Wings': '창익의 불꽃',
        'Bloodied Maw': '홍아의 불꽃',
        'Cardinals': 'Cardinals', // FIXME
        'Cauterize': '인두질',
        'Coil': 'Coil', // FIXME
        'Corners': 'Corners', // FIXME
        'Crimson Breath': '진홍빛 숨결',
        'Crimson Wings': '홍익의 불꽃',
        'Dark Wave': '어둠의 파동',
        'Dry Ice': '지면 동결',
        'Earth Shaker': '요동치는 대지',
        'Enrage': 'Enrage', // FIXME
        'Exaflare': '엑사플레어',
        'Flame Blast': '화염 작렬',
        'Flip': 'Flip', // FIXME
        'Frost Breath': '서리 숨결',
        'Horrid Roar': '소름끼치는 포효',
        'Hot Tail': '뜨거운 꼬리',
        '(?<!\\w)In(?!/)': 'In', // FIXME
        'In/Out': 'In/Out', // FIXME
        '(?<!/)Out': 'Out', // FIXME
        'Northern Cross': '북십자성',
        'Position': 'Position', // FIXME
        'Protostar': '원시별',
        'Rime Wreath': '분노의 서릿발',
        'Shaker/Thunder': 'Shaker/Thunder', // FIXME
        'Signal': 'Signal', // FIXME
        'Spin': 'Spin',
        'Stygian Maw': '흑아의 불꽃',
        'Tail End': '꼬리 쓸기',
        'Thunderstorm': '번개 폭풍',
        'Time Immemorial': '천지개벽',
        'Touchdown': '착지',
        'attack': '공격',
      },
      '~effectNames': {
        'Arcane Bulwark': '마법 장벽',
        'Crumbling Bulwark': '마법 장벽 붕괴',
        'Death from Above': '하늘의 재앙',
        'Death from Below': '땅의 재앙',
        'Defenseless': '마법 장벽 불가',
        'Landborne': '땅의 힘',
        'Skyborne': '하늘의 힘',
        'Thin Ice': '얼음 바닥',
      },
    },
  ],
}];
