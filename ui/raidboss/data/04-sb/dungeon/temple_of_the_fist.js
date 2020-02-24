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
        fr: 'Tank buster',
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
        fr: 'Dégâts de zone',
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
        fr: 'Dégâts de zone',
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
        fr: 'Dégâts de zone',
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
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank buster on ' + data.shortName(matches.target),
            fr: 'Tankbuster sur ' + data.shortName(matches.target),
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
        fr: 'Allez dans le bleu',
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
        fr: 'Allez dans le rouge',
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
        fr: 'Dégâts de zone',
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
          fr: 'Soignez ' + data.shortName(matches.target) + ' bientôt',
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
        fr: 'Evitez les têtes',
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
        fr: 'Loin de la marque',
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
            fr: 'Package sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + data.shortName(matches.target),
          fr: 'Package sur ' + data.shortName(matches.target),
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Arbuda': 'Arbuda',
        'Coeurl Smriti': 'Coeurl Smriti',
        'Coeurl Sruti': 'Coeurl Sruti',
        'Guidance': 'Unterweisung',
        'Harmony': 'Harmonie',
        'Ivon Coeurlfist': 'Ivon Coeurlfaust',
        'Tourmaline Pond': 'Turmalinteich',
      },
      'replaceText': {
        '--Smriti Appears--': '--Smriti Appears--', // FIXME
        'Basic Instinct': 'Kampfinstinkt',
        'Cardinal Shift': 'Großrotation',
        'Coeurl Whisper': 'Coeurl-Flüstern',
        'Electric Burst': 'Stromstoß',
        'Fourfold Shear': 'Vierschere',
        'Front/Back\\?Sides\\?': 'Front/Back?Sides?', // FIXME
        'Furious Fists': 'Todeskralle',
        'Heat Lightning': 'Hitzeblitz',
        'Hellseal': 'Höllensiegel',
        'Hurricane Kick': 'Hurrikan-Tritt',
        'Impact': 'Impakt',
        'Killer Instinct': 'Vorausahnung',
        'Pounce': 'Raubtiertatze',
        'Radial Blaster': 'Radial-Blaster',
        'Rhalgr\'s Piece': 'Gewalt des Zerstörers',
        'Silent Roar': 'Stilles Brüllen',
        'Spirit Wave': 'Mentale Welle',
        'Tapas': 'Kasteiung',
        'The Rose Of Destruction': 'Zermalmender Geist',
        'Touch of Slaughter': 'Hauch des Gemetzels',
        'Wide Blaster': 'Weitwinkel-Blaster',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Arbuda': 'Arbuda',
        'Coeurl Smriti': 'Coeurl smriti',
        'Coeurl Sruti': 'Coeurl sruti',
        'Guidance': 'la Conduite',
        'Harmony': 'l\'Harmonie',
        'Ivon Coeurlfist': 'Ivon le Coeurl',
        'Tourmaline Pond': 'l\'étang de Tourmaline',
      },
      'replaceText': {
        '--Smriti Appears--': '-- Apparition de Smriti --',
        'Basic Instinct': 'Instinct profond',
        'Cardinal Shift': 'Rotation cardinale',
        'Coeurl Whisper': 'Murmure du Coeurl',
        'Electric Burst': 'Salve électrique',
        'Fourfold Shear': 'Quadruple cisaille',
        'Front/Back\\?Sides\\?': 'Devant/Derrière\\?Côtés\\?',
        'Furious Fists': 'Poings furieux',
        'Heat Lightning': 'Éclair de chaleur',
        'Hellseal': 'Sceau infernal',
        'Hurricane Kick': 'Coup de pied ouragan',
        'Impact': 'Impact',
        'Killer Instinct': 'Instinct meurtrier',
        'Pounce': 'Attaque subite',
        'Radial Blaster': 'Fulguration radiale',
        'Rhalgr\'s Piece': 'Force de Rhalgr',
        'Silent Roar': 'Hurlement silencieux',
        'Spirit Wave': 'Onde spirituelle',
        'Tapas': 'Tapas',
        'The Rose Of Destruction': 'Rose de la destruction',
        'Touch of Slaughter': 'Toucher massacreur',
        'Wide Blaster': 'Fulguration large',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Arbuda': 'アブダ',
        'Coeurl Smriti': 'クァール・スムリティ',
        'Coeurl Sruti': 'クァール・シュルティ',
        'Ivon Coeurlfist': '双豹のイヴォン',
      },
      'replaceText': {
        '--Smriti Appears--': '--Smriti Appears--', // FIXME
        'Basic Instinct': '闘争本能',
        'Cardinal Shift': '四剣大回転',
        'Coeurl Whisper': '双豹招来',
        'Electric Burst': 'エレクトリックバースト',
        'Fourfold Shear': '四連双斬',
        'Front/Back\\?Sides\\?': 'Front/Back?Sides?', // FIXME
        'Furious Fists': '双豹蒼連撃',
        'Heat Lightning': 'ヒートライトニング',
        'Hellseal': '試練の刻印',
        'Hurricane Kick': '霊魂旋風脚',
        'Impact': 'インパクト',
        'Killer Instinct': '見切り',
        'Pounce': 'パウンス',
        'Radial Blaster': 'ラディアルブラスター',
        'Rhalgr\'s Piece': '壊神拳',
        'Silent Roar': '双豹撃',
        'Spirit Wave': '真霊波',
        'Tapas': '苦行',
        'The Rose Of Destruction': '闘霊弾',
        'Touch of Slaughter': '霊魂秘孔拳',
        'Wide Blaster': 'ワイドブラスター',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Arbuda': '额部陀',
        'Coeurl Smriti': '凶豹所忆',
        'Coeurl Sruti': '凶豹所闻',
        'Ivon Coeurlfist': '双豹伊沃恩',
      },
      'replaceText': {
        '--Smriti Appears--': '--Smriti Appears--', // FIXME
        'Basic Instinct': '斗争本能',
        'Cardinal Shift': '四剑大回旋',
        'Coeurl Whisper': '双豹招来',
        'Electric Burst': '电光爆发',
        'Fourfold Shear': '四连双斩',
        'Front/Back\\?Sides\\?': 'Front/Back?Sides?', // FIXME
        'Furious Fists': '双豹苍连击',
        'Heat Lightning': '惊电',
        'Hellseal': '试炼刻印',
        'Hurricane Kick': '灵魂旋风脚',
        'Impact': '冲击',
        'Killer Instinct': '预判',
        'Pounce': '爪袭',
        'Radial Blaster': '放射冲击波',
        'Rhalgr\'s Piece': '破坏神拳',
        'Silent Roar': '双豹击',
        'Spirit Wave': '真灵波',
        'Tapas': '苦行',
        'The Rose Of Destruction': '斗灵弹',
        'Touch of Slaughter': '灵魂秘孔拳',
        'Wide Blaster': '广域冲击波',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Arbuda': '아부다',
        'Coeurl Smriti': '커얼 스므리티',
        'Coeurl Sruti': '커얼 슈루티',
        'Ivon Coeurlfist': '쌍표범 이본',
      },
      'replaceText': {
        '--Smriti Appears--': '--Smriti Appears--', // FIXME
        'Basic Instinct': '투쟁 본능',
        'Cardinal Shift': '사중 대회전',
        'Coeurl Whisper': '쌍표범 소환',
        'Electric Burst': '전하 폭발',
        'Fourfold Shear': '사연속 베기',
        'Front/Back\\?Sides\\?': 'Front/Back?Sides?', // FIXME
        'Furious Fists': '쌍표창연격',
        'Heat Lightning': '뜨거운 번개',
        'Hellseal': '시련의 각인',
        'Hurricane Kick': '영혼의 선풍각',
        'Impact': '임팩트',
        'Killer Instinct': '간파',
        'Pounce': '덮치기',
        'Radial Blaster': '방사형 블래스터',
        'Rhalgr\'s Piece': '파신권',
        'Silent Roar': '쌍표격',
        'Spirit Wave': '진령파',
        'Tapas': '고행',
        'The Rose Of Destruction': '투령탄',
        'Touch of Slaughter': '영혼의 혈도 찌르기',
        'Wide Blaster': '광범위 블래스터',
      },
    },
  ],
}];
