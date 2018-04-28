// O5S - Sigmascape 1.0 Savage
// localized sync and triggers should work for Ja, En, De, Fr now
// Missing: jp/fr replaceText
[{
  zoneRegex: /Sigmascape V1\.0 \(Savage\)/,
  timelineFile: 'o5s.txt',
  resetWhenOutOfCombat: false,
  timelineReplace: [
    {
      locale: 'de',
      replaceText: {
        'Encumber': 'Wegsperrung',
        'Saintly Beam': 'Heiligenstrahl',
        'Knockback Whistle': 'Rückstoß Pfeife',
        'All in the Mind': 'Psychokinese',
        'Doom Strike': 'Vernichtungsschlag',
        'Head On': 'Frontalangriff',
        'Diabolic Wind': 'Diabolischer Wind',
        'Acid Rain': 'Säureregen',
        'Crossing Whistle': 'Kreuzend Pfeife',
        'Diabolic Headlamp': 'Diabolische Leuchte',
        'Tether Whistle': 'Verfolger Pfeife',
        'Diabolic Light': 'Diabolisches Licht',
        ') Ghosts': ') Geister',
        'Ghosts spawn': 'Geister erscheinen',
      },
      replaceSync: {
        'Engage!': 'Start!',
        'Wroth Ghost': 'Erzürnter Geist',
        'Phantom Train': 'Phantomzug',
        'Remorse': 'Melancholischer Geist',
        'Agony': 'Reuiger Geist',
        'Malice': 'Bösartiger Geist',
      },
    },
    {
      locale: 'fr',
      replaceSync: {
        'Engage!': "À l'attaque!",
        'Wroth Ghost': 'Fantôme Furieux',
        'Phantom Train': 'Train Fantôme',
        'Remorse': 'Fantôme Mélancolique',
        'Agony': 'Fantôme Souffrant',
        'Malice': 'Fantôme Rancunier',
      },
    },
    {
      locale: 'jp',
      replaceSync: {
        'Engage!': '戦闘開始！',
        'Wroth Ghost': 'ロスゴースト',
        'Phantom Train': '魔列車',
        'Remorse': '未練のゴースト',
        'Agony': '苦悶のゴースト',
        'Malice': '怨念のゴースト',
      },
    },
  ],
  triggers: [
    {
      regex: /04:Removing combatant Phantom Train/,
      regexDe: /04:Removing combatant Phantomzug/,
      regexFr: /04:Removing combatant Train Fantôme/,
      regexJp: /04:Removing combatant 魔列車/,
      run: function(data) {
        data.StopCombat();
      },
    },
    {
      id: 'O5S Doom Strike',
      regex: /14:28B1:Phantom Train starts using Doom Strike on (\y{Name})/,
      regexDe: /14:28B1:Phantomzug starts using Vernichtungsschlag on (\y{Name})/,
      regexFr: /14:28B1:Train Fantôme starts using Frappe Létale on (\y{Name})/,
      regexJp: /14:28B1:魔列車 starts using 魔霊撃 on (\y{Name})/,
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
            de: 'Buster auf ' +data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'buster',
          };
        }
      },
    },
    {
      id: 'O5S Head On',
      regex: /14:28A4:Phantom Train starts using Head On/,
      regexDe: /14:28A4:Phantomzug starts using Frontalangriff/,
      regexFr: /14:28A4:Train Fantôme starts using Plein Fouet/,
      regexJp: /14:28A4:魔列車 starts using 追突/,
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
      regexJp: /14:28B2:魔列車 starts using 魔界の前照灯/,
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
      regexJp: /Added new combatant 未練のゴースト/,
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
  ]
}]
