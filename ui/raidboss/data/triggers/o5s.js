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
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tank Buster auf DIR',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Buster auf ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
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
      alertText: function (data) {
        return {
          en: 'Go To Back',
          de: 'Nach HINTEN!',
        };
      },
      tts: function(data) {
        return {
          en: 'run away',
          de: 'renn weg',
        };
      },
    },
    {
      id: 'O5S Diabolic Headlamp',
      regex: /14:28B2:Phantom Train starts using Diabolic Headlamp/,
      regexDe: /14:28B2:Phantomzug starts using Diabolische Leuchte/,
      regexFr: /14:28B2:Train Fantôme starts using Phare Diabolique/,
      regexJa: /14:28B2:魔列車 starts using 魔界の前照灯/,
      alertText: function (data) {
        return {
          en: 'Stack Middle',
          de: 'Versammeln Mitte',
        };
      },
      tts: function(data) {
        return {
          en: 'stack middle',
          de: 'versammeln mitte',
        };
      },
    },
    {
      id: 'O5S Diabolic Light',
      regex: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function (data) {
        return {
          en: 'Light',
          de: 'Licht',
        };
      },
      tts: function (data) {
        return {
          en: 'Light',
          de: 'Licht',
        };
      },
    },
    {
      id: 'O5S Diabolic Wind',
      regex: /1B:........:(\y{Name}):....:....:0046:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: function (data) {
        return {
          en: 'Wind',
          de: 'Wind',
        };
      },
      tts: function (data) {
        return {
          en: 'Wind',
          de: 'Wind',
        };
      },
    },
    {
      id: 'O5S Remorse',
      regex: /Added new combatant Remorse/,
      regexDe: /Added new combatant Melancholischer Geist/,
      regexFr: /Added new combatant Fantôme Mélancolique/,
      regexJa: /Added new combatant 未練のゴースト/,
      infoText: function (data) {
        return {
          en: 'Knockback Ghost',
          de: 'Rückstoß Geist',
        };
      },
      tts: function (data) {
        return {
          en: 'Knockback Ghost',
          de: 'Rückstoß Geist',
        };
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'de',
      replaceSync: {
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
      replaceText: {
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

        // FIXME:
        'Add Wave': 'Add Wave',
      },
      '~effectNames': {
        'Connectivity': 'Kopplung',
        'Prey': 'Markiert',
        'Stun': 'Betäubung',
        'Throttle': 'Erstickung',
      }
    },
    {
      locale: 'fr',
      replaceSync: {
        'Agony': 'Fantôme Souffrant',
        'Doom Chimney': 'Cheminée Maléfique',
        'Phantom Train': 'Train Fantôme',
        'Putrid Passenger': 'Passager Putride',
        'Wroth Ghost': 'Fantôme Furieux',
        'Remorse': 'Fantôme Mélancolique',
        'Agony': 'Fantôme Souffrant',
        'Malice': 'Fantôme Rancunier',
        "Engage!": "À l'attaque",
      },
      replaceText: {
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
        "Engage!": "À l'attaque",
        'Head On': 'Plein Fouet',
        'Possess': 'Possession',
        'Saintly Beam': 'Faisceaux Sacrés',
        // FIXME:
        'Crossing Whistle': 'Crossing Whistle',
        'Knockback Whistle': 'Knockback Whistle',
        'Tether Whistle': 'Tether Whistle',
        ' Ghosts': ' Ghosts',
        'Ghosts spawn': 'Ghosts spawn',
        'Add Wave': 'Add Wave',
      },
      '~effectNames': {
        'Connectivity': 'Attelage',
        'Prey': 'Marquage',
        'Stun': 'Étourdissement',
        'Throttle': 'Suffocation',
      }
    },
    {
      locale: 'ja',
      replaceSync: {
        'Agony': '苦悶のゴースト',
        'Doom Chimney': '魔煙突',
        'Phantom Train': '魔列車',
        'Putrid Passenger': 'ゾンビー・パッセンジャー',
        'Wroth Ghost': 'ロスゴースト',
        'Remorse': '未練のゴースト',
        'Agony': '苦悶のゴースト',
        'Malice': '怨念のゴースト',
      },
      replaceText: {
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
      }
    }
  ],
}]
