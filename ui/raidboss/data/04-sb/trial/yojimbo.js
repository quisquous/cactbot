'use strict';

[{
  zoneRegex: /^Kugane Ohashi$/,
  timelineFile: 'yojimbo.txt',
  triggers: [
    {
      id: 'Yojimbo Giga Jump',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alertText: {
        en: 'Run Marker Away',
        de: 'Mit Marker weglaufen',
      },
    },
    {
      id: 'Yojimbo Dorito',
      regex: Regexes.headMarker({ id: '0037' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alertText: {
        en: 'Dorito Stack',
        de: 'Stacken',
        fr: 'Packez-vous',
      },
    },
    {
      id: 'Yojimbo Gekko',
      regex: Regexes.headMarker({ id: '0090' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      infoText: {
        en: 'Gekko Marker',
        de: 'Gekko Marker',
      },
    },
    {
      id: 'Yojimbo Enchain',
      regex: Regexes.headMarker({ id: '0005' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alarmText: {
        en: 'GTFO',
        de: 'WEG!',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Electrogenetic Force': 'Elektro-Kraft',
        'Embodiment': 'Gilgamesch-Doppelgänger',
        'Gilgamesh': 'Gilgamesch',
        'Inoshikacho': 'Ino-shika-cho',
        'Yojimbo': 'Yojinbo',
      },
      'replaceText': {
        '--Reset--': '--Reset--',
        '--sync--': '--sync--',
        'A Giant Me': 'A Giant Me', // FIXME
        'Ame-no-Murakamo': 'Ame-no-Murakamo', // FIXME
        'Bitter End': 'Klingenschimmer',
        'Dragon Night': 'Drachennacht',
        'Dragon\'s Lair': 'Drachenhort',
        'Electrogenetic Force': 'Elektro-Kraft',
        'Enchain': 'Fesseln',
        'Epic Stormsplitter': 'Fließende Welt',
        'Gekko': 'Gekko',
        'Giga Jump': 'Giga-Sprung',
        'Hell\'s Gate': 'Hell\'s Gate', // FIXME
        'Inoshikacho': 'Ino-shika-cho',
        'Kasha': 'Kasha',
        'Masamune': 'Masamune',
        'Metta-giri': 'Metta-giri',
        'Tiny Song': 'Liliputlied',
        'Unveiling': 'Enthüllung',
        'Wakizashi': 'Wakizashi',
        'Yukikaze': 'Yukikaze',
        'Zanma Zanmai': 'Zanma-zanmai',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Electrogenetic Force': 'Force électrogénétique',
        'Embodiment': 'double de Gilgamesh',
        'Gilgamesh': 'Gilgamesh',
        'Inoshikacho': 'Ino-shika-cho',
        'Yojimbo': 'Yojimbo',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        'A Giant Me': 'A Giant Me', // FIXME
        'Ame-no-Murakamo': 'Ame-no-Murakamo', // FIXME
        'Bitter End': 'Éradication',
        'Dragon Night': 'Nuit du dragon',
        'Dragon\'s Lair': 'Fléau du dragon',
        'Electrogenetic Force': 'Force électrogénétique',
        'Enchain': 'Garrotage',
        'Epic Stormsplitter': 'Monde flottant',
        'Gekko': 'Gekkô',
        'Giga Jump': 'Giga saut',
        'Hell\'s Gate': 'Hell\'s Gate', // FIXME
        'Inoshikacho': 'Ino-shika-cho',
        'Kasha': 'Kasha',
        'Masamune': 'Masamune',
        'Metta-giri': 'Metta-giri',
        'Tiny Song': 'Air lilliputien',
        'Unveiling': 'Dévoilement',
        'Wakizashi': 'Wakizashi',
        'Yukikaze': 'Yukikaze',
        'Zanma Zanmai': 'Zanma zanmai',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Electrogenetic Force': '電撃',
        'Embodiment': 'ギルガメッシュの分身',
        'Gilgamesh': 'ギルガメッシュ',
        'Inoshikacho': '猪鹿蝶',
        'Yojimbo': 'ヨウジンボウ',
      },
      'replaceText': {
        '--Reset--': '--Reset--',
        '--sync--': '--sync--',
        'A Giant Me': 'A Giant Me', // FIXME
        'Ame-no-Murakamo': 'Ame-no-Murakamo', // FIXME
        'Bitter End': 'ヒット・ジ・エンド',
        'Dragon Night': '竜星撃',
        'Dragon\'s Lair': '雲蒸竜変',
        'Electrogenetic Force': '電撃',
        'Enchain': '大捕物',
        'Epic Stormsplitter': '我流海嵐斬',
        'Gekko': '月光',
        'Giga Jump': 'ギガジャンプ',
        'Hell\'s Gate': 'Hell\'s Gate', // FIXME
        'Inoshikacho': '猪鹿蝶',
        'Kasha': '花車',
        'Masamune': 'マサムネ',
        'Metta-giri': '居合滅多斬り',
        'Tiny Song': '小さなメロディ',
        'Unveiling': '真ギルガメッシュチェンジ',
        'Wakizashi': '脇差',
        'Yukikaze': '雪風',
        'Zanma Zanmai': '斬魔三昧',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Electrogenetic Force': '电击',
        'Embodiment': '吉尔伽美什的分身',
        'Gilgamesh': '吉尔伽美什',
        'Inoshikacho': '猪鹿蝶',
        'Yojimbo': '保镖',
      },
      'replaceText': {
        '--Reset--': '--Reset--', // FIXME
        '--sync--': '--sync--', // FIXME
        'A Giant Me': 'A Giant Me', // FIXME
        'Ame-no-Murakamo': 'Ame-no-Murakamo', // FIXME
        'Bitter End': '命尽于此',
        'Dragon Night': '龙星击',
        'Dragon\'s Lair': '云蒸龙变',
        'Electrogenetic Force': '电击',
        'Enchain': '捕获',
        'Epic Stormsplitter': '我流破浪斩',
        'Gekko': '月光',
        'Giga Jump': '十亿跳跃',
        'Hell\'s Gate': 'Hell\'s Gate', // FIXME
        'Inoshikacho': '猪鹿蝶',
        'Kasha': '花车',
        'Masamune': '正宗',
        'Metta-giri': '居合多段斩',
        'Tiny Song': '缩小旋律',
        'Unveiling': '显露原形',
        'Wakizashi': '腰刀',
        'Yukikaze': '雪风',
        'Zanma Zanmai': '斩魔三昧',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Electrogenetic Force': '전류',
        'Embodiment': '길가메시의 분신',
        'Gilgamesh': '길가메시',
        'Inoshikacho': '멧돼지사슴나비',
        'Yojimbo': '요우진보',
      },
      'replaceText': {
        '--Reset--': '--Reset--', // FIXME
        '--sync--': '--sync--', // FIXME
        'A Giant Me': 'A Giant Me', // FIXME
        'Ame-no-Murakamo': 'Ame-no-Murakamo', // FIXME
        'Bitter End': '끝장타',
        'Dragon Night': '용성격',
        'Dragon\'s Lair': '운증용변',
        'Electrogenetic Force': '전류',
        'Enchain': '사슬 묶기',
        'Epic Stormsplitter': '아류해풍참',
        'Gekko': '월광',
        'Giga Jump': '기가 점프',
        'Hell\'s Gate': 'Hell\'s Gate', // FIXME
        'Inoshikacho': '멧돼지사슴나비',
        'Kasha': '화차',
        'Masamune': '마사무네',
        'Metta-giri': '거합 마구베기',
        'Tiny Song': '작은 멜로디',
        'Unveiling': '진 길가메시 변신',
        'Wakizashi': '소도',
        'Yukikaze': '설풍',
        'Zanma Zanmai': '참마삼매',
      },
    },
  ],
}];
