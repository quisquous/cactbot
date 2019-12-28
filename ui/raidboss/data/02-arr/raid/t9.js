'use strict';

[{
  zoneRegex: /^The Second Coil Of Bahamut - Turn \(4\)$/,
  timelineFile: 't9.txt',
  timelineTriggers: [
    {
      id: 'T9 Claw',
      regex: /Bahamut's Claw x5/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer' || data.job == 'BLU';
      },
      beforeSeconds: 5,
      infoText: {
        en: 'Tankbuster',
      },
    },
    {
      id: 'T9 Dalamud Dive',
      regex: /Dalamud Dive/,
      beforeSeconds: 5,
      infoText: {
        en: 'Dive on Main Tank',
      },
    },
    {
      id: 'T9 Super Nova',
      regex: /Super Nova x3/,
      beforeSeconds: 4,
      infoText: {
        en: 'Bait Super Novas Outside',
      },
    },
  ],
  triggers: [
    {
      id: 'T9 Raven Blight You',
      regex: Regexes.gainsEffect({ effect: 'Raven Blight', capture: true }),
      regexDe: Regexes.gainsEffect({ effect: 'Pestschwinge', capture: true }),
      regexFr: Regexes.gainsEffect({ effect: 'Bile De Rapace', capture: true }),
      regexJa: Regexes.gainsEffect({ effect: '凶鳥毒気', capture: true }),
      regexCn: Regexes.gainsEffect({ effect: '凶鸟毒气', capture: true }),
      regexKo: Regexes.gainsEffect({ effect: '흉조의 독', capture: true }),
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: function(data, matches) {
        return matches[2] - 5;
      },
      durationSeconds: 5,
      alarmText: {
        en: 'Blight on YOU',
      },
    },
    {
      id: 'T9 Raven Blight You',
      regex: Regexes.gainsEffect({ effect: 'Raven Blight', capture: true }),
      regexDe: Regexes.gainsEffect({ effect: 'Pestschwinge', capture: true }),
      regexFr: Regexes.gainsEffect({ effect: 'Bile De Rapace', capture: true }),
      regexJa: Regexes.gainsEffect({ effect: '凶鳥毒気', capture: true }),
      regexCn: Regexes.gainsEffect({ effect: '凶鸟毒气', capture: true }),
      regexKo: Regexes.gainsEffect({ effect: '흉조의 독', capture: true }),
      condition: function(data, matches) {
        return data.me != matches[1];
      },
      delaySeconds: function(data, matches) {
        return matches[2] - 5;
      },
      durationSeconds: 5,
      infoText: function(data, matches) {
        return {
          en: 'Blight on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'T9 Meteor Stream',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:000[7A9]:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Meteor on YOU',
      },
    },
    {
      id: 'T9 Meteor Stream',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0008:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread (Meteor Stream)',
      },
    },
    {
      id: 'T9 Stack',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:000F:/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Thermo on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'T9 Phase 2',
      regex: / :Nael deus Darnus HP at 64%/,
      sound: 'Long',
    },
    {
      id: 'T9 Earthshock',
      regex: / 14:7F5:Dalamud Spawn starts using Earthshock/,
      regexDe: / 14:7F5:Dalamud-Golem starts using Erdschock/,
      regexFr: / 14:7F5:Golem De Dalamud starts using Secousse Sismique/,
      regexJa: / 14:7F5:ダラガブゴーレム starts using アースショック/,
      condition: function(data) {
        return data.CanSilence();
      },
      alertText: {
        en: 'Silence Blue Golem',
      },
    },
    {
      id: 'T9 Heavensfall',
      regex: / 14:83B:Nael Deus Darnus starts using Heavensfall/,
      regexDe: / 14:83B:Nael Deus Darnus starts using Himmelssturz/,
      regexFr: / 14:83B:Nael Deus Darnus starts using Destruction Universelle/,
      regexJa: / 14:83B:ネール・デウス・ダーナス starts using 天地崩壊/,
      alertText: {
        en: 'Heavensfall',
      },
    },
    {
      id: 'T9 Garotte Twist Gain',
      regex: Regexes.gainsEffect({ effect: 'Garrote Twist', capture: true }),
      regexDe: Regexes.gainsEffect({ effect: 'Leicht Fixierbar', capture: true }),
      regexFr: Regexes.gainsEffect({ effect: 'Sangle Accélérée', capture: true }),
      regexJa: Regexes.gainsEffect({ effect: '拘束加速', capture: true }),
      regexCn: Regexes.gainsEffect({ effect: '拘束加速', capture: true }),
      regexKo: Regexes.gainsEffect({ effect: '구속 가속', capture: true }),
      condition: function(data, matches) {
        return data.me == matches[1] && !data.garotte;
      },
      infoText: {
        en: 'Garotte on YOU',
      },
      run: function(data) {
        data.garotte = true;
      },
    },
    {
      id: 'T9 Ghost Death',
      regex: / 1[56]:\y{ObjectId}:The Ghost of Meracydia:7FA:Neurolink Burst:/,
      regexDe: / 1[56]:\y{ObjectId}:Geist Von Meracydia:7FA:Neurolink-Bruch:/,
      regexFr: / 1[56]:\y{ObjectId}:Fantôme Méracydien:7FA:Explosion névralgique:/,
      regexJa: / 1[56]:\y{ObjectId}:メラシディアン・ゴースト:7FA:ニューロリンク・バースト:/,
      condition: function(data) {
        return data.garotte;
      },
      alarmText: {
        en: 'Cleanse Garotte',
      },
    },
    {
      id: 'T9 Garotte Twist Lose',
      regex: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Garrote Twist/,
      regexDe: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Leicht Fixierbar/,
      regexFr: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Sangle Accélérée/,
      regexJa: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of 拘束加速/,
      condition: function(data, matches) {
        return data.me == matches[1] && data.garotte;
      },
      run: function(data) {
        delete data.garotte;
      },
    },
    {
      id: 'T9 Final Phase',
      regex: / 14:7E6:Nael Deus Darnus starts using Bahamut's Favor/,
      regexDe: / 14:7E6:Nael Deus Darnus starts using Bahamuts Segen/,
      regexFr: / 14:7E6:Nael Deus Darnus starts using Auspice Du Dragon/,
      regexJa: / 14:7E6:ネール・デウス・ダーナス starts using 龍神の加護/,
      condition: function(data) {
        return !data.seenFinalPhase;
      },
      sound: 'Long',
      run: function(data) {
        data.seenFinalPhase = true;
      },
    },
    {
      id: 'T9 Dragon Locations',
      regex: / 03:\y{ObjectId}:Added new combatant (.*)\..*Pos: \((\y{Float}),(\y{Float}),(?:\y{Float})\)/,
      regexDe: / 03:\y{ObjectId}:Added new combatant (.*)\..*Pos: \((\y{Float}),(\y{Float}),(?:\y{Float})\)/,
      regexFr: / 03:\y{ObjectId}:Added new combatant (.*)\..*Pos: \((\y{Float}),(\y{Float}),(?:\y{Float})\)/,
      regexJa: / 03:\y{ObjectId}:Added new combatant (.*)\..*Pos: \((\y{Float}),(\y{Float}),(?:\y{Float})\)/,
      run: function(data, matches) {
        let names = ['Firehorn', 'Iceclaw', 'Thunderwing'];
        let idx = names.indexOf(matches[1]);
        if (idx == -1)
          return;

        let x = parseFloat(matches[2]);
        let y = parseFloat(matches[3]);

        // Most dragons are out on a circle of radius=~28.
        // Ignore spurious dragons like "Pos: (0.000919255,0.006120025,2.384186E-07)"
        if (x*x + y*y < 20*20)
          return;

        // Positions are the 8 cardinals + numerical slop on a radius=28 circle.
        // N = (0, -28), E = (28, 0), S = (0, 28), W = (-28, 0)
        // Map N = 0, NE = 1, ..., NW = 7
        let dir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;

        data.dragons = data.dragons || [0, 0, 0];
        data.dragons[idx] = dir;
      },
    },
    {
      id: 'T9 Final Phase Reset',
      regex: / 14:7E6:Nael Deus Darnus starts using Bahamut's Favor/,
      regexDe: / 14:7E6:Nael Deus Darnus starts using Bahamuts Segen/,
      regexFr: / 14:7E6:Nael Deus Darnus starts using Auspice Du Dragon/,
      regexJa: / 14:7E6:ネール・デウス・ダーナス starts using 龍神の加護/,
      run: function(data) {
        data.tetherCount = 0;
        data.naelDiveMarkerCount = 0;

        // T9 normal dragons are easy.
        // The first two are always split, so A is the first dragon + 1.
        // The last one is single, so B is the last dragon + 1.
        let dragons = data.dragons.sort();
        let dir_names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        data.naelMarks = [dragons[0], dragons[2]].map(function(i) {
          return dir_names[(i + 1) % 8];
        });

        // Safe zone is one to the left of the first dragon, unless
        // the last dragon is diving there.  If that's true, use
        // one to the right of the second dragon.
        let possibleSafe = (dragons[0] - 1 + 8) % 8;
        if ((dragons[2] + 2) % 8 == possibleSafe)
          possibleSafe = (dragons[1] + 1) % 8;
        data.safeZone = dir_names[possibleSafe];
      },
    },
    {
      id: 'T9 Dragon Marks',
      regex: / 14:7E6:Nael Deus Darnus starts using Bahamut's Favor/,
      regexDe: / 14:7E6:Nael Deus Darnus starts using Bahamuts Segen/,
      regexFr: / 14:7E6:Nael Deus Darnus starts using Auspice Du Dragon/,
      regexJa: / 14:7E6:ネール・デウス・ダーナス starts using 龍神の加護/,
      durationSeconds: 12,
      infoText: function(data) {
        return {
          en: 'Marks: ' + data.naelMarks.join(', '),
          fr: 'Marque : ' + data.naelMarks.join(', '),
          de: 'Markierungen : ' + data.naelMarks.join(', '),
          ja: 'マーカー: ' + data.naelMarks.join(', '),
        };
      },
    },
    {
      id: 'T9 Tether',
      regex: / 23:\y{ObjectId}:Firehorn:\y{ObjectId}:(\y{Name}):....:....:0005:/,
      regexDe: / 23:\y{ObjectId}:Feuerhorn:\y{ObjectId}:(\y{Name}):....:....:0005:/,
      regexFr: / 23:\y{ObjectId}:Corne-De-Feu:\y{ObjectId}:(\y{Name}):....:....:0005:/,
      regexJa: / 23:\y{ObjectId}:ファイアホーン:\y{ObjectId}:(\y{Name}):....:....:0005:/,
      preRun: function(data) {
        data.tetherCount = data.tetherCount || 0;
        data.tetherCount++;
        // Out, In, Out, In
        data.tetherDir = data.tetherCount % 2 ? 'Fire Out' : 'Fire In';
      },
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: data.tetherDir + ' (on YOU)',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: data.tetherDir + ' (on ' + data.ShortName(matches[1]) + ')',
          };
        }
      },
    },
    {
      id: 'T9 Thunder',
      // Note: The 0A event happens before 'gains the effect' and 'starts
      // casting on' only includes one person.
      regex: / :Thunderwing:7FD:.*?:\y{ObjectId}:(\y{Name}):/,
      regexDe: / :Donnerschwinge:7FD:.*?:\y{ObjectId}:(\y{Name}):/,
      regexFr: / :Aile-de-foudre:7FD:.*?:\y{ObjectId}:(\y{Name}):/,
      regexJa: / :サンダーウィング:7FD:.*?:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Thunder on YOU',
        fr: 'Foudre sur VOUS',
        de: 'Blitz auf DIR',
        ja: '自分にサンダー',
      },
      tts: {
        en: 'thunder',
        fr: 'Foudre',
        de: 'blitz',
        ja: 'サンダー',
      },
    },
    {
      id: 'T9 Dragon Safe Zone',
      regex: / 1B:\y{ObjectId}:\y{Name}:....:....:0014:0000:0000:0000:/,
      delaySeconds: 3,
      durationSeconds: 6,
      suppressSeconds: 20,
      infoText: function(data) {
        return 'Safe zone: ' + data.safeZone;
      },
    },
    {
      id: 'T9 Dragon Marker',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0014:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches[1] != data.me)
          return;
        let marker = ['A', 'B', 'C'][data.naelDiveMarkerCount];
        let dir = data.naelMarks[data.naelDiveMarkerCount];
        return {
          en: 'Go To ' + marker + ' (in ' + dir + ')',
          fr: 'Aller en ' + marker + ' (au ' + dir + ')',
          de: 'Gehe zu ' + marker + ' (im ' + dir + ')',
          ja: marker + 'に行く' + ' (あと ' + dir + '秒)',
        };
      },
      tts: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches[1] != data.me)
          return;
        return {
          en: 'Go To ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          fr: 'Aller en ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          de: 'Gehe zu ' + ['A', 'B', 'C'][data.naelDiveMarkerCount],
          ja: ['A', 'B', 'C'][data.naelDiveMarkerCount] + '行くよ',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Astral Debris': 'Lichtgestein',
        'Dalamud Fragment': 'Dalamud-Bruchstück',
        'Engage!': 'Start!',
        'Firehorn': 'Feuerhorn',
        'Iceclaw': 'Eisklaue',
        'Nael Geminus': 'Nael Geminus',
        'Nael deus Darnus': 'Nael deus Darnus',
        'Ragnarok': 'Ragnarök',
        'Thunderwing': 'Donnerschwinge',
        'Umbral Debris': 'Schattengestein',
      },
      'replaceText': {
        '(In)': '(Rein)',
        '(Out)': '(Raus)',
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Bahamut\'s Claw': 'Klauen Bahamuts',
        'Bahamut\'s Favor': 'Bahamuts Segen',
        'Binding Coil': 'Verschlungene Schatten',
        'Cauterize': 'Kauterisieren',
        'Chain Lightning': 'Kettenblitz',
        'Dalamud Dive': 'Dalamud-Sturzflug',
        'Divebomb': 'Sturzbombe',
        'Enrage': 'Finalangriff',
        'Fireball': 'Feuerball',
        'Ghost': 'Geist',
        'Golem Meteors': 'Golem Meteore',
        'Heavensfall': 'Himmelsfall',
        'Iron Chariot': 'Eiserner Streitwagen',
        'Lunar Dynamo': 'Lunarer Dynamo',
        'Megaflare': 'Megaflare',
        'Meteor': 'Meteor',
        'Meteor Stream': 'Meteorflug',
        'Raven Dive': 'Bahamuts Schwinge',
        'Ravensbeak': 'Bradamante',
        'Ravensclaw': 'Silberklauen',
        'Stardust': 'Sternenstaub',
        'Super Nova': 'Supernova',
        'Thermionic Beam': 'Thermionischer Strahl',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Astral Debris': 'Débris astral',
        'Dalamud Fragment': 'Débris de Dalamud',
        'Engage!': 'À l\'attaque !',
        'Firehorn': 'Corne-de-feu',
        'Iceclaw': 'Griffe-de-glace',
        'Nael Geminus': 'Nael Geminus',
        'Nael deus Darnus': 'Nael deus Darnus',
        'Ragnarok': 'Ragnarok',
        'Thunderwing': 'Aile-de-foudre',
        'Umbral Debris': 'Débris ombral',
      },
      'replaceText': {
        '(In)': '(Dedans)',
        '(Out)': '(Dehors)',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Bahamut\'s Claw': 'Griffe de Bahamut',
        'Bahamut\'s Favor': 'Auspice du dragon',
        'Binding Coil': 'Écheveau entravant',
        'Cauterize': 'Cautérisation',
        'Chain Lightning': 'Chaîne d\'éclairs',
        'Dalamud Dive': 'Chute de Dalamud',
        'Divebomb': 'Bombe plongeante',
        'Enrage': 'Enrage',
        'Fireball': 'Boule de feu',
        'Ghost': 'fantôme',
        'Golem Meteors': 'Golem de Dalamud',
        'Heavensfall': 'Chute céleste',
        'Iron Chariot': 'Char de fer',
        'Lunar Dynamo': 'Dynamo lunaire',
        'Megaflare': 'MégaBrasier',
        'Meteor': 'Météore',
        'Meteor Stream': 'Rayon météore',
        'Raven Dive': 'Fonte du rapace',
        'Ravensbeak': 'Bec du rapace',
        'Ravensclaw': 'Serre du rapace',
        'Stardust': 'Poussière d\'étoile',
        'Super Nova': 'Supernova',
        'Thermionic Beam': 'Rayon thermoïonique',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Astral Debris': 'アストラルデブリ',
        'Dalamud Fragment': 'ダラガブデブリ',
        'Engage!': '戦闘開始！',
        'Firehorn': 'ファイアホーン',
        'Iceclaw': 'アイスクロウ',
        'Nael Geminus': 'ネール・ジェミナス',
        'Nael deus Darnus': 'ネール・デウス・ダーナス',
        'Ragnarok': 'ラグナロク',
        'Thunderwing': 'サンダーウィング',
        'Umbral Debris': 'アンブラルデブリ',
      },
      'replaceText': {
        '(In)': '(In)',
        '(Out)': '(Out)',
        '--targetable--': '--targetable--',
        '--untargetable--': '--untargetable--',
        'Bahamut\'s Claw': 'バハムートクロウ',
        'Bahamut\'s Favor': '龍神の加護',
        'Binding Coil': 'バインディングコイル',
        'Cauterize': 'カータライズ',
        'Chain Lightning': 'チェインライトニング',
        'Dalamud Dive': 'ダラガブダイブ',
        'Divebomb': 'ダイブボム',
        'Enrage': 'Enrage',
        'Fireball': 'ファイアボール',
        'Ghost': 'ゴースト',
        'Golem Meteors': 'Golem Meteors', // FIXME
        'Heavensfall': 'ヘヴンスフォール',
        'Iron Chariot': 'アイアンチャリオット',
        'Lunar Dynamo': 'ルナダイナモ',
        'Megaflare': 'メガフレア',
        'Meteor': 'メテオ',
        'Meteor Stream': 'メテオストリーム',
        'Raven Dive': 'レイヴンダイブ',
        'Ravensbeak': 'レイヴェンズビーク',
        'Ravensclaw': 'レイヴェンズクロウ',
        'Stardust': 'スターダスト',
        'Super Nova': 'スーパーノヴァ',
        'Thermionic Beam': 'サーミオニックビーム',
      },
    },
  ],
}];
