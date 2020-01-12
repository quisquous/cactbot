'use strict';

// The Temple of the Fist
[{
  zoneRegex: /^The Temple Of The Fist$/,
  timelineFile: 'temple_of_the_fist.txt',
  timelineTriggers: [
    {
      id: 'Temple Pounce',
      regex: /Pounce/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      infoText: {
        en: 'Tank buster',
      },
    },
    {
      id: 'Temple Cardinal Shift',
      regex: /Cardinal Shift/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
  ],
  triggers: [
    {
      id: 'Temple Electric Burst Sruti',
      regex: Regexes.startsUsing({ id: '1FD6', source: 'Coeurl Sruti', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1FD6', source: 'Coeurl Sruti', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1FD6', source: 'Coeurl Sruti', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1FD6', source: 'クァール・シュルティ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1FD6', source: '凶豹所闻', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1FD6', source: '커얼 슈루티', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
    {
      id: 'Temple Electric Burst Smriti',
      regex: Regexes.startsUsing({ id: '1FD6', source: 'Coeurl Smriti', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1FD6', source: 'Coeurl Smriti', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1FD6', source: 'Coeurl Smriti', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1FD6', source: 'クァール・スムリティ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1FD6', source: '凶豹所忆', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1FD6', source: '커얼 스므리티', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
    {
      id: 'Temple Fourfold Shear',
      regex: Regexes.startsUsing({ id: '1FD9', source: 'Arbuda' }),
      regexDe: Regexes.startsUsing({ id: '1FD9', source: 'Arbuda' }),
      regexFr: Regexes.startsUsing({ id: '1FD9', source: 'Arbuda' }),
      regexJa: Regexes.startsUsing({ id: '1FD9', source: 'アブダ' }),
      regexCn: Regexes.startsUsing({ id: '1FD9', source: '额部陀' }),
      regexKo: Regexes.startsUsing({ id: '1FD9', source: '아부다' }),
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Tank buster on YOU',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank buster on ' + data.shortName(matches.target),
          };
        }
      },
    },
    {
      id: 'Temple Moonseal',
      regex: Regexes.headMarker({ id: '0059' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Stand in blue',
      },
    },
    {
      id: 'Temple Sunseal',
      regex: Regexes.headMarker({ id: '0058' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Stand in red',
      },
    },
    {
      id: 'Temple Port And Star',
      regex: Regexes.startsUsing({ id: '1FDC', source: 'Arbuda', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1FDC', source: 'Arbuda', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1FDC', source: 'Arbuda', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1FDC', source: 'アブダ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1FDC', source: '额部陀', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1FDC', source: '아부다', capture: false }),
      alertText: {
        en: 'front/back are safe',
        de: 'Vorne/Hinten sicher',
        fr: 'Allez devant ou derrière',
      },
      tts: {
        en: 'go front or back',
        de: 'nach vorn oder hinten',
        fr: 'allez devant ou derrière',
      },
    },
    {
      id: 'Temple Fore And Aft',
      regex: Regexes.startsUsing({ id: '1FDB', source: 'Arbuda', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1FDB', source: 'Arbuda', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1FDB', source: 'Arbuda', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1FDB', source: 'アブダ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1FDB', source: '额部陀', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1FDB', source: '아부다', capture: false }),
      alertText: {
        en: 'sides are safe',
        de: 'Seiten sind sicher',
        fr: 'Allez à gauche ou à droite',
      },
      tts: {
        en: 'go sides',
        de: 'zur Seite',
        fr: 'allez sur les côtés',
      },
    },
    {
      id: 'Temple Killer Instinct',
      regex: Regexes.startsUsing({ id: '1FDE', source: 'Arbuda', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1FDE', source: 'Arbuda', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1FDE', source: 'Arbuda', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1FDE', source: 'アブダ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1FDE', source: '额部陀', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1FDE', source: '아부다', capture: false }),
      alertText: {
        en: 'watch for safe',
        de: 'nach Sicherheit schauen',
        fr: 'trouvez une zone safe',
      },
    },
    {
      id: 'Temple Spirit Wave',
      regex: Regexes.startsUsing({ id: '1FE7', source: 'Ivon Coeurlfist', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1FE7', source: 'Ivon Coeurlfaust', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1FE7', source: 'Ivon Le Coeurl', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1FE7', source: '双豹のイヴォン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1FE7', source: '双豹伊沃恩', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1FE7', source: '쌍표범 이본', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
    {
      id: 'Temple Touch Of Slaughter',
      regex: Regexes.startsUsing({ id: '1FE6', source: 'Ivon Coeurlfist' }),
      regexDe: Regexes.startsUsing({ id: '1FE6', source: 'Ivon Coeurlfaust' }),
      regexFr: Regexes.startsUsing({ id: '1FE6', source: 'Ivon Le Coeurl' }),
      regexJa: Regexes.startsUsing({ id: '1FE6', source: '双豹のイヴォン' }),
      regexCn: Regexes.startsUsing({ id: '1FE6', source: '双豹伊沃恩' }),
      regexKo: Regexes.startsUsing({ id: '1FE6', source: '쌍표범 이본' }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: function(data, matches) {
        return {
          en: 'Heal ' + data.shortName(matches.target) + ' soon',
        };
      },
    },
    {
      id: 'Temple Coeurl Heads',
      regex: Regexes.ability({ id: '1FE9', source: 'Ivon Coeurlfist', capture: false }),
      regexDe: Regexes.ability({ id: '1FE9', source: 'Ivon Coeurlfaust', capture: false }),
      regexFr: Regexes.ability({ id: '1FE9', source: 'Ivon Le Coeurl', capture: false }),
      regexJa: Regexes.ability({ id: '1FE9', source: '双豹のイヴォン', capture: false }),
      regexCn: Regexes.ability({ id: '1FE9', source: '双豹伊沃恩', capture: false }),
      regexKo: Regexes.ability({ id: '1FE9', source: '쌍표범 이본', capture: false }),
      infoText: {
        en: 'Avoid floating heads',
      },
    },
    {
      id: 'Temple Rhalgr\'s Piece',
      regex: Regexes.startsUsing({ id: '1FED', source: 'Ivon Coeurlfist', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1FED', source: 'Ivon Coeurlfaust', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1FED', source: 'Ivon Le Coeurl', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1FED', source: '双豹のイヴォン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1FED', source: '双豹伊沃恩', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1FED', source: '쌍표범 이본', capture: false }),
      infoText: {
        en: 'Away from marker',
      },
    },
    {
      id: 'Temple Rose Of Destruction',
      regex: Regexes.startsUsing({ id: '1FEE', source: 'Ivon Coeurlfist' }),
      regexDe: Regexes.startsUsing({ id: '1FEE', source: 'Ivon Coeurlfaust' }),
      regexFr: Regexes.startsUsing({ id: '1FEE', source: 'Ivon Le Coeurl' }),
      regexJa: Regexes.startsUsing({ id: '1FEE', source: '双豹のイヴォン' }),
      regexCn: Regexes.startsUsing({ id: '1FEE', source: '双豹伊沃恩' }),
      regexKo: Regexes.startsUsing({ id: '1FEE', source: '쌍표범 이본' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Stack marker on YOU',
          };
        }
        return {
          en: 'Stack on ' +data.shortName(matches.target),
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Coeurl Sruti': 'Coeurl Sruti',
        'Coeurl Smriti': 'Coeurl Smriti',
        'Arbuda': 'Arbuda',
        'Ivon Coeurlfist': 'Ivon Coeurlfaust',
      },
      'replaceText': {
        'Pounce': 'Raubtiertatze',
        'Radial Blaster': 'Radial-Blaster',
        'Wide Blaster': 'Weitwinkel-Blaster',
        'Electric Burst': 'Stromstoß',
        'Heat Lightning': 'Hitzeblitz',
        'Basic Instinct': 'Kampfinstinkt',

        'Cardinal Shift': 'Großrotation',
        'Fourfold Shear': 'Vierschere',
        'Killer Instinct': 'Vorausahnung',
        'Hellseal': 'Höllensiegel',
        'Tapas': 'Kasteiung',

        'Spirit Wave': 'Mentale Welle',
        'Hurricane Kick': 'Hurrikan-Tritt',
        'Touch of Slaughter': 'Hauch des Gemetzels',
        'Coeurl Whisper': 'Coeurl-Flüstern',
        'Silent Roar': 'Stilles Brüllen',
        'Rhalgr\'s Piece': 'Gewalt Des Zerstörers',
        'The Rose Of Destruction': 'Zermalmender Geist',
        'Furious Fists': 'Todeskralle',
        'Impact': 'Einschlag',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Coeurl Sruti': 'Coeurl Sruti',
        'Coeurl Smriti': 'Coeurl Smriti',
        'Arbuda': 'Arbuda',
        'Ivon Coeurlfist': 'Ivon Le Coeurl',
      },
      'replaceText': {
        'Pounce': 'Attaque Subite',
        'Radial Blaster': 'Fulguration Radiale',
        'Wide Blaster': 'Fulguration Large',
        'Basic Instinct': 'Instinct Profond',
        'Electric Burst': 'Salve électrique',
        'Heat Lightning': 'Éclair De Chaleur',

        'Cardinal Shift': 'Rotation Cardinale',
        'Fourfold Shear': 'Quadruple Cisaille',
        'Killer Instinct': 'Instinct Meurtrier',
        'Hellseal': 'Sceau Infernal',
        'Tapas': 'Tapas',

        'Spirit Wave': 'Onde Spirituelle',
        'Hurricane Kick': 'Coup De Pied Ouragan',
        'Touch of Slaughter': 'Toucher massacreur',
        'Coeurl Whisper': 'Murmure du Coeurl',
        'Silent Roar': 'Hurlement Silencieux',
        'Rhalgr\'s Piece': 'Force De Rhalgr',
        'The Rose Of Destruction': 'Rose de la destruction',
        'Furious Fists': 'Poings Furieux',
        'Impact': 'Impact',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Coeurl Sruti': 'クァール・シュルティ',
        'Coeurl Smriti': 'クァール・スムリティ',
        'Arbuda': 'アブダ',
        'Ivon Coeurlfist': '双豹のイヴォン',
      },
      'replaceText': {
        'Pounce': 'パウンス',
        'Radial Blaster': 'ラディアルブラスター',
        'Wide Blaster': 'ワイドブラスター',
        'Basic Instinct': '闘争本能',
        'Electric Burst': 'エレクトリックバースト',
        'Heat Lightning': 'ヒートライトニング',

        'Cardinal Shift': '四剣大回転',
        'Fourfold Shear': '四連双斬',
        'Killer Instinct': '見切り',
        'Hellseal': '試練の刻印',
        'Tapas': '苦苔',

        'Spirit Wave': '真霊波',
        'Hurricane Kick': '霊魂旋風脚',
        'Touch of Slaughter': '霊魂秘孔拳',
        'Coeurl Whisper': '双豹招来',
        'Silent Roar': '双豹撃',
        'Rhalgr\'s Piece': '壊神拳',
        'The Rose Of Destruction': '闘霊弾',
        'Furious Fists': '双豹蒼連撃',
        'Impact': 'ラールガーズインパクト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Coeurl Sruti': '凶豹所闻',
        'Coeurl Smriti': '凶豹所忆',
        'Arbuda': '额部陀',
        'Ivon Coeurlfist': '双豹伊沃恩',
      },
      'replaceText': {
        'Pounce': '爪袭',
        'Radial Blaster': '放射冲击波',
        'Wide Blaster': '广域冲击波',
        'Basic Instinct': '斗争本能',
        'Electric Burst': '电光爆发',
        'Heat Lightning': '惊电',

        'Cardinal Shift': '四剑大回旋',
        'Fourfold Shear': '四连双斩',
        'Killer Instinct': '预判',
        'Hellseal': '试炼刻印',
        'Tapas': '苦苔',

        'Spirit Wave': '真灵波',
        'Hurricane Kick': '灵魂旋风脚',
        'Touch of Slaughter': '灵魂秘孔拳',
        'Coeurl Whisper': '双豹招来',
        'Silent Roar': '双豹击',
        'Rhalgr\'s Piece': '破坏神拳',
        // FIXME This didn't show up when using translate_fight
        'The Rose Of Destruction': 'The Rose Of Destruction',
        'Furious Fists': '双豹苍连击',
        'Impact': '拉尔戈冲击',
      },
    },
  ],
}];
