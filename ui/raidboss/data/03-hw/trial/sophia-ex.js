'use strict';

[{
  zoneRegex: {
    en: /^Containment Bay P1T6 \(Extreme\)$/,
    cn: /^索菲娅歼殛战$/,
  },
  timelineFile: 'sophia-ex.txt',
  triggers: [
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aion Teleos': 'Aion Teleos',
        'Barbelo': 'Barbelo',
        'Sophia': 'Sophia',
        'The First Demiurge': 'Erst(?:e|er|es|en) Demiurg',
        'The Second Demiurge': 'Zweit(?:e|er|es|en) Demiurg',
        'The Third Demiurge': 'Dritt(?:e|er|es|en) Demiurg',
      },
      'replaceText': {
        '--adds spawn--': '--adds spawn--',
        '--clones appear--': '--klone erscheinen--',
        'Aero III': 'Windga',
        'Arms of Wisdom': 'Arme der Weisheit',
        'Cintamani': 'Chintamani',
        'Cloudy Heavens': 'Nebulöse Himmel',
        'Dischordant Cleansing': 'Dissonante Buße',
        'Divine Spark': 'Göttlicher Funke',
        'Duplicate': 'Duplizieren',
        'Execute': 'Exekutieren',
        'Gnosis': 'Gnosis',
        'Gnostic Rant': 'Gnostischer Gegenlauf',
        'Gnostic Spear': 'Gnostischer Speer',
        'Horizontal Kenoma': 'Horizontales Kenoma',
        'Infusion': 'Schneisenschläger',
        'Light Dew': 'Lichttau',
        'Onrush': 'Heranstürmen',
        'Quasar': 'Quasar',
        'Ring of Pain': 'Ring des Schmerzes',
        'The Scales Of Wisdom': 'Waage der Weisheit',
        'Thunder II\\/III': 'Blitzra/Blitzga',
        'Thunder II(?!(?:I|\\/))': 'Blitzra',
        'Thunder III': 'Blitzga',
        'Vertical Kenoma': 'Vertikales Kenoma',
        'Zombification': 'Zombie',
      },
      '~effectNames': {
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aion Teleos': 'Aion Teleos',
        'Barbelo': 'Barbelo',
        'Sophia': 'Sophia',
        'The First Demiurge': 'Premier Démiurge',
        'The Second Demiurge': 'Second Démiurge',
        'The Third Demiurge': 'Troisième Démiurge',
      },
      'replaceText': {
        '--adds spawn--': '--adds spawn--',
        '--clones appear--': '--apparition des clones--',
        'Aero III': 'Méga Vent',
        'Arms of Wisdom': 'Bras de la sagesse',
        'Cintamani': 'Chintamani',
        'Cloudy Heavens': 'Ciel nébuleux',
        'Dischordant Cleansing': 'Purification Discordante',
        'Divine Spark': 'Étincelle divine',
        'Duplicate': 'Duplication',
        'Execute': 'Exécution',
        'Gnosis': 'Gnose',
        'Gnostic Rant': 'Diatribe gnostique',
        'Gnostic Spear': 'Épieu Gnostique',
        'Horizontal Kenoma': 'Kenoma horizontal',
        'Infusion': 'Infusion',
        'Light Dew': 'Rosée De Lumière',
        'Onrush': 'Charge',
        'Quasar': 'Quasar',
        'Ring of Pain': 'Anneau de douleur',
        'The Scales Of Wisdom': 'Balance de la sagesse',
        'Thunder II\\/III': 'Extra Foudre/Mega Foudre',
        'Thunder II(?!(?:I|\\/))': 'Extra Foudre',
        'Thunder III': 'Méga Foudre',
        'Vertical Kenoma': 'Kenoma Vertical',
        'Zombification': 'Zombification',
      },
      '~effectNames': {
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aion Teleos': 'Aion Teleos',
        'Barbelo': 'バルベロ',
        'Sophia': 'ソフィア',
        'The First Demiurge': '一の従者',
        'The Second Demiurge': '二の従者',
        'The Third Demiurge': '三の従者',
      },
      'replaceText': {
        '--adds spawn--': '--adds spawn--',
        '--clones appear--': '--幻影が現れる--',
        'Aero III': 'エアロガ',
        'Arms of Wisdom': 'ウィズダムアームズ',
        'Cintamani': 'チンターマニ',
        'Cloudy Heavens': 'クラウディヘヴン',
        'Dischordant Cleansing': '不調和の罰',
        'Divine Spark': '熱いまなざし',
        'Duplicate': 'デュプリケイト',
        'Execute': 'エクセキュート',
        'Gnosis': 'グノーシス',
        'Gnostic Rant': '魔槍乱舞',
        'Gnostic Spear': '魔槍突き',
        'Horizontal Kenoma': '側面堅守',
        'Infusion': '猛突進',
        'Light Dew': 'ライトデュー',
        'Onrush': 'オンラッシュ',
        'Quasar': 'クエーサー',
        'Ring of Pain': 'リング・オブ・ペイン',
        'The Scales Of Wisdom': 'バランス・オブ・ウィズダム',
        'Thunder II\\/III': 'サンダー/サンダガ',
        'Thunder II(?!(?:I|\\/))': 'サンダラ',
        'Thunder III': 'サンダガ',
        'Vertical Kenoma': '前後堅守',
        'Zombification': 'ゾンビー',
      },
      '~effectNames': {
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Aion Teleos': '移涌',
        'Barbelo': '芭碧萝',
        'Sophia': '索菲娅',
        'The First Demiurge': '信徒其一',
        'The Second Demiurge': '信徒其二',
        'The Third Demiurge': '信徒其三',
      },
      'replaceText': {
        '--adds spawn--': '--adds spawn--',
        '--clones appear--': '--clones appear--',
        'Aero III': '暴风',
        'Arms of Wisdom': '睿智之秤',
        'Cintamani': '如意宝珠',
        'Cloudy Heavens': '阴云天堂',
        'Dischordant Cleansing': '不平衡之罚',
        'Divine Spark': '灼热视线',
        'Duplicate': '复制',
        'Execute': '处决',
        'Gnosis': '灵知',
        'Gnostic Rant': '魔枪乱舞',
        'Gnostic Spear': '魔枪突刺',
        'Horizontal Kenoma': '侧面坚守',
        'Infusion': '猛突进',
        'Light Dew': '光露',
        'Onrush': '突袭',
        'Quasar': '类星体',
        'Ring of Pain': '痛苦环刺',
        'The Scales Of Wisdom': '睿智之天平',
        'Thunder II\\/III': '震雷/暴雷',
        'Thunder II(?!(?:I|\\/))': '震雷',
        'Thunder III': '暴雷',
        'Vertical Kenoma': '前后坚守',
        'Zombification': '僵尸',
      },
      '~effectNames': {
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aion Teleos': '아이온 소피아',
        'Barbelo': '바르벨로',
        'Sophia': '소피아',
        'The First Demiurge': '제1신도',
        'The Second Demiurge': '제2신도',
        'The Third Demiurge': '제3신도',
      },
      'replaceText': {
        '--adds spawn--': '--adds spawn--',
        '--clones appear--': '--clones appear--',
        'Aero III': '에어로가',
        'Arms of Wisdom': '지혜의 무기',
        'Cintamani': '친타마니',
        'Cloudy Heavens': '흐린 낙원',
        'Dischordant Cleansing': '부조화의 벌',
        'Divine Spark': '뜨거운 시선',
        'Duplicate': '복제',
        'Execute': '이행',
        'Gnosis': '영적 지혜',
        'Gnostic Rant': '마창 난무',
        'Gnostic Spear': '마창 찌르기',
        'Horizontal Kenoma': '측면 견제',
        'Infusion': '맹돌진',
        'Light Dew': '빛의 이슬',
        'Onrush': '돌진',
        'Quasar': '퀘이사',
        'Ring Of Pain': '고통의 소용돌이',
        'The Scales Of Wisdom': '지혜의 저울',
        'Thunder II\\/III': '선더라/선더가',
        'Thunder II(?!(?:I|\\/))': '선더라',
        'Thunder III': '선더가',
        'Vertical Kenoma': '앞뒤 견제',
        'Zombification': '좀비',
      },
      '~effectNames': {
      },
    },
  ],
}];
