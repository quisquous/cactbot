'use strict';

// TODO: fix tail end (seemed to not work??)
// TODO: add phase tracking (so death from above/below can tell you to swap or not)
// TODO: add swap callout after exaflares
// TODO: debuff tracking for when you lose the barrier to remind you to run?
// TODO: ice head markers
// TODO: stack head markers

// O10S - Alphascape 2.0 Savage
[{
  zoneRegex: /^Alphascape V2.0 \(Savage\)$/,
  timelineFile: 'o10s.txt',
  triggers: [
    {
      id: 'O10S Tail End',
      regex: / 14:31AA:Midgardsormr starts using Tail End on (\y{Name})/,
      regexDe: / 14:31AA:Midgardsormr starts using Schweifspitze on (\y{Name})/,
      regexFr: / 14:31AA:Midgardsormr starts using Pointe De Queue on (\y{Name})/,
      regexJa: / 14:31AA:ミドガルズオルム starts using テイルエンド on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'O10S Fire Marker',
      regex: / 1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      alarmText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Fire Marker on YOU',
            de: 'Feuer Marker auf DIR',
            fr: 'Feu sur VOUS',
            ja: 'マーカー on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1])
          return 'Fire on ' + data.ShortName(matches[1]);
      },
    },
    {
      id: 'O10S Death From Below',
      regex: / 1B:........:(\y{Name}):....:....:008F:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Death From Below',
        de: 'Tod von unten',
        fr: 'Désastre terrestre',
      },
    },
    {
      id: 'O10S Death From Above',
      regex: / 1B:........:(\y{Name}):....:....:008E:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Death From Above',
        de: 'Tod von oben',
        fr: 'Désastre Céleste',
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
      regex: /1[56]:\y{ObjectId}:(?:Midgardsormr|):31B[2345]:/,
      regexDe: /1[56]:\y{ObjectId}:(?:Midgardsormr|):31B[2345]:/,
      regexFr: /1[56]:\y{ObjectId}:(?:Midgardsormr|):31B[2345]:/,
      regexJa: /1[56]:\y{ObjectId}:(?:ミドガルズオルム|):31B[2345]:/,
      run: function(data) {
        delete data.lastSpinWasHorizontal;
      },
    },
    {
      id: 'O10N Horizontal Spin 1',
      regex: /15:\y{ObjectId}:Midgardsormr:31AC:/,
      regexDe: /15:\y{ObjectId}:Midgardsormr:31AC:/,
      regexFr: /15:\y{ObjectId}:Midgardsormr:31AC:/,
      regexJa: /15:\y{ObjectId}:ミドガルズオルム:31AC:/,
      infoText: {
        en: 'Next Spin: In or Out',
        de: 'Nächste Drehung: Rein oder Raus',
        fr: 'Tour suivant : Dedans/Dehors',
        ja: '中か外',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = true;
      },
    },
    {
      id: 'O10N Vertical Spin 1',
      regex: /15:\y{ObjectId}:Midgardsormr:31AD:/,
      regexDe: /15:\y{ObjectId}:Midgardsormr:31AD:/,
      regexFr: /15:\y{ObjectId}:Midgardsormr:31AD:/,
      regexJa: /15:\y{ObjectId}:ミドガルズオルム:31AD:/,
      infoText: {
        en: 'Next Spin: Cardinals or Corners',
        de: 'Nächste Drehung: Kanten oder Ecken',
        fr: 'Tour suivant : Cardinaux ou Coins',
        ja: '角かマーカー',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = false;
      },
    },
    {
      id: 'O10N Horizontal Spin 2',
      regex: /15:\y{ObjectId}:Midgardsormr:31AE:/,
      regexDe: /15:\y{ObjectId}:Midgardsormr:31AE:/,
      regexFr: /15:\y{ObjectId}:Midgardsormr:31AE:/,
      regexJa: /15:\y{ObjectId}:ミドガルズオルム:31AE:/,
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
          };
        }
        return {
          en: 'Go To Cardinals',
          de: 'An die Kanten',
          fr: 'Allez sur les cardinaux',
          ja: 'マーカーへ',
        };
      },
    },
    {
      id: 'O10N Vertical Spin 2',
      regex: /15:\y{ObjectId}:Midgardsormr:31B0:/,
      regexDe: /15:\y{ObjectId}:Midgardsormr:31B0:/,
      regexFr: /15:\y{ObjectId}:Midgardsormr:31B0:/,
      regexJa: /15:\y{ObjectId}:ミドガルズオルム:31B0:/,
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
          };
        }
        return {
          en: 'Go To Corners',
          de: 'In die Ecken',
          fr: 'Allez dans les coins',
          ja: '角へ',
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
  ],
}];
