'use strict';

// O5N - Sigmascape 1.0 Normal
[{
  zoneRegex: /^(Sigmascape \(V1\.0\)|Sigmascape V1\.0)$/,
  timelineFile: 'o5n.txt',
  resetWhenOutOfCombat: false,
  triggers: [
    {
      regex: /04:Removing combatant Phantom Train/,
      regexDe: /04:Removing combatant Phantomzug/,
      regexFr: /04:Removing combatant Train Fantôme/,
      run: function(data) {
        data.StopCombat();
      },
    },

    {
      id: 'O5N Doom Strike',
      regex: /14:28A3:Phantom Train starts using Doom Strike on (\y{Name})/,
      regexDe: /14:28A3:Phantomzug starts using Vernichtungsschlag on (\y{Name})/,
      regexFr: /14:28A3:Train Fantôme starts using Frappe Létale on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tank Buster auf DIR',
            fr: 'Tank Buster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Buster auf ' + data.ShortName(matches[1]),
            fr: 'Buster sur ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'tenkbasta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'O5N Head On',
      regex: /14:28A4:Phantom Train starts using Head On/,
      regexDe: /14:28A4:Phantomzug starts using Frontalangriff/,
      regexFr: /14:28A4:Train Fantôme starts using Plein Fouet/,
      alertText: {
        en: 'Go to back',
        de: 'Nach hinten laufen',
        fr: 'S\'éloigner',
      },
      tts: {
        en: 'run away',
        de: 'ab nach hinten',
        fr: 's\'éloigner',
      },
    },
    {
      id: 'O5N Diabolic Headlamp',
      regex: /14:28A6:Phantom Train starts using Diabolic Headlamp/,
      regexDe: /14:28A6:Phantomzug starts using Diabolische Leuchte/,
      regexFr: /14:28A6:Train Fantôme starts using Phare Diabolique/,
      alertText: {
        en: 'Stack middle',
        de: 'Stack in der Mitte',
        fr: 'Stack au milieu',
      },
    },
    {
      id: 'O5N Diabolic Light',
      regex: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      infoText: {
        en: 'Light',
        de: 'Licht',
        fr: 'Lumière',
      },
    },
    {
      id: 'O5N Diabolic Wind',
      regex: /1B:........:(\y{Name}):....:....:0046:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      infoText: {
        en: 'Wind',
        de: 'Wind',
        fr: 'Vent',
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
        'Tether Whistle': 'Verfolger Pfeife',
        'Ghosts': 'Geister',

        'Add Wave': 'Add Welle',
        'Ghost Beams': 'Geisterstrahlen',
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
        'Phantom Train': 'Train fantôme',
        'Putrid Passenger': 'Passager Putride',
        'Wroth Ghost': 'Fantôme (F|f)urieux',
        'Remorse': 'Fantôme Mélancolique',
        'Agony': 'Fantôme Souffrant',
        'Malice': 'Fantôme Rancunier',
        'Engage!': 'À l\'attaque',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--synchronisation--',
        '--targetable--': '--ciblable--',
        '--untargetable--': '--impossible à cibler--',
        'Enrage': 'Enragement',

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
        'Crossing Whistle': 'Sifflet traversée',
        'Tether Whistle': 'Sifflet liens',
        'Ghosts': 'Fantômes',
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
      },
      '~effectNames': {
        'Connectivity': '連結',
        'Prey': 'マーキング',
        'Stun': 'スタン',
        'Throttle': '窒息',
      },
    },
  ],
}];
