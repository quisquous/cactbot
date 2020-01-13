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
  },
  timelineFile: 'o10s.txt',
  triggers: [
    {
      id: 'O10S Tail End',
      regex: Regexes.startsUsing({ id: '31AA', source: 'Midgardsormr' }),
      regexDe: Regexes.startsUsing({ id: '31AA', source: 'Midgardsormr' }),
      regexFr: Regexes.startsUsing({ id: '31AA', source: 'Midgardsormr' }),
      regexJa: Regexes.startsUsing({ id: '31AA', source: 'ミドガルズオルム' }),
      regexCn: Regexes.startsUsing({ id: '31AA', source: '尘世幻龙' }),
      regexKo: Regexes.startsUsing({ id: '31AA', source: '미드가르드오름' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑减伤',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            cn: data.ShortName(matches.target) + '吃死刑',
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            ja: 'バスター',
            cn: '死刑',
          };
        }
      },
    },
    {
      id: 'O10S Fire Marker',
      regex: Regexes.headMarker({ id: '0017' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Fire Marker on YOU',
            de: 'Feuer Marker auf DIR',
            fr: 'Feu sur VOUS',
            ja: 'マーカー on YOU',
            cn: '火点名',
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
      regex: Regexes.headMarker({ id: '008F' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Death From Below',
        de: 'Tod von unten',
        fr: 'Désastre terrestre',
        cn: '地之灾厄',
      },
    },
    {
      id: 'O10S Death From Above',
      regex: Regexes.headMarker({ id: '008E' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Death From Above',
        de: 'Tod von oben',
        fr: 'Désastre Céleste',
        cn: '天之灾厄',
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
      regex: Regexes.ability({ id: '31B[2345]', source: ['Midgardsormr', ''], capture: false }),
      regexDe: Regexes.ability({ id: '31B[2345]', source: ['Midgardsormr', ''], capture: false }),
      regexFr: Regexes.ability({ id: '31B[2345]', source: ['Midgardsormr', ''], capture: false }),
      regexJa: Regexes.ability({ id: '31B[2345]', source: ['ミドガルズオルム', ''], capture: false }),
      regexCn: Regexes.ability({ id: '31B[2345]', source: ['尘世幻龙', ''], capture: false }),
      regexKo: Regexes.ability({ id: '31B[2345]', source: ['미드가르드오름', ''], capture: false }),
      run: function(data) {
        delete data.lastSpinWasHorizontal;
      },
    },
    {
      id: 'O10N Horizontal Spin 1',
      regex: Regexes.ability({ id: '31AC', source: 'Midgardsormr', capture: false }),
      regexDe: Regexes.ability({ id: '31AC', source: 'Midgardsormr', capture: false }),
      regexFr: Regexes.ability({ id: '31AC', source: 'Midgardsormr', capture: false }),
      regexJa: Regexes.ability({ id: '31AC', source: 'ミドガルズオルム', capture: false }),
      regexCn: Regexes.ability({ id: '31AC', source: '尘世幻龙', capture: false }),
      regexKo: Regexes.ability({ id: '31AC', source: '미드가르드오름', capture: false }),
      infoText: {
        en: 'Next Spin: In or Out',
        de: 'Nächste Drehung: Rein oder Raus',
        fr: 'Tour suivant : Dedans/Dehors',
        ja: '中か外',
        cn: '下一转：靠近或远离',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = true;
      },
    },
    {
      id: 'O10N Vertical Spin 1',
      regex: Regexes.ability({ id: '31AD', source: 'Midgardsormr', capture: false }),
      regexDe: Regexes.ability({ id: '31AD', source: 'Midgardsormr', capture: false }),
      regexFr: Regexes.ability({ id: '31AD', source: 'Midgardsormr', capture: false }),
      regexJa: Regexes.ability({ id: '31AD', source: 'ミドガルズオルム', capture: false }),
      regexCn: Regexes.ability({ id: '31AD', source: '尘世幻龙', capture: false }),
      regexKo: Regexes.ability({ id: '31AD', source: '미드가르드오름', capture: false }),
      infoText: {
        en: 'Next Spin: Cardinals or Corners',
        de: 'Nächste Drehung: Kanten oder Ecken',
        fr: 'Tour suivant : Cardinaux ou Coins',
        ja: '角かマーカー',
        cn: '下一转：靠边火角落',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = false;
      },
    },
    {
      id: 'O10N Horizontal Spin 2',
      regex: Regexes.ability({ id: '31AE', source: 'Midgardsormr', capture: false }),
      regexDe: Regexes.ability({ id: '31AE', source: 'Midgardsormr', capture: false }),
      regexFr: Regexes.ability({ id: '31AE', source: 'Midgardsormr', capture: false }),
      regexJa: Regexes.ability({ id: '31AE', source: 'ミドガルズオルム', capture: false }),
      regexCn: Regexes.ability({ id: '31AE', source: '尘世幻龙', capture: false }),
      regexKo: Regexes.ability({ id: '31AE', source: '미드가르드오름', capture: false }),
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
          };
        }
        return {
          en: 'Go To Cardinals',
          de: 'An die Kanten',
          fr: 'Allez sur les cardinaux',
          ja: 'マーカーへ',
          cn: '靠边',
        };
      },
    },
    {
      id: 'O10N Vertical Spin 2',
      regex: Regexes.ability({ id: '31B0', source: 'Midgardsormr', capture: false }),
      regexDe: Regexes.ability({ id: '31B0', source: 'Midgardsormr', capture: false }),
      regexFr: Regexes.ability({ id: '31B0', source: 'Midgardsormr', capture: false }),
      regexJa: Regexes.ability({ id: '31B0', source: 'ミドガルズオルム', capture: false }),
      regexCn: Regexes.ability({ id: '31B0', source: '尘世幻龙', capture: false }),
      regexKo: Regexes.ability({ id: '31B0', source: '미드가르드오름', capture: false }),
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
          };
        }
        return {
          en: 'Go To Corners',
          de: 'In die Ecken',
          fr: 'Allez dans les coins',
          ja: '角へ',
          cn: '角落',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Midgardsormr': 'Midgardsormr',
        'Ancient Dragon': 'Antiker Drache',
        'Immortal Key': 'Unsterblicher Schlüssel',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Azure Wings': 'Azurschwingen',
        'Bloodied Maw': 'Blutiger Schlund',
        'Cauterize': 'Kauterisieren',
        'Coil': 'Angriff',
        'Crimson Breath': 'Purpurschwingen',
        'Crimson Wings': 'Purpurschwingen',
        'Dark Wave': 'Dunkle Welle',
        'Dry Ice': 'Trockeneis',
        'Earth Shaker': 'Erdstoß',
        'Enrage': 'Finalangriff',
        'Exaflare': 'Exaflare',
        'Flame Blast': 'Flammenhölle',
        'Frost Breath': 'Frostiger Atem',
        'Horrid Roar': 'Entsetzliches Brüllen',
        'Hot Tail': 'Schwelender Schweif',
        'Northern Cross': 'Kreuz des Nordens',
        'Protostar': 'Protostern',
        'Rime Wreath': 'Frostkalter Reif',
        'Stygian Maw': 'Stygischer Schlund',
        'Tail End': 'Schweifspitze',
        'Thunderstorm': 'Gewitter',
        'Time Immemorial': 'Urknall',
        'Touchdown': 'Himmelssturz',
        'attack': 'Attacke',
        'Flip': 'Rolle',
        'Spin': 'Drehung',
        'Cardinals': 'Kanten',
        'Corners': 'Ecken',
        'In': 'Rein',
        'Out': 'Raus',
        'Flip/Spin': 'Rolle/Drehung',
        'In/Out': 'Rein/Raus',
        'Corners/Cardinals': 'Ecken/Kanten',
        'Shaker/Thunder': 'Erdstoß/Blitz',
        ' ready': ' bereit',
        'Signal': 'Signal',
        'Position': 'Position',
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
        'Engage!': 'À l\'attaque',
        'Midgardsormr': 'Midgardsormr',
        'Ancient Dragon': 'Dragon Ancien',
        'Immortal Key': 'Clef Immortelle',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Azure Wings': 'Ailes azur',
        'Bloodied Maw': 'Gueule ensanglantée',
        'Cauterize': 'Cautérisation',
        'Coil': 'Charge',
        'Crimson Breath': 'Haleine cramoisie',
        'Crimson Wings': 'Ailes pourpres',
        'Dark Wave': 'Vague de ténèbres',
        'Dry Ice': 'Poussière glaçante',
        'Earth Shaker': 'Secousse',
        'Enrage': 'Enrage',
        'Exaflare': 'ExaBrasier',
        'Flame Blast': 'Explosion de flamme',
        'Frost Breath': 'Souffle glacé',
        'Horrid Roar': 'Rugissement horrible',
        'Hot Tail': 'Queue calorifique',
        'Northern Cross': 'Croix du nord',
        'Protostar': 'Proto-étoile',
        'Rime Wreath': 'Enveloppe de givre',
        'Stygian Maw': 'Gueule ténébreuse',
        'Tail End': 'Pointe de queue',
        'Thunderstorm': 'Tempête de foudre',
        'Time Immemorial': 'Big bang',
        'Touchdown': 'Atterrissage',
        'attack': 'Attaque',

        'Flip': 'Tour vertical',
        'Spin': 'Tour horizontal',
        'Cardinals': 'Cardinaux',
        'In': 'Dedans',
        'Out': 'Dehors',
        'Flip/Spin': 'Tour Hz/Vt',
        'In/Out': 'Dedans/Dehors',
        'Corners/Cardinals': 'Coins/Cardinaux',
        'Shaker/Thunder': 'Secousse/Tempête',
        ' ready': ' prêt',

        // FIXME
        'Corners': 'Corners',
        'Signal': 'Signal',
        'Position': 'Position',
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
        'Engage!': '戦闘開始！',
        'Midgardsormr': 'ミドガルズオルム',
        'Ancient Dragon': 'エンシェントドラゴン',
        'Immortal Key': '竜の楔',
      },
      'replaceText': {
        'Akh Morn': 'アク・モーン',
        'Akh Rhai': 'アク・ラーイ',
        'Azure Wings': '蒼翼の焔',
        'Bloodied Maw': '紅牙の焔',
        'Cauterize': 'カータライズ',
        'Coil': '',
        'Crimson Breath': 'クリムゾンブレス',
        'Crimson Wings': '紅翼の焔',
        'Dark Wave': 'ダークウェーブ',
        'Dry Ice': 'フリージングダスト',
        'Earth Shaker': 'アースシェイカー',
        'Exaflare': 'エクサフレア',
        'Flame Blast': 'フレイムブラスト',
        'Frost Breath': 'フロストブレス',
        'Horrid Roar': 'ホリッドロア',
        'Hot Tail': 'ヒートテイル',
        'Northern Cross': 'ノーザンクロス',
        'Protostar': 'プロトスター',
        'Rime Wreath': 'ライムリリース',
        'Stygian Maw': '',
        'Tail End': 'テイルエンド',
        'Thunderstorm': 'サンダーストーム',
        'Time Immemorial': '天地開闢',
        'Touchdown': 'タッチダウン',
        'attack': '攻撃',

        // FIXME
        'Flip': 'Flip',
        'Spin': 'Spin',
        'Cardinals': 'Cardinals',
        'Corners': 'Corners',
        'In': 'In',
        'Out': 'Out',
        'Flip/Spin': 'Flip/Spin',
        'In/Out': 'In/Out',
        'Corners/Cardinals': 'Corners/Cardinals',
        'Shaker/Thunder': 'Shaker/Thunder',
        ' ready': ' ready',
        'Signal': 'Signal',
        'Position': 'Position',
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
        'I am Midgardsormr': '我乃尘世幻龙',
        'Ancient Dragon': '远古之龙',
        'Ancient dragon': '远古之龙',
        'Engage!': '战斗开始！',
        'Immortal Key': '龙之楔',
        'Immortal key': '龙之楔',
        'Midgardsormr': '尘世幻龙',
        'ancient dragon': '远古之龙',
        'immortal key': '龙之楔',
      },
      'replaceText': {
        'Akh Morn': '死亡轮回',
        'Akh Rhai': '天光轮回',
        'Azure Wings': '苍翼之焰',
        'Cauterize': '灼热俯冲',
        'Coil': '',
        'Crimson Breath': '深红吐息',
        'Crimson Wings': '红翼之焰',
        'Dark Wave': '黑暗波动',
        'Dry Ice': '冰尘',
        'Earth Shaker': '大地摇动',
        'Exaflare': '百京核爆',
        'Flame Blast': '烈焰十字爆',
        'Frost Breath': '寒霜吐息',
        'Horrid Roar': '恐惧咆哮',
        'Hot Tail': '燃烧之尾',
        'Northern Cross': '北十字星',
        'Protostar': '原恒星',
        'Rime Wreath': '白霜环绕',
        'Stygian Maw': '',
        'Tail End': '煞尾',
        'Thunderstorm': '闪雷风暴',
        'Time Immemorial': '开天辟地',
        'Touchdown': '空降',
        'attack': '攻击',
        // FIXME
        'Flip': '横转',
        'Spin': '竖转',
        'Cardinals': '靠边',
        'Corners': '角落',
        'In': '靠近',
        'Out': '远离',
        'Flip/Spin': 'Flip/Spin',
        'In/Out': '靠近/远离',
        'Corners/Cardinals': '靠边/角落',
        'Shaker/Thunder': '大地摇动/闪雷风暴',
        ' ready': ' ready',
        'Signal': 'Signal',
        'Position': '站位',
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
  ],
}];
