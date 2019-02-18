'use strict';

// O5S - Sigmascape 1.0 Savage
// localization:
//   de: done
//   fr: missing replaceText, triggers
//   ja: missing replaceText, triggers
[{
  zoneRegex: /Sigmascape V1\.0 \(Savage\)/,
  timelineFile: 'o5s.txt',
  resetWhenOutOfCombat: false,
  triggers: [
    {
      regex: /04:Removing combatant Phantom Train/,
      regexDe: /04:Removing combatant Phantomzug/,
      regexFr: /04:Removing combatant Train Fantôme/,
      regexJa: /04:Removing combatant 魔列車/,
      regexKo: /04:Removing combatant 마열차/,
      run: function(data) {
        data.StopCombat();
      },
    },
    {
      id: 'O5S Doom Strike',
      regex: /14:28B1:Phantom Train starts using Doom Strike on (\y{Name})/,
      regexDe: /14:28B1:Phantomzug starts using Vernichtungsschlag on (\y{Name})/,
      regexFr: /14:28B1:Train Fantôme starts using Frappe Létale on (\y{Name})/,
      regexJa: /14:28B1:魔列車 starts using 魔霊撃 on (\y{Name})/,
      regexKo: /14:28B1:마열차 starts using 마령격 on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tank Buster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ko: '탱버 → 나',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Buster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            ko: '탱버 → ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            ko: '탱버',
          };
        }
      },
    },
    {
      id: 'O5S Head On',
      regex: /14:28A4:Phantom Train starts using Head On/,
      regexDe: /14:28A4:Phantomzug starts using Frontalangriff/,
      regexFr: /14:28A4:Train Fantôme starts using Plein Fouet/,
      regexJa: /14:28A4:魔列車 starts using 追突/,
      regexKo: /14:28A4:마열차 starts using 추돌/,
      alertText: function(data) {
        return {
          en: 'Go to back',
          de: 'Nach hinten laufen',
          fr: 'S\'éloigner',
          ko: '뒤로 이동',
        };
      },
      tts: function(data) {
        return {
          en: 'run away',
          de: 'ab nach hinten',
          fr: 'S\'éloigner',
          ko: '뒤로 이동',
        };
      },
    },
    {
      id: 'O5S Diabolic Headlamp',
      regex: /14:28B2:Phantom Train starts using Diabolic Headlamp/,
      regexDe: /14:28B2:Phantomzug starts using Diabolische Leuchte/,
      regexFr: /14:28B2:Train Fantôme starts using Phare Diabolique/,
      regexJa: /14:28B2:魔列車 starts using 魔界の前照灯/,
      regexKo: /14:28B2:마열차 starts using 마계의 전조등/,
      alertText: function(data) {
        return {
          en: 'Stack middle',
          de: 'Stack in der Mitte',
          fr: 'Stack au milieu',
          ko: '중앙으로 모이기',
        };
      },
    },
    {
      id: 'O5S Diabolic Light',
      regex: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      infoText: function(data) {
        return {
          en: 'Light',
          de: 'Licht',
          fr: 'Lumière',
          ko: '빛장판',
        };
      },
    },
    {
      id: 'O5S Diabolic Wind',
      regex: /1B:........:(\y{Name}):....:....:0046:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      infoText: function(data) {
        return {
          en: 'Wind',
          de: 'Wind',
          fr: 'Vent',
          ko: '초록징',
        };
      },
    },
    {
      id: 'O5S Remorse',
      regex: /Added new combatant Remorse/,
      regexDe: /Added new combatant Melancholischer Geist/,
      regexFr: /Added new combatant Fantôme Mélancolique/,
      regexJa: /Added new combatant 未練のゴースト/,
      regexKo: /Added new combatant 미련이 남은 유령/,
      infoText: function(data) {
        return {
          en: 'Knockback Ghost',
          de: 'Rückstoß Geist',
          fr: 'Fantôme soufflant',
          ko: 'Fantôme soufflant',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Agony': 'Gequälter Geist',
        'Doom Chimney': 'Unheilvoller Schornstein',
        'Phantom Train': 'Phantomzug',
        'Putrid Passenger': 'Fauliger Fahrgast',
        'Wroth Ghost': 'Erzürnter Geist',
        'Remorse': 'Melancholischer Geist',
        'Agony': 'Reuiger Geist',
        'Malice': 'Bösartiger Geist',
        'Engage!': 'Start!',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Enrage': 'Finalangriff',

        'Acid Rain': 'Säureregen',
        'All In The Mind': 'Psychokinese',
        'Diabolic Chimney': 'Diabolischer Schlot',
        'Diabolic Headlamp': 'Diabolische Leuchte',
        'Diabolic Light': 'Diabolisches Licht',
        'Diabolic Whistle': 'Diabolische Pfeife',
        'Diabolic Wind': 'Diabolischer Wind',
        'Doom Strike': 'Vernichtungsschlag',
        'Encumber': 'Wegsperrung',
        'Engage!': 'Start!',
        'Head On': 'Frontalangriff',
        'Possess': 'Besessenheit',
        'Saintly Beam': 'Heiligenstrahl',

        'Crossing Whistle': 'Kreuzend Pfeife',
        'Knockback Whistle': 'Rückstoß Pfeife',
        'Tether Whistle': 'Verfolger Pfeife',
        ' Ghosts': ' Geister',
        'Ghosts spawn': 'Geister erscheinen',

        'Add Wave': 'Add Welle',
      },
      '~effectNames': {
        'Connectivity': 'Kopplung',
        'Prey': 'Markiert',
        'Stun': 'Betäubung',
        'Throttle': 'Erstickung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Agony': 'Fantôme Souffrant',
        'Doom Chimney': 'Cheminée Maléfique',
        'Phantom Train': 'Train Fantôme',
        'Putrid Passenger': 'Passager Putride',
        'Wroth Ghost': 'Fantôme Furieux',
        'Remorse': 'Fantôme Mélancolique',
        'Agony': 'Fantôme Souffrant',
        'Malice': 'Fantôme Rancunier',
        'Engage!': 'À l\'attaque',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Enrage': 'Enrage',

        'Acid Rain': 'Pluie Acide',
        'All In The Mind': 'Force De Volonté',
        'Diabolic Chimney': 'Cheminée Diabolique',
        'Diabolic Headlamp': 'Phare Diabolique',
        'Diabolic Light': 'Lueur Diabolique',
        'Diabolic Whistle': 'Sifflet Diabolique',
        'Diabolic Wind': 'Vent Diabolique',
        'Doom Strike': 'Frappe Létale',
        'Encumber': 'Encombrement',
        'Engage!': 'À l\'attaque',
        'Head On': 'Plein Fouet',
        'Possess': 'Possession',
        'Saintly Beam': 'Faisceaux Sacrés',
        ' Ghosts': ' Fantômes',
        'Crossing Whistle': 'Sifflet traversée',
        'Tether Whistle': 'Sifflet liens',
        'Ghosts spawn': 'Pop des Fantômes',
        'Add Wave': 'Vague d\'Adds',
        'Ghost Beams': 'Faisceaux Sacrés',
      },
      '~effectNames': {
        'Connectivity': 'Attelage',
        'Prey': 'Marquage',
        'Stun': 'Étourdissement',
        'Throttle': 'Suffocation',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Agony': '苦悶のゴースト',
        'Doom Chimney': '魔煙突',
        'Phantom Train': '魔列車',
        'Putrid Passenger': 'ゾンビー・パッセンジャー',
        'Wroth Ghost': 'ロスゴースト',
        'Remorse': '未練のゴースト',
        'Agony': '苦悶のゴースト',
        'Malice': '怨念のゴースト',
      },
      'replaceText': {
        'Acid Rain': '酸性雨',
        'All In The Mind': '念力',
        'Diabolic Chimney': '魔界の噴煙',
        'Diabolic Headlamp': '魔界の前照灯',
        'Diabolic Light': '魔界の光',
        'Diabolic Whistle': '魔界の汽笛',
        'Diabolic Wind': '魔界の風',
        'Doom Strike': '魔霊撃',
        'Encumber': '進路妨害',
        'Engage!': '戦闘開始！',
        'Head On': '追突',
        'Possess': '取り憑く',
        'Saintly Beam': 'セイントビーム',
        // FIXME:
        'Crossing Whistle': 'Crossing Whistle',
        'Knockback Whistle': 'Knockback Whistle',
        'Tether Whistle': 'Tether Whistle',
        ' Ghosts': ' Ghosts',
        'Ghosts spawn': 'Ghosts spawn',
      },
      '~effectNames': {
        'Connectivity': '連結',
        'Prey': 'マーキング',
        'Stun': 'スタン',
        'Throttle': '窒息',
      },
    },
    {
      'locale': 'Ko',
      'replaceSync': {
        'Agony': '고뇌하는 유령',
        'Doom Chimney': '마열차 굴뚝',
        'Phantom Train': '마열차',
        'Putrid Passenger': '좀비 승객',
        'Wroth Ghost': '격노하는 유령',
        'Remorse': '미련이 남은 유령',
        'Agony': '고뇌하는 유령',
        'Malice': '원한 품은 유령',
      },
      'replaceText': {
        '--targetable--': '--대상 지정 가능--',
        '--untargetable--': '--대상 지정 불가--',
        'Acid Rain': '산성비',
        'All In The Mind': '염력',
        'Diabolic Chimney': '마계의 연기',
        'Diabolic Headlamp': '마계의 전조등',
        'Diabolic Light': '마계의 빛',
        'Diabolic Whistle': '마계의 경적',
        'Diabolic Wind': '마계의 바람',
        'Doom Strike': '마령격',
        'Encumber': '진로 방해',
        'Engage!': '전투 시작!',
        'Head On': '추돌',
        'Possess': '빙의',
        'Saintly Beam': '성스러운 광선',

        'Crossing Whistle': '행진 유령',
        'Knockback Whistle': '넉백 유령',
        'Tether Whistle': '추적 유령',
        ' Ghosts': ' 유령',
        'Ghosts spawn': '유령 등장',
      },
      '~effectNames': {
        'Connectivity': '연결',
        'Prey': '징',
        'Stun': '기절',
        'Throttle': '질식',
      },
    },
  ],
}];
