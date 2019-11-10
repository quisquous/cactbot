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
      regex: / 14:1FD6:Coeurl Sruti starts using Electric Burst/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
    {
      id: 'Temple Electric Burst Smriti',
      regex: / 14:1FD6:Coeurl Smriti starts using Electric Burst/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
    {
      id: 'Temple Fourfold Shear',
      regex: / 14:1FD9:Arbuda starts using Fourfold Shear on (\y{Name})/,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Tank buster on YOU',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank buster on ' +data.shortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Temple Moonseal',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0059:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Stand in blue',
      },
    },
    {
      id: 'Temple Sunseal',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0058:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Stand in red',
      },
    },
    {
      id: 'Temple Port And Star',
      regex: / 14:1FDC:Arbuda starts using Port And Star/,
      regexDe: / 14:1FDC:Arbuda starts using Links & Rechts/,
      regexFr: / 14:1FDC:Arbuda starts using Gauche Et Droite/,
      regexJa: / 14:1FDC:アブダ starts using 左右双斬/,
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
      regex: / 14:1FDB:Arbuda starts using Fore And Aft/,
      regexDe: / 14:1FDB:Arbuda starts using Vor & Zurück/,
      regexFr: / 14:1FDB:Arbuda starts using Devant Et Derrière/,
      regexJa: / 14:1FDB:アブダ starts using 前後双斬/,
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
      regex: / 14:1FDE:Arbuda starts using Killer Instinct/,
      regexDe: / 14:1FDE:Arbuda starts using Vorausahnung/,
      regexFr: / 14:1FDE:Arbuda starts using Instinct Meurtrier/,
      regexJa: / 14:1FDE:アブダ starts using 見切り/,
      alertText: {
        en: 'watch for safe',
        de: 'nach Sicherheit schauen',
        fr: 'trouvez une zone safe',
      },
    },
    {
      id: 'Temple Spirit Wave',
      regex: / 14:1FE7:Ivon Coeurlfist starts using Spirit Wave/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
    {
      id: 'Temple Touch Of Slaughter',
      regex: / 14:1FE6:Ivon Coeurlfist starts using Touch Of Slaughter on (\y{Name})/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: function(data, matches) {
        return {
          en: 'Heal ' + data.shortName(matches[1]) + ' soon',
        };
      },
    },
    {
      id: 'Temple Coeurl Heads',
      regex: / 15:\y{ObjectId}:Ivon Coeurlfist:1FE9:Coeurl Whisper:/,
      infoText: {
        en: 'Avoid floating heads',
      },
    },
    {
      id: 'Temple Rhalgr\'s Piece',
      regex: / 14:1FED:Ivon Coeurlfist starts using Rhalgr's Piece/,
      infoText: {
        en: 'Away from marker',
      },
    },
    {
      id: 'Temple Rose Of Destruction',
      regex: / 14:1FEE:Ivon Coeurlfist starts using The Rose Of Destruction on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Stack marker on YOU',
          };
        }
        return {
          en: 'Stack on ' +data.shortName(matches[1]),
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
