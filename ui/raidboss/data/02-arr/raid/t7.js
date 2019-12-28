'use strict';

[{
  zoneRegex: /^The Second Coil Of Bahamut - Turn \(2\)$/,
  timelineFile: 't7.txt',
  triggers: [
    {
      id: 'T7 Ram',
      regex: / 14:860:Proto-Chimera starts using The Ram's Voice/,
      regexDe: / 14:860:Proto-Chimära starts using Stimme Des Widders/,
      regexFr: / 14:860:Protochimère starts using Voix Du Bélier/,
      regexJa: / 14:860:プロトキマイラ starts using 氷結の咆哮/,
      condition: function(data) {
        // TODO: is this silenceable in 5.0?
        return data.CanStun() || data.CanSilence();
      },
      infoText: {
        en: 'Silence Ram\'s Voice',
      },
    },
    {
      id: 'T7 Dragon',
      regex: / 14:861:Proto-Chimera starts using The Dragon's Voice/,
      regexDe: / 14:861:Proto-Chimära starts using Stimme Des Drachen/,
      regexFr: / 14:861:Protochimère starts using Voix Du Dragon/,
      regexJa: / 14:861:プロトキマイラ starts using 雷電の咆哮/,
      condition: function(data) {
        // TODO: is this silenceable in 5.0?
        return data.CanStun() || data.CanSilence();
      },
      infoText: {
        en: 'Silence Dragon\'s Voice',
      },
    },
    {
      id: 'T7 Tail Slap',
      regex: / 1[56]:\y{ObjectId}:Melusine:7A8:Tail Slap:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 1[56]:\y{ObjectId}:Melusine:7A8:Schweifklapser:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 1[56]:\y{ObjectId}:Mélusine:7A8:Gifle caudale:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 1[56]:\y{ObjectId}:メリュジーヌ:7A8:テールスラップ:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1] && data.job == 'BLU';
      },
      delaySeconds: 6,
      suppressSeconds: 5,
      infoText: {
        en: 'Tail Slap in 10',
      },
    },
    {
      id: 'T7 Renaud',
      regex: / 03:\y{ObjectId}:Added new combatant Renaud\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Renaud\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Renaud\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant ルノー\./,
      infoText: {
        en: 'Renaud Add',
      },
    },
    {
      id: 'T7 Voice',
      regex: Regexes.gainsEffect({ effect: 'Cursed Voice', capture: true }),
      regexDe: Regexes.gainsEffect({ effect: 'Stimme Der Verwünschung', capture: true }),
      regexFr: Regexes.gainsEffect({ effect: 'Voix Du Maléfice', capture: true }),
      regexJa: Regexes.gainsEffect({ effect: '呪詛の声', capture: true }),
      regexCn: Regexes.gainsEffect({ effect: '诅咒之声', capture: true }),
      regexKo: Regexes.gainsEffect({ effect: '저주의 목소리', capture: true }),
      delaySeconds: function(data, matches) {
        return matches[2] - 3;
      },
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Voice Soon',
      },
    },
    {
      id: 'T7 Shriek',
      regex: Regexes.gainsEffect({ effect: 'Cursed Shriek', capture: true }),
      regexDe: Regexes.gainsEffect({ effect: 'Schrei Der Verwünschung', capture: true }),
      regexFr: Regexes.gainsEffect({ effect: 'Cri Du Maléfice', capture: true }),
      regexJa: Regexes.gainsEffect({ effect: '呪詛の叫声', capture: true }),
      regexCn: Regexes.gainsEffect({ effect: '诅咒之嚎', capture: true }),
      regexKo: Regexes.gainsEffect({ effect: '저주의 외침', capture: true }),
      durationSeconds: 3,
      alarmText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Shriek on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Shriek on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T7 Shriek Reminder',
      regex: Regexes.gainsEffect({ effect: 'Cursed Shriek', capture: true }),
      regexDe: Regexes.gainsEffect({ effect: 'Schrei Der Verwünschung', capture: true }),
      regexFr: Regexes.gainsEffect({ effect: 'Cri Du Maléfice', capture: true }),
      regexJa: Regexes.gainsEffect({ effect: '呪詛の叫声', capture: true }),
      regexCn: Regexes.gainsEffect({ effect: '诅咒之嚎', capture: true }),
      regexKo: Regexes.gainsEffect({ effect: '저주의 외침', capture: true }),
      delaySeconds: 7,
      durationSeconds: 3,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Shriek Soon',
          };
        }
        return {
          en: 'Dodge Shriek',
        };
      },
    },
    {
      id: 'T7 Phase 2',
      regex: / :Melusine HP at 79%/,
      sound: 'Long',
    },
    {
      id: 'T7 Phase 3',
      regex: / :Melusine HP at 59%/,
      sound: 'Long',
    },
    {
      id: 'T7 Phase 4',
      regex: / :Melusine HP at 34%/,
      sound: 'Long',
    },
    {
      id: 'T7 Petrifaction 1',
      regex: / 14:7BB:Lamia Prosector starts using Petrifaction/,
      regexDe: / 14:7BB:Lamia-Prosektorin starts using Versteinerung/,
      regexFr: / 14:7BB:Lamia Dissectrice starts using Pétrification/,
      regexJa: / 14:7BB:ラミア・プロセクター starts using ペトリファクション/,
      alertText: {
        en: 'Look Away!',
      },
    },
    {
      id: 'T7 Petrifaction 2',
      regex: / 14:7B1:Melusine starts using Petrifaction/,
      regexDe: / 14:7B1:Melusine starts using Versteinerung/,
      regexFr: / 14:7B1:Mélusine starts using Pétrification/,
      regexJa: / 14:7B1:メリュジーヌ starts using ペトリファクション/,
      alertText: {
        en: 'Look Away!',
      },
    },
    {
      id: 'T7 Tail',
      regex: / 14:7B2:Melusine starts using Venomous Tail/,
      regexDe: / 14:7B2:Melusine starts using Venomschweif/,
      regexFr: / 14:7B2:Mélusine starts using Queue Venimeuse/,
      regexJa: / 14:7B2:メリュジーヌ starts using ベノモステール/,
      alertText: {
        en: 'Venomous Tail',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bioweapon Storage is no longer sealed': 'Das Biowaffen-Magazin öffnet sich erneut',
        'Bioweapon Storage will be sealed off': 'bis sich das Biowaffen-Magazin schließt',
        'Engage!': 'Start!',
        'Lamia Prosector': 'Lamia-Prosektorin',
        'Melusine': 'Melusine',
      },
      'replaceText': {
        'Circle Blade': 'Kreisklinge',
        'Circle Of Flames': 'Feuerkreis',
        'Cursed Shriek': 'Schrei der Verwünschung',
        'Cursed Voice': 'Stimme der Verwünschung',
        'Deathdancer': 'Todestänzerin',
        'Frenzy': 'Verve',
        'Petrifaction': 'Versteinerung',
        'Red Lotus Blade': 'Rote Lotosklinge',
        'Sacrifice': 'Opferung',
        'Tail Slap': 'Schweifklapser',
        'Venomous Tail': 'Venomschweif',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bioweapon Storage is no longer sealed': 'Ouverture de l\Entrepôt d\'armes biologiques',
        'Bioweapon Storage will be sealed off': 'Fermeture de l\Entrepôt d\'armes biologiques',
        'Engage!': 'À l\'attaque !',
        'Lamia Prosector': 'Lamia dissectrice',
        'Melusine': 'Mélusine',
      },
      'replaceText': {
        'Circle Blade': 'Lame circulaire',
        'Circle Of Flames': 'Cercle de flammes',
        'Cursed Shriek': 'Cri maudit',
        'Cursed Voice': 'Voix maudite',
        'Deathdancer': 'Danseuse de mort',
        'Frenzy': 'Frénésie',
        'Petrifaction': 'Pétrification',
        'Red Lotus Blade': 'Lame lotus rouge',
        'Sacrifice': 'Sacrifice',
        'Tail Slap': 'Gifle caudale',
        'Venomous Tail': 'Queue venimeuse',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bioweapon Storage is no longer sealed': 'Bioweapon Storage is no longer sealed', // FIXME
        'Bioweapon Storage will be sealed off': 'Bioweapon Storage will be sealed off', // FIXME
        'Engage!': '戦闘開始！',
        'Lamia Prosector': 'ラミア・プロセクター',
        'Melusine': 'メリュジーヌ',
      },
      'replaceText': {
        'Circle Blade': 'サークルブレード',
        'Circle Of Flames': 'サークル・オブ・フレイム',
        'Cursed Shriek': '呪詛の叫声',
        'Cursed Voice': '呪詛の声',
        'Deathdancer': 'Deathdancer', // FIXME
        'Frenzy': '熱狂',
        'Petrifaction': 'ペトリファクション',
        'Red Lotus Blade': 'レッドロータス',
        'Sacrifice': '生贄',
        'Tail Slap': 'テールスラップ',
        'Venomous Tail': 'ベノモステール',
      },
    },
  ],
}];



