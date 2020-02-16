'use strict';

// O8N - Sigmascape 4.0 Normal
[{
  zoneRegex: /^Sigmascape \(V4\.0\)$/,
  timelineFile: 'o8n.txt',
  triggers: [
    {
      id: 'O8N Hyper Drive',
      regex: Regexes.startsUsing({ id: '292E', source: 'Kefka' }),
      regexDe: Regexes.startsUsing({ id: '292E', source: 'Kefka' }),
      regexFr: Regexes.startsUsing({ id: '292E', source: 'Kefka' }),
      regexJa: Regexes.startsUsing({ id: '292E', source: 'ケフカ' }),
      regexCn: Regexes.startsUsing({ id: '292E', source: '凯夫卡' }),
      regexKo: Regexes.startsUsing({ id: '292E', source: '케프카' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Hyperdrive on YOU',
            fr: 'Colonne de feu sur VOUS',
            de: 'Hyperantrieb auf DIR',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Hyperdrive on ' + data.ShortName(matches.target),
            fr: 'Colonne de feu sur ' + data.ShortName(matches.target),
            de: 'Hyperantrieb auf ' + data.ShortName(matches.target),
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            fr: 'Colonne de feu',
            de: 'hyperantrieb',
          };
        }
      },
    },
    {
      id: 'O8N Shockwave',
      regex: Regexes.startsUsing({ id: '2927', source: 'Graven Image', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2927', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2927', source: 'Statue Divine', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2927', source: '神々の像', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2927', source: '众神之像', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2927', source: '신들의 상', capture: false }),
      delaySeconds: 5,
      alertText: {
        en: 'Look for Knockback',
        fr: 'Préparez-vous à la projection',
        de: 'Auf Rückstoß achten',
      },
      tts: {
        en: 'knockback',
        fr: 'Projection depuis le boss',
        de: 'Rückstoß',
      },
    },
    {
      id: 'O8N Gravitational Wave',
      regex: Regexes.startsUsing({ id: '2929', source: 'Graven Image', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2929', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2929', source: 'Statue Divine', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2929', source: '神々の像', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2929', source: '众神之像', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2929', source: '신들의 상', capture: false }),
      alertText: {
        en: 'Get Right/East =>',
        fr: 'Allez à Droite/Est =>',
        de: 'Nach Rechts/Westen =>',
      },
      tts: {
        en: 'right',
        fr: 'Projection depuis le côté droit',
        de: 'rechts',
      },
    },
    {
      id: 'O8N Intemperate Will',
      regex: Regexes.startsUsing({ id: '292A', source: 'Graven Image', capture: false }),
      regexDe: Regexes.startsUsing({ id: '292A', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      regexFr: Regexes.startsUsing({ id: '292A', source: 'Statue Divine', capture: false }),
      regexJa: Regexes.startsUsing({ id: '292A', source: '神々の像', capture: false }),
      regexCn: Regexes.startsUsing({ id: '292A', source: '众神之像', capture: false }),
      regexKo: Regexes.startsUsing({ id: '292A', source: '신들의 상', capture: false }),
      alertText: {
        en: '<= Get Left/West',
        fr: '<= Allez à Gauche/Ouest',
        de: '<= Nach Links/Westen',
      },
      tts: {
        en: 'left',
        fr: 'Projection depuis le côté gauche',
        de: 'links',
      },
    },
    {
      id: 'O8N Ave Maria',
      regex: Regexes.startsUsing({ id: '292B', source: 'Graven Image', capture: false }),
      regexDe: Regexes.startsUsing({ id: '292B', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      regexFr: Regexes.startsUsing({ id: '292B', source: 'Statue Divine', capture: false }),
      regexJa: Regexes.startsUsing({ id: '292B', source: '神々の像', capture: false }),
      regexCn: Regexes.startsUsing({ id: '292B', source: '众神之像', capture: false }),
      regexKo: Regexes.startsUsing({ id: '292B', source: '신들의 상', capture: false }),
      alertText: {
        en: 'Look At Statue',
        fr: 'Regardez la statue',
        de: 'Statue anschauen',
      },
      tts: {
        en: 'look towards',
        fr: 'Regardez la statue',
        de: 'anschauen',
      },
    },
    {
      id: 'O8N Indolent Will',
      regex: Regexes.startsUsing({ id: '292C', source: 'Graven Image', capture: false }),
      regexDe: Regexes.startsUsing({ id: '292C', source: 'Heilig(?:e|er|es|en) Statue', capture: false }),
      regexFr: Regexes.startsUsing({ id: '292C', source: 'Statue Divine', capture: false }),
      regexJa: Regexes.startsUsing({ id: '292C', source: '神々の像', capture: false }),
      regexCn: Regexes.startsUsing({ id: '292C', source: '众神之像', capture: false }),
      regexKo: Regexes.startsUsing({ id: '292C', source: '신들의 상', capture: false }),
      alertText: {
        en: 'Look Away From Statue',
        fr: 'Ne regardez pas la statue',
        de: 'Von Statue wegschauen',
      },
      tts: {
        en: 'look away',
        fr: 'Ne regardez pas la statue',
        de: 'weckschauen',
      },
    },
    {
      id: 'O8N Aero Assault',
      regex: Regexes.startsUsing({ id: '2924', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2924', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2924', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2924', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2924', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2924', source: '케프카', capture: false }),
      infoText: {
        en: 'Knockback on Boss',
        fr: 'Projection depuis le boss',
        de: 'Rückstoß vom Boss',
      },
    },
    {
      id: 'O8N Flagrant Fire Single',
      regex: Regexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      infoText: {
        en: 'fire on YOU',
        fr: 'Feu sur VOUS',
        de: 'Feuer auf DIR',
      },
      tts: {
        en: 'fire',
        fr: 'feu',
        de: 'Feuer',
      },
    },
    {
      id: 'O8N Flagrant Fire Stack',
      regex: Regexes.headMarker({ id: '003E' }),
      alertText: function(data, matches) {
        return 'Stack on ' + data.ShortName(matches.target);
      },
      tts: {
        en: 'stack',
        fr: 'stack',
        de: 'stek',
      },
    },
    {
      id: 'O8N Thrumming Thunder Real',
      regex: Regexes.startsUsing({ id: '291D', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '291D', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '291D', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '291D', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '291D', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '291D', source: '케프카', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'True Thunder',
        fr: 'Vraie foudre',
        de: 'Wahrer Blitz',
      },
      tts: {
        en: 'True',
        fr: 'Vrai',
        de: 'Wahr',
      },
    },
    {
      id: 'O8N Thrumming Thunder Fake',
      regex: Regexes.startsUsing({ id: '291B', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '291B', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '291B', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '291B', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '291B', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '291B', source: '케프카', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Fake Thunder',
        fr: 'Fausse foudre',
        de: 'Falscher Blitz',
      },
      tts: {
        en: 'Fake',
        fr: 'Fausse',
        de: 'Falsch',
      },
    },
    {
      id: 'O8N Blizzard Fake Donut',
      regex: Regexes.startsUsing({ id: '2916', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2916', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2916', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2916', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2916', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2916', source: '케프카', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Fake Ice: Get out',
        fr: 'Fausse glace : Sortez',
        de: 'Falsches Eis: Rausgehen',
      },
      tts: {
        en: 'Get out',
        fr: 'Sortez',
        de: 'Rausgehen',
      },
    },
    {
      id: 'O8N Blizzard True Donut',
      regex: Regexes.startsUsing({ id: '2919', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2919', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2919', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2919', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2919', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2919', source: '케프카', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'True Ice: Get in',
        fr: 'Vraie glace: Rentrez dedans',
        de: 'Wahre Eis: Reingehen',
      },
      tts: {
        en: 'Get in',
        fr: 'rentrez dedans',
        de: 'Reingehen',
      },
    },
    {
      id: 'O8N Blizzard Fake Near',
      regex: Regexes.startsUsing({ id: '2914', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2914', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2914', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2914', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2914', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2914', source: '케프카', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Fake Ice: Get in',
        fr: 'Fausse glace: Rentrez dedans',
        de: 'Falsches Eis: Reingehen',
      },
      tts: {
        en: 'Get in',
        fr: 'rentrez dedans',
        de: 'Reingehen',
      },
    },
    {
      id: 'O8N Blizzard True Near',
      regex: Regexes.startsUsing({ id: '2918', source: 'Kefka', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2918', source: 'Kefka', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2918', source: 'Kefka', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2918', source: 'ケフカ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2918', source: '凯夫卡', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2918', source: '케프카', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'True Ice: Get out',
        fr: 'Vraie glace: Sortez',
        de: 'Wahres Eis: Rausgehen',
      },
      tts: {
        en: 'Get out',
        fr: 'Sortez',
        de: 'raus da',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Destroy! Destroy! Destroy! I will destroy it all!': 'Destroy! Destroy! Destroy! I will destroy it all!', // FIXME
        'Graven Image': 'heilig(?:e|er|es|en) Statue',
        'Kefka': 'Kefka',
        'Light Of Consecration': 'Licht der Weihe',
        'The Mad Head': 'verrückt(?:e|er|es|en) Kopf',
      },
      'replaceText': {
        'Aero Assault': 'Wallendes Windga',
        'Aero/Ruin': 'Wind/Ruin',
        'All Things Ending': 'Ende aller Dinge',
        'Blizzard Blitz': 'Erstarrendes Eisga',
        'Blizzard III': 'Eisga',
        'Celestriad': 'Dreigestirn',
        'Explosion': 'Explosion',
        'Fire III': 'Feuga',
        'Flagrant Fire': 'Flammendes Feuga',
        'Forsaken': 'Verloren',
        'Future\'s End': 'Ende der Zukunft',
        'Futures Numbered': 'Vernichtung der Zukunft',
        'Graven Image': 'Göttliche Statue',
        'Gravitas': 'Gravitas',
        'Gravitational Wave': 'Gravitationswelle',
        'Half Arena': 'Halbe Arena',
        'Heartless Angel': 'Herzloser Engel',
        'Heartless Archangel': 'Herzloser Erzengel',
        'Holy Ascent': 'Heiliger Aufstieg',
        'Hyperdrive': 'Hyperantrieb',
        'Idyllic Will': 'Idyllischer Wille',
        'Indolent Will': 'Träger Wille',
        'Indomitable Will': 'Unzähmbarer Wille',
        'Indulgent Will': 'Nachsichtiger Wille',
        'Inexorable Will': 'Unerbittlicher Wille',
        'Intemperate Will': 'Unmäßiger Wille',
        'Light Of Judgment': 'Licht des Urteils',
        'Mana Charge': 'Mana-Aufladung',
        'Mana Release': 'Mana-Entladung',
        'Meteor': 'Meteor',
        'Pasts Forgotten': 'Vernichtung der Vergangenheit',
        'Pulse Wave': 'Pulswelle',
        'Revolting Ruin': 'Revoltierendes Ruinga',
        'Shockwave': 'Schockwelle',
        'Starstrafe': 'Sternentanz',
        'Statue Gaze': 'Statuenblick',
        'The Path Of Light': 'Pfad des Lichts',
        'Thrumming Thunder': 'Brachiales Blitzga',
        'Thunder III': 'Blitzga',
        'Timely Teleport': 'Turbulenter Teleport',
        'Trine': 'Trine',
        'Ultima Upsurge': 'Ultima-Wallung',
        'Ultimate Embrace': 'Ultima-Umarmung',
        'Ultima(?! )': 'Ultima',
        'Vitrophyre': 'Vitrophyr',
        'Wave Cannon': 'Wellenkanone',
        'Wings Of Destruction': 'Vernichtungsschwinge',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Destroy! Destroy! Destroy! I will destroy it all!': 'Destroy! Destroy! Destroy! I will destroy it all!', // FIXME
        'Graven Image': 'Statue divine',
        'Kefka': 'Kefka',
        'Light Of Consecration': 'lumière de la consécration',
        'The Mad Head': 'visage de la folie',
      },
      'replaceText': {
        'Aero Assault': 'Méga Vent véhément',
        'Aero/Ruin': 'Vent/Ruine',
        'All Things Ending': 'Fin de toutes choses',
        'Blizzard Blitz': 'Méga Glace glissante',
        'Blizzard III': 'Méga Glace',
        'Celestriad': 'Tristella',
        'Explosion': 'Explosion',
        'Fire III': 'Méga Feu',
        'Flagrant Fire': 'Méga Feu faufilant',
        'Forsaken': 'Cataclysme',
        'Future\'s End': 'Fin du futur',
        'Futures Numbered': 'Ruine du futur',
        'Graven Image': 'Statue divine',
        'Gravitas': 'Tir gravitationnel',
        'Gravitational Wave': 'Onde gravitationnelle',
        'Half Arena': 'Moitié d\'arène',
        'Heartless Angel': 'Ange sans cœur',
        'Heartless Archangel': 'Archange sans cœur',
        'Holy Ascent': 'Ascension sacrée',
        'Hyperdrive': 'Colonne de feu',
        'Idyllic Will': 'Volonté idyllique',
        'Indolent Will': 'Volonté indolente',
        'Indomitable Will': 'Volonté indomptable',
        'Indulgent Will': 'Volonté indulgente',
        'Inexorable Will': 'Volonté inexorable',
        'Intemperate Will': 'Volonté intempérante',
        'Light Of Judgment': 'Triade guerrière',
        'Mana Charge': 'Concentration de mana',
        'Mana Release': 'Décharge de mana',
        'Meteor': 'Météore',
        'Pasts Forgotten': 'Ruine du passé',
        'Pulse Wave': 'Pulsation spirituelle',
        'Revolting Ruin': 'Méga Ruine ravageuse',
        'Shockwave': 'Onde de choc',
        'Starstrafe': 'Fou dansant',
        'Statue Gaze': 'Regard de statue',
        'The Path Of Light': 'Voie de lumière',
        'Thrumming Thunder': 'Méga Foudre fourmillante',
        'Thunder III': 'Méga Foudre',
        'Timely Teleport': 'Téléportation turbulente',
        'Trine': 'Trine',
        'Ultima Upsurge': 'Ultima ulcérante',
        'Ultimate Embrace': 'Étreinte fatidique',
        'Ultima(?! )': 'Ultima',
        'Vitrophyre': 'Vitrophyre',
        'Wave Cannon': 'Canon plasma',
        'Wings Of Destruction': 'Aile de la destruction',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Destroy! Destroy! Destroy! I will destroy it all!': 'Destroy! Destroy! Destroy! I will destroy it all!', // FIXME
        'Graven Image': '神々の像',
        'Kefka': 'ケフカ',
        'Light Of Consecration': '聖別の光',
        'The Mad Head': 'マッドヘッド',
      },
      'replaceText': {
        'Aero Assault': 'ずんずんエアロガ',
        'Aero/Ruin': 'Aero/Ruin', // FIXME
        'All Things Ending': '消滅の脚',
        'Blizzard Blitz': 'ぐるぐるブリザガ',
        'Blizzard III': 'ブリザガ',
        'Celestriad': 'スリースターズ',
        'Explosion': '爆発',
        'Fire III': 'ファイガ',
        'Flagrant Fire': 'めらめらファイガ',
        'Forsaken': 'ミッシング',
        'Future\'s End': '未来の終焉',
        'Futures Numbered': '未来の破滅',
        'Graven Image': '神々の像',
        'Gravitas': '重力弾',
        'Gravitational Wave': '重力波',
        'Half Arena': 'Half Arena', // FIXME
        'Heartless Angel': '心ない天使',
        'Heartless Archangel': '心ない大天使',
        'Holy Ascent': '昇天',
        'Hyperdrive': 'ハイパードライブ',
        'Idyllic Will': '睡魔の神気',
        'Indolent Will': '惰眠の神気',
        'Indomitable Will': '豪腕の神気',
        'Indulgent Will': '聖母の神気',
        'Inexorable Will': '無情の神気',
        'Intemperate Will': '撲殺の神気',
        'Light Of Judgment': '裁きの光',
        'Mana Charge': 'マジックチャージ',
        'Mana Release': 'マジックアウト',
        'Meteor': 'メテオ',
        'Pasts Forgotten': '過去の破滅',
        'Pulse Wave': '波動弾',
        'Revolting Ruin': 'ばりばりルインガ',
        'Shockwave': '衝撃波',
        'Starstrafe': '妖星乱舞',
        'Statue Gaze': 'Statue Gaze', // FIXME
        'The Path Of Light': '光の波動',
        'Thrumming Thunder': 'もりもりサンダガ',
        'Thunder III': 'サンダガ',
        'Timely Teleport': 'ぶっとびテレポ',
        'Trine': 'トライン',
        'Ultima Upsurge': 'どきどきアルテマ',
        'Ultimate Embrace': '終末の双腕',
        'Ultima(?! )': 'アルテマ',
        'Vitrophyre': '岩石弾',
        'Wave Cannon': '波動砲',
        'Wings Of Destruction': '破壊の翼',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Destroy! Destroy! Destroy! I will destroy it all!': 'Destroy! Destroy! Destroy! I will destroy it all!', // FIXME
        'Graven Image': '众神之像',
        'Kefka': '凯夫卡',
        'Light Of Consecration': '祝圣之光',
        'The Mad Head': '妖首',
      },
      'replaceText': {
        'Aero Assault': '疼飕飕暴风',
        'Aero/Ruin': 'Aero/Ruin', // FIXME
        'All Things Ending': '消灭之脚',
        'Blizzard Blitz': '滴溜溜冰封',
        'Blizzard III': '冰封',
        'Celestriad': '三星',
        'Explosion': '爆炸',
        'Fire III': '爆炎',
        'Flagrant Fire': '呼啦啦爆炎',
        'Forsaken': '遗弃末世',
        'Future\'s End': '未来终结',
        'Futures Numbered': '未来破灭',
        'Graven Image': '众神之像',
        'Gravitas': '重力弹',
        'Gravitational Wave': '重力波',
        'Half Arena': 'Half Arena', // FIXME
        'Heartless Angel': '无心天使',
        'Heartless Archangel': '无心大天使',
        'Holy Ascent': '升天',
        'Hyperdrive': '超驱动',
        'Idyllic Will': '睡魔的神气',
        'Indolent Will': '懒惰的神气',
        'Indomitable Will': '强腕的神气',
        'Indulgent Will': '圣母的神气',
        'Inexorable Will': '无情的神气',
        'Intemperate Will': '扑杀的神气',
        'Light Of Judgment': '制裁之光',
        'Mana Charge': '魔法储存',
        'Mana Release': '魔法放出',
        'Meteor': '陨石',
        'Pasts Forgotten': '过去破灭',
        'Pulse Wave': '波动弹',
        'Revolting Ruin': '恶狠狠毁荡',
        'Shockwave': '冲击波',
        'Starstrafe': '妖星乱舞',
        'Statue Gaze': 'Statue Gaze', // FIXME
        'The Path Of Light': '光之波动',
        'Thrumming Thunder': '劈啪啪暴雷',
        'Thunder III': '暴雷',
        'Timely Teleport': '跳蹦蹦传送',
        'Trine': '异三角',
        'Ultima Upsurge': '扑腾腾究极',
        'Ultimate Embrace': '终末双腕',
        'Ultima(?! )': '究极',
        'Vitrophyre': '岩石弹',
        'Wave Cannon': '波动炮',
        'Wings Of Destruction': '破坏之翼',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Destroy! Destroy! Destroy! I will destroy it all!': 'Destroy! Destroy! Destroy! I will destroy it all!', // FIXME
        'Graven Image': '신들의 상',
        'Kefka': '케프카',
        'Light Of Consecration': '정화의 빛',
        'The Mad Head': '광인의 머리',
      },
      'replaceText': {
        'Aero Assault': '갈기갈기 에어로가',
        'Aero/Ruin': 'Aero/Ruin', // FIXME
        'All Things Ending': '소멸의 발차기',
        'Blizzard Blitz': '빙글빙글 블리자가',
        'Blizzard III': '블리자가',
        'Celestriad': '세 개의 별',
        'Explosion': '폭발',
        'Fire III': '파이가',
        'Flagrant Fire': '이글이글 파이가',
        'Forsaken': '행방불명',
        'Future\'s End': '미래의 종언',
        'Futures Numbered': '미래의 파멸',
        'Graven Image': '신들의 상',
        'Gravitas': '중력탄',
        'Gravitational Wave': '중력파',
        'Half Arena': 'Half Arena', // FIXME
        'Heartless Angel': '비정한 천사',
        'Heartless Archangel': '비정한 대천사',
        'Holy Ascent': '승천',
        'Hyperdrive': '하이퍼드라이브',
        'Idyllic Will': '수마의 신기',
        'Indolent Will': '태만의 신기',
        'Indomitable Will': '호완의 신기',
        'Indulgent Will': '성모의 신기',
        'Inexorable Will': '무정의 신기',
        'Intemperate Will': '박살의 신기',
        'Light Of Judgment': '심판의 빛',
        'Mana Charge': '마력 충전',
        'Mana Release': '마력 방출',
        'Meteor': '메테오',
        'Pasts Forgotten': '과거의 파멸',
        'Pulse Wave': '파동탄',
        'Revolting Ruin': '파삭파삭 루인가',
        'Shockwave': '충격파',
        'Starstrafe': '요성난무',
        'Statue Gaze': 'Statue Gaze', // FIXME
        'The Path Of Light': '빛의 파동',
        'Thrumming Thunder': '찌릿찌릿 선더가',
        'Thunder III': '선더가',
        'Timely Teleport': '껑충껑충 텔레포',
        'Trine': '트라인',
        'Ultima Upsurge': '두근두근 알테마',
        'Ultimate Embrace': '종말의 포옹',
        'Ultima(?! )': '알테마',
        'Vitrophyre': '암석탄',
        'Wave Cannon': '파동포',
        'Wings Of Destruction': '파괴의 날개',
      },
    },
  ],
}];
